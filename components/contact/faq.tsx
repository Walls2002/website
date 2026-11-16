"use client";

import { useRef, useState } from "react";
import { PlusIcon } from "@/components/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/lib/data";
import { gsap, useGSAP, useMotion } from "@/lib/gsap";

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-heading-part], [data-underline]", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08 }).from(
      "[data-faq]",
      { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "transform" },
      "-=0.3",
    );
  });

  // Animate the answer panels open/closed to their natural height.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ref.current?.querySelectorAll<HTMLElement>("[data-answer]").forEach((panel, i) => {
        gsap.to(panel, { height: i === open ? "auto" : 0, duration: reduce ? 0 : 0.45, ease: "power2.inOut" });
      });
    },
    { scope: ref, dependencies: [open], revertOnUpdate: false },
  );

  return (
    <section ref={ref} id="faq" aria-labelledby="faq-title" className="container-site scroll-mt-28 pt-14 sm:pt-20">
      <SectionHeading
        align="center"
        title={<span id="faq-title">Frequently asked questions</span>}
        underline
      />
      <ul className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} data-faq className="overflow-hidden rounded-2xl border border-oat-line bg-white">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink sm:px-6 sm:text-base"
                >
                  {f.q}
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen ? "rotate-45 bg-brand text-white" : "bg-oat text-brand"
                    }`}
                  >
                    <PlusIcon className="size-4" />
                  </span>
                </button>
              </h3>
              <div
                id={`faq-${i}`}
                data-answer
                role="region"
                aria-hidden={!isOpen}
                className={`overflow-hidden ${i === 0 ? "" : "h-0"}`}
              >
                <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6">{f.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
