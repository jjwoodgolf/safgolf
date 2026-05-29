import {
  GraduationCap,
  Handshake,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const Scholarships = () => {
  return (
    <Layout>
      <SEO
        title="College Golf Scholarships | Student Athlete Foundation"
        description="Need-based scholarships and recruiting support for junior golfers pursuing a college playing career."
        path="/scholarships"
      />

      {/* Hero */}
      <section className="bg-background pt-32 pb-20 lg:pt-44 lg:pb-28">
        <div className="container-custom max-w-4xl">
          <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-6">
            Program
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8">
            Fueling the Future of College Golf
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl">
            The Student Athlete Foundation provides critical financial assistance
            and expert recruiting mentorship to help dedicated junior golfers
            achieve their dreams of playing at the collegiate level.
          </p>
        </div>
      </section>

      {/* Section 1: The Annual SAF Scholarship */}
      <section className="bg-muted/40 py-20 lg:py-28">
        <div className="container-custom max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <GraduationCap
                  className="h-7 w-7 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-3">
                The Annual SAF Scholarship
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                Partnering for Impact
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe that financial barriers should never stand between a
                talented athlete and a higher education. To maximize our impact,
                the Student Athlete Foundation partners directly with premier
                junior golf organizations, including the South Texas PGA and the
                Beltway JGT.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Through these strategic partnerships, SAF donates annual
                scholarship funds directly to these organizations. Their
                internal leadership teams then evaluate and select a highly
                deserving applicant from within their tours to receive the annual
                SAF Scholarship, ensuring the funds directly assist dedicated
                athletes with their upcoming college tuition and academic
                expenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Recruiting Mentorship Program */}
      <section className="bg-background py-20 lg:py-28">
        <div className="container-custom max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                <Target
                  className="h-7 w-7 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <span className="block text-primary font-semibold uppercase tracking-[0.18em] text-xs mb-3">
                The Recruiting Mentorship Program
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                College Golf Recruiting Mentorship
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Navigating the complex landscape of college athletics can be
                overwhelming for families. To bridge this gap, SAF offers a
                comprehensive College Golf Recruiting Mentorship Program. We
                provide student-athletes with the tools, competitive exposure,
                and strategic guidance required to connect with college coaches,
                build professional athletic resumes, and secure roster spots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Sponsor a Student-Athlete's Journey */}
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
              Sponsor a Student-Athlete's Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Powered by Community and Corporate Support
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              As a 501(c)(3) non-profit, our ability to change lives is
              entirely powered by community and corporate support. When you
              donate to the Student Athlete Foundation, your funds are directly
              deployed to alter a young athlete's trajectory.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-8 border border-border">
              <Users
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Mentorship Sponsorships
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Fully funding a student-athlete's participation in our extensive
                College Golf Recruiting Mentorship Program.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <Award
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Recruiting Workshops
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sponsoring entry fees for athletes to attend high-exposure
                college recruiting workshops and showcase events.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <CheckCircle2
                className="h-7 w-7 text-primary mb-5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                Direct Financial Aid
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Expanding our annual scholarship fund pool for the South Texas
                PGA and Beltway JGT selections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Join Us in Changing Lives
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            Your support opens doors. Whether you give to the scholarship fund
            or apply for mentorship, you are part of building the future of
            college golf.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/donate">
                Donate to the Scholarship Fund
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white/40 hover:bg-white hover:text-primary"
            >
              <Link to="/contact">Apply for Mentorship</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Scholarships;
