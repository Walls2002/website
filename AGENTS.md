<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kin Kitchen website: rules for agents

The Kin Kitchen website (Next.js 16, Tailwind 4, GSAP). Business facts and
page content live in two content files. Every change must survive a content
edit and must not look machine-made.

## Where things live

| What | File |
| --- | --- |
| Business identity: name, established year, date locale and week start, contact, address, weekly hours (`hours` is derived from `weeklyHours`), ordering terms (delivery cut-off, free-delivery threshold, cake notice, reply time), socials, nav | `lib/site.ts` |
| Page content: products, categories, the "good to know" info band, promises band, FAQs, testimonials, team, milestones, getting here, amenities, delivery zones | `lib/data.ts` |
| Opening-hours helpers (`groupHours`, `formatTime`) | `lib/hours.ts` |
| Control icons (small on purpose) | `components/icons.tsx` |
| Social logos (Phosphor) | `components/layout/social-links.tsx` |
| Colours, wrap rules, LCP keyframes | `app/globals.css` |
| Browser QA | `scripts/qa.mjs` |

## Rules

1. **Nothing identifying a business is hardcoded in a component.** Names,
   years, hours, terms and contact details come from `site` or `lib/data.ts`.
2. **Derive, never retype.** The about hero year and the first milestone come
   from `site.establishedYear`; the footer, contact cards and info band read
   `site.hours`; the FAQ, delivery checker, order form and promises band read
   `site.terms`. Don't type a count into copy ("three bakers", "five
   milestones"); write it so the number isn't needed.
3. **Copy:** no em dashes in rendered text (QA fails on them), sentence case
   for headings, buttons and labels. Don't join several sentence-case items
   into one sentence; stack them as short lines (the hours in the info band).
4. **Line breaks** are handled globally with `text-wrap: balance` (headings)
   and `text-wrap: pretty` (body copy) in `app/globals.css`. Never insert
   `<br>` or `&nbsp;` to force a break, and never remove these rules: they
   keep new copy wrapping well whenever the content changes. If a headline still looks cramped, constrain its max-width or
   shorten the copy instead.
5. **Keep it human.** These patterns are what make a site read as
   AI-generated, so they are banned everywhere: pages, header, Menu dropdown,
   account and basket panels, mobile drawer, footer, the custom-cake form
   (including its error and sent states), 404. `npm run qa` fails on each of
   them (see `aiTells()` in `scripts/qa.mjs`).
   - **No eyebrows or kickers.** Nothing small, uppercase or `// LABEL`
     above a heading, on heroes too. The heading says it. Breadcrumbs
     (links back up the site) are fine. There is no `eyebrow` prop on
     `PageHero` or `SectionHeading`; don't add one back.
   - **No visible numbering.** No "01 / 02 / 03" on cards, steps, terms,
     menu items or list rows, no "Step 2 of 4", no decimal list markers.
     Order is shown by position, a line or a dot (the story timeline's
     spine). QA checks links and buttons too; only number controls are
     exempt. The basket badge and quantity stepper carry
     `data-allow-number`; never put it on a card or a step.
   - **No stats.** No counters, count-ups, "200+ happy customers", rating
     rows or stars, years badges or number tiles. Replace a stat block with
     information a visitor can use: opening hours, delivery terms, notice
     for custom cakes, the address. A number belongs inside a sentence with
     its unit ("seating for 24").
   - **Icons only where they do a job inside a control.** Account, basket,
     add to basket, menu, close, chevrons, button arrows, the accordion and
     quantity steppers, the selected option tick. Never beside a heading, a
     fact, a list item, a field or a contact line. `components/icons.tsx`
     holds only those icons, each tagged `data-icon`; don't add to it for
     decoration. Category illustrations sit inside links and chips only.
   - **Social links are brand logos, not words.** `SocialLinks` renders
     `site.socials` as icon-only links with Phosphor brand logos
     (`@phosphor-icons/react/dist/ssr`, one weight), each with an
     `aria-label`, a 40px hit area, `data-icon` on the svg and a `-ml-2.5`
     row offset so the first logo lines up with the text above. A Google
     Business profile is one of them (`GoogleLogo`); any other Google mark on
     the site uses the same Phosphor logo, never a drawn "G" or a PNG. Add a
     network to `SocialNetwork` in `lib/site.ts` and to the logo map.
