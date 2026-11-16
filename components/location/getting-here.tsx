"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { pickupSteps } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

export function GettingHere() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-heading-part]", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08 })
      .from("[data-underline]", { scaleX: 0, duration: 0.5 }, "-=0.2")
      .from(
        "[data-route]",
        { y: 50, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: "power3.out", clearProps: "transform" },
        "-=0.3",
      );
  });

  return (
    <section ref={ref} aria-labelledby="getting-here-title" className="container-site pt-14 sm:pt-20">
      <SectionHeading
        align="center"
        title={<span id="getting-here-title">How pick-up works</span>}
        underline
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
        {pickupSteps.map((g) => (
          <li
            key={g.title}
            data-route
            className="rounded-2xl border border-oat-line bg-white p-5 shadow-sm shadow-brand/5 md:p-6"
          >
            <h3 className="font-serif text-xl text-ink">{g.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{g.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
