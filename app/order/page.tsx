import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { OrderForm } from "@/components/order/order-form";
import { TrustBar } from "@/components/sections/trust-bar";

export const metadata: Metadata = {
  title: "Order",
  description: "Pick your treats, plan a celebration cake or ask Kin Kitchen a question, and send it straight to the kitchen.",
};

export default function OrderPage() {
  return (
    <>
      <PageHero
        crumb="Order"
        title="Send us your order"
        intro="Pick your treats, plan a celebration cake or ask a question. It all comes straight to us in the kitchen, and we reply by message."
        image="moms-day-cakes.webp"
        imageAlt="A row of Mother's Day cakes in pink, red and lilac, lettered Best Mom and Happy Mom's Day"
      />
      <OrderForm />
      <TrustBar />
    </>
  );
}
