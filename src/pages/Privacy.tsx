import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <Layout>
      <SEO
        title="Privacy Policy | Student Athlete Foundation"
        description="Privacy policy for the Student Athlete Foundation website."
        path="/privacy"
      />
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/90">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-muted-foreground leading-relaxed mb-8">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We collect information you provide directly to us, such as your name, email address, phone number, and message when you use our contact form, subscribe to our newsletter, apply for a program, or make a donation. We also collect information automatically through cookies and similar technologies to improve your browsing experience.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We use your information to respond to your inquiries, process donations, send newsletters and updates, manage program applications, and improve our website and services. We do not sell your personal information to third parties.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Payment Processing</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Donation payments are processed through Stripe. We do not store your full credit card details on our servers. Stripe's privacy policy governs the information you provide during payment.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Email Communications</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With your consent, we may send you newsletters, event invitations, and updates about our programs. You can unsubscribe at any time by clicking the unsubscribe link in our emails or contacting us directly.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the internet is completely secure.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or how we handle your information, please contact us at{" "}
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

export default Privacy;
