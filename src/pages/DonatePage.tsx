import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DonationCard from "@/components/DonationCard";
import { CheckCircle2, GraduationCap, Shield, Users } from "lucide-react";

const impactItems = [
  { amount: "$50", description: "Tournament entry fees for one junior golfer" },
  { amount: "$100", description: "Equipment for a veteran clinic participant" },
  { amount: "$250", description: "One month of training for a junior golfer" },
  { amount: "$500", description: "Full 8-week veterans program for one participant" },
  { amount: "$1,000", description: "Sends a student-athlete to a showcase event" },
  { amount: "$5,000", description: "Funds a complete college scholarship application cycle" },
];

const programs = [
  { icon: GraduationCap, title: "Scholarships", text: "College recruiting mentorship and direct financial aid." },
  { icon: Shield, title: "Veterans", text: "Free PGA HOPE clinics and adaptive equipment." },
  { icon: Users, title: "Junior Golf", text: "Coaching, tournament access, and mentorship." },
];

const DonatePage = () => {
  return (
    <Layout>
      <SEO
        title="Donate & Sponsor | Student Athlete Foundation"
        description="Make a tax-deductible donation or sponsor a student-athlete. Fund golf scholarships for juniors and free programs for veterans."
        path="/donate"
      />

      {/* Hero + Donation Card */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Fund the next generation of golfers.
            </h1>
            <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-lg">
              Your tax-deductible gift powers scholarships for student-athletes, free clinics for veterans,
              and recruiting mentorship that opens doors to college golf.
            </p>
            <div className="space-y-4">
              {programs.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{p.title}</p>
                    <p className="text-white/75 text-sm">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DonationCard />
        </div>
      </section>

      {/* Impact */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Your Impact</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">
              Every gift translates directly into opportunity.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactItems.map((item) => (
              <div key={item.amount} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-primary mb-1">{item.amount}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax info */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center p-8 bg-primary/5 rounded-xl border border-primary/20 max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-foreground mb-3">Tax-Deductible Giving</h3>
            <p className="text-foreground font-medium">
              The Student Athlete Foundation is a registered 501(c)(3) non-profit organization.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              All donations are tax-deductible to the extent allowed by law. Tax ID: XX-XXXXXXX
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DonatePage;
