# Kin Kitchen website

The public site for Kin Kitchen ("Sisterhood · Desserts · Est. 2026"), a dessert kitchen in Quezon City and San Jose del Monte. Built with Next.js 16 (App Router), Tailwind CSS 4 and GSAP, in Kin Kitchen's own logo, colours (chocolate, oat, butter tan, toffee), fonts (Playfair Display and Montserrat) and photos.

## Orders

The basket and the order page (`/contact#order`) send each order to two places at once (`lib/send-order.ts`):

1. **The Kin Kitchen CRM**: the Supabase RPC `submit_web_order`, which drops the order in the CRM's "From the website" inbox on the Orders page. Run the CRM's `supabase/migrations/0010_web_orders.sql` first.
2. **The owner's email**: Web3Forms, using an access key made with kinkitchen4@gmail.com.

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_WEB3FORMS_KEY` at build time (see `.env.example`). An order counts as sent when either one lands. With neither configured, the form hands the customer a prefilled email to send, so no order is silently lost.

Prices are hidden on purpose and there are no shop hours: the owner confirms price, date and pick-up spot by message.

## Pages

| Route | What's on it |
| --- | --- |
| `/` | One-screen hero, good-to-know band (pre-orders, pick-up points, celebration cakes, contact), promo cards, Kin favourites, about, categories, customer review, CTA |
| `/menu` | Category chips (deep-linkable with `?category=cakes`), sort dropdown, Flip-animated product grid with add-to-basket |
| `/about` | Sisterhood story and values, good-to-know band, how a batch comes together, promises band, review |
| `/our-story` | Story intro, scroll-scrubbed timeline dated from Kin Kitchen's posts |
| `/location` | The two pick-up points with Maps links, how pick-up works |
| `/contact` | Contact cards, the order form (basket pre-order, celebration cake or question) with a date picker, FAQ |

The header (with the Menu dropdown, basket panel and mobile drawer) and the footer live in `app/layout.tsx`, so every page shares them.

## Layout & responsiveness

- **Container:** the `container-site` utility in `app/globals.css` is full-width with 20–32px gutters on phones and tablets, and capped at **80% of the viewport** from 1024px up.
- **Mobile-first:** primary buttons go full-width on phones (the `fluid` prop on `ButtonLink`/`Button`). Testimonials, team members and menu chips become swipe rails, and headings use fluid `clamp()` type.
- **Tablet (768–1023px):** each section has its own tablet layout rather than a squeezed desktop one. For example, the good-to-know band is two by two, and the About section is two columns with its values underneath.

## Animation

GSAP with `@gsap/react` (`useGSAP`), ScrollTrigger, ScrollTo and DrawSVG, registered in `lib/gsap.ts`. Flip is registered by the menu browser, the only place that uses it.

- `useMotion(ref, setup)` scopes each section's animations and only runs them when the visitor hasn't asked for reduced motion.
- Above-the-fold elements marked `data-intro` are hidden by a tiny inline script until GSAP applies their start state, so the final layout never flashes first.
- Entrance tweens use `clearProps: "transform"`, so no leftover transform creates a stacking context or containing block that could trap a dropdown.

## Dropdowns

`components/ui/select.tsx` is an accessible custom select. While a dropdown is open, its wrapper is raised to `z-40` and the panel to `z-50`. Header panels live inside the sticky `z-50` header, and the mobile drawer is `z-60`. Every dropdown was hit-tested to confirm it paints above the surrounding fields, cards and sections.

`components/ui/date-picker.tsx` is the order form's date field: a hand-built calendar popover (no native date input, no calendar package). It opens upward when there's no room below, disables days before the earliest pick-up (`site.terms.earliestPickupHours`), and follows the WAI-ARIA date picker pattern: arrows move by day and week, PageUp/PageDown by month (Shift for a year), Home/End to the week's ends, Enter or Space picks, Escape closes and puts focus back on the field. Dates are formatted with `site.locale`; the week starts on `site.weekStartsOn`.

Scrollbars are thin and use the palette everywhere (`app/globals.css`). Overlays never flash one while animating: AGENTS.md rule 7 has the causes to avoid, and `npm run qa` checks every frame of each overlay's entrance.

## Customising

- **Name, motto, contact, pick-up points, earliest pick-up, socials and nav:** `lib/site.ts`.
- **Menu, categories, good-to-know band, promises, FAQs, the review, batch steps and timeline:** `lib/data.ts`.
- **Social links:** `site.socials` (Facebook, Instagram, Messenger), each shown as its Phosphor brand logo.
- **Colours:** the `@theme` tokens in `app/globals.css`. `DESIGN.md` records the whole visual system.
- **Images:** `public/images/`, Kin Kitchen's own photos and K-heart-K monogram. Each file carries its origin in its metadata.
- **Replacing a file in `public/`:** give it a new name (`storefront-2.webp`) and update its references. Static hosts and CDNs keep serving the old file under the old URL.

## Keep it human

These are the signs that a site was generated, and this site is built
without them. Keep it that way when you add sections, in every component
including the header, Menu dropdown, mobile drawer, footer and the order form:

- **No eyebrows or kickers** above headings, heroes included. Breadcrumbs
  are fine.
- **No visible numbering**: no "01 / 02 / 03" on cards, steps or menu items,
  no "Step 2 of 4".
- **No stats**: no counters, "200+ happy customers", star ratings, years
  badges or number strips. Show something useful instead (pick-up points,
  how pre-orders work, how to reach us).
- **Icons only on controls**: basket, menu, close, chevrons, arrows,
  the accordion. Never next to headings, facts, list items, fields or
  contact details.
- **Social links are logos**: each network in `site.socials` shows its
  Phosphor brand logo as an icon-only, labelled link,
  never the written word.

`npm run qa` fails on all of them, and `AGENTS.md` (rule 5) has the detail.
QA catches the patterns; a person still reviews the result before handover.

## Images & performance

A static export has no image optimiser, so `npm run images` (run automatically before `dev` and `build`) uses `sharp` to render each file in `public/images/` as WebP at the widths listed in `lib/image-widths.mjs`. The variants go to `public/_img/` (git-ignored) with a content hash in the file name, and `lib/image-loader.ts` points every `next/image` srcset entry at the closest one. `lib/image-manifest.json` is regenerated on each run. Commit it whenever an image changes.

- Add or replace images in `public/images/` and reference them as `/images/...`. The loader takes care of the rest.
- Give fixed-size images their **rendered** `width`/`height` (for example `width={48}` for a 48px icon), and give `fill` images an accurate `sizes`, so phones don't download desktop-sized files.
- The hero and page-hero images are the LCP element. Their entrances are CSS keyframes (`animate-hero-drop`, `animate-card-in`, `animate-pop-in` in `app/globals.css`), not `data-intro` GSAP fades, so they paint before any JavaScript runs. Keep it that way when changing them.
- `public/_headers` caches `/_img/*` and `/_next/static/*` as immutable for a year.

## Deploying to Cloudflare (static)

The site is a fully static export (`output: "export"` with `trailingSlash: true` in `next.config.ts`): `npm run build` writes plain HTML, CSS, JS and images to `out/`, one `index.html` per route (`out/about/index.html`, ...), so any bucket host (R2, Pages, S3) serves it without rewrites.

**Before the first deploy**, set the public URL so the canonical URLs, `sitemap.xml` and `robots.txt` are correct:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

Then choose one of these:

- **Workers static assets (recommended):** run `npx wrangler login` once, then `npm run deploy`. It uses `wrangler.jsonc`, which serves `out/`, returns `404.html` for unknown paths and redirects `/about` to `/about/`.
- **Pages, from the CLI:** `npm run deploy:pages` (project name `kin-kitchen`).
- **Pages, from Git:** connect the repo in the dashboard with build command `npm run build` and output directory `out`. Add `NEXT_PUBLIC_SITE_URL` as a build variable. `.node-version` pins Node 22.

To preview the production build locally on Cloudflare's runtime, run `npm run preview` (http://localhost:8787).

**What's included:**

- `public/_headers`: a one-year immutable cache for `/_next/static/*`, a one-week cache for `/images/*`, and baseline security headers.
- `app/sitemap.ts` and `app/robots.ts`: generated at build time.
- `app/not-found.tsx`: exported as `404.html`.

**Static-export notes:**

- **Images:** `next/image` runs with `images.unoptimized`, because there's no optimisation server. The files in `public/images` are already compressed WebP.
- **Menu filter:** `/menu` is prerendered with every product, and the browser then applies `?category=` (`MenuBrowserFromUrl` inside `<Suspense>`).
- **Orders:** the basket and order form run in the browser and send through `lib/send-order.ts` (see Orders above).
- **Compatibility date:** keep `compatibility_date` in `wrangler.jsonc` no later than the release date of the installed Wrangler runtime.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Before handing over: `npm run typecheck && npm run lint && npm run build && npm run qa`. QA serves `out/` like a static host (`QA_PORT` sets its port), visits every built route at 1440 and 390 wide and fails on console errors, a missing or second h1, em dashes, horizontal overflow and the AI tells listed under "Keep it human", including with the header panels, mobile drawer and contact form states open. It also drives the date picker by keyboard and fails on a scrollbar that flashes while an overlay opens.
