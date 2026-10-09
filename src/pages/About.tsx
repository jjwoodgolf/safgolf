import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import { photos } from "@/components/site/photos";
import { ORG } from "@/components/site/org";

const About = () => (
  <Layout>
    <SEO
      title="About | The Student Athlete Foundation"
      description="The Student Athlete Foundation is a Houston-area 501(c)(3) nonprofit founded by PGA professional and former college coach JJ Wood."
      path="/about"
    />
    <PageHeader
      eyebrow="About"
      title="A Houston golf foundation built around access."
      intro="The Student Athlete Foundation (SAF Golf) helps junior golfers from families with financial need reach serious coaching, competition and college guidance."
      image={photos.jjVarsityCommunity}
    />

    <Section eyebrow="What we do" title="One coaching pathway, funded by donors.">
      <div className="grid md:grid-cols-2 gap-10 text-lg text-muted-foreground leading-relaxed">
        <p>
          SAF programming and the GPG Varsity Group are one pathway. The Varsity program is delivered at
          {" "}{ORG.venue}. SAF provides need-based scholarship access so cost is not the reason a capable junior
          stays on the sidelines.
        </p>
        <p>
          Over the years SAF has also funded scholarships through the Southern Texas PGA and Beltway Junior Golf Tour,
          bought equipment for underfunded high-school teams, hosted college golf combines and showcases since 2012,
          and supported free veterans programs through PGA HOPE.
        </p>
      </div>
    </Section>

    <Section tone="muted" eyebrow="Founder" title="JJ Wood">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
          <p>
            JJ Wood is a PGA professional who played college golf at Pepperdine and Oklahoma. He joined Rice
            University as an assistant coach in January 2014 and was part of the staff for Rice's first Conference USA
            men's golf title that year. In August 2014 he was hired as an assistant coach at Ohio State.
          </p>
          <p>
            Today he leads junior coaching at Golf Performance Group in Friendswood, bringing what he learned
            recruiting and coaching college players to the families SAF serves.
          </p>
        </div>
        <img src={photos.rice2014.src} alt={photos.rice2014.alt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
      </div>
    </Section>

    <Section eyebrow="Governance" title="Nonprofit status">
      <dl className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden">
        {[
          ["Legal name", ORG.legalName],
          ["Status", "501(c)(3) nonprofit"],
          ["EIN", ORG.ein],
        ].map(([k, v]) => (
          <div key={k} className="bg-background p-6">
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-sm text-muted-foreground max-w-3xl">
        Donations are tax-deductible to the extent allowed by law. Please consult your tax advisor.
      </p>
    </Section>
  </Layout>
);

export default About;
