import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import PhotoGallery from "@/components/site/PhotoGallery";
import { photos, communityGallery } from "@/components/site/photos";

const SuccessStoriesPage = () => (
  <Layout>
    <SEO
      title="Success Stories | The Student Athlete Foundation"
      description="Players from the SAF and Varsity coaching community have won state championships and progressed to college golf and professional tours."
      path="/success-stories"
    />
    <PageHeader
      eyebrow="Success stories"
      title="A community that has produced champions."
      intro="Players in JJ Wood's coaching, SAF and Varsity community have won state junior and high-school championships and progressed to college golf, the LPGA Tour, the PGA Tour and major championships."
      image={photos.jjVarsityCommunity}
    />
    <Section>
      <PhotoGallery items={communityGallery} caption="Players from the SAF and Varsity coaching community." />
      <p className="mt-10 text-muted-foreground max-w-3xl leading-relaxed">
        These results reflect shared coaching and program history. Not every player pictured received SAF funding, and
        no program can guarantee competitive or recruiting outcomes.
      </p>
    </Section>
  </Layout>
);

export default SuccessStoriesPage;
