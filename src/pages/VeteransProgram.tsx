import { Shield, HeartHandshake, Users, Calendar, Activity, Award } from "lucide-react";
import ProgramPage from "@/components/ProgramPage";

const VeteransProgram = () => (
  <ProgramPage
    seoTitle="Veterans Golf Program | Student Athlete Foundation"
    seoDescription="A free golf program for military veterans focused on community, recovery, and lifelong engagement with the game."
    path="/veterans"
    eyebrow="Program"
    title="Veterans Golf Program"
    lede="Placeholder lede. Describe the veterans program in one or two sentences — who it serves, what it provides, and the lasting impact for service members and their families."
    pillars={[
      {
        icon: Shield,
        title: "Earned Access",
        description: "Placeholder. Outline eligibility for veterans and active-duty service members.",
      },
      {
        icon: HeartHandshake,
        title: "Therapeutic Recreation",
        description: "Placeholder. Describe the mental and physical health benefits documented through structured play.",
      },
      {
        icon: Users,
        title: "Peer Community",
        description: "Placeholder. Detail the camaraderie built among participants and instructors.",
      },
      {
        icon: Calendar,
        title: "Weekly Programming",
        description: "Placeholder. Cover the regular cadence of clinics, range sessions, and tournament play.",
      },
      {
        icon: Activity,
        title: "Instruction at Every Level",
        description: "Placeholder. Describe how new and experienced players are each given a clear development path.",
      },
      {
        icon: Award,
        title: "Recognition Events",
        description: "Placeholder. Mention the showcase tournaments and ceremonies celebrating participant achievements.",
      },
    ]}
    primaryCta={{ label: "Enroll in the program", href: "/contact" }}
  />
);

export default VeteransProgram;
