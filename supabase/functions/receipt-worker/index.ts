// Scheduled receipt retry/reconciliation worker. Invoked by database cron only.
// Auth: x-worker-token must equal the service-only value in app_private_config (never leaves the database
// except inside the cron request). No anonymous access; no request input is trusted beyond the token.
import { adminClient, liveDeps } from "../_shared/deps.ts";
import { manageUrl } from "../_shared/donations.ts";
import { recoverReceipt, type OutboxReceipt } from "../_shared/outbox.ts";
import { assertSafAccount, stripeClient } from "../_shared/saf.ts";

const BATCH = 25;
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function safeEqual(a: string, b: string) {
  if (a.length !== b.length || !a) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  const db = adminClient();
  const { data: cfg } = await db.from("app_private_config").select("value").eq("key", "receipt_worker_token").maybeSingle();
  if (!cfg?.value || !safeEqual(req.headers.get("x-worker-token") ?? "", cfg.value)) return json(401, { error: "Unauthorized" });

  const stripe = stripeClient();
  await assertSafAccount(stripe);
  const deps = liveDeps(stripe);

  const { data: rows, error } = await db.from("donation_receipts")
    .select("*")
    .in("status", ["pending", "failed", "sending", "unconfirmed"])
    .neq("kind", "test")
    .or(`next_attempt_at.is.null,next_attempt_at.lte.${new Date().toISOString()}`)
    .order("created_at")
    .limit(BATCH);
  if (error) return json(500, { error: error.message });

  const results: Record<string, number> = {};
  for (const r of (rows ?? []) as OutboxReceipt[]) {
    let manage: string | null = null;
    if (r.kind === "monthly_invoice" && r.donation_id) {
      const { data: d } = await db.from("donations").select("stripe_session_id").eq("id", r.donation_id).maybeSingle();
      manage = manageUrl(d?.stripe_session_id);
    }
    let out: string;
    try { out = await recoverReceipt(deps, r, manage); } catch (e) {
      out = "error";
      console.error(`[receipt-worker] ${r.receipt_number}: ${e instanceof Error ? e.message : e}`);
    }
    results[out] = (results[out] ?? 0) + 1;
  }
  console.log("[receipt-worker]", JSON.stringify(results));
  return json(200, { processed: rows?.length ?? 0, results });
});
