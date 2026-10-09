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
6. Ledger `donation_receipts` has a unique `stripe_object_id`, a sequential receipt number (`SAF-YYYY-NNNNNN`), paid timestamp, gross USD cents received, state (pending/sending/sent/failed), attempts, last error and Brevo message id. `claim_donation_receipt()` atomically moves a row to `sending`, so concurrent or duplicate events send at most once. A stale `sending` row can be reclaimed after 10 minutes. `stripe_events` logs every event with its status and error.
7. When an email fails, the receipt is marked `failed` with the provider error, and the webhook returns 500 so Stripe retries (Stripe retries for up to 3 days). Staff can also click **Resend** in Admin -> Donations (`resend-receipt`, which checks for an admin/staff role).
8. Monthly donors: every receipt links to `/manage-donation`, which opens the SAF Stripe Customer Portal (card update, invoice history, cancel at period end). The portal also has an email sign-in page: https://billing.stripe.com/p/login/6oU8wO1zU83t6c2ewV48000

## Receipt content (HTML + plain text)
Legal name, brand, EIN 45-3459562, donor name, payment date (America/Chicago), gross amount received including any opted-in fee support, receipt number, gift type, "No goods or services were provided in exchange for this contribution.", "Contributions are tax-deductible to the extent permitted by law.", and "keep for your tax records". Monthly receipts state they cover a single payment only. Sender: The Student Athlete Foundation <jj@gpghouston.com> (Brevo sender id 1, active). Reply-to: safsportshouston@gmail.com. No postal address is included because no current address has been verified. Donor-entered text is HTML-escaped. Event registrations, sponsorships with benefits and in-kind gifts are excluded: only `gift_type=pure_gift` objects get automatic receipts.

## Security
- `donations`, `donation_receipts` and `stripe_events` can be read by staff only. No client-side insert or update path exists. Writes happen only from service-role backend functions.
- The webhook signing secret is stored in `app_private_config` (service-role only, RLS with no policies). It was created by `stripe-webhook-setup` and is never returned or logged. Setting `STRIPE_WEBHOOK_SECRET` in Secrets would take precedence.
- `stripe-webhook-setup` requires a staff session, or an HMAC proof made with the SAF Stripe secret key (which is never transmitted).

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
| Unit: email failure recorded + surfaced; retry sends exactly once | PASS |
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
