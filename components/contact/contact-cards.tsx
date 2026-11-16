"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useMotion } from "@/lib/gsap";
import { pickupPoints, site, telHref } from "@/lib/site";

const cards = [
  { title: "Message us", lines: ["Facebook Messenger", "Replies from the kitchen"], href: site.messengerUrl },
  { title: "Call or text", lines: [site.phone, site.phoneAlt], href: telHref(site.phone) },
  { title: "Email us", lines: [site.email], href: `mailto:${site.email}` },
  { title: "Pick-up points", lines: pickupPoints.map((p) => p.label), href: "/location" },
];

export function ContactCards() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    gsap.from("[data-contact-card]", {
      y: 40,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  return (
    <section ref={ref} aria-label="Contact details" className="container-site pt-12 sm:pt-16">
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {cards.map(({ title, lines, href }) => {
          const body = (
            <>
              <span className="block font-serif text-xl text-ink transition-colors group-hover:text-brand">{title}</span>
              {lines.map((l, i) => (
                <span key={i} className={`${i === 0 ? "mt-1.5" : "mt-0.5"} block text-sm break-words text-muted`}>
                  {l}
                </span>
              ))}
            </>
          );
          const cls =
            "group block h-full rounded-2xl border border-oat-line bg-white p-5 shadow-sm shadow-brand/5 transition-[box-shadow,border-color] sm:p-6";
          return (
            <li key={title} data-contact-card>
              {href?.startsWith("/") ? (
                <Link href={href} className={`${cls} hover:border-brand-soft hover:shadow-lg hover:shadow-brand/10`}>
                  {body}
                </Link>
              ) : href ? (
                <a href={href} className={`${cls} hover:border-brand-soft hover:shadow-lg hover:shadow-brand/10`}>
                  {body}
                </a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
