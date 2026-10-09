import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import PlaybookCTA from "@/components/site/PlaybookCTA";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";
import { ORG } from "@/components/site/org";

const offering = [
  ["Coached group practice", "Structured sessions with coaches and a peer group that pushes each player."],
  ["On-course strategy", "Course management and decision-making under tournament conditions."],
  ["Technique and short game", "Full-swing fundamentals with deliberate short-game and putting work."],
  ["Tournament preparation", "Planning, routines and preparation for junior and high-school events."],
  ["Mental game", "Focus, resilience and process habits that hold up under pressure."],
  ["Progress tracking", "Measured goals so players and parents can see improvement."],
  ["College recruiting guidance", "Help understanding the recruiting process and finding the right fit."],
];

const JuniorGolfDevelopment = () => (
  <Layout>
    <SEO
      title="Junior Golf & Varsity Program | The Student Athlete Foundation"
      description="The Varsity junior golf program at Golf Performance Group, Timber Creek GC in Friendswood, with need-based scholarship access through SAF."
      path="/junior-golf"
    />
    <PageHeader
      eyebrow="Junior golf / Varsity"
      title="Serious coaching for committed junior golfers."
      intro={`The Varsity program is delivered at ${ORG.venue}. SAF scholarships give families with financial need access to the same coaching.`}
      image={photos.varsityPractice}
    >
      <Button asChild size="lg"><Link to="/apply/scholarship">Apply for a scholarship</Link></Button>
      <Button asChild size="lg" variant="outline"><Link to="/apply/junior-golf">Junior golf inquiry</Link></Button>
    </PageHeader>

    <Section eyebrow="The program" title="What Varsity players work on.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden">
        {offering.map(([t, d]) => (
          <div key={t} className="bg-background p-6">
            <h3 className="font-semibold font-body text-foreground">{t}</h3>
            <p className="mt-2 text-muted-foreground text-[15px] leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground max-w-3xl">
        Current schedules and enrollment for paid Varsity membership are handled by Golf Performance Group. Paid GPG or
        PGACOACH purchases are separate from donations to SAF.
      </p>
    </Section>

    <Section tone="muted">
      <div className="grid md:grid-cols-3 gap-3">
        {[photos.varsityFitness, photos.varsitySeminar, photos.varsityWinterRange].map((p) => (
          <img key={p.alt} src={p.src} alt={p.alt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
        ))}
      </div>
    </Section>

    <PlaybookCTA />
  </Layout>
);

export default JuniorGolfDevelopment;
