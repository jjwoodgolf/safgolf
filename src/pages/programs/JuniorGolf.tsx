import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const JuniorGolf = () => {
  const benefits = [
    "Professional instruction from PGA certified coaches",
    "Access to practice facilities and driving ranges",
    "Tournament scheduling and registration assistance",
    "Skill assessments and progress tracking",
    "Mental game coaching and course management",
    "Equipment fitting and recommendations",
  ];

  const ageGroups = [
    { age: "8-10", focus: "Fundamentals & Fun" },
    { age: "11-13", focus: "Skill Development" },
    { age: "14-18", focus: "Competition Ready" },
  ];

  return (
    <Layout>
      <SEO title="Junior Golf Development | SAF" description="Comprehensive training and mentorship for young golfers aiming at college scholarships." path="/programs/junior-golf" />
      <PageHero
        kicker="Junior Development"
        title="Junior Golf Player Development"
        subtitle="Comprehensive training programs for young golfers looking to improve their skills, build confidence, and compete at higher levels."
        imageOffset={5}
      />

      {/* Program Overview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Program Overview</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Building Tomorrow's Champions
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our Junior Golf Player Development program is designed to nurture young talent from 
                beginners to competitive players. We focus on technical skills, mental toughness, 
                and the values that golf teaches—integrity, respect, and perseverance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether your child is picking up a club for the first time or preparing for 
                tournament competition, our experienced coaches create personalized development 
                plans to help each player reach their potential.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">
                Program Benefits
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Age-Appropriate Training</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Programs for Every Level
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We tailor our instruction to meet the unique needs of each age group.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ageGroups.map((group, index) => (
              <div
                key={group.age}
                className="bg-card rounded-xl p-8 shadow-lg border border-border text-center hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-2xl font-bold text-accent">{group.age}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Ages {group.age}
                </h3>
                <p className="text-accent font-semibold mb-4">{group.focus}</p>
                <p className="text-muted-foreground text-sm">
                  Age-appropriate instruction focused on building skills and love for the game.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Contact us to learn more about enrollment and how we can help your junior golfer develop their skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Contact Us <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/programs">
              <Button variant="outline" size="lg">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JuniorGolf;
