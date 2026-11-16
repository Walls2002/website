export type NavItem = {
  label: string;
  href: string;
};

/** Add a network here and to the logo map in components/layout/social-links.tsx. */
export type SocialNetwork = "instagram" | "facebook" | "messenger" | "pinterest" | "youtube" | "tiktok" | "x" | "google";

export type PickupPoint = {
  value: string;
  /** How customers say it: "Commonwealth, Quezon City". */
  label: string;
  /** The wider area, shown under the label. The exact spot is sent when an order is confirmed. */
  area: string;
  mapsUrl: string;
};

/**
 * Kin Kitchen bakes to order and hands over at two pick-up points, so there are
 * no shop hours. Orders open in batches with a set pick-up date.
 */
export const pickupPoints: PickupPoint[] = [
  {
    value: "commonwealth-qc",
    label: "Commonwealth, Quezon City",
    area: "Luzon Avenue, Matandang Balara",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Luzon+Avenue+Matandang+Balara+Quezon+City",
  },
  {
    value: "kelsey-hills-sjdm",
    label: "Kelsey Hills, San Jose del Monte",
    area: "San Jose del Monte, Bulacan",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kelsey+Hills+San+Jose+del+Monte+Bulacan",
  },
];

/**
 * Earliest pick-up day the order form offers, in hours from now. A working
 * minimum for the date picker, not a promise: the owner confirms every date by
 * message. Change it once Kin Kitchen settles on a notice period.
 */
const earliestPickupHours = 48;

export const site = {
  /** Public origin used for canonical URLs, the sitemap and social previews. Set NEXT_PUBLIC_SITE_URL at build time. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kin-kitchen.pages.dev").replace(/\/$/, ""),
  name: "Kin Kitchen",
  legalName: "Kin Kitchen",
  tagline: "Sweet memories, created together.",
  /** The logo's line, kept as three parts so it can be set with dots between them. */
  motto: ["Sisterhood", "Desserts", "Est. 2026"],
  /** The year Kin Kitchen started. The story derives from it. */
  establishedYear: 2026,
  /** BCP 47 locale for dates (the order form's date picker) and the first day of the week (0 = Sunday, 1 = Monday). */
  locale: "en-PH",
  weekStartsOn: 0 as 0 | 1,
  phone: "0991 517 4907",
  phoneAlt: "0929 141 4364",
  email: "kinkitchen4@gmail.com",
  messengerUrl: "https://m.me/61572144501732",
  instagramHandle: "_kinkitchen",
  terms: {
    earliestPickupHours,
  },
  /** Icon-only links with the network's logo. */
  socials: [
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61572144501732" },
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/_kinkitchen/" },
    { network: "messenger", label: "Messenger", href: "https://m.me/61572144501732" },
  ] satisfies { network: SocialNetwork; label: string; href: string }[],
  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About us", href: "/about" },
    { label: "Our story", href: "/our-story" },
    { label: "Pick-up", href: "/location" },
    { label: "Order", href: "/order" },
  ] satisfies NavItem[],
  help: [
    { label: "How pre-orders work", href: "/contact#faq" },
    { label: "Pick-up points", href: "/location" },
    { label: "Celebration cakes", href: "/menu?category=cakes" },
    { label: "Send an order", href: "/order" },
    { label: "Contact us", href: "/contact" },
  ] satisfies NavItem[],
} as const;

/** `tel:` link for a phone number written the local way ("0991 517 4907"). */
export const telHref = (phone: string) => `tel:+63${phone.replace(/\D/g, "").replace(/^0/, "")}`;
