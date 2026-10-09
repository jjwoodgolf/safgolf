import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import PlaybookCTA from "@/components/site/PlaybookCTA";
import { Button } from "@/components/ui/button";
import { photos } from "@/components/site/photos";

const programs = [
  { title: "Junior golf / Varsity", href: "/junior-golf", photo: photos.varsityPractice, text: "Coached group practice, tournament preparation and progress tracking at Golf Performance Group." },
  { title: "Scholarships", href: "/scholarships", photo: photos.varsitySeminar, text: "Need-based awards that give junior families access to the Varsity program." },
  { title: "College recruiting", href: "/programs/recruiting", photo: photos.varsityCoachDiscussion, text: "Guidance for players and parents on finding the right college fit." },
  { title: "Veterans (PGA HOPE)", href: "/veterans", photo: photos.pgaHope, text: "Our history of free golf programs for veterans through PGA HOPE." },
  { title: "Showcases & events", href: "/events", photo: photos.combine2014, text: "College golf combines and showcases held since 2012." },
];

const ProgramsPage = () => (
  <Layout>
    <SEO
      title="Programs | The Student Athlete Foundation"
      description="Junior golf coaching, need-based scholarships, college recruiting guidance, veterans golf history and showcases from SAF Golf in Houston."
      path="/programs"
    />
    <PageHeader
      eyebrow="Programs"
      title="Coaching, access and a path to college."
      intro="Everything SAF does supports one pathway: serious coaching for junior golfers, with scholarships so financial need does not decide who takes part."
    >
      <Button asChild size="lg"><Link to="/donate">Donate</Link></Button>
      <Button asChild size="lg" variant="outline"><Link to="/apply/scholarship">Apply for a scholarship</Link></Button>
    </PageHeader>
    <Section>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs.map((p) => (
          <Link key={p.href} to={p.href} className="group block">
            <img src={p.photo.src} alt={p.photo.alt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
            <h2 className="mt-5 font-display text-2xl group-hover:text-primary transition-colors">{p.title}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{p.text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-medium">
              Learn more <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
    <PlaybookCTA compact />
  </Layout>
);

export default ProgramsPage;
