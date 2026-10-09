import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import type { Deps, Donation, Receipt } from "./donations.ts";
import { findBrevoMessage, sendReceiptEmail } from "./receipt.ts";
import type { Stripe } from "./saf.ts";

export function adminClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
}

const DCOLS = "id,donor_name,donor_email,stripe_session_id,stripe_subscription_id,frequency,status";

export function liveDeps(stripe: Stripe): Deps {
  const db = adminClient();
  const one = async <T>(q: PromiseLike<{ data: T | null; error: { message: string } | null }>) => {
    const { data, error } = await q;
    if (error) throw new Error(`DB: ${error.message}`);
    return data;
  };
  return {
    now: () => new Date(),
    findProviderMessage: (r) => findBrevoMessage(r.id, r.donor_email),
    retrieveSubscription: async (id) => {
      const s = await stripe.subscriptions.retrieve(id);
      return { status: s.status, cancel_at_period_end: s.cancel_at_period_end };
    },
    findDonationBySession: (id) =>
      one<Donation>(db.from("donations").select(DCOLS).eq("stripe_session_id", id).maybeSingle()),
    findDonationBySubscription: (id) =>
      one<Donation>(db.from("donations").select(DCOLS).eq("stripe_subscription_id", id).order("created_at").limit(1).maybeSingle()),
    updateDonation: async (id, patch) => {
      const { error } = await db.from("donations").update(patch).eq("id", id);
      if (error) throw new Error(`DB: ${error.message}`);
    },
    upsertReceipt: async (r) => {
      const { error } = await db.from("donation_receipts").upsert(r, { onConflict: "stripe_object_id", ignoreDuplicates: true });
      if (error) throw new Error(`DB: ${error.message}`);
      const row = await one<Receipt>(db.from("donation_receipts").select("*").eq("stripe_object_id", r.stripe_object_id).single());
      return row!;
    },
    claimReceipt: async (id) => {
      const { data, error } = await db.rpc("claim_donation_receipt", { _id: id });
      if (error) throw new Error(`DB: ${error.message}`);
      return (Array.isArray(data) ? data[0] : data) ?? null;
    },
    markReceipt: async (id, patch) => {
      const { error } = await db.from("donation_receipts").update(patch).eq("id", id);
      if (error) throw new Error(`DB: ${error.message}`);
    },
    sendEmail: (r) => sendReceiptEmail(r),
    sessionIdForSubscription: async (subId) => {
      const list = await stripe.checkout.sessions.list({ subscription: subId, limit: 1 });
      return list.data[0]?.id ?? null;
    },
  };
}

/** Verifies the caller is signed in with an admin/staff role. Returns user id or null. */
export async function requireStaff(req: Request): Promise<string | null> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const db = adminClient();
  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return null;
  const { data: roles } = await db.from("user_roles").select("role").eq("user_id", data.user.id).in("role", ["admin", "staff"]);
  return roles && roles.length > 0 ? data.user.id : null;
}
