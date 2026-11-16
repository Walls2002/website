import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { MenuBrowser, MenuBrowserFromUrl } from "@/components/menu/menu-browser";
import { Cta } from "@/components/sections/cta";
import { Promos } from "@/components/sections/promos";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Banana loaves, brownies, celebration cakes, cupcakes, crinkles and coconut macaroons, baked to order by Kin Kitchen.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        crumb="Menu"
        title="Baked to order"
        intro="Add what you'd like to your basket and send it. We'll reply with the price, the batch date and where to pick up."
        image="bagged-brownies.webp"
        imageAlt="A basket of individually wrapped Kin Kitchen brownies"
      />
      {/* Prerendered with every treat; the browser then applies any ?category= filter. */}
      <Suspense fallback={<MenuBrowser initialCategory="all" />}>
        <MenuBrowserFromUrl />
      </Suspense>
      <Promos />
      <Cta
        title={["Planning a", "celebration?"]}
        text="Icing and fondant cakes, message brownies and cupcakes, made for your date."
        cta={{ label: "Plan a cake", href: "/contact#order" }}
        className="py-14 sm:py-20"
      />
    </>
  );
}
