// Shared SAF donation config. Pinned Stripe SDK + API version.
import Stripe from "npm:stripe@18.5.0";

export const STRIPE_API_VERSION = "2025-08-27.basil" as const;
export const EXPECTED_STRIPE_ACCOUNT = "acct_1SpUY5AnxhNHaMeq"; // JJ Wood Student Athlete Foundation Inc. — never GPG
export const DEFAULT_ORIGIN = "https://safgolf.online";
export const MIN_CENTS = 100; // $1.00 (Stripe's USD technical minimum is $0.50)
export const MAX_CENTS = 2_500_000; // $25,000 online limit; larger gifts by arrangement
export const FEE_PERCENT = 0.029;
export const FEE_FIXED_CENTS = 30;

export const ORG = {
  legalName: "JJ Wood Student Athlete Foundation Inc.",
  brand: "The Student Athlete Foundation",
  ein: "45-3459562",
  senderEmail: "jj@gpghouston.com",
  replyTo: "safsportshouston@gmail.com",
  phone: "(713) 586-9569",
  site: "https://safgolf.online",
};

const ALLOWED_ORIGINS = new Set([
  "https://safgolf.online",
  "https://www.safgolf.online",
  "https://safgolf.lovable.app",
  "https://id-preview--399cb46f-eb07-4388-8555-ed0a831a5f16.lovable.app",
  "http://localhost:8080",
]);
const PREVIEW_RE = /^https:\/\/[a-z0-9-]+--399cb46f-eb07-4388-8555-ed0a831a5f16\.lovable\.app$/;

/** Returns the origin only if allowlisted; otherwise null. Never trust arbitrary Origin for redirects. */
export function allowedOrigin(origin: string | null | undefined): string | null {
  if (!origin) return null;
  return ALLOWED_ORIGINS.has(origin) || PREVIEW_RE.test(origin) ? origin : null;
}

export function corsFor(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin(origin) ?? DEFAULT_ORIGIN,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
}

export function grossWithFees(baseCents: number) {
  return Math.round((baseCents + FEE_FIXED_CENTS) / (1 - FEE_PERCENT));
}

/** Validates a donor-entered dollar amount; returns cents or an error string. */
export function parseAmount(input: unknown): { cents: number } | { error: string } {
  const n = typeof input === "number" ? input : typeof input === "string" ? Number(input) : NaN;
  if (!Number.isFinite(n)) return { error: "Enter a valid amount." };
  const cents = Math.round(n * 100);
  if (Math.abs(n * 100 - cents) > 1e-6) return { error: "Amount can have at most two decimal places." };
  if (cents < MIN_CENTS) return { error: "The minimum online gift is $1.00." };
  if (cents > MAX_CENTS) return { error: "For gifts over $25,000 please contact us." };
  return { cents };
}

export function stripeClient() {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: STRIPE_API_VERSION, httpClient: Stripe.createFetchHttpClient() });
}

let accountVerified = false;
/** Refuses to operate unless the configured key belongs to the SAF Stripe account. */
export async function assertSafAccount(stripe: Stripe) {
  if (accountVerified) return;
  const acct = await stripe.accounts.retrieve();
  if (acct.id !== EXPECTED_STRIPE_ACCOUNT) {
    throw new Error("Configured Stripe key does not belong to the SAF account; refusing to continue.");
  }
  accountVerified = true;
}

export function isSafMetadata(md: Record<string, string> | null | undefined) {
  return !!md && md.saf_donation === "1" && md.gift_type === "pure_gift";
}

export { Stripe };
