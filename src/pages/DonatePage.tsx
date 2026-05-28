import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Heart, CreditCard, Building2, Gift, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonatePage = () => {
  const donationOptions = [
    {
      icon: CreditCard,
      title: "One-Time Gift",
      description: "Make an immediate impact with a single donation. Every dollar directly supports our programs.",
      cta: "Donate Now",
    },
    {
      icon: Heart,
      title: "Monthly Giving",
      description: "Become a sustaining partner with recurring support and help us plan for the future.",
      cta: "Join Monthly",
    },
    {
      icon: Building2,
      title: "Corporate Giving",
      description: "Partner with us through corporate sponsorship and make a difference in your community.",
      cta: "Learn More",
    },
    {
      icon: Gift,
      title: "Legacy Giving",
      description: "Include SAF in your estate planning and create a lasting impact for generations.",
      cta: "Plan Your Gift",
    },
  ];

  const impactItems = [
    { amount: "$50", description: "Provides tournament entry fees for one junior golfer" },
    { amount: "$100", description: "Covers equipment costs for a veteran participant" },
    { amount: "$250", description: "Sponsors a junior golfer for one month of training" },
    { amount: "$500", description: "Funds a complete 8-week program for one veteran" },
    { amount: "$1,000", description: "Sends a student-athlete to a showcase event" },
    { amount: "$5,000", description: "Sponsors a full college scholarship application process" },
  ];

  return (
    <Layout>
      <SEO title="Donate | Student Athlete Foundation" description="Make a tax-deductible donation to fund golf scholarships for junior athletes and free programs for military veterans." path="/donate" />
      <PageHero
        kicker="Donate"
        title="Support Our Mission"
        subtitle="Your tax-deductible donation directly supports junior golfers pursuing college dreams and veterans finding healing through golf."
        imageOffset={4}
      />

      {/* Main Donation CTA */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Help Us Change Lives
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Every donation makes a difference. Whether it's helping a young golfer attend a tournament, 
              providing equipment for a veteran, or funding a scholarship application, your generosity 
              creates opportunities that transform lives.
            </p>
            <Button variant="hero" size="xl" className="min-w-[250px]">
              <Heart className="h-5 w-5" />
              Donate Today
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Your Impact</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              See How Your Gift Helps
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every contribution, no matter the size, makes a meaningful difference in the lives of our participants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactItems.map((item) => (
              <div
                key={item.amount}
                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-accent mb-2">
                      {item.amount}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Ways to Give</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Choose How You Want to Help
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationOptions.map((option, index) => (
              <div
                key={option.title}
                className="bg-card rounded-xl p-6 shadow-lg card-hover border border-border text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {option.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {option.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  {option.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Info */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center p-8 bg-accent/5 rounded-xl border border-accent/20 max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Tax-Deductible Giving
            </h3>
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
