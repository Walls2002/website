"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useMotion } from "@/lib/gsap";
import { pickupPoints, site, telHref } from "@/lib/site";

/**
 * The two pick-up points. Kin Kitchen has no shop, so instead of a map pin
 * and opening hours each point shows its area and a Maps link; the exact
 * hand-over spot is sent with the order confirmation.
 */
export function Visit() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    tl.from("[data-point]", {
      y: 50,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "transform",
    }).from("[data-point-text]", { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.05 }, "-=0.5");
  });

  return (
    <section ref={ref} aria-labelledby="visit-title" className="container-site pt-12 sm:pt-16">
      <h2 id="visit-title" className="sr-only">
        Pick-up points
      </h2>
      <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {pickupPoints.map((p, i) => {
          const dark = i % 2 === 0;
          return (
            <li
              key={p.value}
              data-point
              className={`relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl p-7 sm:min-h-[340px] sm:p-10 ${
                dark ? "bg-brand text-white" : "bg-latte text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`absolute -right-10 -bottom-16 size-56 rounded-full ${dark ? "bg-white/5" : "bg-white/35"}`}
              />
              <div className="relative">
                <h3 data-point-text className="font-serif text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-[1.05]">
                  {p.label.split(", ")[0]}
                </h3>
                <p data-point-text className={`mt-1 font-serif text-xl italic ${dark ? "text-latte" : "text-caramel-dark"}`}>
                  {p.label.split(", ")[1]}
                </p>
                <p data-point-text className={`mt-5 max-w-sm text-[15px] leading-relaxed ${dark ? "text-white/85" : "text-muted"}`}>
                  Around {p.area}. We send the exact spot and time when we confirm your order.
                </p>
              </div>
              <span data-point-text className="relative mt-8 block">
                <ButtonLink href={p.mapsUrl} target="_blank" rel="noreferrer" variant={dark ? "white" : "primary"} size="sm">
                  Open in Maps <ArrowRightIcon className="size-4" />
                </ButtonLink>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-[15px] text-muted">
        Need a hand finding us on the day? Call or text{" "}
        <a href={telHref(site.phone)} className="font-semibold whitespace-nowrap text-brand hover:underline">
          {site.phone}
        </a>
        .
      </p>
    </section>
  );
}
