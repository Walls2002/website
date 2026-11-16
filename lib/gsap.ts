"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject } from "react";

// Shared by most pages. Page-specific plugins (Flip on /menu) register where they are used.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, DrawSVGPlugin, useGSAP);

export { DrawSVGPlugin, gsap, ScrollToPlugin, ScrollTrigger, useGSAP };

/** Only animate when the visitor hasn't asked for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Intro elements now have GSAP from-states applied, so the CSS pre-hide can go. */
export function releaseIntro() {
  document.documentElement.classList.remove("motion-pending");
}

/**
 * Scoped, reduced-motion-aware animation hook. Everything created inside
 * `setup` is reverted on unmount and when the media query stops matching.
 */
export function useMotion(scope: RefObject<HTMLElement | null>, setup: (self: HTMLElement) => void) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (scope.current) setup(scope.current);
        releaseIntro();
      });
    },
    { scope },
  );
}

/** Shared scroll-reveal: rise + fade, then drop the transform so no stacking context lingers. */
export function reveal(
  targets: gsap.TweenTarget,
  trigger: Element | string,
  vars: gsap.TweenVars = {},
  start = "top 85%",
) {
  return gsap.from(targets, {
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.12,
    clearProps: "transform",
    ...vars,
    scrollTrigger: { trigger, start, once: true },
  });
}