6. **Glass and motion.** Never fade a glass (`backdrop-blur`) element or any
   wrapper around it: an ancestor with opacity below 1 (or a filter, mask or
   clip-path) stops the blur from drawing until the animation ends. Reveal
   glass with a clip-path wipe on the element itself at full opacity, fade
   only its children, and draw its outline with `ring-inset`. Cards that sit
   on animated photos (the map bar, the order-form note, team role chips) are
   solid white for that reason.
7. **Scrollbars and overlays.** Every scroll area uses the thin palette
   scrollbar from `app/globals.css` (base layer; don't restyle it per
   component, and keep `.no-scrollbar` for snap rails only). An overlay must
   never flash a scrollbar or move the page while it opens or closes:
   - **Never translate or scale children of an `overflow: auto` element.**
     Transforms count towards scrollable overflow, so a list row lifted 8px
     mid-entrance overflows the scroller and its scrollbar blinks in and
     out. This was the basket flash. Animate the scroller itself as one
     block (the basket list carries `data-panel-item`, its rows don't), or
     fade its children with opacity only.
   - A vertical scroller that has anything sliding sideways inside it sets
     `overflow-x-hidden` (the mobile drawer panel).
   - An overlay that slides in from off-screen is clipped by its fixed
     wrapper (`overflow-hidden` on `#mobile-drawer`), so it can't widen the
     page mid-animation.
   - Locking page scroll removes the page scrollbar; pad the root by the
     scrollbar's width while locked (the drawer effect in `header.tsx`) so
     nothing under the backdrop shifts.
   - A popover that has to take focus on open fades in with `opacity`, not
     `autoAlpha`: `visibility: hidden` on the first frame makes `.focus()`
     a no-op (the date picker).
   `npm run qa` samples every frame while each header panel, the drawer, a
   select and the date picker open and fails on any of these.
8. **One date picker.** `components/ui/date-picker.tsx` is the only date
   input: no native `<input type="date">`, no Radix or other calendar
   package. Its earliest day derives from `site.terms.customCakeNoticeHours`
   and its locale and week start from `site.locale` and `site.weekStartsOn`.
   The calendar grid carries `role="grid"` and `data-allow-number`, the only
   place day numbers are allowed.
9. **One checkbox, and the order form's consent box is required.**
   `components/ui/checkbox.tsx` is the only checkbox: a real `.sr-only`
   input with a GSAP-drawn box and tick, no Radix, no native `required`. A
   submit without it sets `error`, bumps `errorPulse`, focuses the box
   through `inputRef` and sends nothing. Its label and error live in
   `consentCopy` (`lib/data.ts`). There is no privacy policy page, so the
   label links nothing; never link one that doesn't exist.

## Static export and caching (hosting constraint)

`next.config.ts` sets `output: "export"` with `trailingSlash: true`: the
build is plain files in `out/` (`out/index.html`, `out/about/index.html`,
`out/menu/index.html`, ...) for a bucket host such as R2. `.next/` is a
build cache, never the deploy folder. No route handlers (other than the
`force-static` sitemap and robots), server `searchParams`, cookies,
redirects or image optimizer. Nav hrefs are written without the trailing
slash; `isSamePage()` normalises it.

**Never replace a file in `public/` under the same name.** It's served at a
literal, un-fingerprinted URL, so CDNs and browsers keep the old copy. Bump
the filename (`storefront.webp` -> `storefront-2.webp`, `favicon-2.svg` ->
`favicon-3.svg`) and update every reference, including the icons list in
`app/layout.tsx`. Only `public/_img/` variants are content-hashed.

## Before calling anything done

`npm run typecheck && npm run lint && npm run build && npm run qa`. QA serves
`out/` like a bucket (set `QA_PORT` to change its port), finds every route
from the built HTML and checks, at 1440 and 390: console errors, one h1,
image alts, em dashes, horizontal overflow and the AI tells (rule 5), also
with the Menu dropdown, account and basket panels, mobile drawer, an open
select, the delivery answer and the contact form's error and sent states. It
also drives the contact date picker by keyboard (focus in, arrows, PageUp/
PageDown, Home/End, Enter, Escape, focus back, full-date labels) and fails on
any scrollbar that flashes while an overlay opens (rule 7).
Then look at every page at 1440 and 390: the harness cannot see a clipped
border or a cramped heading.
