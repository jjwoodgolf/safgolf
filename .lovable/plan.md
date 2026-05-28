
# SAF Website Completion & Optimization Plan

## 1. Audit vs. Best-in-Class Nonprofits

Benchmarks: charity: water, St. Jude, Folds of Honor, First Tee, Wounded Warrior Project. What they share that we should match:

- **Donate CTA visible on every page** (sticky header + footer + mid-page)
- **Concrete impact math** ($X = Y outcome) above the fold of donate page ✅ partial
- **Transparent financials** (990s, annual report, % of $ to programs)
- **Recurring giving prioritized** (monthly toggle defaulted)
- **Real photos + named beneficiaries** ✅ partial (gallery added)
- **Press / media credibility band** ✅ done
- **Email capture for newsletter** ❌ missing
- **Multiple ways to give** (one-time, monthly, DAF, stock, employer match, legacy)
- **Tax-deductibility + EIN displayed** (currently shows "XX-XXXXXXX" placeholder ❌)
- **Strong SEO/JSON-LD as NonProfit + DonateAction** ❌ missing

## 2. Page Inventory

Existing: Home, About, Events, Programs (+ 5 sub-pages), Success Stories, Sponsors, Contact, Donate.

**Missing / recommended pages:**
- **Impact / Annual Report** — measurable outcomes, financial transparency, 990s
- **News & Blog** — fuels SEO + AI search retrieval
- **Ways to Give** (DAF, stock, employer match, legacy, vehicle, crypto) — separate from Donate checkout
- **Volunteer / Get Involved**
- **Press / Media Kit** — logos, founder bios, downloadable assets
- **Privacy Policy, Terms, Refund/Donation Policy** (required for Stripe + trust)
- **Thank You / Donation Confirmation** page (post-Stripe redirect)
- **FAQ** (donor + program-applicant questions)
- **Apply** pages — Junior Golfer Application, Veteran Program Application, Scholarship Application
- **Newsletter subscribe** landing (Brevo list)

## 3. Donation Conversion Improvements

- Sticky "Donate" button in header on mobile + persistent CTA bar
- Donate page: **monthly vs one-time toggle at top**, preset amounts as large buttons, custom field, "cover processing fee" checkbox
- Replace placeholder Tax ID with real EIN; add 501(c)(3) trust badge
- Add donor testimonial + impact stat next to checkout form
- Use Stripe Checkout (hosted) for PCI simplicity; support Apple Pay / Google Pay / ACH
- Show "X donors this month" social proof (pulled from Stripe metadata)
- After-donation: thank-you page + auto-receipt email + add to Brevo donor list + suggest sharing
- Add "In Honor / In Memory of" optional field
- Add corporate matching gift lookup (Double the Donation widget or simple text)

## 4. Stripe Integration

Recommend **Lovable's built-in Stripe Payments** (no API key required). Implementation:
- One-time + monthly recurring donations
- Preset tiers ($50/$100/$250/$500/$1k/$5k) + custom amount
- Edge functions: `create-checkout-session`, `stripe-webhook` (records donation, triggers Brevo)
- `donations` table (amount, frequency, donor_email, name, message, stripe_session_id, status)
- Success/cancel redirect pages

## 5. Brevo Email Automation

Extend existing Brevo integration:
- **List 27** (contact form) — already wired ✅
- New lists: Donors, Newsletter, Volunteers, Program Applicants
- Automated flows:
  - Donation receipt (transactional, tax-deductible language)
  - Monthly donor welcome series (3 emails)
  - New newsletter subscriber welcome
  - Program application acknowledgment
  - Quarterly impact newsletter (manual send)
- Edge functions: `subscribe-newsletter`, extend `submit-contact` pattern, `stripe-webhook` → Brevo contact + transactional email

## 6. SEO & AI Search Optimization

- Add **react-helmet-async**; unique `<title>`, meta description, canonical, og:* per route
- JSON-LD schemas: `NonProfit` (sitewide), `DonateAction`, `Event` (per event), `Person` (success stories), `FAQPage`, `Article` (blog), `BreadcrumbList`
- Replace placeholder EIN; add `legalName`, `taxID`, `address`, `sameAs` (social links) in Organization schema
- `public/sitemap.xml` generator (script in `scripts/generate-sitemap.ts`) covering all static + dynamic routes
- `robots.txt` with Sitemap directive ✅ exists, needs sitemap line
- Real OG image (1200×630) per major page
- Semantic HTML: single H1 per page (Hero currently uses h1 ✅), proper heading hierarchy on sub-pages
- Image alt text audit on all gallery + program images
- Page speed: lazy-load gallery, preload hero, compress hero background (currently Unsplash hotlink — host locally)
- **AI search (ChatGPT/Perplexity/Google AI)**: clear factual copy, FAQ schema, About page with founding date / EIN / location, structured impact numbers, llms.txt file

## 7. Analytics & Trust

- Google Analytics 4 + Google Search Console verification (use connector)
- Cookie consent banner
- Privacy policy + donation refund policy
- Accessibility pass (WCAG AA): color contrast, focus states, alt text, keyboard nav

---

## Completion Checklist (Build Order)

### Phase 1 — Foundation (SEO + Trust)
- [ ] Install `react-helmet-async`, add per-route meta + JSON-LD
- [ ] Add Organization/NonProfit JSON-LD with real EIN in `index.html`
- [ ] Generate `public/sitemap.xml` via build script; reference in robots.txt
- [ ] Create Privacy Policy, Terms, Donation Refund Policy pages
- [ ] Replace placeholder EIN sitewide
- [ ] Host hero image locally; compress

### Phase 2 — Donation Engine
- [ ] Enable Lovable Stripe Payments
- [ ] Build `donations` table + RLS
- [ ] Edge functions: `create-checkout-session`, `stripe-webhook`
- [ ] Rebuild Donate page: monthly/one-time toggle, preset tiers, custom amount, tribute field, fee-cover
- [ ] Thank You page + transactional receipt via Brevo
- [ ] Sticky mobile Donate CTA

### Phase 3 — Email & Lists
- [ ] Newsletter subscribe component (footer + dedicated page) → Brevo
- [ ] Donor welcome automation in Brevo
- [ ] Program application forms (Junior Golfer, Veteran, Scholarship) → Brevo lists

### Phase 4 — Missing Content Pages
- [ ] Impact / Annual Report page (with 990 downloads)
- [ ] Ways to Give page (DAF, stock, legacy, employer match)
- [ ] Volunteer page
- [ ] Press / Media Kit page
- [ ] FAQ page (with FAQPage schema)
- [ ] News & Blog (simple CMS via Supabase table)

### Phase 5 — Conversion Polish
- [ ] Donor social proof + testimonials on Donate page
- [ ] Add Apple Pay / Google Pay to Stripe checkout
- [ ] "In Honor/Memory of" donations
- [ ] Recurring-donor portal (manage subscription)

### Phase 6 — Analytics & Compliance
- [ ] GA4 + Search Console verification
- [ ] Cookie consent
- [ ] Accessibility audit (WCAG AA)
- [ ] llms.txt for AI crawlers
- [ ] Run SEO scan, fix all findings

---

## Questions Before I Start Building

1. **Real EIN / Tax ID** — need it for trust + JSON-LD
2. **Stripe** — confirm using Lovable built-in Stripe Payments (recommended) vs your existing Stripe account
3. **Annual report / 990s** — do you have PDFs to upload, or skip Impact page for now?
4. **Phase priority** — start with Phase 1 (SEO foundation) + Phase 2 (donation engine) together, then iterate?
