import { Button } from "@/components/ui/button";
import { Heart, CreditCard, Building2, Gift } from "lucide-react";

const Donate = () => {
  const donationOptions = [
    {
      icon: CreditCard,
      title: "One-Time Gift",
      description: "Make an immediate impact with a single donation",
      cta: "Donate Now",
    },
    {
      icon: Heart,
      title: "Monthly Giving",
      description: "Become a sustaining partner with recurring support",
      cta: "Join Monthly",
    },
    {
      icon: Building2,
      title: "Corporate Giving",
      description: "Partner with us through corporate sponsorship",
      cta: "Learn More",
    },
    {
      icon: Gift,
      title: "Legacy Giving",
      description: "Include SAF in your estate planning",
      cta: "Plan Your Gift",
    },
  ];

  return (
    <section id="donate" className="section-padding bg-cream relative overflow-hidden">
      <div className="container-custom">
        {/* Main CTA */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">Support Our Mission</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Help Us Change Lives
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Your tax-deductible donation directly supports junior golfers pursuing college dreams 
            and veterans finding healing through golf. Every dollar makes a difference.
          </p>
          <Button variant="hero" size="xl" className="min-w-[250px]">
            <Heart className="h-5 w-5" />
            Donate Today
          </Button>
        </div>

        {/* Donation Options */}
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

        {/* Tax Info */}
        <div className="text-center mt-12 p-6 bg-accent/5 rounded-xl border border-accent/20">
          <p className="text-foreground font-medium">
            The Student Athlete Foundation is a registered 501(c)(3) non-profit organization.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            All donations are tax-deductible to the extent allowed by law. Tax ID: XX-XXXXXXX
          </p>
        </div>
      </div>
    </section>
  );
};

export default Donate;
