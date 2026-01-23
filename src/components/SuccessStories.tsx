import { Quote } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      name: "Annika",
      school: "University Success",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2018/07/Annika_holds_trophy.jpg",
      quote: "SAF helped me achieve my dream of playing college golf. Their guidance through the recruiting process was invaluable.",
    },
    {
      name: "Caylee Senn",
      school: "Houston Baptist University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2018/01/cayleesenn-hbu-rin.jpeg",
      quote: "Without the Student Athlete Foundation's support, I wouldn't be where I am today playing Division I golf.",
    },
    {
      name: "Mario Carmona",
      school: "Rice University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2014/09/MarioSigns-e1459736350341.jpg",
      quote: "The foundation provided the resources and connections I needed to earn my scholarship at Rice.",
    },
    {
      name: "Logan Pate",
      school: "University of Arkansas",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2014/09/loganPateSigns.jpg",
      quote: "SAF's recruiting guidance and showcase events gave me the exposure I needed to get noticed.",
    },
  ];

  return (
    <section id="success" className="section-padding bg-muted">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-semibold uppercase tracking-wider text-sm">Success Stories</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Dreams Realized
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            These are just a few of the many student-athletes who have achieved their college golf 
            dreams with the help of the Student Athlete Foundation.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, index) => (
            <div
              key={story.name}
              className="bg-card rounded-xl overflow-hidden shadow-lg card-hover group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-display text-lg font-bold">{story.name}</h3>
                  <p className="text-white/80 text-sm">{story.school}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 relative">
                <Quote className="h-6 w-6 text-accent/30 absolute top-4 right-4" />
                <p className="text-muted-foreground text-sm italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg mb-2">
            Help us create more success stories.
          </p>
          <a href="#donate" className="text-accent font-semibold hover:underline">
            Support a future college athlete →
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
