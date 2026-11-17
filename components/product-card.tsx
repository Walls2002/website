import Image from "next/image";
import { ProductOptions } from "@/components/product-options";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
  showDescription?: boolean;
  sizes?: string;
};

/**
 * A menu card: photo, name, and the product's sizes as a price list. The price
 * list sits at the foot of the card so prices line up along a row of cards
 * whatever the length of the name above.
 */
export function ProductCard({
  product,
  showDescription,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 50vw",
}: Props) {
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
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-0.5 sm:px-2 sm:pt-4">
        <h3 className="text-[14px] leading-snug font-medium text-ink @[12rem]:text-base">{product.name}</h3>
        {showDescription && (
          <p className="mt-1 line-clamp-2 hidden text-[13px] leading-snug text-muted sm:block">{product.description}</p>
        )}
        <ProductOptions product={product} className="mt-auto pt-3" />
      </div>
    </article>
  );
}
