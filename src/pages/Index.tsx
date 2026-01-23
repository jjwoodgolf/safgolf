import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Programs from "@/components/Programs";
import SuccessStories from "@/components/SuccessStories";
import Impact from "@/components/Impact";
import Sponsors from "@/components/Sponsors";
import Donate from "@/components/Donate";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Mission />
        <Programs />
        <SuccessStories />
        <Impact />
        <Sponsors />
        <Donate />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
