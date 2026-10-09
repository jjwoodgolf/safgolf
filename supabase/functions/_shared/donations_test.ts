import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import { type Deps, type Donation, handleEvent, type Receipt } from "./donations.ts";
import { deliverReceipt, LOG_SETTLE_MS, ProviderAmbiguous, ProviderRejected, recoverReceipt, STALE_SENDING_MS } from "./outbox.ts";
import { allowedOrigin, grossWithFees, parseAmount } from "./saf.ts";
import { escapeHtml, eventTags, isIdempotencyConflict, renderReceipt } from "./receipt.ts";
const KEY_WINDOW_MS = 14 * 60_000;

const MD = { saf_donation: "1", gift_type: "pure_gift" };

type Mode = "ok" | "reject" | "timeout" | "accept_then_db_fail";
function fake(opts: { failEmails?: number; modes?: Mode[] } = {}) {
  const donations = new Map<string, Donation & Record<string, unknown>>();
  const receipts = new Map<string, Receipt>();
  const sent: string[] = [];         // accepted by provider (simulated)
  const keys: string[] = [];         // idempotency keys submitted
  const providerLog = new Map<string, string>(); // receipt id -> messageId (what reconciliation can see)
  const modes = [...(opts.modes ?? Array(opts.failEmails ?? 0).fill("reject"))];
  let clock = new Date("2026-10-09T12:00:00Z");
  let failNextMark = false;
  let subState = { status: "active", cancel_at_period_end: false };
  let n = 1000;
  const deps: Deps = {
    now: () => clock,
    findDonationBySession: async (sid) => [...donations.values()].find((d) => d.stripe_session_id === sid) ?? null,
    findDonationBySubscription: async (sub) => [...donations.values()].find((d) => d.stripe_subscription_id === sub) ?? null,
    updateDonation: async (id, p) => { Object.assign(donations.get(id)!, p); },
    upsertReceipt: async (r) => {
      const ex = [...receipts.values()].find((x) => x.stripe_object_id === r.stripe_object_id);
      if (ex) return ex;
      const row = { ...r, id: crypto.randomUUID(), status: "pending", attempts: 0, receipt_number: `SAF-T-${++n}` } as Receipt;
      receipts.set(row.id, row);
      return row;
    },
    // Mirrors claim_donation_receipt() SQL semantics.
    claimReceipt: async (id) => {
      const r = receipts.get(id)!;
      const t = clock.getTime();
      const due = !r.next_attempt_at || new Date(r.next_attempt_at).getTime() <= t;
      const okNew = (r.status === "pending" || r.status === "failed") && due;
      if (!okNew) return null;
      r.submission_started_at = clock.toISOString();
      r.status = "sending"; r.attempts++; r.claimed_at = clock.toISOString(); r.next_attempt_at = null;
      return { ...r };
    },
    markReceipt: async (id, p) => {
      if (failNextMark) { failNextMark = false; throw new Error("DB: connection reset"); }
      Object.assign(receipts.get(id)!, p);
    },
    sendEmail: async (r) => {
      keys.push(r.id);
      const m = modes.shift() ?? "ok";
      if (m === "reject") throw new ProviderRejected("Brevo [400]: invalid");
      // Provider-side idempotency: same key within TTL returns the original message, no second delivery.
      const prior = providerLog.get(r.id);
      if (m === "timeout") {
        if (!prior) { sent.push(r.receipt_number); providerLog.set(r.id, `<m${sent.length}>`); } // accepted, response lost
        throw new ProviderAmbiguous("Brevo request did not complete: timeout");
      }
      if (prior) return { messageId: prior };
      sent.push(r.receipt_number);
      const id = `<m${sent.length}>`; providerLog.set(r.id, id);
      if (m === "accept_then_db_fail") failNextMark = true;
      return { messageId: id };
    },
    findProviderMessage: async (r) => providerLog.get(r.id) ?? null,
    sessionIdForSubscription: async (sub) => sub === "sub_1" ? "cs_sub" : null,
    retrieveSubscription: async () => subState,
  };
  return {
    deps, donations, receipts, sent, keys, providerLog,
    advance: (ms: number) => { clock = new Date(clock.getTime() + ms); },
    setSub: (s: typeof subState) => { subState = s; },
    forgetProvider: () => providerLog.clear(),
  };
}

