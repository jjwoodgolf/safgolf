// Stripe webhook. verify_jwt=false because the Stripe signature (raw body + constructEventAsync) authenticates requests.
import { assertSafAccount, Stripe, stripeClient } from "../_shared/saf.ts";
import { handleEvent } from "../_shared/donations.ts";
import { adminClient, liveDeps } from "../_shared/deps.ts";

const cryptoProvider = Stripe.createSubtleCryptoProvider();
let cachedSecret: string | null = null;

async function signingSecret(): Promise<string | null> {
  if (cachedSecret) return cachedSecret;
  const env = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (env) return (cachedSecret = env);
  const { data } = await adminClient().from("app_private_config").select("value").eq("key", "stripe_webhook_secret").maybeSingle();
  return (cachedSecret = data?.value ?? null);
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return json(400, { error: "Missing signature" });
  const secret = await signingSecret();
  if (!secret) {
    console.error("[stripe-webhook] signing secret not configured");
    return json(500, { error: "Webhook not configured" });
  }

  const raw = await req.text();
  const stripe = stripeClient();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret, undefined, cryptoProvider);
  } catch (e) {
    console.warn("[stripe-webhook] signature verification failed:", e instanceof Error ? e.message : e);
    return json(400, { error: "Invalid signature" });
  }

  const db = adminClient();
  const { data: prior } = await db.from("stripe_events").select("status,attempts").eq("id", event.id).maybeSingle();
  if (prior?.status === "processed") return json(200, { received: true, duplicate: true });
  if (prior) await db.from("stripe_events").update({ attempts: prior.attempts + 1, status: "received" }).eq("id", event.id);
  else await db.from("stripe_events").insert({ id: event.id, type: event.type });

  try {
    await assertSafAccount(stripe);
    const outcome = await handleEvent(liveDeps(stripe), event);
    await db.from("stripe_events").update({ status: "processed", processed_at: new Date().toISOString(), error: null }).eq("id", event.id);
    console.log(`[stripe-webhook] ${event.type} ${event.id} -> ${outcome.action}`);
    return json(200, { received: true, ...outcome });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[stripe-webhook] ${event.type} ${event.id} failed: ${msg}`);
    await db.from("stripe_events").update({ status: "failed", error: msg.slice(0, 1000) }).eq("id", event.id);
    // Non-2xx makes Stripe retry; receipt claim prevents duplicate sends.
    return json(500, { error: "Processing failed" });
  }
});
