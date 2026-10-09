// Durable receipt outbox. Pure logic with injected dependencies so every failure path is unit tested.
//
// States (donation_receipts.status):
//   pending       created, never submitted
//   sending       claimed; submission boundary persisted BEFORE the provider call
//   sent          provider accepted; provider_message_id stored
//   failed        provider DEFINITELY rejected (4xx/429) -> retried later with backoff
//   unconfirmed   ambiguous (timeout, network error, 5xx, accepted-but-DB-write-failed, worker crash)
//   needs_review  delivery could not be proved or disproved -> held for staff; never auto-resent
//
// Brevo idempotencyKey = the persisted receipt UUID. Brevo documents a finite dedupe TTL (15 min in the
// 2021 changelog, 30 min in newer batch docs); we conservatively treat 14 min as the safe resend window.
// Outside that window an ambiguous receipt is reconciled from Brevo's event log by its unique tag, or held.
import type { ReceiptData } from "./receipt.ts";

export const KEY_WINDOW_MS = 14 * 60_000;
export const STALE_SENDING_MS = 10 * 60_000;
export const LOG_SETTLE_MS = 2 * 60 * 60_000; // provider event logs can lag; wait before concluding "not sent"
export const MAX_DEFINITE_ATTEMPTS = 6;

export type ReceiptStatus = "pending" | "sending" | "sent" | "failed" | "unconfirmed" | "needs_review";

export interface OutboxReceipt extends ReceiptData {
  id: string;
  donation_id: string | null;
  stripe_object_id: string;
  status: ReceiptStatus;
  attempts: number;
  last_error?: string | null;
  provider_message_id?: string | null;
  submission_started_at?: string | null;
  claimed_at?: string | null;
  next_attempt_at?: string | null;
}

/** Provider definitively did not accept the message (safe to retry later). */
export class ProviderRejected extends Error {}
/** Outcome unknown: the provider may or may not have accepted it. */
export class ProviderAmbiguous extends Error {}

export interface OutboxDeps {
  now(): Date;
  claimReceipt(id: string): Promise<OutboxReceipt | null>;
  markReceipt(id: string, patch: Record<string, unknown>): Promise<void>;
  sendEmail(r: ReceiptData & { id: string }): Promise<{ messageId: string }>;
  /** Looks up an accepted message for this receipt's unique tag. null = none found. Throws if lookup failed. */
  findProviderMessage(r: OutboxReceipt): Promise<string | null>;
}

export type DeliveryResult = "sent" | "accepted_unrecorded" | "busy" | "retry_scheduled" | "unconfirmed" | "needs_review";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 1000);

export function backoffMs(attempts: number) {
  return Math.min(15 * 60_000 * 2 ** Math.max(0, attempts - 1), 12 * 60 * 60_000);
}

export const receiptTag = (id: string) => `receipt-${id}`;

/** Claims and submits one receipt. Never throws for provider/DB-after-send problems: state stays recoverable. */
export async function deliverReceipt(deps: OutboxDeps, receiptId: string, manage: string | null = null): Promise<DeliveryResult> {
  const claimed = await deps.claimReceipt(receiptId); // DB errors here propagate (nothing was sent)
  if (!claimed) return "busy"; // sent, held, not yet due, or held by another worker — durable row, worker recovers

  let messageId: string;
  try {
    ({ messageId } = await deps.sendEmail({ ...claimed, manage_url: manage }));
  } catch (e) {
    const now = deps.now();
    if (e instanceof ProviderRejected) {
      const exhausted = claimed.attempts >= MAX_DEFINITE_ATTEMPTS;
      await safeMark(deps, claimed.id, exhausted
        ? { status: "needs_review", last_error: errMsg(e), review_reason: "Provider rejected repeatedly" }
        : { status: "failed", last_error: errMsg(e), next_attempt_at: new Date(now.getTime() + backoffMs(claimed.attempts)).toISOString() });
      return exhausted ? "needs_review" : "retry_scheduled";
    }
    // Timeout / network / 5xx: may have been accepted. Do not mark failed.
    await safeMark(deps, claimed.id, { status: "unconfirmed", last_error: errMsg(e) });
    return "unconfirmed";
  }

  // Provider accepted. A DB failure from here on must NEVER lead to a resend.
  try {
    await deps.markReceipt(claimed.id, { status: "sent", provider_message_id: messageId, sent_at: deps.now().toISOString(), last_error: null });
    return "sent";
  } catch (e) {
    // Try to at least persist the message id; reconciliation will finalize it as sent.
    await safeMark(deps, claimed.id, { status: "unconfirmed", provider_message_id: messageId, last_error: `Accepted, DB write failed: ${errMsg(e)}` });
    return "accepted_unrecorded";
  }
}

async function safeMark(deps: OutboxDeps, id: string, patch: Record<string, unknown>) {
  try { await deps.markReceipt(id, patch); } catch (e) {
    // Row stays 'sending'; the worker treats stale 'sending' as unconfirmed and reconciles.
    console.error(`[outbox] could not record state for ${id}: ${errMsg(e)}`);
  }
}

/** Worker step for one non-sent receipt. Never blindly resends outside the idempotency window. */
export async function recoverReceipt(deps: OutboxDeps, r: OutboxReceipt, manage: string | null = null): Promise<string> {
  const now = deps.now().getTime();
  const t = (s?: string | null) => (s ? new Date(s).getTime() : 0);

  if (r.status === "sent" || r.status === "needs_review") return "skip";

  if (r.status === "pending" || r.status === "failed") {
    if (r.next_attempt_at && t(r.next_attempt_at) > now) return "not_due";
    return deliverReceipt(deps, r.id, manage);
  }

  if (r.status === "sending") {
    if (now - t(r.claimed_at) < STALE_SENDING_MS) return "in_flight";
    await deps.markReceipt(r.id, { status: "unconfirmed", last_error: r.last_error ?? "Worker stopped mid-send" });
    r = { ...r, status: "unconfirmed" };
  }

  // unconfirmed
  if (r.provider_message_id) {
    await deps.markReceipt(r.id, { status: "sent", sent_at: deps.now().toISOString(), last_error: null });
    return "reconciled_sent";
  }
  if (now - t(r.submission_started_at) < KEY_WINDOW_MS) {
    return deliverReceipt(deps, r.id, manage); // same idempotency key, inside provider dedupe window
  }
  let found: string | null;
  try { found = await deps.findProviderMessage(r); } catch (e) {
    await deps.markReceipt(r.id, { last_error: `Reconcile lookup failed: ${errMsg(e)}` });
    return "lookup_failed";
  }
  if (found) {
    await deps.markReceipt(r.id, { status: "sent", provider_message_id: found, sent_at: deps.now().toISOString(), last_error: null });
    return "reconciled_sent";
  }
  if (now - t(r.submission_started_at) < LOG_SETTLE_MS) return "awaiting_logs";
  await deps.markReceipt(r.id, {
    status: "needs_review",
    review_reason: "Delivery could not be confirmed after the provider idempotency window; not auto-resent.",
  });
  return "needs_review";
}
