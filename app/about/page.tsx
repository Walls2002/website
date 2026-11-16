import type { Metadata } from "next";
import { Team } from "@/components/about/team";
import { PageHero } from "@/components/layout/page-hero";
import { About } from "@/components/sections/about";
import { Cta } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustBar } from "@/components/sections/trust-bar";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.name} is a sisterhood dessert kitchen in Quezon City and San Jose del Monte, baking banana loaves, brownies and celebration cakes to order.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="About us"
        title="A kitchen run by sisters"
        intro={`Kin means family. Since ${site.establishedYear} we've baked to order in small batches, boxed every treat by hand and handed it over ourselves.`}
        image="gift-loaves.webp"
        imageAlt="Banana loaves in foil trays tied with gold ribbon and thank-you stickers"
      />
      <About showLink={false} />
      <Features />
      <Team />
      <TrustBar />
      <Testimonials />
      <Cta />
    </>
  );
}
