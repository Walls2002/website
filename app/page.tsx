import { About } from "@/components/sections/about";
import { Bestsellers } from "@/components/sections/bestsellers";
import { Categories } from "@/components/sections/categories";
import { Cta } from "@/components/sections/cta";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Promos } from "@/components/sections/promos";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Promos />
      <Bestsellers />
      <About />
      <Categories />
      <Testimonials />
      <Cta />
    </>
  );
}
