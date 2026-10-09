import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
  image?: { src: string; alt: string };
}

/** Consistent editorial header for public pages. */
const PageHeader = ({ eyebrow, title, intro, children, image }: PageHeaderProps) => (
  <section className="pt-28 md:pt-32 pb-12 md:pb-16 bg-background border-b border-border">
    <div className="container-custom px-4 md:px-8">
      <div className={image ? "grid lg:grid-cols-12 gap-10 items-end" : ""}>
        <div className={image ? "lg:col-span-6" : "max-w-3xl"}>
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.08] text-foreground">
            {title}
          </h1>
          {intro && <div className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">{intro}</div>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && (
          <div className="lg:col-span-6">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full aspect-[4/3] object-cover rounded-sm"
              loading="eager"
            />
          </div>
        )}
      </div>
    </div>
  </section>
);

export default PageHeader;
