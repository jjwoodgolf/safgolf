import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Handshake, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SponsorsPage = () => {
  const sponsorshipLevels = [
    {
      tier: "Platinum",
      emoji: "🏆",
      amount: "$10,000+",
      benefits: [
        "Premier logo placement on all materials",
        "Event naming rights",
        "VIP access to all events",
        "Featured in press releases",
        "Social media spotlight",
        "Exclusive networking events",
      ],
      bgClass: "bg-gradient-to-b from-muted to-background",
    },
    {
      tier: "Gold",
      emoji: "🥇",
      amount: "$5,000+",
      benefits: [
        "Logo on event materials",
        "Recognition at events",
        "VIP access to select events",
        "Social media recognition",
        "Newsletter features",
      ],
      bgClass: "bg-gradient-to-b from-secondary/20 to-secondary/5",
    },
    {
      tier: "Silver",
      emoji: "🥈",
      amount: "$2,500+",
      benefits: [
        "Logo on website",
        "Event recognition",
        "Social media mention",
        "Newsletter acknowledgment",
      ],
      bgClass: "bg-gradient-to-b from-muted/50 to-muted",
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 text-left">
              <p className="text-muted-foreground text-lg">Tax-deductible charitable contribution</p>
              <p className="text-muted-foreground text-lg">Brand visibility tied to education and service</p>
              <p className="text-muted-foreground text-lg">Community goodwill and local impact</p>
              <p className="text-muted-foreground text-lg">Alignment with youth development and veterans</p>
              <p className="text-muted-foreground text-lg">Long-term partnership opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Community Support</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Thank You to Our Sponsors
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              These organizations and individuals make our mission possible through their generous contributions.
            </p>
          </div>

          {/* Sponsor Tiers Display */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {sponsorshipLevels.map((level) => (
              <div key={level.tier} className={`${level.bgClass} rounded-xl p-8 text-center border border-border`}>
                <div className="text-4xl mb-4">{level.emoji}</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{level.tier} Sponsors</h3>
                <p className="text-muted-foreground text-sm mb-6">{level.amount}</p>
                <div className="h-32 flex items-center justify-center text-muted-foreground italic border-2 border-dashed border-border rounded-lg">
                  Your logo here
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Partner With Us</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Sponsorship Opportunities
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join our mission to support junior golfers and veterans. Choose the sponsorship level that works for your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipLevels.map((level, index) => (
              <div
                key={level.tier}
                className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 text-center">{level.emoji}</div>
                <h3 className="font-display text-2xl font-bold text-foreground text-center mb-2">
                  {level.tier}
                </h3>
                <p className="text-accent font-bold text-xl text-center mb-6">{level.amount}</p>
                <ul className="space-y-3 mb-8">
                  {level.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Become a Sponsor
                  </Button>
                </Link>
              </div>
            ))}
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
