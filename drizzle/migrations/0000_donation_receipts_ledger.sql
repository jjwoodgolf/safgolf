-- Receipt / payment ledger: one row per paid Stripe object (payment_intent for one-time, invoice for monthly)
CREATE SEQUENCE IF NOT EXISTS public.donation_receipt_seq START 1001;

CREATE TABLE public.donation_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES public.donations(id) ON DELETE SET NULL,
  kind text NOT NULL CHECK (kind IN ('one_time','monthly_invoice','test')),
  stripe_object_id text NOT NULL UNIQUE,
  stripe_event_id text,
  donor_name text,
  donor_email text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'usd',
  paid_at timestamptz NOT NULL,
  receipt_number text NOT NULL UNIQUE DEFAULT ('SAF-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.donation_receipt_seq')::text, 6, '0')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','failed')),
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  provider_message_id text,
  claimed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.donation_receipts TO authenticated;
GRANT ALL ON public.donation_receipts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.donation_receipt_seq TO service_role;
ALTER TABLE public.donation_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view receipts" ON public.donation_receipts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER donation_receipts_updated_at BEFORE UPDATE ON public.donation_receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX donation_receipts_status_idx ON public.donation_receipts(status);

-- Stripe event audit log (dedupe/visibility)
CREATE TABLE public.stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'received',
  error text,
  attempts integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);
GRANT SELECT ON public.stripe_events TO authenticated;
GRANT ALL ON public.stripe_events TO service_role;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view stripe events" ON public.stripe_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- Private config (webhook signing secret). Service role only; no policies.
CREATE TABLE public.app_private_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_private_config TO service_role;
REVOKE ALL ON public.app_private_config FROM anon, authenticated;
ALTER TABLE public.app_private_config ENABLE ROW LEVEL SECURITY;

-- Donation tracking columns
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS paid_at timestamptz;
CREATE UNIQUE INDEX IF NOT EXISTS donations_session_uidx ON public.donations(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS donations_subscription_idx ON public.donations(stripe_subscription_id);

-- Atomic claim: only one worker can move a receipt into 'sending'. Stale 'sending' (10 min) is reclaimable.
CREATE OR REPLACE FUNCTION public.claim_donation_receipt(_id uuid)
RETURNS SETOF public.donation_receipts
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.donation_receipts
     SET status = 'sending', attempts = attempts + 1, claimed_at = now(), last_error = NULL
   WHERE id = _id
     AND (status IN ('pending','failed') OR (status = 'sending' AND claimed_at < now() - interval '10 minutes'))
  RETURNING *;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_donation_receipt(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_donation_receipt(uuid) TO service_role;