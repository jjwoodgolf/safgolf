import { allowedOrigin, assertSafAccount, corsFor, DEFAULT_ORIGIN, grossWithFees, parseAmount, stripeClient } from "../_shared/saf.ts";
import { adminClient } from "../_shared/deps.ts";

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsFor(origin);
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const site = allowedOrigin(origin);
  if (origin && !site) return json(403, { error: "Origin not allowed" });
  const base = site ?? DEFAULT_ORIGIN;

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }
  const parsed = parseAmount(body.amount);
  if ("error" in parsed) return json(400, { error: parsed.error });
  if (body.frequency !== "one_time" && body.frequency !== "monthly") return json(400, { error: "Choose one-time or monthly." });
  const frequency = body.frequency as "one_time" | "monthly";
  const coverFees = body.coverFees === true;
  const baseCents = parsed.cents;
  const chargedCents = coverFees ? grossWithFees(baseCents) : baseCents;

  try {
    const stripe = stripeClient();
    await assertSafAccount(stripe);
    const metadata = {
      saf_donation: "1",
      gift_type: "pure_gift",
      frequency,
      base_amount_cents: String(baseCents),
      cover_fees: String(coverFees),
    };
    const name = frequency === "monthly" ? "Monthly gift — The Student Athlete Foundation" : "Gift — The Student Athlete Foundation";
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      submit_type: frequency === "monthly" ? undefined : "donate",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: chargedCents,
          product_data: { name, description: "Tax-deductible contribution to JJ Wood Student Athlete Foundation Inc. (EIN 45-3459562)" },
          ...(frequency === "monthly" ? { recurring: { interval: "month" as const } } : {}),
        },
      }],
      custom_fields: [{ key: "donor_name", label: { type: "custom", custom: "Full name for your receipt" }, type: "text", text: { minimum_length: 2, maximum_length: 120 } }],
      ...(frequency === "one_time" ? { customer_creation: "always" as const, payment_intent_data: { metadata } } : { subscription_data: { metadata } }),
      metadata,
      success_url: `${base}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/donate?canceled=1`,
    });

    const { error } = await adminClient().from("donations").insert({
      amount_cents: chargedCents, currency: "usd", frequency, cover_fees: coverFees,
      stripe_session_id: session.id, status: "pending", metadata: { base_amount_cents: baseCents },
    });
    if (error) console.error("[create-donation-checkout] pending insert failed:", error.message);

    return json(200, { url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[create-donation-checkout]", msg);
    return json(500, { error: "Unable to start checkout. Please try again." });
  }
});
