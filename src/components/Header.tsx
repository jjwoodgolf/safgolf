import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import safLogoFull from "@/assets/saf-logo-full.png";

const programLinks = [
  { label: "College Scholarships", href: "/scholarships" },
  { label: "Veterans Program", href: "/veterans" },
  { label: "Junior Golf Development", href: "/junior-golf" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "About Us", href: "/about" },
    { label: "Sponsors", href: "/sponsors" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const isProgramsActive = programLinks.some((l) => location.pathname.startsWith(l.href));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border">
      <div className="container-custom pr-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center pl-[10px]">
            <img src={safLogoFull} alt="Student Athlete Foundation" className="h-[62px] w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/about"
              className={`font-medium transition-colors duration-200 ${
                isActive("/about") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              About Us
            </Link>

            {/* Programs dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProgramsOpen(true)}
              onMouseLeave={() => setProgramsOpen(false)}
            >
              <button
                className={`flex items-center gap-1 font-medium transition-colors duration-200 ${
                  isProgramsActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
                aria-haspopup="true"
                aria-expanded={programsOpen}
              >
                Programs
                <ChevronDown className="h-4 w-4" />
              </button>
              {programsOpen && (
                <div className="absolute left-0 top-full pt-3 min-w-[240px]">
                  <div className="bg-white border border-border rounded-md shadow-lg py-2">
                    {programLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/sponsors"
              className={`font-medium transition-colors duration-200 ${
                isActive("/sponsors") ? "text-primary" : "text-foreground/80 hover:text-primary"
              }`}
            >
              Sponsors
            </Link>

            <Link to="/donate">
              <Button variant="donate" size="lg">
                Donate Now
              </Button>
            </Link>

            <Link
              to="/login"
              aria-label="Login"
              className="p-2 text-foreground/70 hover:text-primary transition-colors"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                to="/about"
                className="font-medium py-2 text-foreground/80 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              <div className="py-2">
                <p className="font-medium text-foreground/60 text-sm uppercase tracking-wide mb-2">
                  Programs
                </p>
                <div className="flex flex-col gap-2 pl-3 border-l border-border">
                  {programLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-foreground/80 hover:text-primary py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/sponsors"
                className="font-medium py-2 text-foreground/80 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sponsors
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-2 font-medium py-2 text-foreground/80 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>

              <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                <Button variant="donate" size="lg" className="mt-2 w-full">
                  Donate Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
