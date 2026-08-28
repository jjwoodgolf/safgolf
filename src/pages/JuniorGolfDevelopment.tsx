import { Sparkles, Target, Users, BookOpen, Trophy, Flag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProgramPage from "@/components/ProgramPage";

const JuniorGolfDevelopment = () => (
  <ProgramPage
    seoTitle="Junior Golf Development | Student Athlete Foundation"
    seoDescription="Coaching, character, and competitive opportunities for junior golfers ages 8-18 building toward college-level play."
    path="/junior-golf"
    eyebrow="Program"
    title="Junior Golf Development"
    lede="A structured pathway for junior golfers ages 8-18 to build sound fundamentals, competitive habits, and the character required to pursue college golf. From first swings to tournament-ready play, every participant receives age-appropriate coaching and a clear development plan."
    pillars={[
      {
        icon: Sparkles,
        title: "Foundational Skills",
        description: "Athletes learn proper grip, posture, and short-game technique through station-based training that makes the fundamentals repeatable under pressure.",
      },
      {
        icon: Target,
        title: "Personalized Coaching",
        description: "Each junior receives an individualized development plan based on age, skill level, and goals, with regular coach feedback and progress tracking.",
      },
      {
        icon: Users,
        title: "Team Environment",
        description: "Players train in cohorts where peers push one another to improve, build friendships, and learn how to compete with respect and confidence.",
      },
      {
        icon: BookOpen,
        title: "Academics First",
        description: "SAF holds every participant to strong academic standards because college opportunities require both golf ability and classroom performance.",
      },
      {
        icon: Trophy,
        title: "Tournament Pathways",
        description: "Coaches guide juniors through local, regional, and national tournament schedules that match their readiness and exposure goals.",
      },
      {
        icon: Flag,
        title: "Pathway to College",
        description: "Strong juniors transition into the scholarship and recruiting mentorship tracks, ensuring the next step is clear when they are ready.",
      },
    ]}
    primaryCta={{ label: "Join the program", href: "/contact" }}
    secondaryCta={{ label: "Support junior golf", href: "/donate" }}
  />
);

export default JuniorGolfDevelopment;
