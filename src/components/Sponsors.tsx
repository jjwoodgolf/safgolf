import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sponsors = () => {
  return (
    <section id="sponsors" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Supporters</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Community Sponsors
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We're grateful for the generous support of our sponsors and partners who 
            help make our programs possible.
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Platinum */}
          <div className="bg-gradient-to-b from-muted to-background rounded-xl p-8 text-center border border-border">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Platinum Sponsors</h3>
            <p className="text-muted-foreground text-sm mb-6">$10,000+</p>
            <div className="h-32 flex items-center justify-center text-muted-foreground italic">
              Your logo here
            </div>
          </div>

          {/* Gold */}
          <div className="bg-gradient-to-b from-secondary/20 to-secondary/5 rounded-xl p-8 text-center border border-secondary/30">
            <div className="text-3xl mb-4">🥇</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Gold Sponsors</h3>
            <p className="text-muted-foreground text-sm mb-6">$5,000+</p>
            <div className="h-32 flex items-center justify-center text-muted-foreground italic">
              Your logo here
            </div>
          </div>

          {/* Silver */}
          <div className="bg-gradient-to-b from-muted/50 to-muted rounded-xl p-8 text-center border border-border">
            <div className="text-3xl mb-4">🥈</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Silver Sponsors</h3>
            <p className="text-muted-foreground text-sm mb-6">$2,500+</p>
            <div className="h-32 flex items-center justify-center text-muted-foreground italic">
              Your logo here
            </div>
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <div className="bg-muted rounded-2xl p-8 md:p-12 text-center">
          <Handshake className="h-12 w-12 text-accent mx-auto mb-6" />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Become a Sponsor
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Partner with us to make a lasting impact in the lives of junior golfers and 
            military veterans. Sponsorship opportunities include event naming rights, 
            logo placement, and exclusive recognition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="lg">
              Sponsorship Opportunities
            </Button>
            <Button variant="outline" size="lg">
              Download Sponsor Packet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
