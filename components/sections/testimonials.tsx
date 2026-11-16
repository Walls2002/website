"use client";

import Image from "next/image";
import { useRef } from "react";
import { testimonials } from "@/lib/data";
import { gsap, useMotion } from "@/lib/gsap";

/**
 * One real review, shown large beside the message it came in. More reviews
 * join `testimonials` in lib/data.ts as customers send them; the first one
 * leads, the rest stack under it.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const [lead, ...rest] = testimonials;

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true } });
    tl.from("[data-t-title]", { y: 30, autoAlpha: 0, duration: 0.7, ease: "power3.out" })
      .fromTo(
        "[data-t-shot]",
        { clipPath: "inset(0% 0% 100% 0% round 2rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.1, ease: "power4.inOut" },
        "-=0.4",
      )
      .from("[data-t-shot] img", { scale: 1.2, duration: 1.3, ease: "power3.out" }, "<")
      .from("[data-t-quote]", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, "-=0.9");
  });

  return (
    <section ref={ref} aria-labelledby="reviews-title" className="mt-14 bg-latte-soft py-14 sm:mt-20 sm:py-20">
      <div className="container-site grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div
          data-t-shot
          className="relative mx-auto aspect-[718/926] w-full max-w-[300px] overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-xl shadow-brand/15 md:max-w-[340px]"
        >
          <Image
            src="/images/review-messenger.webp"
            alt="A customer's Messenger message praising the cake, with a photo of the cake at their party"
            fill
            sizes="(min-width: 768px) 340px, 300px"
            className="object-cover"
          />
        </div>

        <figure>
          <h2
            id="reviews-title"
            data-t-title
            className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink"
          >
            Straight from the inbox
          </h2>
          <blockquote data-t-quote className="mt-6">
            <p className="font-serif text-[clamp(1.4rem,1.1rem+1.1vw,2.1rem)] leading-snug text-brand italic">
              &ldquo;{lead.quote}&rdquo;
            </p>
          </blockquote>
          <p data-t-quote className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-muted">
            {lead.translation}
          </p>
          <figcaption data-t-quote className="mt-5 text-sm font-semibold text-ink">
            {lead.source}
          </figcaption>
          {rest.length > 0 && (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {rest.map((r) => (
                <li key={r.quote} className="rounded-2xl bg-white p-5 text-[15px] leading-relaxed text-ink">
                  <p>&ldquo;{r.quote}&rdquo;</p>
                  <p className="mt-3 text-sm text-muted">{r.source}</p>
                </li>
              ))}
            </ul>
          )}
        </figure>
      </div>
    </section>
  );
}
