import { Target, Users, Award } from "lucide-react";

const Mission = () => {
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

  return (
    <section id="about" className="section-padding bg-muted">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">About Us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Transforming Lives Through the Power of Golf
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The Student Athlete Foundation is a 501(c)(3) non-profit organization dedicated to 
            empowering lives through the beautiful game of golf. From aspiring college athletes 
            to our nation's heroes, we're creating opportunities and changing lives.
          </p>
        </div>

        {/* Values Grid */}
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

        {/* Founder Quote */}
        <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
          <div className="relative z-10">
            <blockquote className="font-display text-2xl md:text-3xl text-white font-medium italic max-w-3xl mx-auto">
              "Every young golfer deserves the chance to pursue their dreams, and every veteran 
              deserves to find healing and community on the course."
            </blockquote>
            <div className="mt-6 text-white/80">
              — Student Athlete Foundation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
