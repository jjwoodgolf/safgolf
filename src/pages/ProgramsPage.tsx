import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Award, Calendar, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProgramsPage = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Junior Golf Player Development",
      description: "Comprehensive training programs for young golfers looking to improve their skills and compete at higher levels. Our development program focuses on technique, mental game, and tournament preparation.",
      link: "/programs/junior-golf",
      features: ["Professional coaching", "Practice facilities access", "Tournament scheduling", "Skill assessments"],
    },
    {
      icon: Award,
      title: "College Golf Scholarships",
      description: "Financial assistance and guidance for student-athletes pursuing college golf scholarships. We help navigate the recruiting process and connect athletes with college coaches.",
      link: "/programs/college-scholarships",
      features: ["Scholarship guidance", "College coach connections", "Academic advisement", "Application support"],
    },
    {
      icon: Users,
      title: "Veterans Golf Program",
      description: "Complimentary 8-week golf programs for military veterans, including amputees, in partnership with the PGA of America. Golf provides rehabilitation, community, and healing.",
      link: "/programs/veterans",
      features: ["Free instruction", "Equipment provided", "Peer support groups", "PGA partnership"],
    },
    {
      icon: Calendar,
      title: "Golf Showcase Events",
      description: "Competitive events designed to give junior golfers exposure to college coaches and scouts. Showcase your skills in a professional tournament environment.",
      link: "/programs/showcase-events",
      features: ["College Golf Combine", "College Recruiting Workshop, Q&A With College Coaches", "Video highlights", "Networking opportunities"],
    },
    {
      icon: UserCheck,
      title: "Recruiting Services",
      description: "Personalized recruiting assistance to help student-athletes navigate the complex college golf recruiting landscape and find the right fit.",
      link: "/programs/recruiting",
      features: ["Profile development", "Coach outreach", "Campus visit coordination", "Offer evaluation"],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Our Programs
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Comprehensive programs designed to support junior golfers on their journey to college 
            and provide healing opportunities for our nation's veterans.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid gap-8">
            {programs.map((program, index) => (
              <div
                key={program.title}
                className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                        <program.icon className="h-7 w-7 text-accent" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        {program.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>
                    <Link to={program.link}>
                      <Button variant="accent">
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="lg:w-72">
                    <h4 className="font-semibold text-foreground mb-3">Program Features:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
            Contact us to learn more about our programs and how we can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" size="lg">
                Support Our Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramsPage;
