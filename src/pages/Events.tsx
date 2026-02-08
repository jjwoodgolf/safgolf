import Layout from "@/components/Layout";
import { Calendar, Users, GraduationCap, Trophy, Gift, Award, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Events = () => {
  const events = [
    {
      icon: Users,
      title: "8-Week Program for Military Vets and Amputees",
      description: "Complimentary golf instruction program designed to provide rehabilitation, community, and healing for our nation's veterans.",
    },
    {
      icon: GraduationCap,
      title: "College Golf Combines",
      description: "Competitive showcase events connecting junior golfers with college coaches for recruiting opportunities.",
    },
    {
      icon: Award,
      title: "College Golf Day at University of Houston",
      description: "Exclusive practice facility access with UH Coaches, providing hands-on training and recruiting insights.",
    },
    {
      icon: Trophy,
      title: "Houston Open Experience",
      description: "Provided 30 junior golfers tickets to the Houston Open to meet PGA Tour professional Cameron Tringale and participate in Q&A.",
    },
    {
      icon: Calendar,
      title: "SAF Golf Fundraisers",
      description: "Annual fundraising events that support our programs and create networking opportunities for sponsors and participants.",
    },
    {
      icon: Gift,
      title: "College Scholarships Funded",
      description: "Funded 5 college scholarships to junior golfers through South Texas PGA and Beltway Tour partnerships.",
    },
    {
      icon: Briefcase,
      title: "Equipment Support for Inner City Golf Team",
      description: "Purchased golf bags for inner city high school golf team, ensuring students have the equipment needed to compete.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Our Events
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            From veteran programs to college combines, discover the impactful events 
            that make a difference in the lives of golfers across our community.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={event.title}
                className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <event.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  {event.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
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
            Get Involved
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Want to participate in our events or support our mission? Contact us to learn more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" size="lg">
                Support Our Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
