import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Award, CheckCircle, ArrowRight, GraduationCap, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const CollegeScholarships = () => {
  const services = [
    {
      icon: FileText,
      title: "Application Support",
      description: "Guidance through scholarship applications and required documentation.",
    },
    {
      icon: Users,
      title: "Coach Connections",
      description: "Direct introductions to college coaches and programs.",
    },
    {
      icon: GraduationCap,
      title: "Academic Advisement",
      description: "Help meeting NCAA eligibility requirements and academic standards.",
    },
  ];

  const eligibility = [
    "Demonstrated commitment to golf and academic excellence",
    "Minimum GPA requirements met",
    "Active participation in competitive golf",
    "Financial need consideration",
    "Positive character and sportsmanship",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            College Golf Scholarships
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Financial assistance and guidance for student-athletes pursuing their dreams 
            of playing college golf.
          </p>
        </div>
      </section>

      {/* Program Overview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Scholarship Program</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Making College Golf Accessible
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe that financial barriers shouldn't prevent talented golfers from 
                pursuing their college dreams. Our scholarship program provides financial 
                support and comprehensive guidance through the college recruiting process.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From creating recruiting profiles to connecting with college coaches, we're 
                with you every step of the way to help you find the right fit and secure 
                the funding you need.
              </p>
            </div>
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.title} className="bg-card rounded-xl p-6 shadow-lg border border-border flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Requirements</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Eligibility Criteria
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We consider the following factors when reviewing scholarship applications.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <ul className="space-y-4">
                {eligibility.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-5xl font-bold text-secondary mb-2">50+</div>
              <p className="text-white/80">Scholarships Awarded</p>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-secondary mb-2">$500K+</div>
              <p className="text-white/80">In Scholarship Funds</p>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-secondary mb-2">100%</div>
              <p className="text-white/80">Graduation Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Apply for a Scholarship
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Ready to take the next step toward your college golf career? Contact us to learn about the application process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Apply Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/success-stories">
              <Button variant="outline" size="lg">
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CollegeScholarships;
