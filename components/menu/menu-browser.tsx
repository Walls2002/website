"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Flip } from "gsap/Flip";
import { useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Select } from "@/components/ui/select";
import { categories, categoryImage, fromPrice, products, type CategorySlug } from "@/lib/data";
import { gsap, useGSAP, useMotion } from "@/lib/gsap";

gsap.registerPlugin(Flip);

type Filter = CategorySlug | "all";
type Sort = "picks" | "favourites" | "price" | "name";

const sortOptions = [
  { value: "picks", label: "Our picks" },
  { value: "favourites", label: "Favourites first" },
  { value: "price", label: "Price: low to high" },
  { value: "name", label: "Name: A to Z" },
];

const sorters: Record<Sort, (a: (typeof products)[number], b: (typeof products)[number]) => number> = {
  picks: (a, b) => a.order - b.order,
  favourites: (a, b) => Number(Boolean(b.favourite)) - Number(Boolean(a.favourite)) || a.order - b.order,
  price: (a, b) => fromPrice(a) - fromPrice(b) || a.order - b.order,
  name: (a, b) => a.name.localeCompare(b.name),
};

const toFilter = (value: string | null): Filter =>
  categories.some((c) => c.slug === value) ? (value as CategorySlug) : "all";

/**
 * Reads `?category=` in the browser so /menu can be a fully static page
 * (static export has no server to read search params). Render inside <Suspense>.
 */
export function MenuBrowserFromUrl() {
  const category = toFilter(useSearchParams().get("category"));
  return <MenuBrowser initialCategory={category} />;
}

export function MenuBrowser({ initialCategory }: { initialCategory: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialCategory);

  // Follow the URL when it changes underneath us (e.g. a header "Menu" dropdown link).
  const [lastInitial, setLastInitial] = useState(initialCategory);
  if (initialCategory !== lastInitial) {
    setLastInitial(initialCategory);
    setFilter(initialCategory);
  }
  const [sort, setSort] = useState<Sort>("picks");
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = useMemo(
    () => products.filter((p) => filter === "all" || p.category === filter).sort(sorters[sort]),
    [filter, sort],
  );

  // Capture positions before the list changes so Flip can animate the reflow.
  const capture = () => {
    if (gridRef.current) flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-menu-item]"));
  };

  const changeFilter = (next: Filter) => {
    if (next === filter) return;
    capture();
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(null, "", url);
  };

  const changeSort = (next: string) => {
    capture();
    setSort(next as Sort);
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      flipState.current = null;
      Flip.from(state, {
        targets: gridRef.current?.querySelectorAll("[data-menu-item]"),
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.03,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.15 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.3 }),
      });
    },
    { dependencies: [filter, sort], scope: rootRef },
  );

  useMotion(rootRef, (el) => {
    gsap.from("[data-menu-chip]", {
      y: 16,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
    gsap.from("[data-menu-item]", {
      y: 50,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
    });
  });

  const chips: { value: Filter; label: string; icon?: string }[] = [
    { value: "all", label: "All treats" },
    ...categories.map((c) => ({ value: c.slug, label: c.label, icon: categoryImage(c) })),
  ];

  return (
    <section ref={rootRef} aria-labelledby="menu-title" className="container-site pt-12 sm:pt-16">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="menu-title" className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink">
            Browse the menu
          </h2>
          <p className="mt-2 text-[15px] text-muted" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "treat" : "treats"}
            {filter !== "all" && <> in {categories.find((c) => c.slug === filter)?.label}</>}
          </p>
        </div>
        <Select label="Sort by" options={sortOptions} value={sort} onChange={changeSort} className="w-full sm:w-64" />
      </div>

      {/* Category chips: a swipeable rail on phones, wrapping row from tablet up. */}
      <div className="-mx-5 mt-6 sm:-mx-8 lg:mx-0">
        <ul
          aria-label="Filter by category"
          className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 sm:px-8 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          {chips.map((c) => {
            const active = filter === c.value;
            return (
              <li key={c.value} data-menu-chip className="shrink-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => changeFilter(c.value)}
                  className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand bg-brand text-white shadow-md shadow-brand/25"
                      : "border-oat-line bg-white text-ink hover:border-brand-soft hover:bg-oat"
                  }`}
                >
                  {c.icon && (
                    <Image src={c.icon} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
                  )}
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ul ref={gridRef} className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {visible.map((p) => (
          <li key={p.slug} data-menu-item data-flip-id={p.slug}>
            <ProductCard product={p} showDescription sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 50vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
