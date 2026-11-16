"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import {
  ArrowRightIcon,
  BagIcon,
  ChevronIcon,
  CloseIcon,
  MenuIcon,
  MinusIcon,
  PlusIcon,
} from "@/components/icons";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { categories } from "@/lib/data";
import { gsap, MOTION_OK, prefersReducedMotion, releaseIntro, useGSAP } from "@/lib/gsap";
import { handleSamePageClick } from "@/lib/same-page";
import { site } from "@/lib/site";

type Panel = "menu" | "cart" | null;

const categoryLabel = new Map(categories.map((c) => [c.slug, c.label]));

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const { lines, count, setQty, pulse } = useCart();
  const [panel, setPanel] = useState<Panel>(null);
  const [drawer, setDrawer] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelExit = useRef<gsap.core.Tween | null>(null);
  const drawerExit = useRef<gsap.core.Timeline | null>(null);

  /** Fade/lift the open dropdown away, then unmount it (and optionally run `then`). */
  const closePanel = (then?: () => void) => {
    const el = headerRef.current?.querySelector<HTMLElement>("[data-panel]");
    if (!el) {
      setPanel(null);
      then?.();
      return;
    }
    if (panelExit.current) return;
    gsap.killTweensOf(el);
    panelExit.current = gsap.to(el, {
      autoAlpha: 0,
      y: -8,
      scale: 0.97,
      duration: prefersReducedMotion() ? 0 : 0.2,
      ease: "power2.in",
      onComplete: () => {
        panelExit.current = null;
        setPanel(null);
        then?.();
      },
    });
  };

  /** Cancel an in-flight close (e.g. the pointer came back to "Menu") and restore the panel. */
  const cancelPanelClose = () => {
    const tween = panelExit.current;
    if (!tween) return;
    tween.kill();
    panelExit.current = null;
    gsap.to(tween.targets(), { autoAlpha: 1, y: 0, scale: 1, duration: 0.15 });
  };

  /** Reverse the drawer: links tuck away, panel slides out, backdrop fades, then unmount. */
  const closeDrawer = (then?: () => void) => {
    const root = drawerRef.current;
    if (!root) {
      setDrawer(false);
      then?.();
      return;
    }
    if (drawerExit.current) return;
    const q = gsap.utils.selector(root);
    // Stop the entrance if it's still playing so the exit starts from where things are.
    gsap.killTweensOf(q("[data-drawer-item], [data-drawer-panel], [data-drawer-backdrop]"));
    drawerExit.current = gsap
      .timeline({
        onComplete: () => {
          drawerExit.current = null;
          setDrawer(false);
          // Wait a frame so the page scroll lock is lifted before anything scrolls.
          if (then) requestAnimationFrame(then);
        },
      })
      .to(q("[data-drawer-item]"), { x: 24, autoAlpha: 0, duration: 0.18, stagger: { each: 0.03, from: "end" } })
      .to(q("[data-drawer-panel]"), { xPercent: 100, duration: 0.35, ease: "power3.in" }, 0.08)
      .to(q("[data-drawer-backdrop]"), { autoAlpha: 0, duration: 0.3 }, 0.12);
    if (prefersReducedMotion()) drawerExit.current.progress(1);
  };

  // Close whatever is open when the route changes (e.g. browser back/forward).
  useEffect(() => {
    if (panel) closePanel();
    if (drawer) closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to navigation
  }, [pathname]);

  // Outside click + Escape close the open dropdown.
  useEffect(() => {
    if (!panel) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) closePanel();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  // Lock page scroll behind the mobile drawer. Hiding the root overflow removes the page
  // scrollbar (tablets and narrow desktop windows have one), so pad the root by its width
  // or everything under the backdrop jumps sideways.
  useEffect(() => {
    if (!drawer) return;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    const unlock = () => {
      root.style.overflow = "";
      root.style.paddingRight = "";
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    return () => {
      unlock();
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  // Intro: logo drops in, links cascade, actions pop.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          // clearProps: a leftover transform would become the containing block for the
          // fixed-position basket panel on phones and trap it inside the icon button.
          .timeline({ defaults: { ease: "power3.out", clearProps: "transform" } })
          .from("[data-h-logo]", { y: -24, autoAlpha: 0, duration: 0.7 })
          .from("[data-h-link]", { y: -14, autoAlpha: 0, duration: 0.5, stagger: 0.06 }, "-=0.4")
          .from(
            "[data-h-action]",
            {
              scale: 0.6,
              autoAlpha: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "back.out(2.5)",
            },
            "-=0.35",
          );
        releaseIntro();
      });
    },
    { scope: headerRef },
  );

  // Dropdown panel entrance.
  useGSAP(
    () => {
      if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        `[data-panel="${panel}"]`,
        { autoAlpha: 0, y: -10, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" },
      );
      gsap.from(`[data-panel="${panel}"] [data-panel-item]`, {
        y: 8,
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.035,
        delay: 0.05,
      });
    },
    { scope: headerRef, dependencies: [panel] },
  );

  // Basket badge bounce whenever something is added.
  useGSAP(
    () => {
      if (!pulse || !badgeRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(badgeRef.current, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    },
    { dependencies: [pulse] },
  );

  // Mobile drawer slide + link cascade.
  useGSAP(
    () => {
      if (!drawer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline()
        .from("[data-drawer-backdrop]", { autoAlpha: 0, duration: 0.25 })
        .from("[data-drawer-panel]", { xPercent: 100, duration: 0.45, ease: "power3.out" }, 0)
        .from(
          "[data-drawer-item]",
          {
            x: 30,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.15,
        );
    },
    { scope: drawerRef, dependencies: [drawer] },
  );

  const open = (p: Exclude<Panel, null>) => {
    if (panel === p) return cancelPanelClose();
    if (panel) closePanel(() => setPanel(p));
    else setPanel(p);
  };
  const toggle = (p: Exclude<Panel, null>) => (panel === p && !panelExit.current ? closePanel() : open(p));
  const hoverOpen = () => {
    clearTimeout(hoverTimer.current);
    if (window.matchMedia("(hover: hover)").matches) open("menu");
  };
  const hoverClose = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    hoverTimer.current = setTimeout(() => panel === "menu" && closePanel(), 180);
  };
  /** Nav links: close any open menu, and if the link is for this page, glide to the top instead. */
  const onNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (drawer) {
      if (!handleSamePageClick(e, href, (scroll) => closeDrawer(scroll))) closeDrawer();
    } else if (panel) {
      if (!handleSamePageClick(e, href, (scroll) => closePanel(scroll))) closePanel();
    } else {
      handleSamePageClick(e, href);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-oat-line/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            data-intro
            data-h-logo
            aria-label={`${site.legalName} home`}
            onClick={onNavClick("/")}
            className="shrink-0"
          >
            <Logo priority />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1 text-[15px] font-medium text-ink 2xl:gap-3">
              {site.nav.map((item) =>
                item.label === "Menu" ? (
                  <li
                    key={item.label}
                    data-intro
                    data-h-link
                    className="relative"
                    onMouseEnter={hoverOpen}
                    onMouseLeave={hoverClose}
                  >
                    <button
                      type="button"
                      aria-expanded={panel === "menu"}
                      aria-controls="menu-panel"
                      onClick={() =>
                        // Hover already opened it on pointer devices; a click there should keep it open.
                        window.matchMedia("(hover: hover)").matches ? open("menu") : toggle("menu")
                      }
                      className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors hover:text-brand ${
                        isActive(pathname, item.href) ? "text-brand" : ""
                      }`}
                    >
                      {item.label}
                      <ChevronIcon
                        className={`size-3.5 transition-transform ${panel === "menu" ? "rotate-180" : ""}`}
                      />
                    </button>
                    {panel === "menu" && (
                      <div className="absolute top-[calc(100%+14px)] left-1/2 z-50 w-[560px] -translate-x-1/2">
                        <div
                          id="menu-panel"
                          data-panel="menu"
                          className="rounded-2xl border border-oat-line bg-white p-3 shadow-2xl shadow-ink/10"
                        >
                          <ul className="grid grid-cols-2 gap-1">
                            {categories.map((c) => (
                              <li key={c.slug} data-panel-item>
                                <Link
                                  href={`/menu?category=${c.slug}`}
                                  onClick={onNavClick(`/menu?category=${c.slug}`)}
                                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-oat"
                                >
                                  <span className="grid size-12 shrink-0 place-items-center">
                                    <Image
                                      src={`/images/categories/${c.slug}.webp`}
                                      alt=""
                                      width={40}
                                      height={40}
                                      className="size-10 rounded-full object-cover"
                                    />
                                  </span>
                                  <span>
                                    <span className="block text-[15px] font-semibold text-ink">{c.label}</span>
                                    <span className="block text-[13px] font-normal text-muted">{c.blurb}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            data-panel-item
                            href="/menu"
                            onClick={onNavClick("/menu")}
                            className="mt-2 flex items-center justify-between rounded-xl bg-oat px-4 py-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
                          >
                            View full menu <ArrowRightIcon className="size-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.label} data-intro data-h-link>
                    <Link
                      href={item.href}
                      onClick={onNavClick(item.href)}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`relative block rounded-full px-4 py-2 transition-colors hover:text-brand ${
                        isActive(pathname, item.href) ? "text-brand" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative" data-intro data-h-action>
              <button
                type="button"
                aria-label={`Basket, ${count} items`}
                aria-expanded={panel === "cart"}
                onClick={() => toggle("cart")}
                className="relative grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-oat hover:text-brand"
              >
                <BagIcon className="size-6" />
                {count > 0 && (
                  <span
                    ref={badgeRef}
                    data-allow-number
                    className="absolute top-1 right-1 grid size-[18px] place-items-center rounded-full bg-caramel text-[10px] font-semibold text-white"
                  >
                    {count}
                  </span>
                )}
              </button>
              {panel === "cart" && (
                <div
                  data-panel="cart"
                  className="fixed inset-x-3 top-[80px] z-50 rounded-2xl border border-oat-line bg-white p-4 shadow-2xl shadow-ink/15 sm:absolute sm:inset-x-auto sm:top-[calc(100%+14px)] sm:right-0 sm:w-[380px]"
                >
                  <p
                    data-panel-item
                    className="flex items-center justify-between pb-3 text-base font-semibold text-ink"
                  >
                    Your basket <span className="text-sm font-normal text-muted">{count} items</span>
                  </p>
                  {lines.length === 0 ? (
                    <p data-panel-item className="rounded-xl bg-oat px-4 py-6 text-center text-sm text-muted">
                      Your basket is empty. Pick something from the menu to pre-order.
                    </p>
                  ) : (
                    // The list scrolls, so it animates as one block: a translated child would
                    // overflow the scroller mid-entrance and flash its scrollbar (AGENTS.md).
                    <ul data-panel-item className="max-h-[45vh] space-y-2 overflow-x-hidden overflow-y-auto overscroll-contain">
                      {lines.map(({ product, qty }) => (
                        <li
                          key={product.slug}
                          className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-oat/60"
                        >
                          <Image
                            src={`/images/products/${product.slug}.webp`}
                            alt=""
                            width={56}
                            height={56}
                            className="size-14 rounded-lg bg-cream object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                            <p className="text-sm text-muted">{categoryLabel.get(product.category)}</p>
                          </div>
                          <div
                            data-allow-number
                            className="flex items-center gap-1 rounded-full border border-oat-line p-0.5"
                          >
                            <button
                              type="button"
                              aria-label={`Remove one ${product.name}`}
                              onClick={() => setQty(product.slug, qty - 1)}
                              className="grid size-8 place-items-center rounded-full text-ink hover:bg-oat"
                            >
                              <MinusIcon className="size-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-medium">{qty}</span>
                            <button
                              type="button"
                              aria-label={`Add one ${product.name}`}
                              onClick={() => setQty(product.slug, qty + 1)}
                              className="grid size-8 place-items-center rounded-full text-ink hover:bg-oat"
                            >
                              <PlusIcon className="size-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p data-panel-item className="mt-3 border-t border-oat-line pt-3 text-sm leading-relaxed text-muted">
                    We confirm the price and pick-up details by message before we bake.
                  </p>
                  <ButtonLink
                    data-panel-item
                    href="/order#order"
                    onClick={onNavClick("/order#order")}
                    className="mt-3 w-full"
                  >
                    {lines.length ? "Send pre-order" : "Choose your treats"}
                  </ButtonLink>
                </div>
              )}
            </div>

            <span data-intro data-h-action className="hidden sm:block">
              <ButtonLink href="/order" size="sm" onClick={onNavClick("/order")} className="ml-2">
                Pre-order
              </ButtonLink>
            </span>

            <button
              type="button"
              data-intro
              data-h-action
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-oat xl:hidden"
              aria-label="Open menu"
              aria-expanded={drawer}
              aria-controls="mobile-drawer"
              onClick={() => (panel ? closePanel(() => setDrawer(true)) : setDrawer(true))}
            >
              <MenuIcon className="size-7" />
            </button>
          </div>
        </div>
      </header>

      {drawer && (
        <div
          ref={drawerRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          // Clip: the panel slides in from off-screen, which would otherwise widen the page mid-animation.
          className="fixed inset-0 z-[60] overflow-hidden xl:hidden"
        >
          <button
            type="button"
            data-drawer-backdrop
            aria-label="Close menu"
            onClick={() => closeDrawer()}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            data-drawer-panel
            className="absolute inset-y-0 right-0 flex w-[min(88vw,400px)] flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-white px-6 pt-5 pb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => closeDrawer()}
                className="grid size-11 place-items-center rounded-full text-ink hover:bg-oat"
              >
                <CloseIcon className="size-7" />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-8">
              <ul className="space-y-1">
                {site.nav.map((item) => (
                  <li key={item.label} data-drawer-item>
                    <Link
                      href={item.href}
                      onClick={onNavClick(item.href)}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`flex min-h-12 items-center justify-between rounded-xl px-4 font-serif text-2xl ${
                        isActive(pathname, item.href) ? "bg-oat text-brand" : "text-ink"
                      }`}
                    >
                      {item.label}
                      <ArrowRightIcon className="size-5 opacity-50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div data-drawer-item className="mt-8">
              <p className="px-1 text-sm font-semibold text-ink">Shop by bake</p>
              <ul className="mt-3 grid grid-cols-3 gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/menu?category=${c.slug}`}
                      onClick={onNavClick(`/menu?category=${c.slug}`)}
                      className="flex flex-col items-center gap-1.5 rounded-xl bg-latte-soft px-1 py-3 text-xs font-semibold text-ink"
                    >
                      <Image
                        src={`/images/categories/${c.slug}.webp`}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div data-drawer-item className="mt-auto space-y-3 pt-8">
              <ButtonLink href="/order" onClick={onNavClick("/order")} className="w-full">
                Pre-order
              </ButtonLink>
              <ButtonLink href={site.messengerUrl} variant="outline" className="w-full">
                Message us
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
