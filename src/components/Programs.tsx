import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, ArrowRight } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "College Golf Scholarships",
      subtitle: "For Junior Golfers",
      description: "We provide comprehensive support to help talented junior golfers navigate the college recruiting process and secure athletic scholarships.",
      features: [
        "College recruiting guidance and assessment",
        "Financial assistance for tournaments",
        "Academic advisement services",
        "Golf showcase events and exposure",
        "Recruiting profile development",
      ],
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070",
      cta: "Learn About Scholarships",
    },
    {
      icon: Shield,
      title: "Veterans Golf Program",
      subtitle: "For Military Heroes",
      description: "An 8-week complimentary golf program designed to provide rehabilitation, community, and joy for military veterans and amputees.",
      features: [
        "Free 8-week structured program",
        "PGA of America partnership",
        "Professional instruction",
        "Adaptive golf techniques",
        "Veteran community building",
      ],
      image: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=2069",
      cta: "Support Our Veterans",
    },
  ];

  return (
    <section id="programs" className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">Our Programs</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Two Missions, One Foundation
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your support enables us to run programs that create lasting impact in the lives 
            of aspiring college athletes and military veterans alike.
          </p>
        </div>

        {/* Programs */}
        <div className="space-y-16">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 text-white">
                      <program.icon className="h-8 w-8" />
                      <span className="font-display text-xl font-semibold">{program.subtitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <h3 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  {program.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="accent" size="lg">
                  {program.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
