import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

// Exported as out/404.html; Cloudflare serves it for unknown paths (see wrangler.jsonc).
export default function NotFound() {
  return (
    <section className="container-site grid place-items-center py-16 text-center sm:py-24">
      <Image
        src="/images/kin-monogram.png"
        alt=""
        width={628}
        height={480}
        className="h-24 w-auto sm:h-28"
        loading="eager"
      />
      <h1 className="mt-6 font-serif text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-tight text-ink">
        Oops, this page crumbled
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">
        We couldn&apos;t find that page, but the next batch is waiting on the menu.
      </p>
      <div className="mt-8 grid w-full gap-3 sm:flex sm:w-auto sm:justify-center">
        <ButtonLink href="/" size="lg" fluid>
          Back to home
        </ButtonLink>
        <ButtonLink href="/menu" variant="outline" size="lg" fluid>
          Browse the menu
        </ButtonLink>
      </div>
    </section>
  );
}
