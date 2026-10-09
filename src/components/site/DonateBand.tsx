import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Bottom-of-page donation call to action shown on public pages. */
const DonateBand = () => (
  <section className="bg-charcoal text-charcoal-foreground">
    <div className="container-custom px-4 md:px-8 py-16 md:py-20 grid md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-8">
        <p className="eyebrow-light mb-4">Support the scholarship fund</p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight">
          The coaching exists. Access is what your gift makes possible.
        </h2>
        <p className="mt-4 text-charcoal-foreground/80 max-w-2xl leading-relaxed">
          Gifts to The Student Athlete Foundation fund need-based scholarships so more junior golfers can join
          coached practice, tournament preparation and college guidance.
        </p>
      </div>
      <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
        <Button asChild size="lg" className="min-w-[200px]">
          <Link to="/donate">Donate</Link>
        </Button>
        <Button asChild size="lg" variant="outlineLight" className="min-w-[200px]">
          <Link to="/scholarships">How scholarships work</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default DonateBand;
