"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { milestones } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

export function Timeline() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    gsap.from("[data-heading-part], [data-underline]", {
      y: 24,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });

    // The spine grows as you scroll through the story.
    gsap.from("[data-spine-fill]", {
      scaleY: 0,
      ease: "none",
      transformOrigin: "top center",
      scrollTrigger: { trigger: el.querySelector("[data-spine]"), start: "top 70%", end: "bottom 60%", scrub: 0.5 },
    });

    el.querySelectorAll<HTMLElement>("[data-milestone]").forEach((item) => {
      const fromLeft = item.dataset.side === "left";
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 80%", once: true } });
      tl.from(item.querySelector("[data-dot]"), { scale: 0, duration: 0.5, ease: "back.out(3)" })
        .from(
          item.querySelector("[data-card]"),
          { x: fromLeft ? -50 : 50, autoAlpha: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" },
          "-=0.3",
        )
        .from(item.querySelector("[data-year]"), { y: 12, autoAlpha: 0, duration: 0.5 }, "-=0.6");
    });
  });

  return (
    <section ref={ref} aria-labelledby="timeline-title" className="bg-oat py-14 sm:py-20 mt-14 sm:mt-20">
      <div className="container-site">
        <SectionHeading
          align="center"
          title={<span id="timeline-title">The story so far</span>}
          underline
        />
        <ol data-spine className="relative mt-12 md:mt-16">
          {/* Spine: left rail on phones, centred from tablet up. */}
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-brand-soft/50 md:left-1/2 md:-translate-x-1/2"
          >
            <span data-spine-fill className="block h-full w-full bg-brand" />
          </span>
          {milestones.map((m, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li
                key={m.year}
                data-milestone
                data-side={side}
                className="relative grid pb-10 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0"
              >
                <span
                  data-dot
                  aria-hidden
                  className="absolute top-1.5 left-0 grid size-6 place-items-center rounded-full bg-white ring-4 ring-brand md:left-[calc(50%-12px)]"
                >
                  <span className="size-2 rounded-full bg-caramel" />
                </span>
                <div className={side === "left" ? "md:col-start-1 md:text-right" : "md:col-start-2"}>
                  <p data-year className="font-serif text-2xl text-brand sm:text-3xl">
                    {m.year}
                  </p>
                  <div
                    data-card
                    className={`mt-3 rounded-2xl bg-white p-5 shadow-sm shadow-brand/5 sm:p-6 ${
                      side === "left" ? "md:ml-auto" : ""
                    } md:max-w-md`}
                  >
                    <h3 className="text-base font-semibold text-ink sm:text-lg">{m.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{m.text}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
