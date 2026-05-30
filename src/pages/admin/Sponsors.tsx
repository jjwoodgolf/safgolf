import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function Sponsors() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("sponsor_inquiries")
      .select("id,company_name,contact_name,email,phone,interest_tier,message,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-4xl">Sponsors</h1>
        <p className="text-muted-foreground mt-2">Inbound sponsorship inquiries.</p>
      </div>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No inquiries yet.</TableCell></TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.company_name}</TableCell>
                  <TableCell>
                    <div>{r.contact_name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
                  </TableCell>
                  <TableCell className="capitalize">{r.interest_tier || "—"}</TableCell>
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
