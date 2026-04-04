import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuccessGallerySlider from "@/components/SuccessGallerySlider";

const SuccessStoriesPage = () => {
  const stories = [
    {
      name: "Annika",
      school: "University Success",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2018/07/Annika_holds_trophy.jpg",
      quote: "SAF helped me achieve my dream of playing college golf. Their guidance through the recruiting process was invaluable.",
      fullStory: "Through the Student Athlete Foundation, I received not only financial support but also mentorship that helped me navigate the complex world of college recruiting. The showcase events gave me the exposure I needed, and the staff worked tirelessly to connect me with coaches who were the right fit for my goals.",
    },
    {
      name: "Caylee Senn",
      school: "Houston Baptist University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2018/01/cayleesenn-hbu-rin.jpeg",
      quote: "Without the Student Athlete Foundation's support, I wouldn't be where I am today playing Division I golf.",
      fullStory: "The foundation believed in me when I was still developing my game. They provided resources for training, helped me improve my academic standing, and guided me through every step of the recruiting process. Today, I'm proud to represent Houston Baptist University on the golf course.",
    },
    {
      name: "Mario Carmona",
      school: "Rice University",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2014/09/MarioSigns-e1459736350341.jpg",
      quote: "The foundation provided the resources and connections I needed to earn my scholarship at Rice.",
      fullStory: "Coming from a modest background, I never thought playing golf at a prestigious university like Rice was possible. SAF opened doors I didn't know existed. They covered tournament costs, provided coaching support, and helped me build a recruiting profile that caught the attention of Rice's coaching staff.",
    },
    {
      name: "Logan Pate",
      school: "University of Arkansas",
      image: "https://www.thestudentathletefoundation.org/wp-content/uploads/2014/09/loganPateSigns.jpg",
      quote: "SAF's recruiting guidance and showcase events gave me the exposure I needed to get noticed.",
      fullStory: "The showcase events organized by SAF were game-changers for me. I was able to play in front of coaches from top programs, including Arkansas. The foundation's staff helped me prepare both mentally and physically for these opportunities, and their belief in my abilities gave me the confidence I needed to succeed.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Success Stories
          </h1>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            These are just a few of the many student-athletes who have achieved their college golf 
            dreams with the help of the Student Athlete Foundation.
          </p>
        </div>
      </section>

      {/* Student Athletes Gallery */}
      <SuccessGallerySlider
        title="SAF Student Athletes"
        subtitle="Dozens of junior golfers have gone through our programs and achieved their college dreams."
      />

      {/* Stories Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="space-y-12">
            {stories.map((story, index) => (
              <div
                key={story.name}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 bg-card rounded-xl overflow-hidden shadow-lg border border-border`}
              >
                {/* Image */}
                <div className="lg:w-1/3 h-64 lg:h-auto">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <Quote className="h-8 w-8 text-accent/30 mb-4" />
                  <blockquote className="text-xl italic text-foreground mb-4">
                    "{story.quote}"
                  </blockquote>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {story.fullStory}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {story.name}
                    </h3>
                    <p className="text-accent font-medium">{story.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Help Us Create More Success Stories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Your support directly impacts the lives of junior golfers pursuing their college dreams.
          </p>
          <Link to="/donate">
            <Button variant="hero" size="xl">
              Support a Future Athlete
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default SuccessStoriesPage;
