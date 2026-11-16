"use client";

import Image from "next/image";
import { useRef } from "react";
import { useCart } from "@/components/cart/cart-context";
import { CartIcon } from "@/components/icons";
import { categories, type Product } from "@/lib/data";
import { gsap } from "@/lib/gsap";

type Props = {
  product: Product;
  showDescription?: boolean;
  sizes?: string;
};

const categoryLabel = new Map(categories.map((c) => [c.slug, c.label]));

export function ProductCard({
  product,
  showDescription,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 50vw",
}: Props) {
  const { add } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  const onAdd = () => {
    add(product.slug);
    if (btnRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.8, rotate: -20 },
        { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" },
      );
    }
  };

  return (
    <article
      data-product-card
      className="group @container flex h-full flex-col rounded-2xl border border-oat-line bg-white p-2 shadow-sm shadow-brand/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-brand/15 sm:p-2.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-cream sm:aspect-[1.15]">
        <Image
          src={`/images/products/${product.slug}.webp`}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {/*
        Content-aware layout (container query on the card):
        - narrow cards: name and description span the full width so names don't wrap,
          price and basket button share the bottom row;
        - wide cards (15rem+ of content width): the reference layout, with the button beside name and price.
      */}
      <div
        className={`grid flex-1 grid-cols-[1fr_auto] items-end gap-x-2 px-1.5 pt-3 pb-1.5 sm:px-2 sm:pt-4 sm:pb-2 ${
          showDescription ? "grid-rows-[auto_auto_1fr]" : "grid-rows-[auto_1fr]"
        }`}
      >
        <h3 className="col-span-2 self-start text-[13px] leading-snug font-medium text-ink @[9rem]:text-sm @[12rem]:text-base @[15rem]:col-span-1">
          {product.name}
        </h3>
        {showDescription && (
          <p className="col-span-2 mt-1 line-clamp-2 hidden self-start text-[13px] leading-snug text-muted sm:block @[15rem]:col-span-1">
            {product.description}
          </p>
        )}
        <p className="mt-2 text-[13px] font-medium text-caramel-dark @[12rem]:text-sm @[15rem]:mt-1.5">
          {categoryLabel.get(product.category)}
        </p>
        <button
          ref={btnRef}
          type="button"
          onClick={onAdd}
          aria-label={`Add ${product.name} to basket`}
          className={`mt-2 grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:size-11 @[15rem]:col-start-2 @[15rem]:row-start-1 @[15rem]:mt-0 ${
            showDescription ? "@[15rem]:row-span-3" : "@[15rem]:row-span-2"
          }`}
        >
          <CartIcon className="size-5" />
        </button>
      </div>
    </article>
  );
}
