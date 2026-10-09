// READ-ONLY status lookup for the thank-you page. Never sends email or writes data.
import { assertSafAccount, corsFor, isSafMetadata, stripeClient } from "../_shared/saf.ts";
import { adminClient } from "../_shared/deps.ts";

const SESSION_RE = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

Deno.serve(async (req) => {
  const cors = corsFor(req.headers.get("origin"));
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const sessionId = new URL(req.url).searchParams.get("session_id") ?? "";
  if (!SESSION_RE.test(sessionId)) return json(200, { state: "invalid" });

  try {
    const stripe = stripeClient();
    await assertSafAccount(stripe);
    let s;
    try { s = await stripe.checkout.sessions.retrieve(sessionId); } catch { return json(200, { state: "invalid" }); }
    if (!isSafMetadata(s.metadata)) return json(200, { state: "invalid" });

    const mode = s.mode === "subscription" ? "monthly" : "one_time";
    let state: "paid" | "processing" | "canceled";
    if (s.status === "complete" && s.payment_status === "paid") state = "paid";
    else if (s.status === "complete") state = "processing";
    else state = "canceled";

    let receipt: { status: string; delivery: string; number: string; paid_at: string } | null = null;
    const objectId = mode === "one_time"
      ? (typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id)
      : (typeof s.invoice === "string" ? s.invoice : s.invoice?.id);
    if (objectId) {
      const { data } = await adminClient().from("donation_receipts")
        .select("status,receipt_number,paid_at").eq("stripe_object_id", objectId).maybeSingle();
      if (data) {
        const delivery = data.status === "sent" ? "sent"
          : data.status === "needs_review" ? "held"
          : data.status === "failed" || data.status === "unconfirmed" ? "retrying"
          : "preparing";
        receipt = { status: data.status, delivery, number: data.receipt_number, paid_at: data.paid_at };
      }
    }

    const cf = s.custom_fields?.find((f) => f.key === "donor_name")?.text?.value ?? s.customer_details?.name ?? "";
    return json(200, {
      state, mode,
      amount_total: s.amount_total, currency: s.currency,
      first_name: cf.trim().split(/\s+/)[0] || null,
      receipt,
    });
  } catch (e) {
    console.error("[verify-donation]", e instanceof Error ? e.message : e);
    return json(500, { state: "error" });
  }
});
