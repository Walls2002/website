"use client";

import type { MouseEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** True when `href` points at the page already on screen (ignoring hashes, keeping any active filters). */
export function isSamePage(href: string) {
  const url = new URL(href, window.location.href);
  // Routes export with a trailing slash (/menu/), while nav hrefs are written without one.
  const path = (p: string) => p.replace(/(.)\/$/, "$1");
  return (
    path(url.pathname) === path(window.location.pathname) &&
    (url.search === "" || url.search === window.location.search) &&
    url.hash === ""
  );
}

/** Glide back to the top from wherever the visitor is, scaled to the distance travelled. */
export function scrollToTop() {
  const distance = window.scrollY;
  if (distance < 2) return;
  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  // CSS smooth scrolling would fight GSAP's per-frame updates, so switch it off for the ride.
  const root = document.documentElement;
  const restore = () => (root.style.scrollBehavior = "");
  root.style.scrollBehavior = "auto";
  gsap.to(window, {
    scrollTo: 0,
    duration: gsap.utils.clamp(0.5, 1.4, distance / 2500),
    ease: "power3.inOut",
    overwrite: "auto",
    onComplete: restore,
    onInterrupt: restore,
  });
}

/**
 * onClick for nav links: if the link targets the current page, cancel the (no-op)
 * navigation and scroll to the top instead. `before` lets callers close menus first.
 */
export function handleSamePageClick(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  before?: (done: () => void) => void,
) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (!isSamePage(href)) return false;
  e.preventDefault();
  if (before) before(scrollToTop);
  else scrollToTop();
  return true;
}
