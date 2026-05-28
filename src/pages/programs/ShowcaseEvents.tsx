import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle, ArrowRight, Camera, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShowcaseEvents = () => {
  const eventFeatures = [
    {
      icon: Users,
      title: "College Coach Attendance",
      description: "Coaches from universities across the country attend our events to scout talent.",
    },
    {
      icon: Trophy,
      title: "Professional Format",
      description: "Tournament-style events with professional scoring and officiating.",
    },
    {
      icon: Camera,
      title: "Video Highlights",
      description: "Professional video coverage to add to your recruiting portfolio.",
    },
  ];

  const upcomingEvents = [
    {
      name: "Spring Showcase Classic",
      date: "March 2025",
      location: "Houston, TX",
      description: "Kick off the season with our premier spring event.",
    },
    {
      name: "Summer Championship",
      date: "June 2025",
      location: "Houston, TX",
      description: "The main event of our showcase season.",
    },
    {
      name: "Fall Invitational",
      date: "October 2025",
      location: "Houston, TX",
      description: "Final showcase of the year for college-bound seniors.",
    },
  ];

  return (
    <Layout>
      <SEO title="Golf Showcase Events | SAF" description="Competitive showcase events giving junior golfers direct exposure to college coaches and scouts." path="/programs/showcase-events" />
            {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Golf Showcase Events
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Competitive events designed to give junior golfers maximum exposure to 
            college coaches and scouts.
          </p>
        </div>
      </section>

      {/* Program Overview */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Get Noticed</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
                Your Stage to Shine
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our showcase events are specifically designed to put talented junior golfers 
                in front of college coaches. These aren't just tournaments—they're recruiting 
                opportunities that can change your future.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We invite coaches from Division I, II, III, and NAIA programs to watch 
                players compete in a professional tournament environment. With proper scoring, 
                video coverage, and networking opportunities, our showcases give you the 
                exposure you need to get recruited.
              </p>
            </div>
            <div className="space-y-6">
              {eventFeatures.map((feature) => (
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

      {/* Upcoming Events */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">Mark Your Calendar</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Register early to secure your spot in our showcase events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div
                key={event.name}
                className="bg-card rounded-xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-accent font-semibold mb-2">{event.date}</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {event.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{event.location}</p>
                <p className="text-muted-foreground mb-6">{event.description}</p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Register Interest
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold uppercase tracking-wider text-sm">Be Prepared</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                What to Expect
              </h2>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <ul className="space-y-4">
                {[
                  "36-hole tournament format over two days",
                  "Professional scoring and leaderboards",
                  "Meet-and-greet sessions with college coaches",
                  "Skills challenges and assessment stations",
                  "Professional photography and video",
                  "Post-event player evaluations",
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
            Ready to Compete?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Contact us to learn about upcoming showcase events and how to register.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact">
              <Button variant="accent" size="lg">
                Register Now <ArrowRight className="h-4 w-4 ml-2" />
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

export default ShowcaseEvents;
