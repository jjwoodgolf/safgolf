-- Add explicit SELECT policy that denies all access (only service_role can read)
CREATE POLICY "No public read access to contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (false);