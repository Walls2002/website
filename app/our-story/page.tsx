import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Categories } from "@/components/sections/categories";
import { Cta } from "@/components/sections/cta";
import { StoryIntro } from "@/components/story/story-intro";
import { Timeline } from "@/components/story/timeline";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description: `How ${site.name} began in ${site.establishedYear}: sisters, banana loaves, and cakes for every mom and dad.`,
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        crumb="Our story"
        title="Sweet memories, made together"
        intro={`It started in ${site.establishedYear} with a logo, a home oven and a few orders from friends. Here's how this year has gone.`}
        image="hero-streusel.webp"
        imageAlt="Banana cinnamon streusel loaves in foil trays with a handwritten tag"
      />
      <StoryIntro />
      <Timeline />
      <Categories />
      <Cta
        title={["Be part of", "the next batch."]}
        text="Pre-orders open in batches. Send yours and we'll confirm by message."
        cta={{ label: "Start a pre-order", href: "/menu" }}
        className="py-14 sm:py-20"
      />
    </>
  );
}
