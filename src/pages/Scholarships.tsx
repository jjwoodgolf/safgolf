import { GraduationCap, Trophy, Users, FileText, Compass, HandCoins } from "lucide-react";
import ProgramPage from "@/components/ProgramPage";

const Scholarships = () => (
  <ProgramPage
    seoTitle="College Golf Scholarships | Student Athlete Foundation"
    seoDescription="Need-based scholarships and recruiting support for junior golfers pursuing a college playing career."
    path="/scholarships"
    eyebrow="Program"
    title="College Golf Scholarships"
    lede="Placeholder lede. Describe the scholarship program in one or two sentences here — who it serves, the outcome it creates, and why it matters."
    pillars={[
      {
        icon: GraduationCap,
        title: "Tuition Support",
        description: "Placeholder. Outline the financial assistance available to qualified student athletes.",
      },
      {
        icon: Trophy,
        title: "Competitive Pathway",
        description: "Placeholder. Describe access to ranked tournaments and showcase events that drive recruiting visibility.",
      },
      {
        icon: Users,
        title: "Mentorship",
        description: "Placeholder. Detail the coaches, advisors, and alumni who guide scholars through the process.",
      },
      {
        icon: FileText,
        title: "Application Coaching",
        description: "Placeholder. Explain hands-on support with NCAA eligibility, essays, and academic preparation.",
      },
      {
        icon: Compass,
        title: "School Selection",
        description: "Placeholder. Cover how scholars are matched with schools that fit academically, athletically, and personally.",
      },
      {
        icon: HandCoins,
        title: "Long-Term Funding",
        description: "Placeholder. Describe the renewable nature of the scholarship and ongoing financial guidance.",
      },
    ]}
    primaryCta={{ label: "Apply for a scholarship", href: "/contact" }}
  />
);

export default Scholarships;
