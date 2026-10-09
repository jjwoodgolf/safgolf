import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonateBand from "@/components/site/DonateBand";

interface LayoutProps {
  children: React.ReactNode;
  /** Hide the bottom donation band (e.g. on the donate page itself). */
  hideDonateBand?: boolean;
}

const Layout = ({ children, hideDonateBand = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideDonateBand && <DonateBand />}
      <Footer />
      {!hideDonateBand && (
        <div className="lg:hidden h-14" aria-hidden="true" />
      )}
      {!hideDonateBand && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-background">
          <div className="flex items-center justify-between gap-4 px-4 h-14">
            <span className="text-sm text-muted-foreground">Fund a junior golfer's access</span>
            <Link
              to="/donate"
              className="inline-flex items-center h-9 px-5 rounded-sm bg-primary text-primary-foreground text-sm font-semibold"
            >
              Donate
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
