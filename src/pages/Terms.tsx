import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <Layout>
      <SEO
        title="Terms of Service | Student Athlete Foundation"
        description="Terms of service for the Student Athlete Foundation website."
        path="/terms"
      />
      <section className="pt-32 pb-20 bg-primary">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground leading-relaxed mb-8">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              By accessing or using the Student Athlete Foundation website, you agree to these Terms of Service. If you do not agree, please do not use the site.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Use of the Website</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You agree to use this website only for lawful purposes. You may not use the site to transmit harmful code, attempt to gain unauthorized access, or interfere with the site's operation.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Donations</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All donations made through this website are voluntary and processed by Stripe. Donations are generally final and non-refundable. If you believe an error occurred with your donation, please contact us promptly.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All content on this website, including text, images, logos, and graphics, is the property of the Student Athlete Foundation or its licensors and is protected by applicable intellectual property laws.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This website is provided "as is" without warranties of any kind. We do not guarantee that the site will always be available, error-free, or secure.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To the fullest extent permitted by law, the Student Athlete Foundation shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We may update these Terms of Service from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, contact us at{" "}
              <a href="mailto:safsportshouston@gmail.com" className="text-primary hover:underline">
                safsportshouston@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