const addDonation = (f: ReturnType<typeof fake>, id: string, sid: string, frequency = "one_time") =>
  f.donations.set(id, { id, donor_name: null, donor_email: null, stripe_session_id: sid, stripe_subscription_id: null, frequency, status: "pending" });

const session = (over: Record<string, unknown> = {}) => ({
  id: "cs_1", mode: "payment", payment_status: "paid", status: "complete", amount_total: 2500, currency: "usd",
  payment_intent: "pi_1", customer: "cus_1", metadata: MD,
  customer_details: { email: "donor@example.com", name: "Card Name" },
  custom_fields: [{ key: "donor_name", text: { value: "Pat Donor" } }], ...over,
});
const ev = (type: string, object: unknown, id = crypto.randomUUID()) => ({ id: `evt_${id}`, type, created: 1760000000, data: { object } });

Deno.test("one-time paid: exactly one receipt even with duplicate + async-succeeded events", async () => {
  const f = fake(); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  await handleEvent(f.deps, ev("checkout.session.async_payment_succeeded", session()));
  assertEquals(f.sent.length, 1);
  const r = [...f.receipts.values()][0];
  assertEquals(r.amount_cents, 2500); assertEquals(r.donor_name, "Pat Donor"); assertEquals(r.status, "sent");
  assertEquals(f.donations.get("d1")!.status, "paid");
});

Deno.test("unpaid (delayed method) checkout completion issues no receipt", async () => {
  const f = fake(); addDonation(f, "d1", "cs_1");
  const out = await handleEvent(f.deps, ev("checkout.session.completed", session({ payment_status: "unpaid" })));
  assertEquals(out.action, "awaiting_payment"); assertEquals(f.sent.length, 0); assertEquals(f.receipts.size, 0);
  await handleEvent(f.deps, ev("checkout.session.async_payment_failed", session({ payment_status: "unpaid" })));
  assertEquals(f.donations.get("d1")!.status, "failed"); assertEquals(f.sent.length, 0);
});

Deno.test("expired session is marked, no receipt", async () => {
  const f = fake(); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.expired", session({ status: "expired", payment_status: "unpaid" })));
  assertEquals(f.donations.get("d1")!.status, "expired"); assertEquals(f.sent.length, 0);
});

Deno.test("non-SAF objects are ignored", async () => {
  const f = fake();
  const out = await handleEvent(f.deps, ev("checkout.session.completed", session({ metadata: {} })));
  assertEquals(out.action, "ignored_not_saf");
  const out2 = await handleEvent(f.deps, ev("checkout.session.completed", session({ metadata: { saf_donation: "1", gift_type: "event_registration" } })));
  assertEquals(out2.action, "ignored_not_saf"); assertEquals(f.sent.length, 0);
});

const invoice = (id: string, amount = 10000, paidAt = 1760000100) => ({
  id, amount_paid: amount, currency: "usd", customer_email: "monthly@example.com", customer_name: "Inv Name",
  status_transitions: { paid_at: paidAt },
  parent: { subscription_details: { subscription: "sub_1", metadata: MD } },
});

Deno.test("monthly: checkout completion alone sends nothing; first + renewal invoices each receipted once", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly");
  await handleEvent(f.deps, ev("checkout.session.completed", session({ id: "cs_sub", mode: "subscription", subscription: "sub_1", payment_intent: null })));
  assertEquals(f.sent.length, 0);
  await handleEvent(f.deps, ev("invoice.paid", invoice("in_1")));
  await handleEvent(f.deps, ev("invoice.paid", invoice("in_1")));
  await handleEvent(f.deps, ev("invoice.paid", invoice("in_2", 10000, 1762600000)));
  assertEquals(f.sent.length, 2);
  const rs = [...f.receipts.values()];
  assert(rs.every((r) => r.kind === "monthly_invoice" && r.amount_cents === 10000 && r.donation_id === "d1"));
});

Deno.test("monthly: invoice.paid arriving BEFORE checkout.session.completed links via session, no duplicate", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly");
  await handleEvent(f.deps, ev("invoice.paid", invoice("in_1")));
  assertEquals(f.donations.get("d1")!.stripe_subscription_id, "sub_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session({ id: "cs_sub", mode: "subscription", subscription: "sub_1", payment_intent: null })));
  assertEquals(f.sent.length, 1); assertEquals(f.receipts.size, 1);
});

