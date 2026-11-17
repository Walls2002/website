import { pickupPoints, site } from "@/lib/site";

export type CategorySlug = "brownies" | "loaves" | "breads" | "treats";

/** `image` is the file in public/images/categories (bump its name to replace it, never overwrite). */
export const categories: { slug: CategorySlug; label: string; blurb: string; image: string }[] = [
  { slug: "brownies", label: "Brownies", blurb: "Fudgy or s'mores, by the piece or boxed", image: "brownies-2" },
  { slug: "loaves", label: "Banana bakes", blurb: "Streusel, overload and muffins", image: "loaves-2" },
  { slug: "breads", label: "Bread and rolls", blurb: "Garlic bread and cinnamon rolls", image: "breads" },
  { slug: "treats", label: "Sweet bites", blurb: "Coconut macarons by the box", image: "treats-2" },
];

export const categoryImage = (c: { image: string }) => `/images/categories/${c.image}.webp`;

/**
 * A size on the menu. `count` is how many pieces it holds, so the saving on a
 * box is worked out from the single-piece price, never typed in.
 */
export type ProductOption = { id: string; label: string; price: number; count?: number };
export type Flavour = { id: string; label: string };

/**
 * The menu, from Kin Kitchen's own menu flyer, with its prices. Photos are
 * `public/images/products/<slug>.webp`. `order` sets the default menu order
 * (lower comes first).
 */
export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  options: ProductOption[];
  /** Chosen once per basket line, e.g. the glaze on a cinnamon roll ("Vanilla" + "Glaze" reads "Vanilla glaze"). */
  flavours?: { name: string; choices: Flavour[] };
  favourite?: boolean;
  order: number;
};

export const products: Product[] = [
  {
    slug: "fudgy-brownies",
    name: "Fudgy brownies",
    category: "brownies",
    description: "Dense, fudgy squares studded with chocolate chips.",
    options: [
      { id: "piece", label: "Per piece", price: 29, count: 1 },
      { id: "box-6", label: "Box of 6", price: 159, count: 6 },
      { id: "box-12", label: "Box of 12", price: 279, count: 12 },
    ],
    favourite: true,
    order: 1,
  },
  {
    slug: "smores-brownies",
    name: "S'mores brownies",
    category: "brownies",
    description: "Fudgy brownie under toasted marshmallows, graham and chocolate chips.",
    options: [
      { id: "piece", label: "Per piece", price: 34, count: 1 },
      { id: "box-6", label: "Box of 6", price: 179, count: 6 },
      { id: "box-12", label: "Box of 12", price: 309, count: 12 },
    ],
    favourite: true,
    order: 2,
  },
  {
    slug: "banana-cinnamon-streusel",
    name: "Banana cinnamon streusel",
    category: "loaves",
    description: "Banana cake under a thick cinnamon crumble, baked in its own tin.",
    options: [{ id: "tin", label: "500 ml tin", price: 149 }],
    favourite: true,
    order: 3,
  },
  {
    slug: "banana-overload",
    name: "Banana overload",
    category: "loaves",
    description: "Banana cake topped with sliced almonds and chocolate chips.",
    options: [{ id: "tin", label: "500 ml tin", price: 149 }],
    order: 4,
  },
  {
    slug: "banana-muffins",
    name: "Banana muffins",
    category: "loaves",
    description: "Bite-size banana muffins with chocolate chips, for sharing round.",
    options: [{ id: "pack-30", label: "Pack of 30", price: 299 }],
    order: 5,
  },
  {
    slug: "cinnamon-rolls",
    name: "Cinnamon rolls",
    category: "breads",
    description: "Soft cinnamon swirls under a vanilla or cream cheese glaze.",
    options: [
      { id: "piece", label: "Per piece", price: 59, count: 1 },
      { id: "pair", label: "2 pieces", price: 109, count: 2 },
    ],
    flavours: {
      name: "Glaze",
      choices: [
        { id: "vanilla", label: "Vanilla" },
        { id: "cream-cheese", label: "Cream cheese" },
      ],
    },
    favourite: true,
    order: 6,
  },
  {
    slug: "garlic-bread",
    name: "Garlic bread",
    category: "breads",
    description: "A round loaf cut deep and baked with garlic butter and herbs.",
    options: [
      { id: "piece", label: "Per piece", price: 89, count: 1 },
      { id: "pair", label: "2 pieces", price: 169, count: 2 },
    ],
    order: 7,
  },
  {
    slug: "coconut-macaron",
    name: "Coconut macaron",
    category: "treats",
    description: "Golden coconut macarons with a chocolate centre, in little paper cups.",
    options: [{ id: "box-8", label: "Box of 8", price: 55 }],
    order: 8,
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

const pesoFormat = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 });

/** "₱1,299" */
export const peso = (n: number) => `₱${pesoFormat.format(n)}`;

/** The lowest price on a product, for "from" lines and sorting. */
export const fromPrice = (p: Product) => Math.min(...p.options.map((o) => o.price));

/** What a box saves against buying the pieces one by one (0 when there's no single price). */
export function savingOf(p: Product, o: ProductOption) {
  const single = p.options.find((x) => x.count === 1);
  if (!single || !o.count || o.count < 2) return 0;
  return Math.max(0, single.price * o.count - o.price);
}

/**
 * The item name sent with an order: "Fudgy brownies · Box of 6", the same
 * "Product · Size" shape the CRM's price list uses, so it can price the line.
 */
export const itemName = (p: Product, o: ProductOption) => (p.options.length > 1 ? `${p.name} · ${o.label}` : p.name);

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
    a: "We open orders for each batch for a few days and post the pick-up date with it. Add what you'd like to your basket and send it. We'll message you back to confirm your order and the pick-up details.",
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
    q: "How much is a celebration cake?",
    a: "It depends on the size and the design, so cakes aren't on the price list. Send us your idea and we'll reply with the price before anything is baked.",
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
    image: "about-batch",
    alt: "A batch of banana loaves with almonds and chocolate chips, lidded and ready to go",
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
