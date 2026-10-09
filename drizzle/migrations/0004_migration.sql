CREATE OR REPLACE FUNCTION public.claim_donation_receipt(_id uuid, _key_window_seconds integer DEFAULT 840)
 RETURNS SETOF donation_receipts LANGUAGE sql SECURITY DEFINER SET search_path TO 'public'
AS $$
  UPDATE public.donation_receipts
     SET status = 'sending', attempts = attempts + 1, claimed_at = now(),
         submission_started_at = now(), next_attempt_at = NULL
   WHERE id = _id
     AND status IN ('pending','failed')
     AND COALESCE(next_attempt_at, '-infinity'::timestamptz) <= now()
  RETURNING *;
$$;
REVOKE ALL ON FUNCTION public.claim_donation_receipt(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_donation_receipt(uuid, integer) TO service_role;