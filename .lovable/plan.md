
# SAF Sales Tool — Completion Plan

Built around the existing `.lovable/plan.md` phases, locked to your three decisions:
- Stripe = bring-your-own-key (your existing Stripe account)
- Auth = staff/admins + program applicants (no donor accounts)
- Backend storage = every form on the site (donations, newsletter, applications, volunteer/sponsor inquiry, contact)

---

## Phase 1 — Foundation (SEO + Trust)

Goal: make the site credible to donors, search engines, and AI crawlers before driving traffic to it.

- Wire `react-helmet-async` into every route; unique title, meta description, canonical, og:image.
- Add `Organization` / `NonProfit` JSON-LD in `index.html` with real EIN, legal name, address, phone, `sameAs`.
- Replace placeholder `XX-XXXXXXX` Tax ID sitewide (Donate page + footer).
- Generate `public/sitemap.xml` from `scripts/generate-sitemap.ts` at build; add `Sitemap:` line to `robots.txt`.
- Create Privacy Policy, Terms, and Donation Refund Policy pages (required for Stripe + trust).
- Host hero image locally (currently hotlinked Unsplash), compress, add proper alt text across galleries.

**Blocker to resolve before starting:** real EIN, legal address, and any 990 PDFs you want linked.

---

## Phase 2 — Donation Engine (BYOK Stripe)

Goal: a high-conversion donate flow that records every gift in our database.

- Add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` as project secrets.
- New table `donations` (amount, currency, frequency, donor name/email, tribute, message, stripe_session_id, stripe_customer_id, status, created_at) with RLS: public insert via edge fn only, staff read.
- Edge functions:
  - `create-checkout-session` — one-time + monthly, preset tiers ($50/100/250/500/1k/5k) + custom + "cover processing fee" + "In Honor/Memory of".
  - `stripe-webhook` — verifies signature, writes donation row, triggers Brevo receipt + adds donor to "Donors" list.
- Rebuild `/donate`: monthly/one-time toggle at top (monthly default), large preset tier buttons, custom amount, tribute field, fee-cover checkbox, donor social-proof + testimonial column.
- Sticky mobile "Donate" CTA in header.
- `/thank-you` post-checkout page with share prompt.

---

## Phase 3 — Authentication & Forms Backend

Goal: staff dashboard + applicant portal, plus every form persists to the DB.

**Auth**
- Enable Supabase email/password + Google (Lovable Cloud managed OAuth).
- `profiles` table (auto-created via trigger on signup) + separate `user_roles` table with `app_role` enum (`admin`, `staff`, `applicant`) and `has_role()` security-definer function — never store role on profiles.
- `/auth` (login/signup), `/reset-password`, `/account` pages. Email confirmation ON.

**Form tables (all with RLS — public insert via edge fn, staff-only read)**
- `donations` (Phase 2)
- `newsletter_subscribers` (email, source, created_at)
- `program_applications` (program enum: junior_golf / veteran / scholarship, applicant_user_id nullable, payload jsonb, status, reviewer notes)
- `volunteer_inquiries`
- `sponsor_inquiries`
- `contact_submissions` ✅ already exists

**Edge functions** (one per form, modeled on existing `submit-contact`): IP rate-limit, Zod validation, write row, forward to Brevo list. Newsletter → Brevo List "Newsletter"; applications → Brevo List "Applicants"; etc.

**Applicant portal**
- `/apply/junior-golf`, `/apply/veteran`, `/apply/scholarship` — logged-in applicants submit and see status.
- `/my-applications` — read their own rows (RLS scoped to `auth.uid()`).

**Staff dashboard** `/admin` (gated by `has_role(auth.uid(), 'admin'|'staff')`):
- Tabs: Donations, Applications, Newsletter, Volunteer, Sponsor, Contact.
- CSV export per tab. Application status update (pending/review/approved/declined).
- Donation totals (today / MTD / YTD), monthly donor count.

---

## Phase 4 — Email & Lists (Brevo)

Goal: every form submission triggers the right automated email and lands in the right list.

- Extend Brevo integration with lists: Donors, Newsletter, Volunteers, Sponsors, Applicants (Junior/Veteran/Scholarship).
- Transactional flows: donation receipt (tax-deductible language + EIN), monthly donor 3-email welcome series, newsletter welcome, application acknowledgment per program, volunteer/sponsor reply-to.
- Quarterly impact newsletter template (manual send from Brevo).

---

## Phase 5 — Missing Content Pages

Goal: complete the site map donors and search engines expect.

- `/impact` — annual report, measurable outcomes, 990 downloads, % of funds to programs.
- `/ways-to-give` — DAF, stock, employer match, legacy, vehicle, crypto (info-only, links to forms).
- `/volunteer` — form → `volunteer_inquiries`.
- `/press` — media kit, founder bios, downloadable logos.
- `/faq` — donor + applicant FAQs with `FAQPage` JSON-LD.
- `/news` — simple blog backed by a `posts` table (staff-authored from `/admin`).
- Newsletter signup component embedded in footer + `/subscribe` landing.

---

## Phase 6 — Analytics, Polish & Launch

- GA4 + Google Search Console (via connector).
- Cookie consent banner (required with GA4 + EU traffic).
- WCAG AA pass: contrast, focus states, keyboard nav, alt text audit.
- `public/llms.txt` for AI crawlers.
- Run security scan + SEO scan; fix all findings.
- Publish to `safgolf.lovable.app` (or custom domain if you have one).

---

## Technical Details

- **Stripe BYOK** uses `enable_stripe` (not `enable_stripe_payments`); you provide `STRIPE_SECRET_KEY`. The Lovable seamless integration is unavailable since you're keeping your own account.
- **Roles**: dedicated `user_roles` table + `has_role()` security-definer function (prevents privilege escalation and RLS recursion).
- **Form edge functions** all follow the existing `submit-contact` pattern (CORS, Zod validation, IP rate-limit via `check_contact_rate_limit`-style RPCs, Brevo forward).
- **RLS pattern** for every new form table: `INSERT` allowed to `anon` via edge fn only (edge fn uses service role); `SELECT` restricted via `has_role(auth.uid(), 'admin'|'staff')`; applicants read their own rows via `auth.uid() = applicant_user_id`.
- **GRANTs**: every new public table gets explicit `GRANT` statements in the same migration (anon insert where allowed, authenticated CRUD scoped by RLS, service_role full).
- **Aesthetic**: all new UI uses Playfair Display + Inter, primary `#690000`, generous whitespace, Lucide icons only, no emojis, no bounce animations — per project memory.

---

## Open Questions Before Phase 1

1. Real EIN, legal name, and mailing address for JSON-LD + Tax ID display.
2. Do you have 990 PDFs / annual report content, or stub the Impact page for v1?
3. Custom domain to publish to, or stay on `safgolf.lovable.app`?
4. Stripe: live keys ready now, or start in test mode and swap before launch?

Approve this and I'll start Phase 1 immediately.