Deno.test("zero-amount and failed invoices issue no receipt", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly");
  await handleEvent(f.deps, ev("invoice.paid", invoice("in_0", 0)));
  await handleEvent(f.deps, ev("invoice.payment_failed", invoice("in_f")));
  assertEquals(f.sent.length, 0);
});

Deno.test("definite provider rejection: recorded, backoff, worker retry sends exactly once", async () => {
  const f = fake({ failEmails: 1 }); addDonation(f, "d1", "cs_1");
  const out = await handleEvent(f.deps, ev("checkout.session.completed", session()));
  assertEquals(out.action, "receipt_retry_scheduled");
  const r = [...f.receipts.values()][0];
  assertEquals(r.status, "failed"); assert(String(r.last_error).includes("400")); assert(r.next_attempt_at);
  // Stripe redelivery before backoff elapses does not resend.
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  assertEquals(f.sent.length, 0);
  f.advance(16 * 60_000);
  assertEquals(await recoverReceipt(f.deps, { ...r }), "sent");
  await recoverReceipt(f.deps, { ...r });
  assertEquals(f.sent.length, 1); assertEquals(r.status, "sent"); assertEquals(r.attempts, 2);
});

Deno.test("provider accepted then DB write fails: never resent, reconciled to sent", async () => {
  const f = fake({ modes: ["accept_then_db_fail"] }); addDonation(f, "d1", "cs_1");
  const out = await handleEvent(f.deps, ev("checkout.session.completed", session()));
  assertEquals(out.action, "receipt_accepted_unrecorded");
  const r = [...f.receipts.values()][0];
  assertEquals(r.status, "unconfirmed"); assert(r.provider_message_id);
  await handleEvent(f.deps, ev("checkout.session.completed", session())); // Stripe retry
  assertEquals(await recoverReceipt(f.deps, { ...r }), "reconciled_sent");
  assertEquals(f.sent.length, 1); assertEquals(r.status, "sent");
});

Deno.test("unconfirmed is never resubmitted, even inside the key window", async () => {
  const f = fake({ modes: ["timeout", "ok"] }); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  const r = [...f.receipts.values()][0];
  assertEquals(r.status, "unconfirmed");
  f.advance(60_000);
  assertEquals(await recoverReceipt(f.deps, { ...r }), "reconciled_sent"); // from provider log, no new send
  assertEquals(f.keys, [r.id]); assertEquals(f.sent.length, 1);
  assertEquals(await deliverReceipt(f.deps, r.id), "busy");
});

Deno.test("regression: accepted-but-timeout -> duplicate 400 -> never resent after TTL", async () => {
  // Brevo answers a reused key with 400 duplicate_parameter; it must be ambiguous, not a definite rejection.
  assert(isIdempotencyConflict(400, JSON.stringify({ code: "duplicate_parameter", message: "Idempotency key already used" })));
  assert(!isIdempotencyConflict(400, JSON.stringify({ code: "invalid_parameter", message: "email is not valid" })));
  const f = fake({ modes: ["timeout", "dup", "dup", "ok"] as Mode[] }); addDonation(f, "d1", "cs_1");
  f.deps.sendEmail = ((orig) => async (r) => {
    if ((f as any).peek?.() === "dup") throw new ProviderAmbiguous("Brevo idempotency conflict [400]: duplicate_parameter");
    return orig(r);
  })(f.deps.sendEmail);
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  f.forgetProvider(); // provider log not (yet) visible
  const r = [...f.receipts.values()][0];
  for (const step of [60_000, KEY_WINDOW_MS, 60 * 60_000, LOG_SETTLE_MS]) {
    f.advance(step); await recoverReceipt(f.deps, { ...r });
  }
  assertEquals(f.keys.length, 1); assertEquals(f.sent.length, 1); assertEquals(r.status, "needs_review");
});

