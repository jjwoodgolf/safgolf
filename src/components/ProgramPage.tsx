import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ProgramPageProps {
  seoTitle: string;
  seoDescription: string;
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  pillars: Pillar[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

const ProgramPage = ({
  seoTitle,
  seoDescription,
  path,
  eyebrow,
  title,
  lede,
  pillars,
  primaryCta = { label: "Apply", href: "/contact" },
  secondaryCta = { label: "Support this program", href: "/donate" },
}: ProgramPageProps) => {
  return (
    <Layout>
      <SEO title={seoTitle} description={seoDescription} path={path} />

      {/* Hero */}
      <section className="bg-background pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-custom max-w-4xl">
          <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-6">
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
            {lede}
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-custom">
        <div className="border-t border-border" />
      </div>

      {/* Pillars */}
      <section className="bg-background py-24 lg:py-32">
        <div className="container-custom">
          <div className="max-w-2xl mb-16">
            <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-4">
              What we provide
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Program overview
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <pillar.icon
                  className="h-7 w-7 text-primary mb-6"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Ready to take the next step?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Placeholder copy. Replace with a tailored call to action describing how
            participants or supporters can engage with this program.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white/40 hover:bg-white hover:text-primary"
            >
              <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramPage;
