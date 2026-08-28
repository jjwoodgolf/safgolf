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
import { Loader2, Send, GraduationCap } from "lucide-react";

const ScholarshipApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    gpa: "",
    gradYear: "",
    tournaments: "",
    colleges: "",
    needStatement: "",
    golfExperience: "",
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
        navigate(`/login?redirect=${encodeURIComponent("/apply/scholarship")}`);
      }
    });
  }, [navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("submit-application", {
        body: {
          program: "scholarship",
          applicant_name: form.name,
          applicant_email: form.email,
          applicant_phone: form.phone,
          payload: {
            school: form.school,
            gpa: form.gpa,
            grad_year: form.gradYear,
            tournaments: form.tournaments,
            colleges: form.colleges,
            need_statement: form.needStatement,
            golf_experience: form.golfExperience,
          },
        },
      });
      if (error) throw error;
      toast({ title: "Application submitted", description: "We will review your scholarship application and be in touch." });
      navigate("/success-stories");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <Layout>
      <SEO
        title="Apply for a Golf Scholarship | Student Athlete Foundation"
        description="Apply for a college golf scholarship or recruiting mentorship through SAF."
        path="/apply/scholarship"
      />
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Scholarship Application
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Apply for scholarship support and recruiting mentorship to help you reach the collegiate level.
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
                <Label htmlFor="school">Current School</Label>
                <Input id="school" required value={form.school} onChange={(e) => update("school", e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" value={form.gpa} onChange={(e) => update("gpa", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradYear">Graduation Year</Label>
                <Input id="gradYear" required value={form.gradYear} onChange={(e) => update("gradYear", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tournaments">Tournament Experience</Label>
              <Textarea id="tournaments" rows={3} value={form.tournaments} onChange={(e) => update("tournaments", e.target.value)} placeholder="List recent tournaments, finishes, and scoring average." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colleges">Colleges of Interest</Label>
              <Input id="colleges" value={form.colleges} onChange={(e) => update("colleges", e.target.value)} placeholder="Schools or division levels you are considering." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="golfExperience">Golf Background</Label>
              <Textarea id="golfExperience" rows={3} value={form.golfExperience} onChange={(e) => update("golfExperience", e.target.value)} placeholder="Years playing, handicap, coaching history, and goals." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="needStatement">Why This Support Matters</Label>
              <Textarea id="needStatement" rows={4} value={form.needStatement} onChange={(e) => update("needStatement", e.target.value)} placeholder="Describe how scholarship or mentorship support would help you reach your goals." />
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Application
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ScholarshipApplication;
