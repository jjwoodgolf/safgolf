import { Button } from "@/components/ui/button";
import { Heart, GraduationCap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070')`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 animate-fade-in">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-medium">501(c)(3) Non-Profit Organization</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Empowering Lives
            <span className="block text-secondary">Through Golf</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Helping junior golfers achieve their college scholarship dreams while providing 
            transformative golf programs for our military veterans and amputees.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <Heart className="h-5 w-5" />
              Donate Today
            </Button>
            <Button variant="heroOutline" size="xl" className="min-w-[200px]">
              Learn More
            </Button>
          </div>
          
          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">50+</div>
              <div className="text-sm text-white/70 mt-1">College Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">100+</div>
              <div className="text-sm text-white/70 mt-1">Veterans Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">10+</div>
              <div className="text-sm text-white/70 mt-1">Years of Impact</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
