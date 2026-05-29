
-- =========================================================
-- 1. ROLES + PROFILES
-- =========================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'applicant');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'staff')
  )
$$;

CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + default applicant role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'applicant')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- 2. DONATIONS
-- =========================================================

CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT,
  donor_email TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  frequency TEXT NOT NULL DEFAULT 'one_time' CHECK (frequency IN ('one_time', 'monthly')),
  cover_fees BOOLEAN NOT NULL DEFAULT false,
  tribute_type TEXT CHECK (tribute_type IN ('honor', 'memory')),
  tribute_name TEXT,
  message TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'canceled')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view donations"
ON public.donations FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Users view own donations"
ON public.donations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER donations_updated_at
BEFORE UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX donations_status_idx ON public.donations (status, created_at DESC);
CREATE INDEX donations_email_idx ON public.donations (donor_email);

-- =========================================================
-- 3. NEWSLETTER
-- =========================================================

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view subscribers"
ON public.newsletter_subscribers FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

-- =========================================================
-- 4. PROGRAM APPLICATIONS
-- =========================================================

CREATE TYPE public.program_type AS ENUM ('junior_golf', 'veteran', 'scholarship');
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'in_review', 'approved', 'declined');

CREATE TABLE public.program_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program public.program_type NOT NULL,
  applicant_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.application_status NOT NULL DEFAULT 'submitted',
  reviewer_notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.program_applications TO authenticated;
GRANT ALL ON public.program_applications TO service_role;
ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants view own applications"
ON public.program_applications FOR SELECT TO authenticated
USING (auth.uid() = applicant_user_id);

CREATE POLICY "Staff view all applications"
ON public.program_applications FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

CREATE POLICY "Applicants insert own application"
ON public.program_applications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = applicant_user_id);

CREATE POLICY "Applicants update own draft"
ON public.program_applications FOR UPDATE TO authenticated
USING (auth.uid() = applicant_user_id AND status = 'draft')
WITH CHECK (auth.uid() = applicant_user_id);

CREATE POLICY "Staff update applications"
ON public.program_applications FOR UPDATE TO authenticated
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER applications_updated_at
BEFORE UPDATE ON public.program_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX applications_program_idx ON public.program_applications (program, status, created_at DESC);
CREATE INDEX applications_user_idx ON public.program_applications (applicant_user_id);

-- =========================================================
-- 5. VOLUNTEER INQUIRIES
-- =========================================================

CREATE TABLE public.volunteer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_areas TEXT[],
  availability TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.volunteer_inquiries TO authenticated;
GRANT ALL ON public.volunteer_inquiries TO service_role;
ALTER TABLE public.volunteer_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view volunteer inquiries"
ON public.volunteer_inquiries FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

-- =========================================================
-- 6. SPONSOR INQUIRIES
-- =========================================================

CREATE TABLE public.sponsor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest_tier TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sponsor_inquiries TO authenticated;
GRANT ALL ON public.sponsor_inquiries TO service_role;
ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff view sponsor inquiries"
ON public.sponsor_inquiries FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

-- =========================================================
-- 7. Extend contact_submissions read access to staff
-- =========================================================

CREATE POLICY "Staff view contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));
