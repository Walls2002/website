"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { ChevronIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { categories, products, type CategorySlug } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

type Filter = CategorySlug | "all";

const menu = [...products].sort((a, b) => a.order - b.order);
const categoryLabel = new Map(categories.map((c) => [c.slug, c.label]));
const chips: { value: Filter; label: string; icon?: string }[] = [
  { value: "all", label: "All treats" },
  ...categories.map((c) => ({ value: c.slug, label: c.label, icon: c.slug })),
];

const stepBtn = "grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-oat";

/**
 * The menu, inside the order form: pick treats straight into the basket without
 * leaving the page. It shares the basket store with the header and the menu page,
 * so whatever is added here is the same basket everywhere. Starts open while the
 * basket is empty and folded away once there's something in it, so a phone isn't
 * a long scroll of treats before the name fields.
 */
export function MenuPicker() {
  const { lines, add, setQty } = useCart();
  const qtyOf = new Map(lines.map((l) => [l.product.slug, l.qty]));
  const [filter, setFilter] = useState<Filter>("all");
  const [chosen, setChosen] = useState<boolean | null>(null);
  const open = chosen ?? lines.length === 0;
  const visible = menu.filter((p) => filter === "all" || p.category === filter);

  const panelRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(0);

  // Height follows `open`. The basket loads from storage right after hydration and can
  // flip the default, so changes in the first moments after mount snap instead of animating.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      if (!mountedAt.current) mountedAt.current = performance.now();
      const instant =
        performance.now() - mountedAt.current < 400 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(panel, { height: open ? "auto" : 0, duration: instant ? 0 : 0.5, ease: "power3.inOut", overwrite: true });
      if (open && !instant) {
        gsap.fromTo(
          panel.querySelectorAll("[data-pick-row]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.35, stagger: 0.025, delay: 0.1, overwrite: true },
        );
      }
    },
    { dependencies: [open], revertOnUpdate: false },
  );

  const toggleLabel = open ? "Hide the menu" : lines.length ? "Add more from the menu" : "Choose from the menu";

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="order-menu"
        onClick={() => setChosen(!open)}
        className="mt-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-oat-line px-4 text-left text-sm font-medium text-ink transition-colors hover:border-brand-soft hover:bg-oat focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {toggleLabel}
        <ChevronIcon className={`size-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        ref={panelRef}
        id="order-menu"
        inert={!open}
        aria-hidden={!open}
        className="overflow-hidden"
        style={{ height: open ? "auto" : 0 }}
      >
        <div className="pt-4">
          <div className="-mx-3 sm:-mx-4">
            <ul aria-label="Filter the menu" className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-1 sm:px-4 lg:flex-wrap">
              {chips.map((c) => {
                const active = filter === c.value;
                return (
                  <li key={c.value} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(c.value)}
                      className={`flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        active
                          ? "border-brand bg-brand text-white shadow-md shadow-brand/25"
                          : "border-oat-line bg-white text-ink hover:border-brand-soft hover:bg-oat"
                      }`}
                    >
                      {c.icon && (
                        <Image
                          src={`/images/categories/${c.icon}.webp`}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 rounded-full object-cover"
                        />
                      )}
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <ul aria-label="Treats on the menu" className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-1">
            {visible.map((p) => {
              const qty = qtyOf.get(p.slug) ?? 0;
              return (
                <li key={p.slug} data-pick-row className="flex items-center gap-3 rounded-xl bg-oat p-2 pr-2.5">
                  <Image
                    src={`/images/products/${p.slug}.webp`}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-lg bg-cream object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug font-medium text-ink">{p.name}</span>
                    <span className="mt-0.5 block text-[13px] font-medium text-caramel-dark">
                      {categoryLabel.get(p.category)}
                    </span>
                  </span>
                  {qty ? (
                    <span data-allow-number className="flex shrink-0 items-center gap-1 rounded-full border border-oat-line bg-white p-0.5">
                      <button type="button" aria-label={`Remove one ${p.name}`} onClick={() => setQty(p.slug, qty - 1)} className={stepBtn}>
                        <MinusIcon className="size-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium" aria-live="polite">
                        {qty}
                      </span>
                      <button type="button" aria-label={`Add one more ${p.name}`} onClick={() => setQty(p.slug, qty + 1)} className={stepBtn}>
                        <PlusIcon className="size-3.5" />
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Add ${p.name} to your order`}
                      onClick={() => {
                        // Keep the menu open while they shop; it only folds when they say so.
                        setChosen(true);
                        add(p.slug);
                      }}
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
