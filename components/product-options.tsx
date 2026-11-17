"use client";

import { useId, useState } from "react";
import { flavourText, lineKey, useCart } from "@/components/cart/cart-context";
import { PlusIcon } from "@/components/icons";
import { peso, savingOf, type Product } from "@/lib/data";
import { gsap } from "@/lib/gsap";

type Props = {
  product: Product;
  className?: string;
  /** Runs after a size is added (the order form keeps its menu open). */
  onAdd?: () => void;
  /** The ground it sits on, so the row hover stays visible. */
  surface?: "white" | "oat";
};

/**
 * A product's sizes as a price list, like the menu flyer: "Box of 6 ---- ₱159".
 * Each row is one tap to add that size; once it's in the basket the disc shows
 * how many. Products with flavours ask for one first (the cinnamon roll glaze).
 * Sized by its own width (container queries), so it fits a narrow phone card
 * and a wide order-form row alike.
 */
export function ProductOptions({ product, className = "", onAdd, surface = "white" }: Props) {
  const hover = surface === "oat" ? "hover:bg-white" : "hover:bg-oat";
  const { lines, add } = useCart();
  const group = useId();
  const [flavourId, setFlavourId] = useState(product.flavours?.choices[0]?.id ?? null);
  const flavour = product.flavours?.choices.find((f) => f.id === flavourId) ?? null;
  const qtyOf = new Map(lines.map((l) => [l.key, l.qty]));

  const pick = (key: string, button: HTMLButtonElement) => {
    add(key);
    onAdd?.();
    const disc = button.querySelector("[data-add-disc]");
    if (disc && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(disc, { scale: 0.6, rotate: -25 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" });
    }
  };

  return (
    <div className={`@container ${className}`}>
      {product.flavours && (
        <fieldset className="mb-2.5">
          <legend className="mb-1.5 text-xs font-medium text-muted">{product.flavours.name}</legend>
          <div className="flex flex-wrap gap-1.5">
            {product.flavours.choices.map((f) => (
              <label
                key={f.id}
                className="flex min-h-9 cursor-pointer items-center rounded-full border border-oat-line bg-white px-3 text-[13px] font-medium text-ink transition-colors hover:border-brand-soft has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
              >
                <input
                  type="radio"
                  name={group}
                  value={f.id}
                  checked={flavourId === f.id}
                  onChange={() => setFlavourId(f.id)}
                  className="sr-only"
                />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <ul aria-label={`${product.name} sizes`} className="-mx-1.5 divide-y divide-oat-line border-t border-oat-line">
        {product.options.map((o) => {
          const key = lineKey(product.slug, o.id, flavourId);
          const qty = qtyOf.get(key) ?? 0;
          const save = savingOf(product, o);
          const what = [product.name, o.label, flavourText(product, flavour)].filter(Boolean).join(", ");
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={(e) => pick(key, e.currentTarget)}
                aria-label={
                  qty
                    ? `Add another ${what}, ${peso(o.price)}. ${qty} in your basket`
                    : `Add ${what} to your basket, ${peso(o.price)}`
                }
                className={`grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-1.5 rounded-lg px-1.5 py-1.5 text-left transition-colors ${hover} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand @[12rem]:gap-x-2`}
              >
                <span className="text-[13px] font-medium whitespace-nowrap text-ink @[12rem]:text-sm">{o.label}</span>
                <span aria-hidden className="border-t border-dashed border-oat-line" />
                <span className="text-[13px] font-semibold text-ink tabular-nums @[12rem]:text-sm">{peso(o.price)}</span>
                <span
                  data-add-disc
                  data-allow-number
                  className={`grid size-5 place-items-center rounded-full text-white transition-colors @[12rem]:size-6 ${
                    qty ? "bg-caramel text-[11px] font-semibold" : "bg-brand"
                  }`}
                >
                  {qty ? qty : <PlusIcon className="size-3 @[12rem]:size-3.5" />}
                </span>
                {save > 0 && (
                  <span className="col-span-4 text-xs leading-snug font-medium text-caramel-dark">Save {peso(save)}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
