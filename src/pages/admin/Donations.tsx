import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Receipt = {
  id: string; receipt_number: string; kind: string; donor_name: string | null; donor_email: string;
  amount_cents: number; paid_at: string; status: string; attempts: number; last_error: string | null;
};
type Donation = { id: string; amount_cents: number; donor_name: string | null; donor_email: string | null; frequency: string; status: string; created_at: string };

const usd = (c: number) => (c / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Donations() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [r, d] = await Promise.all([
      supabase.from("donation_receipts").select("id,receipt_number,kind,donor_name,donor_email,amount_cents,paid_at,status,attempts,last_error").order("paid_at", { ascending: false }).limit(200),
      supabase.from("donations").select("id,amount_cents,donor_name,donor_email,frequency,status,created_at").order("created_at", { ascending: false }).limit(200),
    ]);
    setReceipts((r.data as Receipt[]) ?? []);
    setDonations((d.data as Donation[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const resend = async (id: string) => {
    setBusy(id);
    const { error } = await supabase.functions.invoke("resend-receipt", { body: { receipt_id: id } });
    if (error) {
      const details = error instanceof FunctionsHttpError ? (await error.context.json().catch(() => ({}))).error : error.message;
      toast({ title: "Resend failed", description: details ?? "Unknown error", variant: "destructive" });
    } else toast({ title: "Receipt sent" });
    setBusy(null);
    load();
  };

  const failed = receipts.filter((r) => r.status === "failed" || r.status === "pending");

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-4xl">Donations</h1>
        <p className="text-muted-foreground mt-2">Confirmed payments and tax receipts. Receipts are sent automatically when Stripe confirms payment.</p>
      </div>

      {failed.length > 0 && (
        <Card className="p-4 border-destructive">
          <p className="font-medium">{failed.length} receipt(s) need attention.</p>
          <p className="text-sm text-muted-foreground">Use Resend below. Each receipt can only be sent once.</p>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="px-4 pt-4 font-medium">Paid payments & receipts</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt</TableHead><TableHead>Donor</TableHead><TableHead>Amount</TableHead>
              <TableHead>Paid</TableHead><TableHead>Receipt status</TableHead><TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : receipts.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No paid donations yet.</TableCell></TableRow>
            ) : receipts.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.receipt_number}<div className="text-muted-foreground">{r.kind === "monthly_invoice" ? "Monthly payment" : "One time"}</div></TableCell>
                <TableCell><div className="font-medium">{r.donor_name || "—"}</div><div className="text-xs text-muted-foreground">{r.donor_email}</div></TableCell>
                <TableCell className="font-medium">{usd(r.amount_cents)}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(r.paid_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "sent" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>{r.status}</Badge>
                  {r.last_error && <div className="text-xs text-destructive mt-1 max-w-xs truncate" title={r.last_error}>{r.last_error}</div>}
                  <div className="text-xs text-muted-foreground">{r.attempts} attempt(s)</div>
                </TableCell>
                <TableCell>
                  {r.status !== "sent" && (
                    <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => resend(r.id)}>Resend</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-4 pt-4 font-medium">Checkout sessions & monthly gifts</div>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Donor</TableHead><TableHead>Amount</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Started</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((d) => (
              <TableRow key={d.id}>
                <TableCell><div className="font-medium">{d.donor_name || "—"}</div><div className="text-xs text-muted-foreground">{d.donor_email}</div></TableCell>
                <TableCell>{usd(d.amount_cents)}</TableCell>
                <TableCell className="capitalize">{d.frequency.replace("_", " ")}</TableCell>
                <TableCell><Badge variant="secondary">{d.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
