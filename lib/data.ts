import { pickupPoints, site } from "@/lib/site";

export type CategorySlug = "loaves" | "brownies" | "cakes" | "cupcakes" | "treats";

export const categories: { slug: CategorySlug; label: string; blurb: string }[] = [
  { slug: "loaves", label: "Banana loaves", blurb: "Baked in their own tins" },
  { slug: "brownies", label: "Brownies", blurb: "Fudgy, boxed or by the piece" },
  { slug: "cakes", label: "Cakes", blurb: "Icing or full fondant" },
  { slug: "cupcakes", label: "Cupcakes", blurb: "Swirled and boxed to gift" },
  { slug: "treats", label: "Cookies & bites", blurb: "Crinkles, macaroons, rolls" },
];

/**
 * The menu, from Kin Kitchen's own posts. Prices are left off on purpose: they
 * change with size, design and batch, so the owner quotes them when confirming
 * an order. `order` sets the default menu order (lower comes first).
 */
export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  favourite?: boolean;
  order: number;
};

export const products: Product[] = [
  {
    slug: "banana-cinnamon-streusel-loaf",
    name: "Banana cinnamon streusel loaf",
    category: "loaves",
    description: "Banana loaf under a thick cinnamon crumble, baked in its own tin.",
    favourite: true,
    order: 1,
  },
  {
    slug: "brownie-box",
    name: "Brownie box of 8",
    category: "brownies",
    description: "Fudgy squares with a salted caramel or chocolate drizzle.",
    favourite: true,
    order: 2,
  },
  {
    slug: "banana-choco-chip-loaf",
    name: "Banana loaf with choco chips",
    category: "loaves",
    description: "Soft banana bread studded with chocolate chips.",
    favourite: true,
    order: 3,
  },
  {
    slug: "icing-cake",
    name: "Icing cake, 6 by 2",
    category: "cakes",
    description: "Buttercream piped in your colours, with your message on top.",
    favourite: true,
    order: 4,
  },
  {
    slug: "banana-overload-loaf",
    name: "Banana overload loaf",
    category: "loaves",
    description: "The fully loaded banana loaf, sealed with a thank-you sticker.",
    order: 5,
  },
  {
    slug: "fondant-cake",
    name: "Full fondant cake",
    category: "cakes",
    description: "Smooth fondant, sugar flowers and lettering for the big days.",
    order: 6,
  },
  {
    slug: "message-brownie-cake",
    name: "Message brownie tray",
    category: "brownies",
    description: "A tray of brownies piped with your greeting and fondant toppers.",
    order: 7,
  },
  {
    slug: "cupcake-box",
    name: "Cupcake box",
    category: "cupcakes",
    description: "Rose-swirled buttercream cupcakes in the colours of your party.",
    order: 8,
  },
  {
    slug: "coconut-macaroons",
    name: "Coconut macaroons",
    category: "treats",
    description: "Chewy, golden coconut macaroons baked in little paper cups.",
    order: 9,
  },
  {
    slug: "number-cake",
    name: "Number cake",
    category: "cakes",
    description: "Your age or year cut in cake and crowned with piped florals.",
    order: 10,
  },
  {
    slug: "crinkles",
    name: "Chocolate crinkles",
    category: "treats",
    description: "Soft chocolate cookies rolled in powdered sugar till they crack.",
    order: 11,
  },
  {
    slug: "brownies-by-the-piece",
    name: "Brownies by the piece",
    category: "brownies",
    description: "One fudgy brownie, wrapped on its own for sharing out.",
    order: 12,
  },
  {
    slug: "message-cupcakes",
    name: "Topper cupcakes",
    category: "cupcakes",
    description: "Cupcakes capped with fondant letters and shapes for a theme.",
    order: 13,
  },
  {
    slug: "chocolate-chip-cookies",
    name: "Chocolate chip cookies",
    category: "treats",
    description: "Little chocolate chip cookies, heaped into a box.",
    order: 14,
  },
  {
    slug: "cinnamon-rolls",
    name: "Cinnamon rolls",
    category: "treats",
    description: "Soft rolls with vanilla sauce and cream cheese on the side.",
    order: 15,
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

/**
 * The info band under the home hero (and on /about): what a visitor needs to
 * know before ordering. Pick-up points come from `site`, so nothing is retyped.
 */
export const goodToKnow: { title: string; lines: string[] }[] = [
  {
    title: "Pre-orders",
    lines: ["We bake in batches. Orders open for a few days, then you pick up on the set date."],
  },
  { title: "Pick-up points", lines: pickupPoints.map((p) => p.label) },
  {
    title: "Celebration cakes",
    lines: ["Icing or full fondant, with your colours and message. Send us the date first."],
  },
  { title: "Ask us anything", lines: [site.phone, "Or message us on Facebook and Instagram."] },
];

/** The chocolate promises band: each promise is stated as a fact, not a slogan. */
export const promises = [
  { title: "Baked to order", text: "In small batches for each pick-up date" },
  { title: "Boxed by hand", text: "Ribboned and sealed with a thank-you" },
  { title: "A real reply", text: "From the sisters who bake it" },
  { title: "Two pick-up points", text: "Quezon City and San Jose del Monte" },
];

export const faqs = [
  {
    q: "How do pre-orders work?",
    a: "We open orders for each batch for a few days and post the pick-up date with it. Add what you'd like to your basket and send it. We'll message you back to confirm your order, the price and the pick-up details.",
  },
  {
    q: "Where do I pick up my order?",
    a: `At ${pickupPoints.map((p) => p.label).join(" or ")}. Choose the one closer to you when you send your order and we'll send the exact spot when we confirm.`,
  },
  {
    q: "Can you make a cake for my celebration?",
    a: "Yes. Tell us the date, the message and the colours you have in mind using the order form, or send a photo on Messenger. We make icing cakes and full fondant cakes, plus message brownies and cupcakes to match.",
  },
  {
    q: "Why are there no prices on the menu?",
    a: "Prices change with the size, the design and the batch, so we send yours when we confirm your order. Nothing is baked until you've said yes.",
  },
];

/**
 * Real words from a real customer, kept in the language they were written in.
 * Add more as they come in; never invent one.
 */
export const testimonials = [
  {
    quote: "Hello ma'am, ansarap po ng cake n'yo, kabitin hehe. Naubos po agad, probably will order again. Thank you po!",
    translation: "Your cake was so good it left us wanting more. It was gone right away, we'll probably order again.",
    source: "A birthday cake customer, on Messenger",
  },
];

/** How a batch comes together, shown on /about. No names or faces until the owners choose to share them. */
export const kitchenSteps = [
  {
    title: "Baked in small batches",
    image: "about-oven",
    alt: "A tray of brownies baking in the oven",
    text: "Each pre-order is baked for its pick-up date, one tray at a time.",
  },
  {
    title: "Boxed by hand",
    image: "gift-loaves",
    alt: "Banana loaves tied with gold ribbon and thank-you stickers",
    text: "Tied with ribbon and sealed with a thank-you sticker before it leaves the kitchen.",
  },
  {
    title: "Ready on pick-up day",
    image: "labelled-boxes",
    alt: "Stacked brownie boxes with Kin Kitchen labels",
    text: "Labelled, stacked and waiting at the pick-up point you chose.",
  },
];

/** Dated from Kin Kitchen's own posts. The first entry follows `site.establishedYear`. */
export const milestones = [
  {
    year: `April ${site.establishedYear}`,
    title: "The K and the heart",
    text: "The Kin Kitchen logo goes up and the first orders come in from friends and neighbours.",
  },
  {
    year: "May 2026",
    title: "Cakes for every mom",
    text: "Fondant and buttercream cakes for Mother's Day: Best Mom Ever, World's Best Mom, Happy Mom's Day.",
  },
  {
    year: "June 2026",
    title: "Best Dad, in brownie",
    text: "Father's Day trays piped in blue, with fondant mustaches and cupcake boxes to match.",
  },
  {
    year: "July 2026",
    title: "Banana loaf season",
    text: "The first banana loaf pre-orders open, and brownies become the month's best seller.",
  },
  {
    year: "October 2026",
    title: "Spooktacularly sweet",
    text: "Halloween brownie boxes tied in orange and black ribbon, and the streusel loaf sells out.",
  },
  {
    year: "November 2026",
    title: "Dessert cups on the house",
    text: "Free dessert cups at the covered court in Barangay Bagong Pag-asa on November 18.",
  },
];

/** How pick-up works, shown on /location. */
export const pickupSteps = [
  {
    title: "Order in the window",
    text: "Each batch has a few days to order. Fill your basket and send it from the order page.",
  },
  {
    title: "We confirm by message",
    text: "You'll get the price, the pick-up date and the exact spot by text, Messenger or email.",
  },
  {
    title: "Pick up on the day",
    text: "Collect your box at the point you chose. Tell us if someone else is picking up for you.",
  },
] as const;

/**
 * The order form's required consent box. There is no privacy policy page yet,
 * so the label links nothing; add the page and link it from the label in
 * `components/contact/order-form.tsx` if Kin Kitchen publishes one.
 */
export const consentCopy = {
  label: `I agree to ${site.legalName} contacting me about this order and keeping my details for that purpose.`,
  error: "Please tick the box so we can get back to you.",
};
