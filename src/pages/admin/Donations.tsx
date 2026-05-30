import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Donations() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("donations")
      .select("id,amount_cents,donor_name,donor_email,frequency,status,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-4xl">Donations</h1>
        <p className="text-muted-foreground mt-2">All contributions, most recent first.</p>
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No donations yet.</TableCell></TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.donor_name || "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground">{r.donor_email}</div>
                  </TableCell>
                  <TableCell className="font-medium">${(r.amount_cents / 100).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{r.frequency?.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "completed" ? "default" : "secondary"}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
