import type { Metadata } from "next";
import { ContactCards } from "@/components/contact/contact-cards";
import { Faq } from "@/components/contact/faq";
import { OrderForm } from "@/components/contact/order-form";
import { PageHero } from "@/components/layout/page-hero";
import { TrustBar } from "@/components/sections/trust-bar";

export const metadata: Metadata = {
  title: "Order",
  description: "Send a pre-order from your basket, plan a celebration cake or ask Kin Kitchen a question.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="Order"
        title="Send us your order"
        intro="Pre-orders, celebration cakes or a quick question: it all comes straight to us in the kitchen, and we reply by message."
        image="moms-day-cakes.webp"
        imageAlt="A row of Mother's Day cakes in pink, red and lilac, lettered Best Mom and Happy Mom's Day"
      />
      <ContactCards />
      <OrderForm />
      <Faq />
      <TrustBar />
    </>
  );
}
