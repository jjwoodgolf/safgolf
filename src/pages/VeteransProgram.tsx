import {
  Shield,
  HeartHandshake,
  Handshake,
  ArrowRight,
  Users,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const VeteransProgram = () => {
  return (
    <Layout>
      <SEO
        title="Veterans Golf Program | Student Athlete Foundation"
        description="Transformative, complimentary golf programs and rehabilitation opportunities for military veterans and amputees."
        path="/veterans"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[hsl(0_30%_10%)] pt-32 pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 container-custom max-w-4xl">
          <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-6">
            Program
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
            Healing Through the Game of Golf
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl">
            The Student Athlete Foundation is honored to provide transformative,
            complimentary golf programs and rehabilitation opportunities for
            military veterans and amputees.
          </p>
        </div>
      </section>

      {/* Section 1: The PGA Partnership */}
      <section className="bg-muted/40 py-20 lg:py-28">
        <div className="container-custom max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <Shield
                  className="h-7 w-7 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-3">
                PGA HOPE
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                Helping Our Patriots Everywhere
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We are proud to align with PGA REACH and regional
                sections—including the Southern Texas PGA and Southwest PGA—to
                support the PGA HOPE initiative. This flagship military program
                introduces golf to veterans to enhance their physical, mental,
                social, and emotional well-being.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Through these programs, veterans receive free, specialized golf
                instruction taught by local PGA Professionals who are trained in
                adaptive golf and military cultural competency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Rehabilitation & Community */}
      <section className="bg-background py-20 lg:py-28">
        <div className="container-custom max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <HeartHandshake
                  className="h-7 w-7 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-3">
                Rehabilitation & Community
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                More Than Just a Game
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                For many veterans, the transition back to civilian life or the
                journey of rehabilitating from injuries can be isolating. Golf
                provides a unique, therapeutic environment where veterans can
                rebuild physical strength, forge a supportive community with
                fellow servicemembers, and regain a vital sense of purpose on
                the fairway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Donor Pitch */}
      <section className="bg-muted/40 py-20 lg:py-28">
        <div className="container-custom max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
              <Handshake
                className="h-7 w-7 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-3">
              Fund a Hero&apos;s Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Powered by Community and Corporate Support
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              As a 501(c)(3) non-profit organization, our ability to offer these
              life-changing clinics completely free of charge to veterans is
              powered by corporate grants and private donors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-8 border border-border">
              <Award
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Clinic Operations
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Funding facility access and specialized PGA Professional
                instruction.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <Users
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Adaptive Equipment
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Providing modified golf clubs and training aids for wounded and
                amputee veterans.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <CheckCircle2
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Community Events
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sponsoring post-clinic meals and community-building events for
                the veterans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Join Us in Serving Those Who Served
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Your support funds life-changing clinics for veterans. Whether you
            give to the program or register for a clinic, you are part of
            building healing and community through golf.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/donate">
                Donate to the Veterans Program
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white/40 hover:bg-white hover:text-primary"
            >
              <Link to="/contact">Register for a Clinic</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VeteransProgram;
