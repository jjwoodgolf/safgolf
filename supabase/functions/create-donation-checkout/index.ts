import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STRIPE_FEE_PERCENT = 0.029;
const STRIPE_FEE_FIXED_CENTS = 30;

function calcGrossWithFees(amountCents: number) {
  // gross = (amount + 0.30) / (1 - 0.029)
  return Math.round((amountCents + STRIPE_FEE_FIXED_CENTS) / (1 - STRIPE_FEE_PERCENT));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const amountDollars = Number(body.amount);
    const frequency: "one_time" | "monthly" = body.frequency === "monthly" ? "monthly" : "one_time";
    const coverFees: boolean = Boolean(body.coverFees);
    const donorEmail: string | undefined = body.donorEmail?.trim() || undefined;
    const donorName: string | undefined = body.donorName?.trim() || undefined;

    if (!amountDollars || amountDollars < 5 || amountDollars > 100000) {
      return new Response(JSON.stringify({ error: "Amount must be between $5 and $100,000" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseCents = Math.round(amountDollars * 100);
    const chargedCents = coverFees ? calcGrossWithFees(baseCents) : baseCents;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const origin = req.headers.get("origin") || "";
    const productName =
      frequency === "monthly"
        ? "Monthly Donation - Student Athlete Foundation"
        : "Donation - Student Athlete Foundation";

    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: chargedCents,
            product_data: { name: productName },
            ...(frequency === "monthly" ? { recurring: { interval: "month" } } : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?canceled=1`,
      metadata: {
        donor_name: donorName ?? "",
        base_amount_cents: String(baseCents),
        cover_fees: String(coverFees),
        frequency,
      },
    });

    // Pre-record the pending donation
    await supabaseAdmin.from("donations").insert({
      amount_cents: chargedCents,
      currency: "usd",
      frequency,
      cover_fees: coverFees,
      donor_name: donorName ?? null,
      donor_email: donorEmail ?? null,
      stripe_session_id: session.id,
      status: "pending",
      metadata: { base_amount_cents: baseCents },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[create-donation-checkout]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
