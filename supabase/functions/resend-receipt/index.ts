// Staff-only: retry a pending/failed receipt. Uses the same atomic claim, so it never double-sends.
import { corsFor } from "../_shared/saf.ts";
import { adminClient, liveDeps, requireStaff } from "../_shared/deps.ts";
import { deliverReceipt, manageUrl } from "../_shared/donations.ts";
import { stripeClient } from "../_shared/saf.ts";

Deno.serve(async (req) => {
  const cors = corsFor(req.headers.get("origin"));
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!(await requireStaff(req))) return json(403, { error: "Staff only" });

  let id = "";
  try { id = String((await req.json()).receipt_id ?? ""); } catch { /* */ }
  if (!/^[0-9a-f-]{36}$/i.test(id)) return json(400, { error: "Invalid receipt id" });

  const db = adminClient();
  const { data: r } = await db.from("donation_receipts").select("id,kind,status,donation_id").eq("id", id).maybeSingle();
  if (!r) return json(404, { error: "Not found" });
  if (r.status === "sent") return json(409, { error: "Receipt already sent" });
  if (r.status === "sending" || r.status === "unconfirmed")
    return json(409, { error: "Delivery is being confirmed automatically. Try again later if it moves to Needs review." });
  if (r.status === "needs_review" || r.status === "failed") {
    // Explicit staff decision: release the hold and send now (may duplicate if an earlier attempt was delivered).
    const { error } = await db.from("donation_receipts")
      .update({ status: "failed", next_attempt_at: null, review_reason: null }).eq("id", id).in("status", ["needs_review", "failed"]);
    if (error) return json(500, { error: error.message });
  }
  let manage: string | null = null;
  if (r.kind === "monthly_invoice" && r.donation_id) {
    const { data: d } = await db.from("donations").select("stripe_session_id").eq("id", r.donation_id).maybeSingle();
    manage = manageUrl(d?.stripe_session_id);
  }
  try {
    const result = await deliverReceipt(liveDeps(stripeClient()), id, manage);
    return json(result === "sent" ? 200 : 202, { result });
  } catch (e) {
    return json(502, { error: e instanceof Error ? e.message : String(e) });
  }
});
