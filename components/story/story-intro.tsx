"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useMotion } from "@/lib/gsap";
import { site } from "@/lib/site";

export function StoryIntro() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    tl.from("[data-story-text]", {
      y: 26,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "transform",
    })
      .from("[data-quote-mark]", { scale: 0, rotate: -40, duration: 0.7, ease: "back.out(2.5)" }, "-=0.4")
      .from("[data-story-img='a']", { x: -40, rotate: -6, autoAlpha: 0, duration: 1, ease: "power3.out" }, 0)
      .from("[data-story-img='b']", { x: 40, y: 40, rotate: 8, autoAlpha: 0, duration: 1, ease: "power3.out" }, 0.15);

    gsap.to("[data-story-img='b']", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <section ref={ref} aria-labelledby="story-title" className="container-site pt-14 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md pb-12 sm:max-w-xl lg:max-w-none lg:pr-10">
          <div data-story-img="a" className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/moms-day-cakes.webp"
              alt="A row of Mother's Day cakes in pink, red and lilac buttercream and fondant"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div
            data-story-img="b"
            className="absolute right-0 -bottom-2 aspect-square w-[46%] overflow-hidden rounded-3xl ring-8 ring-white lg:-right-2"
          >
            <Image
              src="/images/oven-glow.webp"
              alt="Trays of bakes glowing inside the oven"
              fill
              sizes="(min-width: 1024px) 20vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2
            id="story-title"
            data-story-text
            className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink"
          >
            A K, a heart and a home oven
          </h2>
          <p data-story-text className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
            {site.name} began in {site.establishedYear} as sisters baking for the people around them: banana loaves for
            merienda, brownies for the barkada, a cake for mom. The two Ks in our logo hold a heart between them, and
            that&apos;s the whole idea.
          </p>
          <figure data-story-text className="relative mt-8 rounded-2xl bg-oat p-6 sm:p-7">
            <span
              data-quote-mark
              aria-hidden
              className="absolute -top-5 left-6 grid size-10 place-items-center rounded-full bg-brand font-serif text-3xl leading-none text-white"
            >
              &ldquo;
            </span>
            <blockquote className="font-serif text-lg leading-relaxed text-ink sm:text-xl">
              Little treats, big celebrations. Thank you so much for trusting us.
            </blockquote>
            <figcaption className="mt-3 text-sm text-muted">From a Kin Kitchen birthday post</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
