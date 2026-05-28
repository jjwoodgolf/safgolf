import { useEffect, useRef, useState, ReactNode } from "react";

import hero01 from "@/assets/hero/hero-01.jpg";
import hero02 from "@/assets/hero/hero-02.jpg";
import hero03 from "@/assets/hero/hero-03.jpg";
import hero04 from "@/assets/hero/hero-04.jpg";
import hero05 from "@/assets/hero/hero-05.jpg";
import hero06 from "@/assets/hero/hero-06.jpg";
import hero07 from "@/assets/hero/hero-07.jpg";
import hero08 from "@/assets/hero/hero-08.jpg";
import hero09 from "@/assets/hero/hero-09.jpg";
import hero10 from "@/assets/hero/hero-10.jpg";

// Full-resolution (1920x1080) hero photography of real SAF student athletes
const ALL_IMAGES = [
  hero01, hero02, hero03, hero04, hero05,
  hero06, hero07, hero08, hero09, hero10,
];

interface PageHeroProps {
  /** Optional eyebrow label above the heading */
  kicker?: string;
  /** Page title (required) */
  title: string;
  /** Supporting paragraph below the title */
  subtitle?: string;
  /** Slot for buttons, icons, or additional content */
  children?: ReactNode;
  /** Starting index into the image pool (rotates the slideshow per page) */
  imageOffset?: number;
  /** How many images this hero rotates through (default 5) */
  imageCount?: number;
  /** Vertical sizing — defaults to a tall banner */
  minHeight?: string;
  /** Horizontal alignment of content */
  align?: "center" | "left";
  /** Override the default container; pass `false` to use a full-width child layout */
  contained?: boolean;
}

/**
 * Reusable hero banner with an auto-rotating image slideshow background
 * and a translucent brand-colored overlay so foreground text stays legible.
 *
 * Images use `object-cover` with `object-position: center` so subjects stay
 * framed across responsive breakpoints without cropping into faces.
 */
const PageHero = ({
  kicker,
  title,
  subtitle,
  children,
  imageOffset = 0,
  imageCount = 5,
  minHeight = "min-h-[480px] md:min-h-[560px]",
  align = "center",
  contained = true,
}: PageHeroProps) => {
  const slides = Array.from({ length: imageCount }, (_, i) =>
    ALL_IMAGES[(imageOffset + i) % ALL_IMAGES.length]
  );

  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <section
      className={`relative ${minHeight} flex pt-32 pb-16 overflow-hidden`}
      aria-label={title}
    >
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        ))}
      </div>

      {/* Translucent brand overlay — keeps imagery visible while ensuring text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
      <div className="absolute inset-0 bg-black/15" />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 w-full flex ${alignCls}`}>
        {contained ? (
          <div className="container-custom">
            <div className={`flex flex-col ${alignCls} gap-6 max-w-4xl ${align === "center" ? "mx-auto" : ""}`}>
              {kicker && (
                <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-5 py-2 text-white text-sm font-semibold uppercase tracking-wider">
                  {kicker}
                </span>
              )}
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/95 text-lg md:text-xl max-w-3xl leading-relaxed drop-shadow">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

export default PageHero;
