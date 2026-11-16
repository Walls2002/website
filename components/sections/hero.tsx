"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useMotion } from "@/lib/gsap";
import { pickupPoints } from "@/lib/site";

/** The heart from the middle of the K-heart-K, drawn as one stroke. */
function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" fill="none" aria-hidden="true" className={className}>
      <path
        data-heart
        d="M6 104c18-4 36-14 52-30M58 74C36 58 26 34 40 22c12-10 24-2 26 10 4-14 22-24 34-12 14 16-8 40-42 54"
        className="stroke-caramel"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
 * The hero fits one screen (`.hero-fit` in globals.css). The headline is set in
 * em off one size that answers to both width and height, so the big words
 * (2.13em) and the heart scale together, and a short screen gets a shorter
 * headline instead of a scroll; in two columns it is also capped by width so
 * "memories," fits its column. The photo box keeps the blob's proportions
 * inside whatever room the grid gives it.
 */
const headlineSize =
  "text-[clamp(1.5rem,min(1.3rem+2vw,5.2dvh),2.8rem)] lg:text-[clamp(1.5rem,min(3.6vw,5.2dvh),2.8rem)] landscape:md:text-[clamp(1.5rem,min(3.6vw,5.2dvh),2.8rem)]";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-hero-line]", { yPercent: 115, duration: 0.9, stagger: 0.12 })
      .from("[data-hero-accent]", { rotate: 6, transformOrigin: "0% 100%", duration: 0.9, stagger: 0.24 }, "<")
      .from("[data-heart]", { drawSVG: "0%", duration: 1.1, ease: "power2.inOut" }, "-=0.5")
      .from("[data-hero-fade]", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, clearProps: "transform" }, "-=0.9")
      .from("[data-hero-blob]", { scale: 0.4, rotate: -25, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.1)
      .from("[data-hero-stamp]", { scale: 0, rotate: -90, duration: 0.9, ease: "expo.out" }, 0.7)
      .from("[data-hero-visit]", { autoAlpha: 0, y: 12, duration: 0.5, clearProps: "transform" }, "-=0.4");

    // Ambient life once the intro settles.
    gsap.to("[data-hero-blob]", {
      rotate: 6,
      scale: 1.03,
      duration: 7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.3,
    });
    gsap.to("[data-hero-stamp]", { rotate: 360, duration: 40, ease: "none", repeat: -1, delay: 1.6 });

    // Gentle depth on scroll.
    gsap.to("[data-hero-visual]", {
      yPercent: -6,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
    });
  });

  return (
    <section ref={ref} aria-labelledby="hero-title" className="overflow-hidden">
      <div className="hero-fit container-site">
        <h1 id="hero-title" className={`relative [grid-area:title] font-serif text-ink ${headlineSize}`}>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-intro data-hero-line className="block text-[1em] leading-[1.2]">
              Sweet
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-intro data-hero-line className="block text-[2.13em] leading-[1] text-brand italic">
              <span data-hero-accent className="inline-block">
                memories,
              </span>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-intro data-hero-line className="block text-[1em] leading-[1.2]">
              created
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-intro data-hero-line className="block text-[2.13em] leading-[1] text-brand italic">
              <span data-hero-accent className="inline-block">
                together.
              </span>
            </span>
          </span>
          <HeartDoodle className="absolute top-[0.1em] left-[3.4em] w-[1.9em]" />
        </h1>

        <p
          data-intro
          data-hero-fade
          className="max-w-[27rem] text-[15px] leading-relaxed text-muted [grid-area:copy] sm:text-base lg:mt-[clamp(0.75rem,2.4dvh,1.5rem)] landscape:md:mt-[clamp(0.75rem,2.4dvh,1.5rem)] lg:text-[17px]"
        >
          Banana loaves, fudgy brownies and celebration cakes from a sisterhood kitchen.
          <span className="hidden sm:inline">
            {" "}
            Pre-order for the next batch, then pick up in Quezon City or San Jose del Monte.
          </span>
        </p>

        <div className="grid grid-cols-2 gap-3 [grid-area:cta] sm:flex sm:flex-wrap sm:items-center sm:gap-4 lg:mt-[clamp(1rem,3.6dvh,2rem)] landscape:md:mt-[clamp(1rem,3.6dvh,2rem)]">
          <span data-intro data-hero-fade>
            <ButtonLink href="/menu" fluid className="w-full sm:min-h-13 sm:px-9 sm:text-base">
              Pre-order now
            </ButtonLink>
          </span>
          <span data-intro data-hero-fade>
            <ButtonLink
              href="/order?for=cake#order"
              variant="outline"
              fluid
              className="w-full sm:min-h-13 sm:px-9 sm:text-base"
            >
              Plan a cake
            </ButtonLink>
          </span>
        </div>

        <div data-hero-visual className="relative flex min-h-0 flex-col items-center [grid-area:visual]">
          {/* The photo box: height from the grid row, width from the blob's own proportions. */}
          <div className="relative grid min-h-0 w-full flex-1 place-items-center [container-type:size]">
            <div className="relative aspect-[600/560] w-[min(100cqw,calc(100cqh*1.0714))]">
              <svg
                data-intro
                data-hero-blob
                viewBox="0 0 600 560"
                aria-hidden="true"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path
                  d="M170 60C250 10 420-10 510 40c80 45 90 150 75 250-15 110 15 180-45 230-70 55-160 0-240 10-90 15-180 30-230-30-50-60-10-130-30-200-20-80 40-190 130-240Z"
                  className="fill-brand-soft"
                />
              </svg>
              {/* LCP image: its entrance is CSS so it paints before hydration. */}
              <div className="absolute inset-x-[16%] top-[6%] -bottom-[2%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[6px] border-white shadow-[0_30px_40px_-10px_rgba(84,60,42,0.35)] motion-safe:animate-card-in">
                <Image
                  src="/images/hero-assortment.webp"
                  alt="A Kin Kitchen spread: banana loaves, cookies and brownies in foil trays"
                  fill
                  sizes="(min-width: 768px) 34vw, 70vw"
                  className="object-cover object-[50%_40%]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* The brand's monogram as a baker's stamp, as it sits on every box label. */}
              <div
                data-hero-stamp
                aria-hidden="true"
                className="absolute right-[1%] bottom-[2%] grid aspect-square w-[24%] min-w-16 place-items-center rounded-full bg-brand text-oat shadow-lg shadow-brand/30"
              >
                <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
                  <defs>
                    <path id="stamp-ring" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" />
                  </defs>
                  <text className="fill-current font-sans text-[8.5px] font-medium tracking-[0.18em]">
                    <textPath href="#stamp-ring">SISTERHOOD · DESSERTS · EST. 2026 ·</textPath>
                  </text>
                </svg>
                <Image
                  src="/images/kin-monogram-oat.png"
                  alt=""
                  width={628}
                  height={480}
                  sizes="64px"
                  className="relative w-[44%]"
                />
              </div>
            </div>
          </div>
          <p
            data-intro
            data-hero-visit
            className="mt-[clamp(0.75rem,3dvh,1.75rem)] hidden shrink-0 text-center leading-snug lg:block landscape:md:block"
          >
            <span className="block text-base font-semibold text-ink lg:text-lg">Pick-up points</span>
            <Link
              href="/location"
              className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline lg:text-[15px]"
            >
              {pickupPoints.map((p) => p.label).join(" · ")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
