import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";
import { ORG } from "@/components/site/org";

type Status = {
  state: "paid" | "processing" | "canceled" | "invalid" | "error";
  mode?: "one_time" | "monthly";
  amount_total?: number;
  currency?: string;
  first_name?: string | null;
  receipt?: { status: string; delivery?: string; number: string; paid_at: string } | null;
};

const usd = (c: number) => (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const ThankYou = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [s, setS] = useState<Status | null>(null);

  useEffect(() => {
    if (!sessionId) { setS({ state: "invalid" }); return; }
    let tries = 0;
    let timer: number | undefined;
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-donation?session_id=${encodeURIComponent(sessionId)}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } },
        );
        const json: Status = await res.json();
        setS(json);
        // Read-only polling while the webhook records the receipt (max ~30s).
        if (json.state === "paid" && json.receipt?.delivery !== "sent" && tries++ < 10) timer = window.setTimeout(load, 3000);
      } catch {
        setS({ state: "error" });
      }
    };
    load();
    return () => window.clearTimeout(timer);
  }, [sessionId]);

  let body: JSX.Element;
  if (!s) {
    body = <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Confirming your gift…</p>;
  } else if (s.state === "paid") {
    const rs = s.receipt?.delivery;
    const paidDate = s.receipt?.paid_at
      ? new Date(s.receipt.paid_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago" })
      : null;
    body = (
      <>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">Thank you{s.first_name ? `, ${s.first_name}` : ""}.</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Your {s.mode === "monthly" ? "monthly gift" : "gift"} of {usd(s.amount_total ?? 0)}{s.mode === "monthly" ? " per month" : ""} has been received by {ORG.legalName}.
        </p>
        <div className="mt-8 border border-border rounded-sm p-6 text-sm space-y-2">
          {s.receipt && <p><span className="text-muted-foreground">Receipt number:</span> {s.receipt.number}</p>}
          {paidDate && <p><span className="text-muted-foreground">Payment date:</span> {paidDate}</p>}
          <p><span className="text-muted-foreground">Amount:</span> {usd(s.amount_total ?? 0)}</p>
          <p>
            <span className="text-muted-foreground">Emailed receipt:</span>{" "}
            {rs === "sent" ? "sent to the email you used at checkout."
              : rs === "retrying" ? <>delivery is delayed. We will retry automatically; contact {ORG.email} if you need help.</>
              : rs === "held" ? <>delivery is delayed. Contact {ORG.email} and we will send you a copy.</>
              : "being prepared — it will arrive by email shortly."}
          </p>
          <p className="text-muted-foreground">{ORG.legalName} · 501(c)(3) nonprofit · EIN {ORG.ein}</p>
          <p className="text-muted-foreground">No goods or services were provided in exchange for this contribution. Contributions are tax-deductible to the extent permitted by law. Your emailed receipt is your official record.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print this page</Button>
          {s.mode === "monthly" && sessionId && (
            <Button asChild variant="outline"><Link to={`/manage-donation?session_id=${encodeURIComponent(sessionId)}`}>Manage monthly gift</Link></Button>
          )}
          <Button asChild><Link to="/">Return home</Link></Button>
        </div>
      </>
    );
  } else if (s.state === "processing") {
    body = (
      <>
        <h1 className="font-display text-4xl leading-tight">Your payment is processing.</h1>
        <p className="mt-5 text-lg text-muted-foreground">Some payment methods take a few days to confirm. We'll email your receipt once the payment clears. No receipt is issued until then.</p>
      </>
    );
  } else if (s.state === "canceled") {
    body = (
      <>
        <h1 className="font-display text-4xl leading-tight">This checkout was not completed.</h1>
        <p className="mt-5 text-lg text-muted-foreground">No payment was made.</p>
        <Button asChild className="mt-8"><Link to="/donate">Try again</Link></Button>
      </>
    );
  } else {
    body = (
      <>
        <h1 className="font-display text-4xl leading-tight">We couldn't find that donation.</h1>
        <p className="mt-5 text-lg text-muted-foreground">The link may be incomplete. If you were charged, contact {ORG.email} and we'll help.</p>
        <Button asChild className="mt-8"><Link to="/donate">Go to donate</Link></Button>
      </>
    );
  }

  return (
    <Layout hideDonateBand>
      <SEO title="Thank you | The Student Athlete Foundation" description="Donation confirmation." path="/thank-you" />
      <section className="pt-32 pb-24 bg-background">
        <div className="container-custom px-4 md:px-8 max-w-2xl">{body}</div>
      </section>
    </Layout>
  );
};

export default ThankYou;
