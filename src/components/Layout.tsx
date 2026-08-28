import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        <Button asChild size="lg" className="shadow-xl rounded-full">
          <Link to="/donate">
            <Heart className="h-4 w-4 mr-2" />
            Donate
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Layout;
