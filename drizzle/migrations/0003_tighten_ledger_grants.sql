REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.donation_receipts FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.stripe_events FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.donation_receipts, public.stripe_events FROM anon;
GRANT SELECT ON public.donation_receipts, public.stripe_events TO authenticated;