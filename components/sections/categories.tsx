"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

export function Categories() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    tl.from("[data-cat-text]", { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" })
      .from(
        "[data-cat-tile]",
        {
          scale: 0.5,
          autoAlpha: 0,
          duration: 0.6,
          ease: "back.out(2)",
          stagger: { each: 0.07, from: "center", grid: "auto" },
          clearProps: "transform",
        },
        "-=0.3",
      )
      .from("[data-cat-cta]", { y: 16, autoAlpha: 0, duration: 0.5, clearProps: "transform" }, "-=0.2")
      .fromTo(
        "[data-cat-image]",
        { clipPath: "inset(0% 0% 0% 100% round 1.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 1.2, ease: "power4.inOut" },
        0.1,
      )
      .from("[data-cat-image] img", { scale: 1.3, duration: 1.5, ease: "power3.out" }, "<");

    gsap.to("[data-cat-image] img", {
      yPercent: -7,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  const bounce = (e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const icon = e.currentTarget.querySelector("img");
    if (icon) gsap.fromTo(icon, { y: 0 }, { y: -8, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.out" });
  };

  return (
    <section ref={ref} aria-labelledby="craving-title" className="container-site pt-14 sm:pt-20">
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
        <div>
          <h2
            id="craving-title"
            data-cat-text
            className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink"
          >
            Pick your kind of sweet
          </h2>
          <p data-cat-text className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted sm:text-base">
            Banana loaves for merienda, brownies to share around, and cakes for the days that need one.
          </p>
          <ul className="mt-7 grid grid-cols-3 gap-3 sm:gap-4 md:max-w-md lg:max-w-none lg:grid-cols-5 lg:gap-3">
            {categories.map((c) => (
              <li key={c.slug} data-cat-tile>
                <Link
                  href={`/menu?category=${c.slug}`}
                  onPointerEnter={bounce}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-latte-soft p-2 text-center transition-colors hover:bg-latte sm:aspect-[1.1]"
                >
                  <Image
                    src={`/images/categories/${c.slug}.webp`}
                    alt=""
                    width={64}
                    height={64}
                    className="size-14 rounded-full object-cover shadow-sm shadow-brand/20 sm:size-16"
                  />
                  <span className="text-[13px] leading-tight font-semibold text-ink sm:text-sm">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div data-cat-cta className="mt-7 md:flex md:max-w-md md:justify-center lg:max-w-none lg:justify-start">
            <ButtonLink href="/menu" fluid>
              See the full menu
            </ButtonLink>
          </div>
        </div>

        <div
          data-cat-image
          className="relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-[4/5] lg:aspect-[1.05]"
        >
          <Image
            src="/images/number-cake-scene.webp"
            alt="A number six cake crowned with red and pink piped florals"
            fill
            sizes="(min-width: 768px) 40vw, 90vw"
            className="scale-110 object-cover object-[50%_50%]"
          />
        </div>
      </div>
    </section>
  );
}
