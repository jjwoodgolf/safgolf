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
import { Loader2, Send, Trophy } from "lucide-react";

const JuniorGolfApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    parentName: "",
    parentEmail: "",
    age: "",
    school: "",
    experience: "",
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
        navigate(`/login?redirect=${encodeURIComponent("/apply/junior-golf")}`);
      }
    });
  }, [navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase.from("program_applications").insert({
      program: "junior_golf",
      applicant_user_id: userId,
      applicant_name: form.name,
      applicant_email: form.email,
      applicant_phone: form.phone,
      payload: {
        parent_name: form.parentName,
        parent_email: form.parentEmail,
        age: form.age,
        school: form.school,
        experience: form.experience,
        goals: form.goals,
      },
      status: "submitted",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Application submitted", description: "We will contact you about junior golf program options." });
    navigate("/programs/junior-golf");
  };

  if (!userId) return null;

  return (
    <Layout>
      <SEO
        title="Apply for Junior Golf Development | Student Athlete Foundation"
        description="Enroll a junior golfer in SAF's development program."
        path="/apply/junior-golf"
      />
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Junior Golf Enrollment
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Begin the enrollment process for junior golf development and tournament pathways.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-lg border border-border space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Junior Golfer Name</Label>
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
                <Label htmlFor="age">Age</Label>
                <Input id="age" required type="number" min={8} max={18} value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent / Guardian Name</Label>
                <Input id="parentName" required value={form.parentName} onChange={(e) => update("parentName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Parent / Guardian Email</Label>
                <Input id="parentEmail" type="email" value={form.parentEmail} onChange={(e) => update("parentEmail", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Input id="school" value={form.school} onChange={(e) => update("school", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Golf Experience</Label>
              <Textarea id="experience" rows={3} value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Years playing, current handicap, prior instruction, and tournament experience." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Development Goals</Label>
              <Textarea id="goals" rows={3} value={form.goals} onChange={(e) => update("goals", e.target.value)} placeholder="What the junior golfer hopes to achieve through the program." />
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Submit Enrollment
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default JuniorGolfApplication;
