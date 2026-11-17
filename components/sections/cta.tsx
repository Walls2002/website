"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useMotion } from "@/lib/gsap";

type Props = {
  title?: [string, string];
  text?: string;
  cta?: { label: string; href: string };
  /** Section spacing/background; defaults to the home layout, where it closes the page. */
  className?: string;
};

export function Cta({
  title = ["Little treats,", "big celebrations."],
  text = "Fill a basket for the next batch and we'll confirm everything by message.",
  cta = { label: "Start a pre-order", href: "/menu" },
  className = "pt-14 pb-14 sm:pt-20 sm:pb-20",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-cta-card]", {
      scale: 0.92,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform",
    })
      .from("[data-cta-line]", { yPercent: 170, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5")
      .from("[data-cta-fade]", { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.08, clearProps: "transform" }, "-=0.4")
      .from("[data-cta-art]", { x: 80, rotate: 6, autoAlpha: 0, duration: 1.1, ease: "power3.out" }, 0.2)
      .from("[data-cta-spark]", { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "back.out(3)" }, "-=0.6");

    gsap.to("[data-cta-spark]", {
      y: -8,
      duration: 1.8,
      stagger: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 1.5,
    });
  });

  return (
    <section ref={ref} aria-labelledby="cta-title" className={className}>
      <div className="container-site">
        <div
          data-cta-card
          className="relative isolate flex flex-col overflow-hidden rounded-3xl bg-brand text-white md:min-h-[320px] md:flex-row md:items-center"
        >
          <div className="relative z-10 px-6 pt-10 sm:px-10 md:w-[50%] md:py-14 lg:px-14">
            <h2 id="cta-title" className="font-serif text-[clamp(2.1rem,1.5rem+2vw,3.25rem)] leading-[1.08] font-black! tracking-[-0.01em]">
              <span className="line-mask block">
                <span data-cta-line className="block">
                  {title[0]}
                </span>
              </span>
              <span className="line-mask block">
                <span data-cta-line className="block">
                  {title[1]}
                </span>
              </span>
            </h2>
            <p data-cta-fade className="mt-3 max-w-xs text-[15px] text-white/85 sm:text-base">
              {text}
            </p>
            <span data-cta-fade className="mt-6 block">
              <ButtonLink href={cta.href} variant="white" fluid>
                {cta.label}
              </ButtonLink>
            </span>
          </div>

          <div className="relative mt-4 aspect-[16/10] w-full md:absolute md:inset-y-0 md:right-0 md:mt-0 md:aspect-auto md:w-[58%]">
            <div data-cta-art className="absolute inset-0">
              <Image
                src="/images/birthday-box.webp"
                alt="Red Happy Birthday gift box of brownies beside stacked Kin Kitchen boxes"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-[50%_42%]"
              />
            </div>
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-brand to-transparent md:inset-y-0 md:right-auto md:h-auto md:w-1/3 md:bg-gradient-to-r" />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="absolute top-[18%] left-[16%] hidden size-12 text-latte md:block"
              fill="currentColor"
              data-cta-spark
            >
              <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
            </svg>
            <span
              data-cta-spark
              className="absolute top-[12%] left-[30%] hidden size-2 rounded-full bg-white/70 md:block"
            />
            <span
              data-cta-spark
              className="absolute top-[40%] left-[10%] hidden size-1.5 rounded-full bg-latte md:block"
            />
            <span
              data-cta-spark
              className="absolute top-[30%] left-[36%] hidden size-1 rounded-full bg-white md:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
