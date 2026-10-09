import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const VeteransProgram = () => (
  <Layout>
    <SEO
      title="Veterans Golf (PGA HOPE) | The Student Athlete Foundation"
      description="SAF's history of free golf programs for military veterans and amputees through the PGA of America's PGA HOPE initiative."
      path="/veterans"
    />
    <PageHeader
      eyebrow="Veterans · PGA HOPE"
      title="Golf, community and adaptive instruction for veterans."
      intro="Beginning in 2016, SAF offered a complimentary eight-week program for veterans and amputees with the PGA of America's PGA HOPE initiative."
      image={photos.pgaHope}
    >
      <Button asChild size="lg" variant="outline"><Link to="/apply/veterans">Veterans interest form</Link></Button>
    </PageHeader>

    <Section eyebrow="What the program offered" title="Connection on the course.">
      <div className="grid md:grid-cols-3 gap-10 text-muted-foreground leading-relaxed">
        <div><h3 className="font-display text-xl text-foreground">Adaptive instruction</h3><p className="mt-2">PGA professionals adapted fundamentals for each participant's needs.</p></div>
        <div><h3 className="font-display text-xl text-foreground">Community</h3><p className="mt-2">Weekly sessions brought veterans together with peers and instructors.</p></div>
        <div><h3 className="font-display text-xl text-foreground">No cost</h3><p className="mt-2">Programs were offered free to military and veteran participants.</p></div>
      </div>
      <p className="mt-10 text-sm text-muted-foreground max-w-3xl">
        Future veterans program dates will be announced when confirmed. Use the interest form to be contacted.
      </p>
    </Section>

    <Section tone="muted">
      <div className="aspect-video w-full max-w-4xl">
        <iframe
          className="w-full h-full rounded-sm"
          src="https://www.youtube.com/embed/RkiURQXDk68"
          title="PGA HOPE veterans golf"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Section>
  </Layout>
);

export default VeteransProgram;
