
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Public can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(email)) > 0
  AND length(trim(message)) > 0
  AND length(name) <= 200
  AND length(email) <= 320
  AND length(message) <= 5000
);
