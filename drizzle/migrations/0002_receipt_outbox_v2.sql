ALTER TABLE public.donation_receipts
  ADD COLUMN IF NOT EXISTS submission_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_reason text;

ALTER TABLE public.donation_receipts DROP CONSTRAINT IF EXISTS donation_receipts_status_check;
ALTER TABLE public.donation_receipts ADD CONSTRAINT donation_receipts_status_check
  CHECK (status IN ('pending','sending','sent','failed','unconfirmed','needs_review'));

CREATE INDEX IF NOT EXISTS donation_receipts_due_idx ON public.donation_receipts(status, next_attempt_at) WHERE status <> 'sent';

-- Claim boundary. pending/failed (when due) start a NEW submission window; unconfirmed may only be re-claimed
-- while still inside the provider idempotency window of its ORIGINAL submission (same idempotency key).
-- 'sending' is never re-claimed here; the worker first moves stale 'sending' rows to 'unconfirmed'.
DROP FUNCTION IF EXISTS public.claim_donation_receipt(uuid);
CREATE OR REPLACE FUNCTION public.claim_donation_receipt(_id uuid, _key_window_seconds integer DEFAULT 840)
RETURNS SETOF public.donation_receipts
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.donation_receipts
     SET status = 'sending',
         attempts = attempts + 1,
         claimed_at = now(),
         submission_started_at = CASE WHEN status IN ('pending','failed') THEN now() ELSE submission_started_at END,
         next_attempt_at = NULL
   WHERE id = _id
     AND (
       (status IN ('pending','failed') AND COALESCE(next_attempt_at, '-infinity'::timestamptz) <= now())
       OR (status = 'unconfirmed' AND provider_message_id IS NULL
           AND submission_started_at > now() - make_interval(secs => _key_window_seconds))
     )
  RETURNING *;
$$;
REVOKE ALL ON FUNCTION public.claim_donation_receipt(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_donation_receipt(uuid, integer) TO service_role;

-- Re-assert service-role-only access to private config.
REVOKE ALL ON public.app_private_config FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.app_private_config TO service_role;