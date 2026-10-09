// Webhook business logic, dependency-injected so it can be unit tested without Stripe/DB.
import { isSafMetadata, ORG } from "./saf.ts";
import type { ReceiptData } from "./receipt.ts";

export interface Donation {
  id: string;
  donor_name: string | null;
  donor_email: string | null;
  stripe_session_id: string | null;
  stripe_subscription_id: string | null;
  frequency: string;
}
export interface Receipt extends ReceiptData {
  id: string;
  donation_id: string | null;
  stripe_object_id: string;
  status: "pending" | "sending" | "sent" | "failed";
  attempts: number;
  last_error?: string | null;
}
export interface NewReceipt {
  donation_id: string | null;
  kind: "one_time" | "monthly_invoice";
  stripe_object_id: string;
  stripe_event_id: string;
  donor_name: string | null;
  donor_email: string;
  amount_cents: number;
  currency: string;
  paid_at: string;
}
export interface Deps {
  findDonationBySession(sessionId: string): Promise<Donation | null>;
  findDonationBySubscription(subId: string): Promise<Donation | null>;
  updateDonation(id: string, patch: Record<string, unknown>): Promise<void>;
  /** Insert if absent (unique stripe_object_id) and return the stored row. */
  upsertReceipt(r: NewReceipt): Promise<Receipt>;
  claimReceipt(id: string): Promise<Receipt | null>;
  markReceipt(id: string, patch: Record<string, unknown>): Promise<void>;
  sendEmail(r: ReceiptData): Promise<{ messageId: string }>;
  sessionIdForSubscription(subId: string): Promise<string | null>;
}

// deno-lint-ignore no-explicit-any
type Obj = any;

export type Outcome = { action: string; receipt?: string };

const iso = (sec: number) => new Date(sec * 1000).toISOString();

export function donorNameFromSession(s: Obj): string | null {
  const cf = (s.custom_fields ?? []).find((f: Obj) => f.key === "donor_name");
  return (cf?.text?.value || s.customer_details?.name || "").trim() || null;
}

export function invoiceSubscription(inv: Obj): { id: string | null; metadata: Record<string, string> | null } {
  const det = inv.parent?.subscription_details;
  const id = det?.subscription ?? (typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id) ?? null;
  const metadata = det?.metadata ?? inv.subscription_details?.metadata ?? null;
  return { id: typeof id === "string" ? id : id?.id ?? null, metadata };
}

export function manageUrl(sessionId: string | null | undefined) {
  return sessionId ? `${ORG.site}/manage-donation?session_id=${encodeURIComponent(sessionId)}` : null;
}

/** Claims and sends one receipt. Safe to call concurrently / repeatedly; sends at most once. */
export async function deliverReceipt(deps: Deps, receiptId: string, manage: string | null = null): Promise<"sent" | "skipped"> {
  const claimed = await deps.claimReceipt(receiptId);
  if (!claimed) return "skipped"; // already sent or another worker holds it
  try {
    const { messageId } = await deps.sendEmail({ ...claimed, manage_url: manage });
    await deps.markReceipt(claimed.id, { status: "sent", provider_message_id: messageId, sent_at: new Date().toISOString(), last_error: null });
    return "sent";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await deps.markReceipt(claimed.id, { status: "failed", last_error: msg.slice(0, 1000) });
    throw new Error(`Receipt ${claimed.receipt_number} failed: ${msg}`);
  }
}

async function paidOneTime(deps: Deps, s: Obj, eventId: string, eventCreated: number): Promise<Outcome> {
  const donation = await deps.findDonationBySession(s.id);
  const email = s.customer_details?.email ?? donation?.donor_email;
  const name = donorNameFromSession(s) ?? donation?.donor_name ?? null;
  const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
  if (!pi) throw new Error(`Paid session ${s.id} has no payment_intent`);
  const paidAt = iso(eventCreated);
  if (donation) {
    await deps.updateDonation(donation.id, {
      status: "paid", paid_at: paidAt, amount_cents: s.amount_total, donor_email: email, donor_name: name,
      stripe_payment_intent_id: pi, stripe_customer_id: typeof s.customer === "string" ? s.customer : null,
    });
  }
  if (!email) throw new Error(`Paid session ${s.id} has no donor email`);
  const receipt = await deps.upsertReceipt({
    donation_id: donation?.id ?? null, kind: "one_time", stripe_object_id: pi, stripe_event_id: eventId,
    donor_name: name, donor_email: email, amount_cents: s.amount_total, currency: s.currency ?? "usd", paid_at: paidAt,
  });
  if (receipt.status === "sent") return { action: "already_receipted", receipt: receipt.receipt_number };
  await deliverReceipt(deps, receipt.id);
  return { action: "receipt_sent", receipt: receipt.receipt_number };
}

