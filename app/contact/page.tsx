import type { Metadata } from "next";
import { ContactCards } from "@/components/contact/contact-cards";
import { Faq } from "@/components/contact/faq";
import { OrderLinkForward } from "@/components/contact/order-link-forward";
import { PageHero } from "@/components/layout/page-hero";
import { Cta } from "@/components/sections/cta";
import { TrustBar } from "@/components/sections/trust-bar";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message, call or email Kin Kitchen, and find answers about pre-orders, cakes and pick-up.",
};

export default function ContactPage() {
  return (
    <>
      <OrderLinkForward />
      <PageHero
        crumb="Contact"
        title="Talk to the kitchen"
        intro="Message us, call or email. We reply as soon as we're out of the kitchen, and every order is confirmed by message."
        image="okasan-cake.webp"
        imageAlt="White birthday cake piped with lilac and lettered Happy birthday Okasan"
      />
      <ContactCards />
      <Cta
        title={["Ready to", "order?"]}
        text="Pick your treats, plan a celebration cake or ask a question, all on one page."
        cta={{ label: "Send an order", href: "/order" }}
        className="pt-14 sm:pt-20"
      />
      <Faq />
      <TrustBar />
    </>
  );
}
