REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(text) TO service_role;