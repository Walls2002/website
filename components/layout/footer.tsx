"use client";

import Link from "next/link";
import { useRef } from "react";
import { Logo } from "@/components/layout/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { gsap, useMotion } from "@/lib/gsap";
import { handleSamePageClick } from "@/lib/same-page";
import { pickupPoints, site, telHref } from "@/lib/site";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.from("[data-f-col]", {
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform",
    })
      .from("[data-f-social]", { scale: 0, duration: 0.45, stagger: 0.07, ease: "back.out(3)" }, "-=0.4")
      .from("[data-f-copy]", { autoAlpha: 0, duration: 0.6 }, "-=0.2");
  });

  return (
    <footer ref={ref} className="bg-brand-dark text-oat">
      <div className="container-site grid gap-x-8 gap-y-10 pt-14 pb-10 sm:grid-cols-2 lg:pt-16 xl:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div data-f-col className="sm:col-span-2 xl:col-span-1">
          <Link
            href="/"
            aria-label={`${site.legalName} home`}
            onClick={(e) => handleSamePageClick(e, "/")}
            className="inline-block"
          >
            <Logo tone="oat" motto />
          </Link>
          <p className="mt-5 max-w-xs font-serif text-lg leading-snug text-oat italic">{site.tagline}</p>
          <SocialLinks tone="oat" className="mt-4" />
        </div>

        <nav data-f-col aria-label="Quick links">
          <h3 className="text-base font-semibold text-white">Quick links</h3>
          <ul className="mt-4 space-y-1 text-[15px] text-oat/80">
            {site.nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={(e) => handleSamePageClick(e, item.href)}
                  className="inline-flex min-h-9 items-center hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav data-f-col aria-label="Ordering help">
          <h3 className="text-base font-semibold text-white">Ordering help</h3>
          <ul className="mt-4 space-y-1 text-[15px] text-oat/80">
            {site.help.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="inline-flex min-h-9 items-center hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div data-f-col className="sm:col-span-2 xl:col-span-1">
          <h3 className="text-base font-semibold text-white">Pick-up and contact</h3>
          <ul className="mt-4 grid gap-3.5 text-[15px] text-oat/80 sm:grid-cols-2 xl:grid-cols-1">
            <li>
              <Link href="/location" className="hover:text-white">
                {pickupPoints.map((p) => (
                  <span key={p.value} className="block">
                    {p.label}
                  </span>
                ))}
              </Link>
            </li>
            <li>
              <a href={telHref(site.phone)} className="block hover:text-white">
                {site.phone}
              </a>
              <a href={telHref(site.phoneAlt)} className="block hover:text-white">
                {site.phoneAlt}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p data-f-copy className="container-site border-t border-white/10 py-6 text-center text-sm text-oat/70">
        © {new Date().getFullYear()} {site.legalName}. Baked in Quezon City and San Jose del Monte.
      </p>
    </footer>
  );
}
