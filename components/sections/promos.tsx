"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { gsap, useMotion } from "@/lib/gsap";

export function Promos() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-promo='left']", { x: -60, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "transform" })
      .from(
        "[data-promo='right']",
        { x: 60, autoAlpha: 0, duration: 0.9, ease: "power3.out", clearProps: "transform" },
        "<0.1",
      )
      .from("[data-promo-art]", { scale: 1.25, autoAlpha: 0, duration: 1.2, stagger: 0.15, ease: "power2.out" }, "<")
      .from("[data-promo-text]", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: "power2.out" }, "-=0.9");
  });

  return (
    <section
      ref={ref}
      aria-label="Offers"
      className="container-site grid gap-5 pt-12 sm:gap-6 sm:pt-16 lg:grid-cols-[1fr_1.03fr]"
    >
      <article
        data-promo="left"
        className="relative isolate flex min-h-[250px] overflow-hidden rounded-3xl bg-brand text-white sm:min-h-[300px]"
      >
        <div className="absolute inset-y-0 right-0 -z-10 w-[52%] sm:w-[55%]">
          <Image
            data-promo-art
            src="/images/promo-loaves.webp"
            alt="Banana loaves with streusel and choco chips beside a ripe banana"
            fill
            sizes="(min-width: 1024px) 22vw, 55vw"
            className="object-cover object-[60%_50%]"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-brand to-transparent" />
        </div>
        <div className="flex max-w-[60%] flex-col justify-center p-6 sm:max-w-[52%] sm:p-10 lg:max-w-[64%] lg:p-8 xl:max-w-[52%] xl:p-10">
          <h2 data-promo-text className="font-serif text-[clamp(1.9rem,1.5rem+1.4vw,2.75rem)] leading-[1.08]">
            Banana loaves
          </h2>
          <p data-promo-text className="mt-2 text-base font-medium text-latte sm:text-lg">
            Streusel or choco chip
          </p>
          <p data-promo-text className="mt-3 hidden text-sm leading-relaxed text-white/85 sm:block lg:hidden xl:block">
            Our pre-order regulars, baked in their own tins and boxed for merienda.
          </p>
          <span data-promo-text className="mt-5 sm:mt-6">
            <ButtonLink href="/menu?category=loaves" variant="white" size="sm">
              See the loaves
            </ButtonLink>
          </span>
        </div>
      </article>

      <article
        data-promo="right"
        className="relative isolate flex min-h-[250px] overflow-hidden rounded-3xl bg-latte sm:min-h-[300px]"
      >
        <div className="absolute inset-y-0 right-0 -z-10 w-[34%] sm:w-[42%]">
          <Image
            data-promo-art
            src="/images/promo-cake.webp"
            alt="White birthday cake piped with pink rosettes and lettered Ms 20 Something"
            fill
            sizes="(min-width: 1024px) 22vw, 50vw"
            className="object-cover object-[50%_45%]"
          />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-latte to-transparent" />
        </div>
        <div className="flex max-w-[68%] flex-col justify-center p-6 sm:max-w-none sm:p-10">
          <h2
            data-promo-text
            className="font-serif text-[clamp(2.2rem,1.8rem+1.6vw,3.1rem)] leading-none text-caramel-dark italic"
          >
            Your words
          </h2>
          <p data-promo-text className="mt-2 text-lg font-medium text-ink sm:text-xl">
            Piped on top, made to order
          </p>
          <span data-promo-text className="mt-5 sm:mt-7">
            <ButtonLink href="/contact#order" variant="caramel" size="sm">
              Plan a cake
            </ButtonLink>
          </span>
        </div>
      </article>
    </section>
  );
}
