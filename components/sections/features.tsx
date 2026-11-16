"use client";

import { useRef } from "react";
import { goodToKnow } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

/** Info band: hours, delivery, custom cakes and allergies, all read from `site` via `goodToKnow`. */
export function Features() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    tl.from("[data-feat-panel]", {
      scaleX: 0.9,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform",
    }).from(
      "[data-feat-item]",
      { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "transform" },
      "-=0.35",
    );
  });

  return (
    <section ref={ref} aria-label="Good to know" className="container-site pt-12 sm:pt-16">
      <ul
        data-feat-panel
        className="grid gap-y-2 rounded-3xl bg-oat px-2 py-4 sm:grid-cols-2 sm:py-6 lg:grid-cols-4 lg:py-8"
      >
        {goodToKnow.map((f, i) => (
          <li
            key={f.title}
            data-feat-item
            className={`px-4 py-4 sm:px-6 lg:py-1 ${i > 0 ? "border-t border-oat-line sm:border-t-0" : ""} ${
              i % 2 === 1 ? "sm:border-l sm:border-oat-line" : ""
            } ${i > 1 ? "sm:border-t sm:pt-5 lg:border-t-0 lg:pt-1" : ""} ${i === 2 ? "lg:border-l lg:border-oat-line" : ""}`}
          >
            <h3 className="font-serif text-lg text-brand sm:text-xl">{f.title}</h3>
            {f.lines.map((line) => (
              <p key={line} className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[15px]">
                {line}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
