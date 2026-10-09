import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import safLogoFull from "@/assets/saf-logo-full.png";

const programLinks = [
  { label: "All programs", href: "/programs" },
  { label: "Junior golf / Varsity", href: "/junior-golf" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "College recruiting", href: "/programs/recruiting" },
  { label: "Veterans (PGA HOPE)", href: "/veterans" },
  { label: "Showcases & events", href: "/events" },
];

const primaryLinks = [
  { label: "About", href: "/about" },
  { label: "Success stories", href: "/success-stories" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);
  const isProgramsActive = programLinks.some((l) => location.pathname.startsWith(l.href));
  const linkCls = (active: boolean) =>
    `text-[15px] font-medium transition-colors ${active ? "text-primary" : "text-foreground/75 hover:text-primary"}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container-custom px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center" aria-label="The Student Athlete Foundation home">
            <img src={safLogoFull} alt="The Student Athlete Foundation" className="h-[56px] w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
            <Link to="/about" className={linkCls(isActive("/about"))}>About</Link>
            <div
              className="relative"
              onMouseEnter={() => setProgramsOpen(true)}
              onMouseLeave={() => setProgramsOpen(false)}
            >
              <button
                className={`flex items-center gap-1 ${linkCls(isProgramsActive)}`}
                aria-haspopup="true"
                aria-expanded={programsOpen}
                onClick={() => setProgramsOpen((v) => !v)}
              >
                Programs <ChevronDown className="h-4 w-4" />
              </button>
              {programsOpen && (
                <div className="absolute left-0 top-full pt-3 min-w-[240px]">
                  <div className="bg-background border border-border rounded-sm py-2">
                    {programLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setProgramsOpen(false)}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {primaryLinks.slice(1).map((l) => (
              <Link key={l.href} to={l.href} className={linkCls(isActive(l.href))}>{l.label}</Link>
            ))}
            <Link to="/login" aria-label="Staff login" className="p-1 text-foreground/50 hover:text-primary">
              <LogIn className="h-4 w-4" />
            </Link>
            <Button asChild>
              <Link to="/donate">Donate</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Button asChild size="sm">
              <Link to="/donate">Donate</Link>
            </Button>
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              <p className="eyebrow mt-2 mb-1">Programs</p>
              {programLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="py-2 text-foreground/85">
                  {link.label}
                </Link>
              ))}
              <p className="eyebrow mt-4 mb-1">Foundation</p>
              {primaryLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)} className="py-2 text-foreground/85">
                  {link.label}
                </Link>
              ))}
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 text-foreground/60 text-sm">
                <LogIn className="h-4 w-4" /> Staff login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
