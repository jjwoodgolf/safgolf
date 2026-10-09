import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function SetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<"checking" | "ok" | "none">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady("ok");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady("ok");
      else setTimeout(() => setReady((r) => (r === "checking" ? "none" : r)), 2500);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 10) return setError("Use at least 10 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate("/admin/donations", { replace: true });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md p-10 space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl">Choose your password</h1>
        </div>
        {ready === "checking" && <p className="text-sm text-center text-muted-foreground">Verifying your link…</p>}
        {ready === "none" && (
          <p className="text-sm text-center text-muted-foreground" role="alert">
            This link is invalid or has expired. Ask an administrator for a new invitation, or use password reset.
          </p>
        )}
        {ready === "ok" && (
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" autoComplete="new-password" required minLength={10}
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={10}
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving…" : "Save password and continue"}
            </Button>
          </form>
        )}
      </Card>
    </main>
  );
}
