import { assert, assertEquals, assertRejects } from "jsr:@std/assert@1";
import { type Deps, type Donation, handleEvent, type Receipt } from "./donations.ts";
import { allowedOrigin, grossWithFees, parseAmount } from "./saf.ts";
import { escapeHtml, renderReceipt } from "./receipt.ts";

const MD = { saf_donation: "1", gift_type: "pure_gift" };

function fake(opts: { failEmails?: number } = {}) {
  const donations = new Map<string, Donation & Record<string, unknown>>();
  const receipts = new Map<string, Receipt>();
  const sent: string[] = [];
  let failures = opts.failEmails ?? 0;
  let n = 1000;
  const deps: Deps = {
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
    claimReceipt: async (id) => {
      const r = receipts.get(id)!;
      if (r.status === "sent" || r.status === "sending") return null;
      r.status = "sending"; r.attempts++;
      return { ...r };
    },
    markReceipt: async (id, p) => { Object.assign(receipts.get(id)!, p); },
    sendEmail: async (r) => {
      if (failures > 0) { failures--; throw new Error("Brevo [503]: unavailable"); }
      sent.push(r.receipt_number);
      return { messageId: `<m${sent.length}>` };
    },
    sessionIdForSubscription: async (sub) => sub === "sub_1" ? "cs_sub" : null,
  };
  return { deps, donations, receipts, sent };
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

Deno.test("email failure is surfaced, recorded, and a retry sends exactly once", async () => {
  const f = fake({ failEmails: 1 }); addDonation(f, "d1", "cs_1");
  await assertRejects(() => handleEvent(f.deps, ev("checkout.session.completed", session())), Error, "Brevo [503]");
  const r = [...f.receipts.values()][0];
  assertEquals(r.status, "failed"); assert(String(r.last_error).includes("503"));
  await handleEvent(f.deps, ev("checkout.session.completed", session())); // Stripe retry
  await handleEvent(f.deps, ev("checkout.session.completed", session()));
  assertEquals(f.sent.length, 1); assertEquals(r.status, "sent"); assertEquals(r.attempts, 2);
});

Deno.test("subscription cancel/update statuses", async () => {
  const f = fake(); addDonation(f, "d1", "cs_sub", "monthly"); f.donations.get("d1")!.stripe_subscription_id = "sub_1";
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
  assertEquals(grossWithFees(10000), 10329);
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
