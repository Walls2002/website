import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { GettingHere } from "@/components/location/getting-here";
import { Visit } from "@/components/location/visit";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Pick-up",
  description:
    "Pick up your Kin Kitchen order in Commonwealth, Quezon City or Kelsey Hills, San Jose del Monte. How pre-order pick-up works.",
};

export default function LocationPage() {
  return (
    <>
      <PageHero
        crumb="Pick-up"
        title="Two places to pick up"
        intro="We don't keep a shop. Every order is baked for its pick-up date and handed over in Quezon City or San Jose del Monte."
        image="labelled-boxes.webp"
        imageAlt="Stacked Kin Kitchen brownie boxes with labels, ready for pick-up"
      />
      <Visit />
      <GettingHere />
      <Cta
        title={["Your box,", "ready on the day."]}
        text="Choose your pick-up point when you send your order."
        cta={{ label: "Start a pre-order", href: "/menu" }}
        className="py-14 sm:py-20"
      />
    </>
  );
}
