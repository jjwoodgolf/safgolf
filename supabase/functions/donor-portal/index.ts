// Opens the SAF Stripe Customer Portal for a monthly donor identified by their Checkout Session id.
import { allowedOrigin, assertSafAccount, corsFor, DEFAULT_ORIGIN, isSafMetadata, stripeClient } from "../_shared/saf.ts";

const SESSION_RE = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsFor(origin);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  let sessionId = "";
  try { sessionId = String((await req.json()).session_id ?? ""); } catch { /* fallthrough */ }
  if (!SESSION_RE.test(sessionId)) return json(400, { error: "Invalid link" });

  try {
    const stripe = stripeClient();
    await assertSafAccount(stripe);
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    if (!isSafMetadata(s.metadata) || s.mode !== "subscription" || typeof s.customer !== "string") {
      return json(400, { error: "This link is not for a monthly gift." });
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: s.customer,
      return_url: `${allowedOrigin(origin) ?? DEFAULT_ORIGIN}/donate`,
    });
    return json(200, { url: portal.url });
  } catch (e) {
    console.error("[donor-portal]", e instanceof Error ? e.message : e);
    return json(500, { error: "Unable to open the donor portal. Please contact us." });
  }
});
