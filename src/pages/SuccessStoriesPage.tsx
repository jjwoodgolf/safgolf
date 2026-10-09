import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import PhotoGallery from "@/components/site/PhotoGallery";
import { photos, communityGallery } from "@/components/site/photos";
import { ArrowUpRight } from "lucide-react";
import marioImg from "@/assets/alumni/mario-carmona-signing.jpg";
import annikaImg from "@/assets/alumni/annika-clark-trophy.jpg";

const spotlights = [
  {
    name: "Mario Carmona",
    img: marioImg,
    alt: "Mario Carmona signing with Rice University",
    position: "object-center",
    early: "Houston junior champion who committed to play college golf at Rice University.",
    milestones: [
      "Played collegiately at Rice University.",
      "Qualified for the 2021 U.S. Open, the 121st playing of the championship.",
    ],
    link: {
      href: "https://riceowls.com/news/2021/5/25/mens-golf-former-golfer-mario-carmona-qualifies-for-121st-us-open",
      label: "Read the Rice Athletics story",
    },
  },
  {
    name: "Annika Clark",
    img: annikaImg,
    alt: "Annika Clark holding a championship trophy",
    position: "object-[60%_center]",
    early: "Texas State Girls Junior champion who committed to play college golf at TCU.",
    milestones: [
      "Won TAPPS 2A state titles in 2013 and 2014 and qualified for the LPGA North Texas Shootout as a junior.",
      "Played collegiately at TCU and qualified for the 2018 LPGA Volunteers of America Texas Classic.",
    ],
    link: {
      href: "https://gofrogs.com/news/2014/11/13/TCU_Women_s_Golf_Announces_Four_Signings",
      label: "Read the TCU Athletics story",
    },
  },
];

const SuccessStoriesPage = () => (
  <Layout>
    <SEO
      title="Success Stories | The Student Athlete Foundation"
      description="Players from the SAF and Varsity coaching community have won state championships and progressed to college golf and professional events."
      path="/success-stories"
    />
    <PageHeader
      eyebrow="Success stories"
      title="A community that has produced champions."
      intro="Players in JJ Wood's coaching, SAF and Varsity community have won state junior and high-school championships and progressed to college golf, the LPGA Tour, the PGA Tour and major championships."
      image={photos.jjVarsityCommunity}
    />
    <Section>
      <div className="max-w-3xl mb-12">
        <p className="eyebrow mb-4">Alumni spotlights</p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight">
          A few of the golfers featured in SAF's early program history—and the milestones that followed.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        {spotlights.map((s) => (
          <article key={s.name} className="border border-border rounded-sm overflow-hidden bg-card">
            <img
              src={s.img}
              alt={s.alt}
              loading="lazy"
              width={640}
              height={360}
              className={`w-full aspect-[16/9] object-cover ${s.position}`}
            />
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl mb-3">{s.name}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{s.early}</p>
              <ul className="space-y-2 mb-6">
                {s.milestones.map((m) => (
                  <li key={m} className="flex gap-3 leading-relaxed">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <a
                href={s.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline underline-offset-4"
              >
                {s.link.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
    <Section>
      <PhotoGallery items={communityGallery} caption="Players from the SAF and Varsity coaching community." />
      <p className="mt-10 text-muted-foreground max-w-3xl leading-relaxed">
        These results reflect shared coaching and program history. Not every player featured received SAF funding, and
        no program can guarantee competitive or recruiting outcomes.
      </p>
    </Section>
  </Layout>
);

export default SuccessStoriesPage;
