// Staff-only: registers the SAF webhook endpoint on the SAF Stripe account and stores the signing
// secret server-side (service-role-only table). The secret is never returned or logged.
import { assertSafAccount, corsFor, STRIPE_API_VERSION, stripeClient } from "../_shared/saf.ts";
import { adminClient, requireStaff } from "../_shared/deps.ts";

const EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "invoice.paid",
  "invoice.payment_failed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
] as const;

/** Alternative operator auth: HMAC(STRIPE_SECRET_KEY, "saf-webhook-setup:<ts>") proves possession of the
 *  SAF Stripe secret key without transmitting it. 5-minute window. */
async function validKeyProof(req: Request): Promise<boolean> {
  const ts = Number(req.headers.get("x-setup-ts"));
  const proof = req.headers.get("x-setup-proof") ?? "";
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key || !Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300 || !/^[0-9a-f]{64}$/.test(proof)) return false;
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`saf-webhook-setup:${ts}`)));
  const hex = [...sig].map((b) => b.toString(16).padStart(2, "0")).join("");
  let diff = 0;
  for (let i = 0; i < 64; i++) diff |= hex.charCodeAt(i) ^ proof.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  const cors = corsFor(req.headers.get("origin"));
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!(await requireStaff(req)) && !(await validKeyProof(req))) return json(403, { error: "Not authorized" });

  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/stripe-webhook`;
  try {
    const stripe = stripeClient();
    await assertSafAccount(stripe);
    const db = adminClient();
    const { data: stored } = await db.from("app_private_config").select("key").eq("key", "stripe_webhook_secret").maybeSingle();
    const existing = (await stripe.webhookEndpoints.list({ limit: 100 })).data.filter((e) => e.url === url);

    if (existing.length === 1 && stored) {
      const ep = await stripe.webhookEndpoints.update(existing[0].id, { enabled_events: [...EVENTS], disabled: false });
      return json(200, { endpoint_id: ep.id, status: ep.status, created: false, events: ep.enabled_events });
    }
    for (const e of existing) {
      if (e.metadata?.saf_donations === "1") await stripe.webhookEndpoints.del(e.id);
      else return json(409, { error: "An unrelated endpoint already uses this URL; not modified." });
    }
    const ep = await stripe.webhookEndpoints.create({
      url,
      enabled_events: [...EVENTS],
      api_version: STRIPE_API_VERSION,
      description: "SAF donations: payment ledger + tax acknowledgments",
      metadata: { saf_donations: "1" },
    });
    const { error } = await db.from("app_private_config")
      .upsert({ key: "stripe_webhook_secret", value: ep.secret!, updated_at: new Date().toISOString() });
    if (error) {
      await stripe.webhookEndpoints.del(ep.id);
      throw new Error(`Could not store signing secret: ${error.message}`);
    }
    return json(200, { endpoint_id: ep.id, status: ep.status, created: true, events: ep.enabled_events });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[stripe-webhook-setup]", msg);
    return json(500, { error: msg });
  }
});
