"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useMotion } from "@/lib/gsap";

type Props = {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  crumb: string;
};

/** Banner for inner pages: oat card, title reveal, image in a soft blob. */
export function PageHero({ title, intro, image, imageAlt, crumb }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, () => {
    // The card and image enter via CSS (see globals.css) so the LCP image paints pre-hydration.
    gsap
      .timeline({ defaults: { ease: "power3.out" }, delay: 0.25 })
      .from("[data-ph-line]", { yPercent: 170, duration: 0.8, stagger: 0.1 })
      .from("[data-ph-fade]", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, "-=0.5");
    gsap.to("[data-ph-image]", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section ref={ref} className="container-site pt-4 sm:pt-6">
      <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl bg-oat px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[1.2fr_1fr] motion-safe:animate-card-in lg:px-14 lg:py-14">
        <div className="relative z-10">
          <nav aria-label="Breadcrumb" data-intro data-ph-fade className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand">{crumb}</span>
          </nav>
          <h1 className="line-mask mt-5 font-serif text-[clamp(2.25rem,1.6rem+2.8vw,3.75rem)] leading-[1.08] text-ink">
            <span data-intro data-ph-line className="block">
              {title}
            </span>
          </h1>
          <p data-intro data-ph-fade className="mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
            {intro}
          </p>
        </div>
        <div data-ph-image className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] md:max-w-none">
          <div
            className="relative aspect-[5/4] overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%] ring-8 ring-white motion-safe:animate-pop-in md:aspect-square lg:aspect-[5/4]"
          >
            <Image
              src={`/images/${image}`}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 35vw, (min-width: 640px) 360px, 300px"
              className="object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
        <span aria-hidden className="absolute -top-16 -right-16 size-56 rounded-full bg-brand-soft/40 blur-2xl" />
      </div>
    </section>
  );
}
