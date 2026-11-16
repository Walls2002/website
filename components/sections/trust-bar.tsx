"use client";

import { useRef } from "react";
import { promises } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

/** Promises band: each promise is a short term from `promises` in lib/data.ts, divided by thin rules. */
export function TrustBar() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    gsap.from("[data-trust]", {
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  return (
    <section ref={ref} aria-label="Our promises" className="mt-14 bg-brand text-white sm:mt-20">
      <ul className="container-site grid grid-cols-2 gap-x-4 gap-y-7 py-8 md:grid-cols-4 md:gap-x-0 md:py-8">
        {promises.map(({ title, text }, i) => (
          <li
            key={title}
            data-trust
            className={`px-2 text-center md:px-6 ${i > 0 ? "md:border-l md:border-white/25" : ""}`}
          >
            <p className="font-serif text-lg leading-tight sm:text-xl">{title}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-white/85 sm:text-sm">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
