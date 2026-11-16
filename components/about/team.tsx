"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { kitchenSteps } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

export function Team() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 78%", once: true } });
    tl.from("[data-heading-part]", { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" })
      .from("[data-underline]", { scaleX: 0, duration: 0.5 }, "-=0.2")
      .fromTo(
        "[data-member-photo]",
        { clipPath: "inset(0% 0% 100% 0% round 1.25rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1, stagger: 0.15, ease: "power4.inOut" },
        "-=0.3",
      )
      .from("[data-member-photo] img", { scale: 1.3, duration: 1.2, stagger: 0.15, ease: "power3.out" }, "<")
      .from(
        "[data-member-text]",
        { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.15, clearProps: "transform" },
        "-=0.8",
      );
  });

  return (
    <section ref={ref} aria-labelledby="team-title" className="container-site pt-14 sm:pt-20">
      <SectionHeading
        align="center"
        title={<span id="team-title">How a batch comes together</span>}
        intro="No shelf, no counter, no leftovers: just your order, from our oven to your hands."
        underline
      />
      <ul className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {kitchenSteps.map((m) => (
          <li key={m.title} className="group w-[78%] shrink-0 snap-start sm:w-[55%] md:w-auto">
            <div data-member-photo className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-oat">
              <Image
                src={`/images/${m.image}.webp`}
                alt={m.alt}
                fill
                sizes="(min-width: 768px) 28vw, 78vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div data-member-text className="px-1 pt-4">
              <h3 className="font-serif text-xl text-ink">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
