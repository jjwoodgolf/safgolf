import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ORG } from "@/components/site/org";

const PORTAL_LOGIN = "https://billing.stripe.com/p/login/6oU8wO1zU83t6c2ewV48000";

const ManageDonation = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.functions.invoke("donor-portal", { body: { session_id: sessionId } });
    if (err || !data?.url) {
      setError("We couldn't open your donor portal from this link. Use the email sign-in option below.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  };

  return (
    <Layout hideDonateBand>
      <SEO title="Manage your monthly gift | The Student Athlete Foundation" description="Update or cancel a monthly gift." path="/manage-donation" />
      <section className="pt-32 pb-24">
        <div className="container-custom px-4 md:px-8 max-w-2xl">
          <p className="eyebrow mb-4">Monthly gift</p>
          <h1 className="font-display text-4xl leading-tight">Manage or cancel your monthly gift.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Update your card, view past payments, or cancel anytime in the secure Stripe donor portal for {ORG.legalName}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {sessionId && (
              <Button size="lg" onClick={open} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Open donor portal
              </Button>
            )}
            <Button asChild size="lg" variant="outline">
              <a href={PORTAL_LOGIN} rel="noopener noreferrer">Sign in with your email</a>
            </Button>
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
          <p className="mt-8 text-sm text-muted-foreground">Need help? {ORG.email} · {ORG.phone}</p>
        </div>
      </section>
    </Layout>
  );
};

export default ManageDonation;
