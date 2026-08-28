import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Shield } from "lucide-react";

const VeteransApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    serviceEra: "",
    accommodations: "",
    golfExperience: "",
    goals: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setForm((f) => ({
          ...f,
          email: data.session?.user.email ?? f.email,
          name: data.session?.user.user_metadata?.display_name ?? data.session?.user.user_metadata?.full_name ?? f.name,
        }));
      } else {
        navigate(`/login?redirect=${encodeURIComponent("/apply/veterans")}`);
      }
    });
  }, [navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase.from("program_applications").insert({
      program: "veteran",
      applicant_user_id: userId,
      applicant_name: form.name,
      applicant_email: form.email,
      applicant_phone: form.phone,
      payload: {
        branch: form.branch,
        service_era: form.serviceEra,
        accommodations: form.accommodations,
        golf_experience: form.golfExperience,
        goals: form.goals,
      },
      status: "submitted",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Registration submitted", description: "We will contact you with clinic details and next steps." });
    navigate("/veterans");
  };

  if (!userId) return null;

  return (
    <Layout>
      <SEO
        title="Veterans Golf Program Registration | Student Athlete Foundation"
        description="Register for SAF's complimentary golf program for military veterans."
        path="/apply/veterans"
      />
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Veterans Program Registration
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Register for complimentary PGA HOPE clinics and adaptive golf opportunities for military veterans.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-lg border border-border space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch of Service</Label>
                <Input id="branch" value={form.branch} onChange={(e) => update("branch", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceEra">Service Era / Years of Service</Label>
              <Input id="serviceEra" value={form.serviceEra} onChange={(e) => update("serviceEra", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="golfExperience">Golf Experience</Label>
              <Textarea id="golfExperience" rows={3} value={form.golfExperience} onChange={(e) => update("golfExperience", e.target.value)} placeholder="Any prior golf experience, including adaptive golf or PGA HOPE clinics." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accommodations">Accommodations or Adaptive Needs</Label>
              <Textarea id="accommodations" rows={3} value={form.accommodations} onChange={(e) => update("accommodations", e.target.value)} placeholder="Please share any accommodations that would help you participate fully." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">What You Hope to Gain</Label>
              <Textarea id="goals" rows={3} value={form.goals} onChange={(e) => update("goals", e.target.value)} placeholder="Rehabilitation, community, skill development, or other personal goals." />
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Register
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default VeteransApplication;
