import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Heart, Lock, Loader2, ShieldCheck } from "lucide-react";

const PRESET_AMOUNTS = [50, 100, 250, 500];
const STRIPE_FEE_PERCENT = 0.029;
const STRIPE_FEE_FIXED = 0.3;

const calcGross = (amount: number) => (amount + STRIPE_FEE_FIXED) / (1 - STRIPE_FEE_PERCENT);

const DonationCard = () => {
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [selected, setSelected] = useState<number | "custom">(100);
  const [customAmount, setCustomAmount] = useState("");
  const [coverFees, setCoverFees] = useState(true);
  const [loading, setLoading] = useState(false);

  const baseAmount = useMemo(() => {
    if (selected === "custom") {
      const n = parseFloat(customAmount);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    return selected;
  }, [selected, customAmount]);

  const totalCharged = useMemo(() => {
    if (!baseAmount) return 0;
    return coverFees ? calcGross(baseAmount) : baseAmount;
  }, [baseAmount, coverFees]);

  const handleDonate = async () => {
    if (!baseAmount || baseAmount < 5) {
      toast({ title: "Enter an amount", description: "Minimum donation is $5.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-donation-checkout", {
        body: { amount: baseAmount, frequency, coverFees },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Checkout failed", description: msg, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-10 max-w-xl mx-auto">
      {/* Frequency toggle */}
      <div className="inline-flex items-center bg-muted rounded-full p-1 mb-8 w-full">
        {(["one_time", "monthly"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
              frequency === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "one_time" ? "One-Time" : "Monthly"}
          </button>
        ))}
      </div>

      {/* Amounts */}
      <Label className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 block">
        Select an amount
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => {
              setSelected(amt);
              setCustomAmount("");
            }}
            className={`py-4 rounded-xl border-2 font-display text-xl font-bold transition-all ${
              selected === amt
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/40 text-foreground"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>

      <div
        className={`rounded-xl border-2 transition-all ${
          selected === "custom" ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <div className="flex items-center px-4">
          <span className="text-muted-foreground font-medium">$</span>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="Custom amount"
            min={5}
            max={100000}
            value={customAmount}
            onFocus={() => setSelected("custom")}
            onChange={(e) => {
              setSelected("custom");
              setCustomAmount(e.target.value);
            }}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium h-14"
          />
        </div>
      </div>

      {/* Cover fees */}
      <label className="flex items-start gap-3 mt-6 mb-8 cursor-pointer group">
        <Checkbox
          checked={coverFees}
          onCheckedChange={(v) => setCoverFees(Boolean(v))}
          className="mt-1"
        />
        <div className="text-sm">
          <p className="font-medium text-foreground">Cover processing fees</p>
          <p className="text-muted-foreground">
            Add a small amount so 100% of your gift reaches our programs.
          </p>
        </div>
      </label>

      {/* Summary + CTA */}
      <div className="border-t border-border pt-6 mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
          <span>Your gift</span>
          <span>${baseAmount.toFixed(2)}</span>
        </div>
        {coverFees && baseAmount > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>Processing fees</span>
            <span>+${(totalCharged - baseAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between font-display text-xl font-bold text-foreground mt-2">
          <span>Total {frequency === "monthly" ? "/ month" : ""}</span>
          <span>${totalCharged.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handleDonate}
        disabled={loading || !baseAmount}
        size="xl"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Redirecting…
          </>
        ) : (
          <>
            <Heart className="h-5 w-5" />
            Donate ${baseAmount ? totalCharged.toFixed(2) : "—"}
            {frequency === "monthly" ? " / month" : ""}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Secure checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> 501(c)(3) tax-deductible
        </span>
      </div>
    </div>
  );
};

export default DonationCard;
