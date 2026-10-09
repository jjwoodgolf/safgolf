import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const Events = () => (
  <Layout>
    <SEO
      title="Showcases & Events | The Student Athlete Foundation"
      description="SAF has hosted college golf combines and showcases since 2012, with college coaches from Rice, Houston Baptist, Arkansas-Little Rock and others."
      path="/events"
    />
    <PageHeader
      eyebrow="Showcases & events"
      title="Putting junior golfers in front of college coaches."
      intro="SAF held its first college golf combine in 2012 and has hosted multiple combines and showcases since."
      image={photos.combine2014}
    />
    <Section eyebrow="History" title="Combines and showcases.">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
          <p>
            At SAF combines and showcases, juniors played and trained while college coaches watched and spoke with
            players and parents. Coaches from Rice, Houston Baptist, Arkansas–Little Rock and other programs took part
            in past events. One example: a combine on January 6, 2014 at Pecan Grove Plantation Country Club combined
            college coach evaluations, a recruiting presentation and an 18-hole event.
          </p>
          <p className="text-base">
            These were historical participants, not current partner endorsements. Upcoming events will be listed here
            when dates are confirmed.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline"><Link to="/contact">Ask about future events</Link></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={photos.combineUh.src} alt={photos.combineUh.alt} loading="lazy" className="col-span-2 w-full aspect-[16/7] object-cover rounded-sm" />
          <img src={photos.combineHbu.src} alt={photos.combineHbu.alt} loading="lazy" className="w-full aspect-square object-cover rounded-sm" />
          <img src={photos.varsitySeminar.src} alt={photos.varsitySeminar.alt} loading="lazy" className="w-full aspect-square object-cover rounded-sm" />
        </div>
      </div>
    </Section>
  </Layout>
);

export default Events;
