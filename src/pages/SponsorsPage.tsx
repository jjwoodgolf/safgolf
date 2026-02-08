import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Handshake, CheckCircle, Receipt, Eye, Heart, Target, Users, GraduationCap, Settings, Building, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SponsorsPage = () => {
  const sponsorshipTiers = [
    {
      amount: "TBD",
      title: "Facility Naming Rights Sponsor",
      benefits: [
        "Exclusive naming rights on building",
        "Primary branding and naming recognition",
        "Homepage logo placement",
        "Facility signage",
        "Program-wide recognition",
        "Direct partnership with SAF leadership",
        "Private 1-day golf school for up to 10 people",
        "Corporate membership to indoor golf training for up to 5 people",
        "Scholarship named after the name of your choice",
        "Media recognition during scholarship award ceremony",
        "Program naming recognition",
        "On-site signage at events and clinics",
        "Annual impact report",
        "Logo placement on sponsor wall",
        "Logo placement on all SAF media materials",
        "Social media acknowledgment",
        "Website recognition",
        "Newsletter acknowledgment",
        "Community impact recognition",
      ],
      cta: "inquiry",
    },
    {
      amount: "TBD",
      title: "Major Program Sponsor",
      benefits: [
        "Program naming recognition",
        "Website and newsletter visibility",
        "On-site signage at events and clinics",
        "Annual impact report",
        "Corporate membership to indoor golf training for up to 3 people",
        "Scholarship named after the name of your choice",
        "Media recognition during scholarship award ceremony",
        "1 social media post recognition",
        "1 newsletter featured email",
        "Logo placement on sponsor wall",
        "Quarterly newsletter recognition",
        "Social media acknowledgment",
        "1 year commitment",
        "Website recognition",
        "Newsletter acknowledgment",
        "Community impact recognition",
      ],
      cta: "inquiry",
    },
    {
      amount: "$2,500",
      title: "College Scholarship Sponsor",
      benefits: [
        "Annual sponsorship",
        "Scholarship named after the name of your choice",
        "Media recognition during scholarship award ceremony",
        "1 social media post recognition",
        "1 newsletter featured email",
        "Logo placement on sponsor wall at facility",
        "Website recognition",
      ],
      cta: "sponsor",
    },
    {
      amount: "$5,000",
      title: "Sponsor a Junior Golfer",
      benefits: [
        "1-year commitment",
        "Player development coaching",
        "College recruiting mentorship",
        "Access to practice facility for one year",
        "Equipment needs",
        "Regional tournament costs",
        "Logo placement on sponsor wall at facility",
        "1 newsletter featured email",
        "1 social media post recognition",
        "Website recognition",
      ],
      cta: "sponsor",
    },
    {
      amount: "$999/month",
      title: "Gold Business Sponsor",
      benefits: [
        "Logo placement on sponsor wall",
        "Quarterly newsletter recognition",
        "Social media acknowledgment",
        "1 year commitment",
        "Website recognition",
        "Newsletter acknowledgment",
        "Community impact recognition",
      ],
      cta: "sponsor",
    },
    {
      amount: "$500/month",
      title: "Silver Sponsor",
      benefits: [
        "1 year commitment",
        "Website recognition",
        "Newsletter acknowledgment",
        "Community impact recognition",
      ],
      cta: "sponsor",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Partner With the Student Athlete Foundation
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-6">
            Creating access, opportunity, and education through the game of golf
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Your sponsorship directly funds youth development, college pathways, and adaptive golf programs for military veterans.
          </p>
          <Link to="/contact">
            <Button variant="heroOutline" size="xl">
              Become a Sponsor
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
              Why Sponsor Student Athlete Foundation
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-lg">Tax-deductible charitable contribution</p>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-lg">Brand visibility tied to education and service</p>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-lg">Community goodwill and local impact</p>
              </div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-lg">Alignment with youth development and veterans</p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-lg">Long-term partnership opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Sponsorship Opportunities
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              We offer structured sponsorship opportunities designed to provide both meaningful impact and sponsor visibility.
            </p>
            <p className="text-primary font-medium">
              All sponsorships are tax-deductible charitable contributions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {sponsorshipTiers.map((tier, index) => (
              <div
                key={tier.title}
                className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-primary font-bold text-2xl">{tier.amount}</p>
                  <h3 className="font-display text-xl font-bold text-foreground mt-1">
                    {tier.title}
                  </h3>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                {tier.cta === "inquiry" ? (
                  <p className="text-sm text-muted-foreground italic">Details provided upon inquiry</p>
                ) : (
                  <Link to="/contact">
                    <Button variant="accent" className="w-full">
                      Sponsor Now
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Funds Are Used */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
              How Sponsorship Funds Are Used
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <p className="text-muted-foreground text-lg">College recruiting program</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Settings className="h-8 w-8 text-primary" />
                <p className="text-muted-foreground text-lg">Program operations</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                <p className="text-muted-foreground text-lg">Facility access and equipment</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <p className="text-muted-foreground text-lg">Veteran programming support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="bg-muted rounded-2xl p-8 md:p-12 text-center">
            <Handshake className="h-12 w-12 text-accent mx-auto mb-6" />
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Make an Impact?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Partner with us to make a lasting impact in the lives of junior golfers and 
              military veterans. Contact us to discuss custom sponsorship opportunities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="accent" size="lg">
                  Contact Us
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Download Sponsor Packet
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SponsorsPage;
