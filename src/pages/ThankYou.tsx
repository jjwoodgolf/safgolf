import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";

const ThankYou = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<"loading" | "paid" | "failed">("loading");
  const [info, setInfo] = useState<{ amount_total?: number; currency?: string; donor_name?: string; mode?: string } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setState("failed");
      return;
    }
    (async () => {
      const { data, error } = await supabase.functions.invoke("verify-donation", {
        method: "GET" as any,
      });
      // functions.invoke doesn't pass query params reliably; use fetch instead
      try {
        const res = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/verify-donation?session_id=${encodeURIComponent(sessionId)}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        const json = await res.json();
        if (json.paid) {
          setInfo(json);
          setState("paid");
        } else {
          setState("failed");
        }
      } catch {
        setState("failed");
      }
    })();
  }, [sessionId]);

  const formatted = info?.amount_total
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: (info.currency || "usd").toUpperCase() }).format(info.amount_total / 100)
    : null;

  return (
    <Layout>
      <SEO title="Thank You | Student Athlete Foundation" description="Thank you for supporting the Student Athlete Foundation." path="/thank-you" />
      <section className="pt-32 pb-24 bg-cream min-h-[70vh] flex items-center">
        <div className="container-custom max-w-2xl text-center">
          {state === "loading" && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Confirming your donation…</p>
            </div>
          )}

          {state === "paid" && (
            <div className="bg-card rounded-2xl shadow-xl border border-border p-10 md:p-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Thank You{info?.donor_name ? `, ${info.donor_name.split(" ")[0]}` : ""}.
              </h1>
              {formatted && (
                <p className="text-lg text-muted-foreground mb-2">
                  We received your {info?.mode === "subscription" ? "monthly" : "one-time"} gift of{" "}
                  <span className="font-semibold text-foreground">{formatted}</span>.
                </p>
              )}
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
                Your support directly funds scholarships for junior golfers, free clinics for veterans, and recruiting
                mentorship for student-athletes. A receipt has been sent to your email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/">Return Home</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/programs">Explore Our Programs</Link>
                </Button>
              </div>
            </div>
          )}

          {state === "failed" && (
            <div className="bg-card rounded-2xl shadow-xl border border-border p-10">
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">We couldn't confirm your donation</h1>
              <p className="text-muted-foreground mb-6">
                If you were charged, please contact us and we'll sort it out immediately.
              </p>
              <Button asChild>
                <Link to="/donate">
                  <Heart className="h-4 w-4" /> Try Again
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ThankYou;
