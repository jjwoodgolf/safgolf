import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const uses = [
  ["Scholarship access", "Need-based awards for juniors to join Varsity coaching."],
  ["Equipment", "Clubs and gear for players and underfunded high-school teams."],
  ["Recruiting and showcases", "Opportunities for juniors to be seen by college coaches."],
];

const SponsorsPage = () => (
  <Layout>
    <SEO
      title="Sponsors & Partners | The Student Athlete Foundation"
      description="Partner with The Student Athlete Foundation to fund need-based junior golf scholarships in the Houston area."
      path="/sponsors"
    />
    <PageHeader
      eyebrow="Sponsors & partners"
      title="Partner with a foundation that puts funds to work on the range."
      intro="Businesses and families can underwrite scholarships, equipment and showcase opportunities. We tailor each partnership through a conversation, not a price list."
      image={photos.varsityWinterRange}
    >
      <Button asChild size="lg"><Link to="/contact">Start a conversation</Link></Button>
      <Button asChild size="lg" variant="outline"><Link to="/donate">Give online</Link></Button>
    </PageHeader>
    <Section eyebrow="Where support goes" title="What sponsorship funds.">
      <div className="grid md:grid-cols-3 gap-10">
        {uses.map(([t, d]) => (
          <div key={t} className="border-t-2 border-primary pt-5">
            <h3 className="font-display text-xl">{t}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  </Layout>
);

export default SponsorsPage;
