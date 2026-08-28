# Finish Plan: Student Athlete Foundation Website

Goal: close the remaining 20% and deliver a complete, conversion-optimized, secure non-profit sales tool.

## Phase 1 — Content & Trust Gaps

- Replace all placeholder copy on `/junior-golf` (Junior Golf Development) with real program lede and six pillar descriptions.
- Add contextual donation CTAs to pages that only have navigation-level donate access: `/about`, `/programs/junior-golf`, `/junior-golf`, `/programs/college-scholarships`, `/programs/showcase-events`, `/programs/recruiting`.
- Replace placeholder tax ID `XX-XXXXXXX` on `/donate` and in the legacy `Donate` component with the real EIN, or remove the line until the EIN is available.
- Fix placeholder copy in `src/components/ProgramPage.tsx` CTA section.
- Build `/privacy` and `/terms` pages (required by footer links and donation trust signals).
- Wire the Sponsors page "Download Sponsor Packet" button to a real PDF or remove it until the packet exists.

## Phase 2 — Auth & Admin Hardening

- Update `ProtectedRoute` to check `is_staff(auth.uid())` instead of only session presence; redirect non-staff users to `/login` or a public landing page.
- Add a lightweight role-aware wrapper in `AdminLayout` so non-staff authenticated users cannot see the admin console shell at all.
- Provide a first-admin seed path (e.g., a secure one-time setup function or documented SQL snippet) so the first staff account can be promoted to `admin`.
- Verify the current `user`, `staff`, and `applicant` roles are sufficient; add `donor` role only if donor account/portal features are desired.

## Phase 3 — Applicant-Facing Application Forms

Build authenticated multi-step or single-page application forms that insert into `public.program_applications`:

- Scholarship Application (`/apply/scholarship`)
- Junior Golf Application (`/apply/junior-golf`)
- Veterans Program Registration (`/apply/veterans`)

Each form collects: name, email, phone, school/branch, relevant background, and program-specific questions, then writes a row with `applicant_user_id = auth.uid()` and `status = 'submitted'`.

Link these forms from the relevant program pages and the admin Applications dashboard.

## Phase 4 — Brevo Email Automation

Extend the existing Brevo Edge Function integration to send:

- Donor receipt after a completed Stripe donation (via `verify-donation` edge function or a new `send-donation-receipt` function).
- Applicant confirmation after each program application is submitted.
- Admin notification to `jj@gpghouston.com` for new program applications and sponsor inquiries.
- Newsletter welcome email after footer subscription (optional).

Store transactional templates or template IDs in Supabase Edge Function secrets/ENV, not in client code.

## Phase 5 — Donation Conversion Polish

- Add a small floating "Donate" button on mobile for one-tap access on every page.
- Add impact statements to preset amounts on the donation card.
- Enable preset monthly plan defaults and surface "Most popular" suggestion.
- Add a "Sponsor a Student" direct tier checkout option on `/sponsors` for the priced tiers.
- Confirm Stripe checkout is using the live product name and the correct success/cancel URLs for the custom domain.

## Phase 6 — Final QA & Deployment

- Run a production build, fix any TypeScript or lint errors.
- Test the full donation flow end-to-end in Stripe test mode, then switch to live keys once verified.
- Verify all form submissions write to Supabase and trigger Brevo emails.
- Verify admin role protection blocks applicant users from the dashboard.
- Re-run security and SEO scans after all changes.
- Publish to the custom domain.

## Prerequisites before starting

- Confirm the real EIN or decide to hide the placeholder line.
- Confirm the Stripe secret key is set in the backend environment and whether it is in test or live mode.
- Confirm the Brevo sender/template setup is ready for donor and applicant emails.

## Expected outcome

All public pages contain complete, credible content; every program page has a clear donate or apply path; donations flow through Stripe into the admin dashboard; applicants can apply online; automated emails keep donors, applicants, and staff informed; the admin area is restricted to staff only.
