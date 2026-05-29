import { Sparkles, Target, Users, BookOpen, Trophy, Flag } from "lucide-react";
import ProgramPage from "@/components/ProgramPage";

const JuniorGolfDevelopment = () => (
  <ProgramPage
    seoTitle="Junior Golf Development | Student Athlete Foundation"
    seoDescription="Coaching, character, and competitive opportunities for junior golfers building toward college-level play."
    path="/junior-golf"
    eyebrow="Program"
    title="Junior Golf Development"
    lede="Placeholder lede. Describe the junior development program in one or two sentences — the age range served, what makes it different, and the outcomes families can expect."
    pillars={[
      {
        icon: Sparkles,
        title: "Foundational Skills",
        description: "Placeholder. Outline the core technical fundamentals taught from day one.",
      },
      {
        icon: Target,
        title: "Personalized Coaching",
        description: "Placeholder. Describe how players receive individualized development plans.",
      },
      {
        icon: Users,
        title: "Team Environment",
        description: "Placeholder. Cover the cohort model and how peers push each other to improve.",
      },
      {
        icon: BookOpen,
        title: "Academics First",
        description: "Placeholder. Explain the standards for school performance that every junior is held to.",
      },
      {
        icon: Trophy,
        title: "Tournament Pathways",
        description: "Placeholder. Detail the local, regional, and national events juniors compete in.",
      },
      {
        icon: Flag,
        title: "Pathway to College",
        description: "Placeholder. Describe how the program transitions strong juniors into the scholarship and recruiting tracks.",
      },
    ]}
    primaryCta={{ label: "Join the program", href: "/contact" }}
  />
);

export default JuniorGolfDevelopment;
