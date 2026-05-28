import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Target, Users, Award, Heart, Trophy, Star } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide financial assistance, academic advisement, and exposure opportunities for junior golfers pursuing college scholarships, while offering healing golf experiences for veterans.",
    },
    {
      icon: Users,
      title: "Who We Serve",
      description: "Local student-athletes with dreams of playing college golf, and military veterans including amputees seeking rehabilitation and community through the game.",
    },
    {
      icon: Award,
      title: "Our Impact",
      description: "Since our founding, we've helped dozens of athletes earn college scholarships and provided complimentary 8-week golf programs for veterans in partnership with the PGA of America.",
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in supporting every individual's journey with care and understanding.",
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our programs to our partnerships.",
    },
    {
      icon: Star,
      title: "Integrity",
      description: "We operate with transparency and honesty in all our interactions and operations.",
    },
  ];

  return (
    <Layout>
      <SEO title="About Us | Student Athlete Foundation" description="Learn about SAF's mission to fund junior golf scholarships and support military veterans through golf in Houston, TX." path="/about" />
            {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            The Student Athlete Foundation is a 501(c)(3) non-profit organization dedicated to 
            empowering lives through the beautiful game of golf.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Foundation</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Transforming Lives Through the Power of Golf
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From aspiring college athletes to our nation's heroes, we're creating 
              opportunities and changing lives one swing at a time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-card rounded-xl p-8 shadow-lg card-hover border border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">What We Believe</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center relative">
            <blockquote className="font-display text-2xl md:text-3xl text-white font-medium italic max-w-3xl mx-auto">
              "Every young golfer deserves the chance to pursue their dreams, and every veteran 
              deserves to find healing and community on the course."
            </blockquote>
            <div className="mt-6 text-white/80">
              — Student Athlete Foundation
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
