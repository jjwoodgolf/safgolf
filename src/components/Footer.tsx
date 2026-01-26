import { Mail, Phone } from "lucide-react";
import safLogo from "@/assets/saf-logo.png";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Success Stories", href: "#success" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "Donate", href: "#donate" },
  ];

  const programs = [
    { label: "Junior Golf Player Development", href: "#programs" },
    { label: "College Golf Scholarships", href: "#programs" },
    { label: "Veterans Golf Program", href: "#programs" },
    { label: "Golf Showcase Events", href: "#programs" },
    { label: "Recruiting Services", href: "#programs" },
  ];

  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <img
              src={safLogo}
              alt="Student Athlete Foundation"
              className="h-24 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/70 leading-relaxed">
              Empowering lives through golf. Helping junior golfers achieve college dreams 
              and providing healing programs for military veterans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
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
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white flex-shrink-0" />
                <a href="mailto:safsportshouston@gmail.com" className="text-white/70 hover:text-white transition-colors">
                  safsportshouston@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white flex-shrink-0" />
                <a href="tel:+17135869569" className="text-white/70 hover:text-white transition-colors">
                  (713) 586-9569
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Student Athlete Foundation. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              501(c)(3) Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
