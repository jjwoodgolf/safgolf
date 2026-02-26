
-- Add metadata column for storing IP (used only server-side for rate limiting)
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Function to check rate limit: max 5 submissions per IP per hour
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(client_ip TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*) < 5
  FROM public.contact_submissions
  WHERE created_at > now() - interval '1 hour'
    AND metadata->>'ip' = client_ip;
$$;
