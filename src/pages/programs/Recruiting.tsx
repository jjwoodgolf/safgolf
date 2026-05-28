import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { UserCheck, CheckCircle, ArrowRight, FileText, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const Recruiting = () => {
  const services = [
    {
      icon: FileText,
      title: "Profile Development",
      description: "Create a compelling recruiting profile that showcases your skills, academics, and achievements.",
    },
    {
      icon: Mail,
      title: "Coach Outreach",
      description: "Strategic communication with college coaches at programs that match your goals.",
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Professional swing videos and tournament highlight reels for your recruiting package.",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Initial Assessment",
      description: "We evaluate your golf skills, academic standing, and college preferences to create a personalized plan.",
    },
    {
      step: "2",
      title: "Profile Building",
      description: "Develop your recruiting profile including videos, statistics, and academic information.",
    },
    {
      step: "3",
      title: "School Research",
      description: "Identify colleges that match your athletic ability, academic goals, and personal preferences.",
    },
    {
      step: "4",
      title: "Coach Contact",
      description: "Strategic outreach to coaches with personalized communication and follow-ups.",
    },
    {
      step: "5",
      title: "Campus Visits",
      description: "Coordinate official and unofficial visits to help you find the right fit.",
    },
    {
      step: "6",
      title: "Offer Evaluation",
      description: "Help you understand and evaluate scholarship offers to make the best decision.",
    },
  ];

  return (
    <Layout>
      <SEO title="College Recruiting Services | SAF" description="Recruiting support: profile building, video, coach outreach, and application guidance." path="/programs/recruiting" />
            {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Recruiting Services
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Personalized guidance to navigate the complex college golf recruiting landscape 
            and find your perfect fit.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Services</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Comprehensive Recruiting Support
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We provide end-to-end support to help you navigate every step of the college recruiting process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-card rounded-xl p-8 shadow-lg border border-border text-center hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">How It Works</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Our Recruiting Process
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A proven step-by-step approach to help you achieve your college golf goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((item, index) => (
              <div
                key={item.step}
                className="bg-card rounded-xl p-6 shadow-lg border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-lg font-bold text-white">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Advantage</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Why Work With Us
              </h2>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <ul className="space-y-4">
                {[
                  "Extensive network of college coaching connections",
                  "Proven track record of successful placements",
                  "Personalized attention tailored to your goals",
                  "Guidance on NCAA eligibility requirements",
                  "Support for all division levels (I, II, III, NAIA, JUCO)",
                  "Honest assessments and realistic expectations",
                ].map((item) => (
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

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Start Your Recruiting Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Contact us for a free initial consultation to discuss your college golf goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/success-stories">
              <Button variant="outline" size="lg">
                View Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Recruiting;
