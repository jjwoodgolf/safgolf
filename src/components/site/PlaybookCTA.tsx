import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PLAYBOOK_URL = "https://pgacoach.ai/course/college-recruiting-playbook/";
export const RECRUITING_COACH_URL = "https://golfrecruitingcoach.com/";

const steps = [
  { title: "Assess fit", text: "Be honest about scores, academics and the level of program that suits you." },
  { title: "Build a school list", text: "Research a balanced range of programs, divisions and campuses." },
  { title: "Create a resume and video", text: "Put results, academics and a clear swing video in one place." },
  { title: "Contact coaches", text: "Send short, personal introductions and follow up with updates." },
  { title: "Plan tournaments and visits", text: "Choose events and campus visits where coaches can see you." },
  { title: "Compare opportunities", text: "Weigh academics, roster fit, cost and aid before deciding." },
];

const PlaybookCTA = ({ compact = false }: { compact?: boolean }) => (
  <section className="section-padding bg-muted">
    <div className="container-custom grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <p className="eyebrow mb-4">College recruiting</p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight text-foreground">
          Six simple steps to college golf.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          The College Recruiting Playbook is an online curriculum from PGACOACH that walks families through the
          recruiting process. It is a separate membership resource and is currently included for Varsity members
          at Golf Performance Group. It does not guarantee a roster spot or scholarship, and it is not a benefit of
          donating.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
              Explore the College Recruiting Playbook <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
          {!compact && (
            <Button asChild size="lg" variant="outline">
              <a href={RECRUITING_COACH_URL} target="_blank" rel="noopener noreferrer">
                GolfRecruitingCoach.com
              </a>
            </Button>
          )}
        </div>
      </div>
      <ol className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-border border border-border rounded-sm overflow-hidden">
        {steps.map((s, i) => (
          <li key={s.title} className="bg-background p-6">
            <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-semibold text-foreground font-body">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default PlaybookCTA;
