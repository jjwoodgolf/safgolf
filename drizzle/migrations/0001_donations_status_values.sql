ALTER TABLE public.donations DROP CONSTRAINT donations_status_check;
ALTER TABLE public.donations ADD CONSTRAINT donations_status_check CHECK (status = ANY (ARRAY[
  'pending','processing','paid','succeeded','failed','expired','refunded',
  'active','past_due','canceling','canceled','incomplete','incomplete_expired','trialing','unpaid','paused'
]));