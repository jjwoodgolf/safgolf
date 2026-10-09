import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Lock, Loader2 } from "lucide-react";

const PRESETS = [25, 100, 250, 500];
const MIN = 1;
const MAX = 25000;
const FEE_PERCENT = 0.029;
const FEE_FIXED = 0.3;
// Mirrors the server calculation (rounded to cents).
const gross = (amt: number) => Math.round(((amt * 100 + FEE_FIXED * 100) / (1 - FEE_PERCENT))) / 100;
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const DonationCard = () => {
  const [params] = useSearchParams();
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [selected, setSelected] = useState<number | "custom" | null>(null);
  const [custom, setCustom] = useState("");
  const [coverFees, setCoverFees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canceled = params.get("canceled") === "1";

  useEffect(() => setError(null), [selected, custom, frequency]);

  const base = useMemo(() => {
    if (selected === "custom") {
      const n = Number(custom);
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
    }
    return selected ?? 0;
  }, [selected, custom]);

  const valid = base >= MIN && base <= MAX;
  const total = valid ? (coverFees ? gross(base) : base) : 0;

  const donate = async () => {
    if (!valid) {
      setError(base > MAX ? "For gifts over $25,000 please contact us." : "Choose or enter an amount of at least $1.00.");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.functions.invoke("create-donation-checkout", {
      body: { amount: base, frequency, coverFees },
    });
    if (err || !data?.url) {
      let msg = "Unable to start checkout. Please try again.";
      if (err instanceof FunctionsHttpError) {
        try { msg = (await err.context.json()).error ?? msg; } catch { /* keep default */ }
      }
      setError(msg);
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  };

  return (
    <div className="bg-card border border-border rounded-sm p-6 sm:p-8 w-full max-w-xl mx-auto">
      {canceled && (
        <p className="mb-6 text-sm border border-border bg-muted px-4 py-3 rounded-sm">
          Checkout was canceled. No payment was made.
        </p>
      )}
      <fieldset>
        <legend className="eyebrow mb-3">Frequency</legend>
        <div className="grid grid-cols-2 border border-border rounded-sm overflow-hidden mb-8">
          {(["one_time", "monthly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={frequency === f}
              onClick={() => setFrequency(f)}
              className={`py-3 text-sm font-semibold transition-colors ${frequency === f ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              {f === "one_time" ? "One time" : "Monthly"}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">Amount (USD)</legend>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={selected === a}
              onClick={() => setSelected(a)}
              className={`py-3 border rounded-sm font-semibold transition-colors ${selected === a ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
            >
              ${a}
            </button>
          ))}
        </div>
        <div className={`mt-2 flex items-center border rounded-sm px-3 ${selected === "custom" ? "border-primary" : "border-border"}`}>
          <span className="text-muted-foreground">$</span>
          <Input
            type="number"
            inputMode="decimal"
            min={MIN}
            max={MAX}
            step="0.01"
            placeholder="Other amount"
            aria-label="Other amount in US dollars"
            value={custom}
            onFocus={() => setSelected("custom")}
            onChange={(e) => { setSelected("custom"); setCustom(e.target.value); }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Minimum online gift $1.00 · maximum $25,000.</p>
      </fieldset>

      <div className="mt-6 flex items-start gap-3">
        <Checkbox id="cover" checked={coverFees} onCheckedChange={(v) => setCoverFees(v === true)} className="mt-0.5" />
        <Label htmlFor="cover" className="text-sm font-normal leading-relaxed text-muted-foreground">
          Add an estimated {usd(valid ? gross(base) - base : 0)} to help cover card processing fees (about 2.9% + $0.30). Optional.
        </Label>
      </div>

      <div className="mt-6 border-t border-border pt-4 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Gift</span><span>{valid ? usd(base) : "—"}</span></div>
        {coverFees && valid && (
          <div className="flex justify-between"><span className="text-muted-foreground">Processing support</span><span>{usd(total - base)}</span></div>
        )}
        <div className="flex justify-between font-semibold text-base pt-1">
          <span>Total {frequency === "monthly" ? "each month" : "today"}</span><span>{valid ? usd(total) : "—"}</span>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

      <Button size="lg" className="mt-6 w-full" onClick={donate} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {valid ? `Continue to secure checkout — ${usd(total)}${frequency === "monthly" ? "/mo" : ""}` : "Continue to secure checkout"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        Payment is processed by Stripe; we never see your card details. You'll get an emailed receipt once your payment
        is confirmed.{frequency === "monthly" && " Monthly gifts can be canceled anytime from the link in each receipt."}
      </p>
    </div>
  );
};

export default DonationCard;
