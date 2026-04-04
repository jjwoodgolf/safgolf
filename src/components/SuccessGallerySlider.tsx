import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import student01 from "@/assets/success-gallery/student-01.jpg";
import student02 from "@/assets/success-gallery/student-02.jpg";
import student03 from "@/assets/success-gallery/student-03.jpg";
import student04 from "@/assets/success-gallery/student-04.jpg";
import student05 from "@/assets/success-gallery/student-05.jpg";
import student06 from "@/assets/success-gallery/student-06.jpg";
import student07 from "@/assets/success-gallery/student-07.jpg";
import student08 from "@/assets/success-gallery/student-08.jpg";
import student09 from "@/assets/success-gallery/student-09.jpg";
import student10 from "@/assets/success-gallery/student-10.jpg";
import student11 from "@/assets/success-gallery/student-11.jpg";
import student12 from "@/assets/success-gallery/student-12.jpg";
import student13 from "@/assets/success-gallery/student-13.jpg";
import student14 from "@/assets/success-gallery/student-14.jpg";
import student15 from "@/assets/success-gallery/student-15.jpg";

const images = [
  student01, student02, student03, student04, student05,
  student06, student07, student08, student09, student10,
  student11, student12, student13, student14, student15,
];

interface SuccessGallerySliderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const SuccessGallerySlider = ({
  title = "Our Student Athletes in Action",
  subtitle = "See the faces behind the success — junior golfers building their futures through SAF programs.",
  compact = false,
}: SuccessGallerySliderProps) => {
  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className={compact ? "py-8 bg-muted" : "section-padding bg-muted"}>
      <div className="container-custom">
        {!compact && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">
              {title}
            </span>
            <p className="text-muted-foreground text-lg leading-relaxed mt-3">
              {subtitle}
            </p>
          </div>
        )}
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {images.map((src, i) => (
              <CarouselItem
                key={i}
                className="pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div className="overflow-hidden rounded-xl border border-border shadow-md aspect-[4/3]">
                  <img
                    src={src}
                    alt={`SAF student athlete ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default SuccessGallerySlider;
