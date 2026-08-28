import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "in" | "out" | "unauthorized">("loading");

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (mounted) setStatus("out");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["admin", "staff"]);
      if (mounted) setStatus(data && data.length > 0 ? "in" : "unauthorized");
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setStatus("out");
        return;
      }
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["admin", "staff"])
        .then(({ data }) => setStatus(data && data.length > 0 ? "in" : "unauthorized"));
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (status === "out") return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (status === "unauthorized") return <Navigate to="/" replace />;
  return <>{children}</>;
}
