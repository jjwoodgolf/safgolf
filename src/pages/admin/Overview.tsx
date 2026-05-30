import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { HandCoins, ClipboardList, Building2, TrendingUp } from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState({ donationsTotal: 0, donationsCount: 0, applications: 0, sponsors: 0 });

  useEffect(() => {
    (async () => {
      const [donations, apps, sponsors] = await Promise.all([
        supabase.from("donations").select("amount_cents,status").eq("status", "completed"),
        supabase.from("program_applications").select("id", { count: "exact", head: true }),
        supabase.from("sponsor_inquiries").select("id", { count: "exact", head: true }),
      ]);
      const total = (donations.data ?? []).reduce((s, d: any) => s + (d.amount_cents || 0), 0);
      setStats({
        donationsTotal: total,
        donationsCount: donations.data?.length ?? 0,
        applications: apps.count ?? 0,
        sponsors: sponsors.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Total Raised", value: `$${(stats.donationsTotal / 100).toLocaleString()}`, icon: TrendingUp },
    { label: "Completed Donations", value: stats.donationsCount, icon: HandCoins },
    { label: "Applications", value: stats.applications, icon: ClipboardList },
    { label: "Sponsor Inquiries", value: stats.sponsors, icon: Building2 },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      <div>
        <h1 className="font-serif text-4xl">Overview</h1>
        <p className="text-muted-foreground mt-2">A summary of foundation activity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-8 space-y-4">
            <c.icon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="font-serif text-3xl mt-1">{c.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
