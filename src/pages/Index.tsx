import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Users, Award, GraduationCap, Heart, Calendar, UserCheck, Quote, ArrowRight } from "lucide-react";
import mediaLogos from "@/assets/media-logos.png";

const Index = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide financial assistance, academic advisement, and exposure opportunities for junior golfers pursuing college scholarships.",
    },
    {
      icon: Users,
      title: "Who We Serve",
      description: "Local student-athletes with dreams of playing college golf, and military veterans seeking rehabilitation through the game.",
    },
    {
      icon: Award,
      title: "Our Impact",
      description: "Helping dozens of athletes earn college scholarships and providing complimentary golf programs for veterans.",
    },
  ];

  const programs = [
    {
      icon: GraduationCap,
      title: "Junior Golf Development",
      description: "Comprehensive training for young golfers looking to improve their skills.",
      link: "/programs/junior-golf",
    },
    {
      icon: Award,
      title: "College Scholarships",
      description: "Financial assistance and guidance for college-bound student-athletes.",
      link: "/programs/college-scholarships",
    },
    {
      icon: Heart,
      title: "Veterans Program",
      description: "Complimentary golf programs for military veterans in partnership with PGA.",
      link: "/programs/veterans",
    },
    {
      icon: Calendar,
      title: "Showcase Events",
      description: "Competitive events to get exposure to college coaches and scouts.",
      link: "/programs/showcase-events",
    },
  ];

  const featuredStories = [
    {
      name: "Mario Carmona",
      school: "Rice University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2014/09/MarioSigns-e1459736350341.jpg",
      quote: "The foundation provided the resources and connections I needed to earn my scholarship at Rice.",
    },
    {
      name: "Caylee Senn",
      school: "Houston Baptist University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2018/01/cayleesenn-hbu-rin.jpeg",
      quote: "Without SAF's support, I wouldn't be where I am today playing Division I golf.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        
        {/* Media Logos Banner */}
        <section className="bg-white py-8">
          <div className="px-[100px]">
            <p className="text-[10px] text-muted-foreground text-center mb-4 lowercase">
              golf programs have been featured on...
            </p>
            <img 
              src={mediaLogos} 
              alt="As featured in CBS, Fox Sports, ESPN Radio, KHOU 11, NewsFix CW39, NBC, Golf" 
              className="w-full h-auto object-contain"
              style={{ 
                filter: 'grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(300%) brightness(0.4)'
              }}
            />
          </div>
        </section>
        
        {/* Mission Preview Section */}
        <section className="section-padding bg-muted">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">About Us</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Transforming Lives Through Golf
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The Student Athlete Foundation is a 501(c)(3) non-profit organization dedicated to 
                empowering lives through the beautiful game of golf.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
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

            <div className="text-center">
              <Link to="/about">
                <Button variant="accent" size="lg">
                  Learn More About Us <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Programs Preview Section */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">What We Offer</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Our Programs
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Comprehensive programs designed to support junior golfers and veterans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {programs.map((program, index) => (
                <Link
                  key={program.title}
                  to={program.link}
                  className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <program.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {program.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link to="/programs">
                <Button variant="outline" size="lg">
                  View All Programs <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories Preview */}
        <section className="section-padding bg-muted">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Success Stories</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Dreams Realized
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Meet some of the student-athletes who achieved their college golf dreams with our help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {featuredStories.map((story, index) => (
                <div
                  key={story.name}
                  className="bg-card rounded-xl overflow-hidden shadow-lg border border-border flex flex-col md:flex-row"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <Quote className="h-6 w-6 text-accent/30 mb-3" />
                    <p className="text-muted-foreground italic mb-4">
                      "{story.quote}"
                    </p>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {story.name}
                      </h3>
                      <p className="text-accent text-sm">{story.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/success-stories">
                <Button variant="accent" size="lg">
                  Read More Stories <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Donate CTA Section */}
        <section className="section-padding bg-cream">
          <div className="container-custom text-center">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Support Our Mission</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Help Us Change Lives
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Your tax-deductible donation directly supports junior golfers pursuing college dreams 
              and veterans finding healing through golf.
            </p>
            <Link to="/donate">
              <Button variant="hero" size="xl">
                <Heart className="h-5 w-5" />
                Donate Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
