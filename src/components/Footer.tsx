import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import safLogo from "@/assets/saf-logo.png";
import { ORG } from "@/components/site/org";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const quickLinks = [
    { label: "About", href: "/about" },
    { label: "Showcases & events", href: "/events" },
    { label: "Programs", href: "/programs" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "Contact", href: "/contact" },
    { label: "Donate", href: "/donate" },
  ];

  const programs = [
    { label: "Junior golf / Varsity", href: "/junior-golf" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Apply for a scholarship", href: "/apply/scholarship" },
    { label: "College recruiting", href: "/programs/recruiting" },
    { label: "Veterans (PGA HOPE)", href: "/veterans" },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: trimmed, source: "footer" });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Subscription failed",
        description: error.message.includes("duplicate")
          ? "This email is already subscribed."
          : "Please try again.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Subscribed", description: "Thank you for joining our newsletter." });
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <img
              src={safLogo}
              alt="Student Athlete Foundation"
              className="h-24 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/85 leading-relaxed">
              The Student Athlete Foundation (SAF Golf) is a Houston-area 501(c)(3) nonprofit
              funding need-based access to junior golf coaching and college guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/85 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/85 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Stay Informed</h4>
            <p className="text-white/85 text-sm mb-4 leading-relaxed">
              Subscribe for program updates, scholarship announcements, and event invitations.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 mb-8">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/40"
                aria-label="Email address"
              />
              <Button
                type="submit"
                disabled={submitting}
                className="bg-white text-primary hover:bg-white/90 flex-shrink-0"
                aria-label="Subscribe"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white flex-shrink-0" />
                <a href="mailto:safsportshouston@gmail.com" className="text-white/85 hover:text-white transition-colors text-sm">
                  safsportshouston@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white flex-shrink-0" />
                <a href="tel:+17135869569" className="text-white/85 hover:text-white transition-colors text-sm">
                  (713) 586-9569
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/85 text-sm">
            © {new Date().getFullYear()} {ORG.legalName}, a 501(c)(3) nonprofit. EIN {ORG.ein}.
          </p>
          <div className="flex flex-wrap gap-6 text-sm justify-center">
            <Link to="/privacy" className="text-white/85 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/85 hover:text-white transition-colors">
              Terms of Service
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
