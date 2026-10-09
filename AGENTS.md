# Project rules

- Shared public-page building blocks live in `src/components/site/` (PageHeader, Section, DonateBand, PlaybookCTA, PhotoGallery, photos registry, org facts) — keeps headers, CTAs and claims consistent across pages.
- `Layout` renders the bottom donation band and mobile donate bar on every public page; pass `hideDonateBand` only on the donate flow — guarantees a donation CTA everywhere without per-page duplication.
- Every public factual claim and photo must be listed in `docs/SAF-content-sources.md` — prevents unverified copy from reaching donors.
- Legacy `/programs/*` duplicates redirect to canonical pages rather than being deleted — preserves old inbound links.
- Donation receipts are triggered only by the Stripe webhook (paid one-time sessions, `invoice.paid` for monthly) through the `donation_receipts` outbox (`_shared/outbox.ts`): ambiguous sends are only resubmitted inside the provider idempotency window, otherwise reconciled from provider logs or held as `needs_review`; the hourly token-authenticated `receipt-worker` recovers them; the thank-you endpoint stays read-only — prevents unpaid, lost or duplicate tax receipts.
- Backend Stripe calls must pass the SAF account guard in `supabase/functions/_shared/saf.ts` and only act on objects tagged `saf_donation=1, gift_type=pure_gift` — keeps SAF separate from other Stripe accounts and non-gift payments.