export async function handleEvent(deps: Deps, event: Obj): Promise<Outcome> {
  const o = event.data?.object ?? {};
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (!isSafMetadata(o.metadata)) return { action: "ignored_not_saf" };
      if (o.mode === "payment") {
        if (o.payment_status !== "paid") {
          const d = await deps.findDonationBySession(o.id);
          if (d) await deps.updateDonation(d.id, { status: "processing" });
          return { action: "awaiting_payment" };
        }
        return paidOneTime(deps, o, event.id, event.created);
      }
      if (o.mode === "subscription") {
        // No receipt here: invoice.paid is the sole monthly receipt trigger.
        const d = await deps.findDonationBySession(o.id);
        const sub = typeof o.subscription === "string" ? o.subscription : o.subscription?.id;
        if (d) {
          await deps.updateDonation(d.id, {
            status: "active", stripe_subscription_id: sub, donor_email: o.customer_details?.email ?? d.donor_email,
            donor_name: donorNameFromSession(o) ?? d.donor_name,
            stripe_customer_id: typeof o.customer === "string" ? o.customer : null,
          });
        }
        return { action: "subscription_linked" };
      }
      return { action: "ignored_mode" };
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      if (!isSafMetadata(o.metadata)) return { action: "ignored_not_saf" };
      const d = await deps.findDonationBySession(o.id);
      if (d) await deps.updateDonation(d.id, { status: event.type.endsWith("expired") ? "expired" : "failed" });
      return { action: "marked_unpaid" };
    }
    case "invoice.paid": {
      const { id: subId, metadata } = invoiceSubscription(o);
      if (!subId || !isSafMetadata(metadata)) return { action: "ignored_not_saf" };
      if (!(o.amount_paid > 0)) return { action: "ignored_zero_invoice" };
      let d = await deps.findDonationBySubscription(subId);
      if (!d) {
        // invoice.paid can arrive before checkout.session.completed — resolve via the Checkout Session.
        const sid = await deps.sessionIdForSubscription(subId);
        if (sid) {
          d = await deps.findDonationBySession(sid);
          if (d) await deps.updateDonation(d.id, { stripe_subscription_id: subId, status: "active" });
        }
      }
      const email = o.customer_email ?? d?.donor_email;
      if (!email) throw new Error(`Invoice ${o.id} has no donor email`);
      const paidAt = iso(o.status_transitions?.paid_at ?? event.created);
      if (d) await deps.updateDonation(d.id, { status: "active", paid_at: paidAt });
      const receipt = await deps.upsertReceipt({
        donation_id: d?.id ?? null, kind: "monthly_invoice", stripe_object_id: o.id, stripe_event_id: event.id,
        donor_name: d?.donor_name ?? o.customer_name ?? null, donor_email: email,
        amount_cents: o.amount_paid, currency: o.currency ?? "usd", paid_at: paidAt,
      });
      if (receipt.status === "sent") return { action: "already_receipted", receipt: receipt.receipt_number };
      await deliverReceipt(deps, receipt.id, manageUrl(d?.stripe_session_id));
      return { action: "receipt_sent", receipt: receipt.receipt_number };
    }
    case "invoice.payment_failed": {
      const { id: subId, metadata } = invoiceSubscription(o);
      if (!subId || !isSafMetadata(metadata)) return { action: "ignored_not_saf" };
      const d = await deps.findDonationBySubscription(subId);
      if (d) await deps.updateDonation(d.id, { status: "past_due" });
      return { action: "marked_past_due" };
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      if (!isSafMetadata(o.metadata)) return { action: "ignored_not_saf" };
      const d = await deps.findDonationBySubscription(o.id);
      const status = event.type.endsWith("deleted") ? "canceled" : o.cancel_at_period_end ? "canceling" : o.status === "active" ? "active" : o.status;
      if (d) await deps.updateDonation(d.id, { status });
      return { action: `subscription_${status}` };
    }
    default:
      return { action: "ignored_type" };
  }
}
