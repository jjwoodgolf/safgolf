# SAF donation + tax acknowledgment workflow

Status as of 2026-10-09. Stripe account: `acct_1SpUY5AnxhNHaMeq` (JJ Wood Student Athlete Foundation Inc., non_profit, live). The GPG account `acct_1Tf2yPJVRjgk5RCT` is never used; every backend function refuses to run unless the configured key resolves to the SAF account.

## Flow
1. Any page "Donate" -> `/donate`. Donor picks one time or monthly, $25/$100/$250/$500 or a custom amount (minimum $1.00, maximum $25,000; Stripe's USD technical minimum is $0.50). Nothing is preselected. Optional processing support (estimated 2.9% + $0.30) is unchecked by default, and the total is shown.
2. `create-donation-checkout` validates the amount, frequency and Origin (allowlist: safgolf.online, www.safgolf.online, safgolf.lovable.app, this project's preview hosts, and localhost:8080. Any other Origin gets 403). It creates a Stripe-hosted Checkout Session with dynamic payment methods (no `payment_method_types`) and a "Full name for your receipt" field, then records a `pending` row in `donations`. Metadata `saf_donation=1, gift_type=pure_gift` goes on the session, the PaymentIntent or Subscription, and that is the only way events are recognized as SAF gifts.
3. Cancel -> `/donate?canceled=1`. No paid record is created. Expired sessions are marked `expired` by the webhook.
4. Success -> `/thank-you?session_id=…`. `verify-donation` is **read-only**: it reports paid / processing / canceled / invalid plus the receipt status from the ledger. The page says "receipt sent" only when the ledger shows the email provider accepted it. Reloading the page never sends anything.
5. `stripe-webhook` (raw body + `constructEventAsync`; verify_jwt=false only because the Stripe signature authenticates requests):
   - `checkout.session.completed` / `async_payment_succeeded`: for one-time gifts, a receipt is sent **only if `payment_status === "paid"`**. Ledger key = PaymentIntent id.
   - Subscription checkout completion links the subscription to the donation. **No receipt.**
   - `invoice.paid` (amount > 0) is the **only** monthly receipt trigger, covering the first payment and every renewal. Ledger key = invoice id. If the invoice arrives before checkout completion, the donation is found through the Checkout Session for that subscription.
   - `async_payment_failed`, `expired`, `invoice.payment_failed`, `customer.subscription.updated/deleted` update the donation status.
6. Ledger `donation_receipts` has a unique `stripe_object_id`, a sequential receipt number (`SAF-YYYY-NNNNNN`), paid timestamp, gross USD cents received, state, attempts, last error and Brevo message id. See "Receipt outbox" below. `stripe_events` logs every event with its status and error.
7. When an email fails, the receipt is marked `failed` with the provider error, and the webhook returns 500 so Stripe retries (Stripe retries for up to 3 days). Staff can also click **Resend** in Admin -> Donations (`resend-receipt`, which checks for an admin/staff role).
8. Monthly donors: every receipt links to `/manage-donation`, which opens the SAF Stripe Customer Portal (card update, invoice history, cancel at period end). The portal also has an email sign-in page: https://billing.stripe.com/p/login/6oU8wO1zU83t6c2ewV48000

## Receipt content (HTML + plain text)
Legal name, brand, EIN 45-3459562, donor name, payment date (America/Chicago), gross amount received including any opted-in fee support, receipt number, gift type, "No goods or services were provided in exchange for this contribution.", "Contributions are tax-deductible to the extent permitted by law.", and "keep for your tax records". Monthly receipts state they cover a single payment only. Sender: The Student Athlete Foundation <jj@gpghouston.com> (Brevo sender id 1, active). Reply-to: safsportshouston@gmail.com. No postal address is included because no current address has been verified. Donor-entered text is HTML-escaped. Event registrations, sponsorships with benefits and in-kind gifts are excluded: only `gift_type=pure_gift` objects get automatic receipts.

## Security
- `donations`, `donation_receipts` and `stripe_events` can be read by staff only. No client-side insert or update path exists. Writes happen only from service-role backend functions.
- The webhook signing secret is stored in `app_private_config` (service-role only, RLS with no policies). It is never returned or logged. Setting `STRIPE_WEBHOOK_SECRET` in Secrets would take precedence.
- The one-off `stripe-webhook-setup` function was removed (source and deployment) after setup; it now returns 404.
- Verified 2026-10-09: anon/authenticated have no SELECT/INSERT on `app_private_config` and no EXECUTE on `claim_donation_receipt` (REST calls return 42501). Ledger tables (`donation_receipts`, `stripe_events`) grant authenticated SELECT only (RLS: staff), no writes for client roles. `receipt-worker` returns 401 without the token; `resend-receipt` returns "Staff only" without a staff session.

## Receipt outbox (reliability model)
States: `pending` -> `sending` (claim; submission time persisted BEFORE the provider call) -> `sent` (provider accepted, message id stored).
- `failed`: Brevo definitively rejected a FIRST submission from `pending`/`failed` (HTTP 4xx incl. 429, or key missing). A 400 `duplicate_parameter` or any idempotency/duplicate conflict is classified as ambiguous, never as rejected. Retried by the worker with backoff (15 min doubling, max 12 h); after 6 attempts -> `needs_review`.
- `unconfirmed`: outcome unknown (timeout after 15 s, network error, 5xx, accepted-without-id, or accepted but the DB write failed). Never treated as failed.
- `needs_review`: delivery could not be proved or disproved. Never auto-resent. Shown in Admin; staff Resend is an explicit decision that may duplicate.
- No automatic resubmission of `unconfirmed` or stale `sending` receipts, ever (not even inside Brevo's idempotency TTL): a later 400/401/429 would not prove the first attempt was unsent. The database claim function only claims `pending`/`failed` rows (migration 0004).
- Idempotency: the receipt UUID is still sent as Brevo `headers.idempotencyKey` plus unique tag `receipt-<uuid>`, as extra protection only; correctness does not depend on its finite TTL.
- Reconciliation (immediately, hourly): stored message id -> `sent`; otherwise the worker looks up Brevo's event log (`/smtp/statistics/events`, event `requests`, `tags` = JSON-serialized array `["receipt-<uuid>"]` per Brevo's get-email-event-report reference, donor email); returned `tag`/`tags` are normalized (array, JSON string, or comma list) and matched exactly. Found -> `sent`. Not found -> waits 2 h for logs to settle, then `needs_review`.
- If an accepted send's DB write fails, the code tries to store the message id as `unconfirmed`; the worker finalizes it as `sent` without resending. If even that write fails, the row stays `sending`; after 10 min the worker treats it as `unconfirmed` and reconciles via the log (a worker crash before the provider call therefore ends in `needs_review`, not a resend).
- A busy claim (another worker holds it) returns `receipt_busy`, not `receipt_sent`. The Stripe event is marked processed only after the receipt row is durably in the ledger; recovery belongs to the worker.
- Worker: `receipt-worker`, invoked hourly (minute 7, 24 runs/day) by database cron, only when non-sent receipts exist. Auth: random token held in `app_private_config`, read by the cron job inside the database. Batch 25. Max retry delay is about 1 hour plus backoff.
- Stale-event guards: once a donation is paid/active/canceling/past_due/canceled/refunded, later unpaid, expired, failed or processing checkout events do not change it. `customer.subscription.updated` fetches the current subscription from Stripe, not the event payload. `canceled` is terminal.
- Known limits: if Brevo's event log is unavailable or doesn't index the tag, ambiguous receipts end in `needs_review` (safe but manual). Duplicates are prevented within the tested model, but not provably impossible: for example, a staff resend from `needs_review` after an undetected delivery.

## Active configuration (verified 2026-10-09)
| Item | State |
|---|---|
| Webhook endpoint `we_1UOXwiAnxhNHaMeqAZoRAuo9` on SAF account, API 2025-08-27.basil, 8 events | enabled |
| Signature verification with real Stripe deliveries | PASS — evt_1UOY11AnxhNHaMeqSC3TCOMg (checkout.session.expired) verified and processed; the first 3 test expirations failed on an old status constraint (since fixed) and will be completed by Stripe automatic retries |
| Customer Portal config `bpc_1UOXwwAnxhNHaMeqfx5EOeGB` (default, login page on) | created |
| Brevo sender jj@gpghouston.com, project key | active, PASS |

## Test results
| Test | Result |
|---|---|
| Unit: duplicate + async-succeeded events -> one receipt | PASS |
| Unit: unpaid checkout completion -> no receipt; async failure -> failed | PASS |
| Unit: expired session -> expired, no receipt | PASS |
| Unit: non-SAF / non-pure-gift objects ignored | PASS |
| Unit: monthly checkout alone -> no receipt; first + renewal invoice -> one receipt each; duplicates ignored | PASS |
| Unit: invoice.paid before checkout.session.completed -> linked, no duplicate | PASS |
| Unit: $0 invoice and payment_failed -> no receipt | PASS |
| Unit: definite rejection -> failed + backoff; redelivery before due sends nothing; worker retry sends once | PASS |
| Unit: provider accepted then DB write fails -> unconfirmed with message id -> reconciled to sent, no resend | PASS |
| Unit: unconfirmed is never resubmitted, even inside the key window; reconciled from log | PASS |
| Unit (regression): accepted-but-timeout -> duplicate 400 (ambiguous) -> no send after TTL -> needs_review | PASS |
| Unit: unconfirmed + later provider rejection never becomes retryable `failed` | PASS |
| Unit: Brevo event tag normalization, no prefix false match | PASS |
| Unit: timeout, then after TTL -> reconciled from provider log, no resend | PASS |
| Unit: timeout, after TTL, no provider evidence -> awaiting logs, then needs_review; never auto-resent | PASS |
| Unit: concurrent worker crash -> `receipt_busy` (not sent); stale sending reconciled, never resubmitted -> needs_review | PASS |
| Unit: claim DB error rethrown (Stripe retries), nothing sent | PASS |
| Unit: paid, then stale expired/failed/unpaid events -> stays paid | PASS |
| Unit: reordered subscription.updated uses canonical state; canceled is terminal | PASS |
| Live: anon REST access to private config / claim RPC denied (42501); worker 401 without token; setup endpoint 404 | PASS |
| Total unit tests (Deno) | 23 passed, 0 failed |
| Brevo idempotency/event-log lookup against the live provider | NOT TESTED (no new emails sent, per instruction); field names follow Brevo docs |
| Unit: amount validation, origin allowlist, receipt fields/escaping/TEST labelling | PASS |
| Live: missing / bad Stripe-Signature -> 400 | PASS |
| Live: $0.50, "abc", bad frequency -> 400; disallowed Origin -> 403 | PASS |
| Live: $1 one-time, $37.50 + fee help ($38.93), $25 monthly Checkout pages open (HTTP 200), dynamic methods | PASS (not paid; sessions then expired) |
| Live: verify-donation open/expired -> canceled; malformed/unknown -> invalid | PASS |
| Live: donor-portal rejects one-time/unpaid sessions; resend-receipt rejects non-staff | PASS |
| Live: TEST receipt (TEST — NOT A DONATION — $0.00) to jj@gpghouston.com | PASS, Brevo accepted, message id `<202610090712.35852866058@smtp-relay.mailin.fr>` |
| Live: real paid one-time / monthly gift end to end | NOT RUN (no live charges authorized) |

Unit tests: `supabase/functions/_shared/donations_test.ts` (run with `deno test` in a folder whose deno.json sets `"nodeModulesDir": "auto"`).

## Outstanding checklist
- [ ] First real gift: confirm the receipt arrives and that Admin -> Donations shows `sent`.
- [ ] Create a staff account (no auth users exist yet) and grant it the `admin` role so the Admin dashboard and Resend can be used.
- [ ] Optional: add a verified SAF mailing address to the receipt footer once confirmed.
- [ ] Optional: scheduled automatic retry job. Today recovery relies on Stripe webhook retries (up to 3 days) plus staff Resend.

## Owner admin handoff (2026-10-09)

- Invitation sent 2026-10-09 07:27 UTC to jj@gpghouston.com only, via the existing Brevo sender (Brevo accepted: HTTP 201, tag `owner-invite`). Link generated with the backend's admin invite API; never logged or stored outside the email.
- Account: one user, UUID `e9bccd98-c5fa-4d75-a202-0f3c91580121`, email not yet confirmed (confirms when JJ opens the link). Roles: `admin` (granted to that exact UUID) plus the default `applicant` added automatically at signup. No other accounts or roles exist or were changed.
- Owner action: open the email "Your SAF donation dashboard invitation", click the button, choose a password on `/set-password` (min 10 characters), then you land on `/admin/donations`. Later sign-ins: `https://safgolf.online/login`.
- Expiry: single-use; backend default invite lifetime is 24 hours (not separately verified). If it expires, use password reset or request a new invite.
- The one-off invite function was deleted after use. Email verification, signup settings and approval gates were not changed.

## Owner invite redirect verification (2026-10-09)
- Auth verify endpoint with a dummy (invalid) invite token and redirect_to=https://safgolf.online/set-password returned 303 to https://safgolf.online/set-password — the production domain is on the redirect allowlist. No real token used; invitation not consumed.
- Invite/recovery forwarding moved from src/main.tsx into an inline script in index.html so it runs before the auth client loads. Local browser test with dummy hashes (type=invite, expired-error, type=recovery) on "/" all landed on /set-password and showed the invalid-link message; normal pages unaffected.
- Brevo event log (read-only): TEST receipt delivered 2026-10-09 02:12 UTC; owner invitation delivered 2026-10-09 02:27 UTC. Neither opened yet at time of check.
