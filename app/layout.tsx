import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-context";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { site } from "@/lib/site";
import "./globals.css";

/* The brand's two faces: Playfair Display from the pre-order posters, Montserrat from the logo wordmark. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | ${site.tagline.replace(/\.$/, "")}`,
    template: `%s | ${site.legalName}`,
  },
  description:
    "Kin Kitchen bakes banana loaves, brownies, celebration cakes and cupcakes to order. Pre-order online and pick up in Commonwealth, Quezon City or Kelsey Hills, San Jose del Monte.",
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: "en_PH",
    images: [{ url: "/images/hero-assortment.webp", width: 1440, height: 1538, alt: "Kin Kitchen banana loaves, cookies and brownies" }],
  },
  icons: {
    icon: [
      { url: "/favicon-3-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-3-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-3-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-3.ico",
    apple: "/apple-touch-icon-3.png",
  },
};

/*
 * Hides [data-intro] elements until GSAP plays their entrance, avoiding a flash
 * of the final state. Skipped for reduced motion; auto-released as a safety net.
 */
const motionBootstrap = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion-pending');setTimeout(function(){d.classList.remove('motion-pending')},2500)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-PH" className={`${playfair.variable} ${montserrat.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to <body> before React loads. */}
      <body className="flex min-h-full flex-col overflow-x-clip" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
