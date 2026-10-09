import { ArrowUpRight } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import PlaybookCTA, { PLAYBOOK_URL } from "@/components/site/PlaybookCTA";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const Recruiting = () => (
  <Layout>
    <SEO
      title="College Golf Recruiting | The Student Athlete Foundation"
      description="Six simple steps to college golf recruiting, and the College Recruiting Playbook from PGACOACH."
      path="/programs/recruiting"
    />
    <PageHeader
      eyebrow="College recruiting"
      title="A clear plan for the college golf search."
      intro="JJ Wood recruited players as a college coach at Rice and Ohio State. Varsity families get recruiting guidance as part of the coaching pathway, built around six simple steps."
      image={photos.varsityCoachDiscussion}
    >
      <Button asChild size="lg">
        <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
          Explore the College Recruiting Playbook <ArrowUpRight className="h-4 w-4 ml-1" />
        </a>
      </Button>
    </PageHeader>
    <PlaybookCTA />
  </Layout>
);

export default Recruiting;