Deno.test("unconfirmed + later provider rejection cannot become a retryable 'failed'", async () => {
  const f = fake({ modes: ["timeout", "reject", "reject"] }); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  f.forgetProvider();
  const r = [...f.receipts.values()][0];
  await handleEvent(f.deps, ev("checkout.session.completed", session())); // Stripe retry
  f.advance(60_000); await recoverReceipt(f.deps, { ...r });
  f.advance(LOG_SETTLE_MS); await recoverReceipt(f.deps, { ...r });
  assertEquals(f.keys.length, 1); assert(r.status !== "failed"); assertEquals(r.status, "needs_review");
});

Deno.test("Brevo event tags are normalized, not falsely matched", () => {
  assertEquals(eventTags({ tags: ["a", "receipt-x"] }), ["a", "receipt-x"]);
  assertEquals(eventTags({ tag: '["donation-receipt","receipt-x"]' }), ["donation-receipt", "receipt-x"]);
  assertEquals(eventTags({ tag: "donation-receipt, receipt-x" }), ["donation-receipt", "receipt-x"]);
  assert(!eventTags({ tag: "receipt-xy" }).includes("receipt-x"));
});

Deno.test("timeout ambiguous after TTL: reconciled from provider log, not resent", async () => {
  const f = fake({ modes: ["timeout"] }); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  const r = [...f.receipts.values()][0];
  f.advance(KEY_WINDOW_MS + 60_000);
  assertEquals(await recoverReceipt(f.deps, { ...r }), "reconciled_sent");
  assertEquals(f.keys.length, 1); assertEquals(f.sent.length, 1); assertEquals(r.status, "sent");
});

Deno.test("timeout after TTL with no provider evidence: held for staff, never auto-resent", async () => {
  const f = fake({ modes: ["timeout"] }); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  f.forgetProvider();
  const r = [...f.receipts.values()][0];
  f.advance(KEY_WINDOW_MS + 60_000);
  assertEquals(await recoverReceipt(f.deps, { ...r }), "awaiting_logs");
  f.advance(LOG_SETTLE_MS);
  assertEquals(await recoverReceipt(f.deps, { ...r }), "needs_review");
  assertEquals(await recoverReceipt(f.deps, { ...r }), "skip");
  assertEquals(f.keys.length, 1); assertEquals(r.status, "needs_review");
});

Deno.test("concurrent worker crash: busy claim is not 'sent'; stale sending recovered", async () => {
  const f = fake(); addDonation(f, "d1", "cs_1");
  const row = await f.deps.upsertReceipt({ donation_id: "d1", kind: "one_time", stripe_object_id: "pi_1", stripe_event_id: "e",
    donor_name: "P", donor_email: "p@x.co", amount_cents: 100, currency: "usd", paid_at: "2026-10-09T12:00:00Z" });
  await f.deps.claimReceipt(row.id); // worker A claims, then crashes before calling the provider
  const out = await handleEvent(f.deps, ev("checkout.session.completed", session({ payment_intent: "pi_1" })));
  assertEquals(out.action, "receipt_busy"); assertEquals(row.status, "sending");
  assertEquals(await recoverReceipt(f.deps, { ...row }), "in_flight");
  f.advance(STALE_SENDING_MS + 1000); // stale: reconciled only, never resubmitted
  assertEquals(await recoverReceipt(f.deps, { ...row }), "awaiting_logs");
  f.advance(LOG_SETTLE_MS);
  assertEquals(await recoverReceipt(f.deps, { ...row }), "needs_review");
  assertEquals(f.sent.length, 0); assertEquals(f.keys.length, 0);
});

Deno.test("deliverReceipt rethrows claim DB errors (nothing sent, Stripe retries)", async () => {
  const f = fake();
  f.deps.claimReceipt = () => Promise.reject(new Error("DB: down"));
  await assertRejects(() => deliverReceipt(f.deps, "x"), Error, "DB: down");
  assertEquals(f.sent.length, 0);
});

Deno.test("paid then stale unpaid/expired/processing events do not downgrade", async () => {
  const f = fake(); addDonation(f, "d1", "cs_1");
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  assertEquals(f.donations.get("d1")!.status, "paid");
  for (const t of ["checkout.session.expired", "checkout.session.async_payment_failed"])
    await handleEvent(f.deps, ev(t, session({ payment_status: "unpaid" })));
  await handleEvent(f.deps, ev("checkout.session.completed", session({ payment_status: "unpaid" })));
  assertEquals(f.donations.get("d1")!.status, "paid"); assertEquals(f.sent.length, 1);
});

