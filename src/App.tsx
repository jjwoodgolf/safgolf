import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Events from "./pages/Events";
import ProgramsPage from "./pages/ProgramsPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import SponsorsPage from "./pages/SponsorsPage";
import Contact from "./pages/Contact";
import DonatePage from "./pages/DonatePage";
import JuniorGolf from "./pages/programs/JuniorGolf";
import CollegeScholarships from "./pages/programs/CollegeScholarships";
import Veterans from "./pages/programs/Veterans";
import ShowcaseEvents from "./pages/programs/ShowcaseEvents";
import Recruiting from "./pages/programs/Recruiting";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/junior-golf" element={<JuniorGolf />} />
          <Route path="/programs/college-scholarships" element={<CollegeScholarships />} />
          <Route path="/programs/veterans" element={<Veterans />} />
          <Route path="/programs/showcase-events" element={<ShowcaseEvents />} />
          <Route path="/programs/recruiting" element={<Recruiting />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<DonatePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
