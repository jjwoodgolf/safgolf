import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import DonationCard from "@/components/DonationCard";
import { ORG } from "@/components/site/org";
import { photos } from "@/components/site/photos";

const DonatePage = () => (
  <Layout hideDonateBand>
    <SEO
      title="Donate | The Student Athlete Foundation"
      description="Make a tax-deductible gift to The Student Athlete Foundation to fund need-based junior golf scholarships in Houston."
      path="/donate"
    />
    <section className="pt-28 md:pt-32 pb-16 bg-background">
      <div className="container-custom px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <p className="eyebrow mb-4">Donate</p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.08]">Give a young golfer a fair shot.</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Your gift funds need-based scholarships so junior golfers can join coached Varsity training, tournament
            preparation and college guidance.
          </p>
          <img src={photos.varsityShortGame.src} alt={photos.varsityShortGame.alt} className="mt-8 w-full aspect-[16/10] object-cover rounded-sm hidden md:block" />
          <div className="mt-8 border-l-2 border-primary pl-5 text-sm text-muted-foreground space-y-2">
            <p className="text-foreground font-medium">{ORG.legalName}</p>
            <p>501(c)(3) nonprofit · EIN {ORG.ein}</p>
            <p>Gifts are tax-deductible to the extent allowed by law. Donations are separate from paid Golf Performance Group or PGACOACH purchases and are not payment for goods or services.</p>
          </div>
        </div>
        <DonationCard />
      </div>
    </section>
  </Layout>
);

export default DonatePage;
