"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useMotion } from "@/lib/gsap";

const values = [
  { title: "Sisterhood", text: "Kin means family. We bake side by side, for the people around us." },
  { title: "Small batches", text: "Each batch is baked for its pick-up date, never sitting on a shelf." },
  { title: "Your occasion", text: "Your colours, your words, piped on by hand for the day it matters." },
];

type Props = {
  /** Hide the "Learn more" link when already on the About page. */
  showLink?: boolean;
};

export function About({ showLink = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    tl.from("[data-about-panel]", { autoAlpha: 0, y: 40, duration: 0.8, ease: "power3.out", clearProps: "transform" })
      .from("[data-about-text]", { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, "-=0.4")
      .fromTo(
        "[data-about-image]",
        { clipPath: "inset(100% 0% 0% 0% round 1.25rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1.1, ease: "power4.inOut" },
        "-=0.7",
      )
      .from("[data-about-image] img", { scale: 1.35, duration: 1.4, ease: "power3.out" }, "<")
      .from(
        "[data-value]",
        { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: "power3.out", clearProps: "transform" },
        "-=0.9",
      );

    gsap.to("[data-about-image] img", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <section ref={ref} aria-labelledby="about-title" className="container-site pt-14 sm:pt-20">
      <div
        data-about-panel
        className="grid gap-8 rounded-3xl bg-oat px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-2 md:gap-10 xl:grid-cols-[1.15fr_1fr_0.95fr] xl:items-center xl:px-10"
      >
        <div className="md:self-center">
          <h2
            id="about-title"
            data-about-text
            className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink xl:text-[clamp(2rem,1rem+1.2vw,2.5rem)]"
          >
            The heart in the middle of the K
          </h2>
          <p data-about-text className="mt-5 text-[15px] leading-relaxed text-muted">
            Kin Kitchen is a sisterhood kitchen. We started in 2026 baking banana loaves and brownies for the people
            around us, and the heart in our logo is the one we share.
          </p>
          <p data-about-text className="mt-2 text-[15px] leading-relaxed text-muted">
            Sweet memories, created together: a box for the birthday, a loaf for the merienda, a cake for the mom who
            does everything.
          </p>
          {showLink && (
            <span data-about-text className="mt-7 block">
              <ButtonLink href="/about" fluid>
                More about us
              </ButtonLink>
            </span>
          )}
        </div>

        <div
          data-about-image
          className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] sm:aspect-[16/11] md:aspect-[4/5] xl:aspect-[0.86]"
        >
          <Image
            src="/images/gift-boxes.webp"
            alt="White Kin Kitchen gift boxes tied with orange and black ribbon"
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 90vw"
            className="scale-110 object-cover"
          />
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4 md:col-span-2 xl:col-span-1 xl:grid-cols-1">
          {values.map(({ title, text }) => (
            <li
              key={title}
              data-value
              className="rounded-2xl bg-white px-5 py-4 shadow-sm shadow-brand/5 sm:py-5"
            >
              <h3 className="font-serif text-lg text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-snug text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
