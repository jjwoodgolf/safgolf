CREATE POLICY "Public can submit sponsor inquiry"
ON public.sponsor_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(company_name)) > 0 AND length(company_name) <= 200
  AND length(trim(contact_name)) > 0 AND length(contact_name) <= 200
  AND length(trim(email)) > 0 AND length(email) <= 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 50)
  AND (message IS NULL OR length(message) <= 5000)
  AND (interest_tier IS NULL OR length(interest_tier) <= 100)
);

CREATE POLICY "Public can submit volunteer inquiry"
ON public.volunteer_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0 AND length(name) <= 200
  AND length(trim(email)) > 0 AND length(email) <= 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 50)
  AND (availability IS NULL OR length(availability) <= 500)
  AND (message IS NULL OR length(message) <= 5000)
);

CREATE POLICY "Block non-admin role writes"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block client inserts on donations"
ON public.donations
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

COMMENT ON TABLE public.donations IS 'Donation records. INSERTs are only allowed via the service role from the create-donation-checkout and verify-donation edge functions.';