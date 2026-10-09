import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const steps = [
  ["Apply", "A parent or guardian completes the online scholarship application, including financial need."],
  ["Review", "SAF reviews eligibility, need and the player's commitment to the program."],
  ["Award", "Awards depend on available funding. Recipients join the Varsity program at Golf Performance Group."],
];

const Scholarships = () => (
  <Layout>
    <SEO
      title="Scholarships | The Student Athlete Foundation"
      description="How SAF need-based scholarships give junior golfers access to Varsity coaching, and how to apply."
      path="/scholarships"
    />
    <PageHeader
      eyebrow="Scholarships"
      title="Need-based access to the Varsity program."
      intro="SAF scholarships cover access to coached Varsity training for juniors whose families could not otherwise afford it. Funding comes from donors."
      image={photos.varsityCoachDiscussion}
    >
      <Button asChild size="lg"><Link to="/apply/scholarship">Apply for a scholarship</Link></Button>
      <Button asChild size="lg" variant="outline"><Link to="/donate">Fund a scholarship</Link></Button>
    </PageHeader>

    <Section eyebrow="How it works" title="Three steps.">
      <ol className="grid md:grid-cols-3 gap-10">
        {steps.map(([t, d], i) => (
          <li key={t} className="border-t-2 border-primary pt-5">
            <span className="font-display text-3xl text-primary">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-display text-xl">{t}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-muted-foreground max-w-3xl leading-relaxed">
        Applying does not guarantee an award. Donations to SAF are separate from paid Golf Performance Group or
        PGACOACH purchases, and a donation never buys placement or an award.
      </p>
    </Section>

    <Section tone="muted" eyebrow="Our history" title="Scholarship support beyond Varsity.">
      <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
        In past seasons SAF funded scholarships through the Southern Texas PGA and the Beltway Junior Golf Tour,
        purchased equipment for underfunded high-school golf teams, and — when funding allowed — offered summer
        recruiting and Varsity coaching free to many participants. Restoring that wider free participation is our
        fundraising goal.
      </p>
    </Section>
  </Layout>
);

export default Scholarships;
