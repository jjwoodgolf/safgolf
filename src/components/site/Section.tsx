import { ReactNode } from "react";

interface SectionProps {
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "default" | "muted";
  id?: string;
}

const Section = ({ eyebrow, title, intro, children, tone = "default", id }: SectionProps) => (
  <section id={id} className={`section-padding ${tone === "muted" ? "bg-muted" : "bg-background"}`}>
    <div className="container-custom">
      {(eyebrow || title || intro) && (
        <div className="max-w-3xl mb-12">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          {title && <h2 className="font-display text-3xl md:text-4xl leading-tight text-foreground">{title}</h2>}
          {intro && <div className="mt-5 text-muted-foreground leading-relaxed text-lg">{intro}</div>}
        </div>
      )}
      {children}
    </div>
  </section>
);

export default Section;