Deno.test("reordered subscription.updated uses canonical Stripe state; canceled is terminal", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly"); f.donations.get("d1")!.stripe_subscription_id = "sub_1";
  f.setSub({ status: "active", cancel_at_period_end: true });
  // stale payload says plain active, canonical says canceling
  await handleEvent(f.deps, ev("customer.subscription.updated", { id: "sub_1", status: "active", cancel_at_period_end: false, metadata: MD }));
  assertEquals(f.donations.get("d1")!.status, "canceling");
  await handleEvent(f.deps, ev("customer.subscription.deleted", { id: "sub_1", status: "canceled", metadata: MD }));
  f.setSub({ status: "active", cancel_at_period_end: false });
  await handleEvent(f.deps, ev("customer.subscription.updated", { id: "sub_1", status: "active", metadata: MD }));
  await handleEvent(f.deps, ev("checkout.session.completed", session({ id: "cs_sub", mode: "subscription", subscription: "sub_1", payment_intent: null })));
  assertEquals(f.donations.get("d1")!.status, "canceled");
});

Deno.test("subscription cancel/update statuses", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly"); f.donations.get("d1")!.stripe_subscription_id = "sub_1";
  f.setSub({ status: "active", cancel_at_period_end: true });
  await handleEvent(f.deps, ev("customer.subscription.updated", { id: "sub_1", status: "active", cancel_at_period_end: true, metadata: MD }));
  assertEquals(f.donations.get("d1")!.status, "canceling");
  await handleEvent(f.deps, ev("customer.subscription.deleted", { id: "sub_1", status: "canceled", metadata: MD }));
  assertEquals(f.donations.get("d1")!.status, "canceled");
});

Deno.test("amount validation", () => {
  assertEquals(parseAmount(1), { cents: 100 });
  assertEquals(parseAmount("25.50"), { cents: 2550 });
  assert("error" in parseAmount(0.99));
  assert("error" in parseAmount(-5));
  assert("error" in parseAmount("abc"));
  assert("error" in parseAmount(1.234));
  assert("error" in parseAmount(30000));
  assertEquals(grossWithFees(10000), 10330);
});

Deno.test("origin allowlist", () => {
  assertEquals(allowedOrigin("https://safgolf.online"), "https://safgolf.online");
  assertEquals(allowedOrigin("https://www.safgolf.online"), "https://www.safgolf.online");
  assertEquals(allowedOrigin("https://safgolf.lovable.app"), "https://safgolf.lovable.app");
  assertEquals(allowedOrigin("https://evil.com"), null);
  assertEquals(allowedOrigin("https://safgolf.online.evil.com"), null);
  assertEquals(allowedOrigin(null), null);
});

Deno.test("receipt content: required fields, escaping, monthly wording, test labelling", () => {
  const base = { receipt_number: "SAF-2026-001001", donor_email: "a@b.co", amount_cents: 2575, currency: "usd", paid_at: "2026-10-09T15:00:00Z" };
  const r = renderReceipt({ ...base, kind: "one_time", donor_name: "<script>x</script>" });
  assert(r.html.includes("&lt;script&gt;")); assert(!r.html.includes("<script>x"));
  for (const s of ["JJ Wood Student Athlete Foundation Inc.", "45-3459562", "$25.75", "SAF-2026-001001", "October 9, 2026",
    "No goods or services were provided in exchange for this contribution.", "Contributions are tax-deductible to the extent permitted by law."]) {
    assert(r.text.includes(s), s); assert(r.html.includes(escapeHtml(s)), s);
  }
  const m = renderReceipt({ ...base, kind: "monthly_invoice", donor_name: "A", manage_url: "https://safgolf.online/manage-donation?session_id=cs_x" });
  assert(m.text.includes("this single payment only")); assert(m.text.includes("Manage or cancel"));
  const t = renderReceipt({ ...base, amount_cents: 0, kind: "test", donor_name: "JJ" });
  assert(t.subject.includes("TEST — NOT A DONATION")); assert(t.text.includes("NOT a tax receipt"));
  assert(!t.text.includes("No goods or services"));
});
