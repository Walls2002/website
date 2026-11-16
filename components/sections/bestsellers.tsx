"use client";

import { useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

const favourites = products.filter((p) => p.favourite);

export function Bestsellers() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-heading-part]", { y: 30, autoAlpha: 0, duration: 0.7, ease: "power3.out" })
      .from("[data-underline]", { scaleX: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
      .from("[data-view-all]", { x: 20, autoAlpha: 0, duration: 0.5 }, "<")
      .from(
        "[data-product-card]",
        { y: 60, rotate: 2, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "transform" },
        "-=0.3",
      )
      .from(
        "[data-product-card] img",
        { scale: 1.25, duration: 1, stagger: 0.1, ease: "power2.out", clearProps: "transform" },
        "<",
      );
  });

  return (
    <section ref={ref} aria-labelledby="bestsellers-title" className="container-site pt-14 sm:pt-20">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading title={<span id="bestsellers-title">Kin favourites</span>} underline />
        <span data-view-all className="mb-4 shrink-0">
          <ButtonLink href="/menu" size="sm">
            Full menu
          </ButtonLink>
        </span>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:gap-6">
        {favourites.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
