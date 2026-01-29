import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Users, CheckCircle, ArrowRight, Heart, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Veterans = () => {
  const programFeatures = [
    {
      icon: Heart,
      title: "Healing Through Golf",
      description: "Golf provides a therapeutic outlet for veterans dealing with physical and mental health challenges.",
    },
    {
      icon: Shield,
      title: "PGA Partnership",
      description: "Our program is developed in partnership with the PGA of America's HOPE program.",
    },
    {
      icon: Award,
      title: "Inclusive Environment",
      description: "All skill levels welcome, including veterans with disabilities and amputees.",
    },
  ];

  const programIncludes = [
    "8 weeks of professional golf instruction",
    "All equipment provided at no cost",
    "Transportation assistance when needed",
    "Peer support and camaraderie",
    "Access to practice facilities",
    "Post-program playing opportunities",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
                Veterans Golf Program
              </h1>
              <p className="text-white/80 text-xl max-w-xl mx-auto lg:mx-0">
                Complimentary golf programs for military veterans, providing healing, 
                community, and a new passion through the game of golf.
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/RkiURQXDk68"
                title="Veterans Golf Program"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">For Our Heroes</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Serving Those Who Served
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                In partnership with the PGA of America's HOPE (Helping Our Patriots Everywhere) 
                program, we offer complimentary 8-week golf instruction programs for military 
                veterans of all skill levels.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Golf offers unique benefits for veterans—the focus required helps quiet the mind, 
                the social environment builds community, and the physical activity supports overall 
                wellness. Our program is specifically designed to be inclusive of veterans with 
                disabilities, including amputees.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Everything is provided at no cost, including professional instruction, equipment, 
                and facility access. Our goal is to remove all barriers so veterans can experience 
                the healing power of golf.
              </p>
            </div>
            <div className="space-y-6">
              {programFeatures.map((feature) => (
                <div key={feature.title} className="bg-card rounded-xl p-6 shadow-lg border border-border flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Program Details</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                What's Included
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Everything you need to start your golf journey is provided at absolutely no cost.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <ul className="grid md:grid-cols-2 gap-4">
                {programIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <blockquote className="font-display text-2xl md:text-3xl font-medium italic max-w-3xl mx-auto">
            "Golf gave me something to focus on besides my pain. The camaraderie with fellow 
            veterans and the patience of the instructors made all the difference."
          </blockquote>
          <div className="mt-6 text-white/80">
            — Program Participant, U.S. Army Veteran
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Enroll in Our Veterans Program
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            If you're a veteran interested in learning golf or returning to the game, contact us to join our next session.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Sign Up Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" size="lg">
                Support This Program
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Veterans;
