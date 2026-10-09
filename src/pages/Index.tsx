import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import PlaybookCTA from "@/components/site/PlaybookCTA";
import PhotoGallery from "@/components/site/PhotoGallery";
import { photos, communityGallery } from "@/components/site/photos";
import { ORG } from "@/components/site/org";

const varsity = [
  "Coached group practice",
  "On-course strategy",
  "Technique and short game",
  "Tournament preparation",
  "Mental game",
  "Progress tracking",
  "College recruiting guidance",
];

const history = [
  {
    year: "2012",
    title: "First college golf combine",
    text: "SAF hosted its first college golf combine, followed by further combines and showcases where coaches from Rice, Houston Baptist, Arkansas–Little Rock and other programs watched juniors play.",
    photo: photos.combineUh,
  },
  {
    year: "2016",
    title: "Veterans programs with PGA HOPE",
    text: "A complimentary eight-week program for veterans and amputees began with the PGA of America's PGA HOPE initiative, offering adaptive instruction and community on the course.",
    photo: photos.pgaHope,
  },
  {
    year: "Past seasons",
    title: "Scholarships, equipment and free coaching",
    text: "SAF funded scholarships through the Southern Texas PGA and Beltway Junior Golf Tour, bought equipment for underfunded high-school teams, and, when funding allowed, offered summer recruiting and Varsity coaching free to many participants.",
    photo: photos.varsitySeminar,
  },
];

const Index = () => (
  <Layout>
    <SEO
      title="The Student Athlete Foundation | Need-based junior golf scholarships, Houston"
      description="SAF Golf is a Houston-area 501(c)(3) nonprofit funding need-based scholarship access to Varsity junior golf coaching and college recruiting guidance."
      path="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "NGO",
        name: ORG.brand,
        legalName: ORG.legalName,
        alternateName: ORG.short,
        taxID: ORG.ein,
        nonprofitStatus: "Nonprofit501c3",
        url: "https://safgolf.online",
        email: ORG.email,
        telephone: ORG.phone,
        areaServed: "Houston, Texas",
      }}
    />

    {/* Hero */}
    <section className="pt-20 bg-background">
      <div className="grid lg:grid-cols-[45fr_55fr] lg:min-h-[640px]">
        <div className="order-2 lg:order-1 flex items-center px-4 md:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12 py-12 lg:py-16">
          <div className="max-w-xl">
            <p className="eyebrow mb-5">Houston · 501(c)(3) nonprofit</p>
            <h1 className="font-display text-[2.6rem] md:text-6xl leading-[1.05] text-foreground">
              Give a young golfer a fair shot.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              The Student Athlete Foundation funds need-based scholarships so junior golfers can train in the
              Varsity coaching program at Golf Performance Group, Timber Creek Golf Club in Friendswood.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link to="/donate">Donate</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/programs">Explore our programs</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <img
            src={photos.varsityShortGame.src}
            alt={photos.varsityShortGame.alt}
            className="w-full h-[300px] sm:h-[420px] lg:h-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>

    {/* Access */}
    <section className="section-padding bg-background border-t border-border">
      <div className="container-custom grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">How your gift works</p>
          <h2 className="font-display text-3xl md:text-[2.6rem] leading-tight">
            The coaching exists. Access is what your gift makes possible.
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-5 text-lg text-muted-foreground leading-relaxed">
          <p>
            SAF programming and the GPG Varsity Group are one coaching pathway. Golf Performance Group delivers the
            Varsity program; SAF provides scholarship access for families who could not otherwise take part.
          </p>
          <p>
            Families apply based on financial need. Available funding and an eligibility review determine each
            award. Donations to SAF are separate from paid Golf Performance Group or PGACOACH purchases.
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 pt-4 text-base text-foreground">
            {varsity.map((v) => (
              <li key={v} className="border-b border-border py-2">{v}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-6 pt-4 text-base">
            <Link to="/scholarships" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              How scholarships work <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/apply/scholarship" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
              Apply for a scholarship <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* History */}
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-4">Our record</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">More than a decade of opening doors.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {history.map((h) => (
            <article key={h.title}>
              <img src={h.photo.src} alt={h.photo.alt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
              <p className="mt-5 eyebrow">{h.year}</p>
              <h3 className="mt-2 font-display text-xl">{h.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">{h.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-12 max-w-3xl text-muted-foreground leading-relaxed">
          Players from JJ Wood's coaching, SAF and Varsity community have won state junior and high-school
          championships and gone on to college golf, the LPGA Tour, the PGA Tour and major championships. That is
          shared program history; not every player received SAF funding, and no outcome is guaranteed. Our goal is to
          raise enough to restore wider free participation.
        </p>
      </div>
    </section>

    {/* Founder */}
    <section className="section-padding bg-background">
      <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
        <img src={photos.rice2014.src} alt={photos.rice2014.alt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-sm" />
        <div>
          <p className="eyebrow mb-4">Founder</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">College coaching experience, applied to junior golf.</h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            JJ Wood is a PGA professional who played college golf at Pepperdine and Oklahoma. He served as an
            assistant coach at Rice University, where he was on staff for the program's first Conference USA title in
            2014, and then at Ohio State.
          </p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-1 text-primary font-medium hover:underline">
            About SAF and JJ Wood <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <PlaybookCTA />

    {/* Gallery */}
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="max-w-3xl mb-10">
          <p className="eyebrow mb-4">Community</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">From the practice tee to signing day.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <img src={photos.jjVarsityCommunity.src} alt={photos.jjVarsityCommunity.alt} loading="lazy" className="w-full aspect-[16/10] object-cover rounded-sm" />
          <img src={photos.varsityCoachDiscussion.src} alt={photos.varsityCoachDiscussion.alt} loading="lazy" className="w-full aspect-[16/10] object-cover object-top rounded-sm" />
        </div>
        <PhotoGallery items={communityGallery.slice(0, 8)} caption="Players from the SAF and Varsity coaching community." />
      </div>
    </section>
  </Layout>
);

export default Index;
