---
name: Kin Kitchen
description: Sweet memories, created together. A sisterhood dessert kitchen, baked to order in batches.
colors:
  chocolate: "#543c2a"
  chocolate-deep: "#3a2a1c"
  butter: "#ead4ae"
  butter-wash: "#f6ecdb"
  toffee: "#b34f17"
  toffee-deep: "#8f3d0f"
  oat-ground: "#efe7da"
  oat-panel: "#f8f2e9"
  oat-line: "#ddd0bc"
  cocoa-ink: "#2e2219"
  cocoa-muted: "#6b5a4c"
  crumb: "#efe6d9"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(3.6rem, 2.2rem + 5vw, 6.6rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.005em"
  poster:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.5rem + 2vw, 3.25rem)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  page-title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.8vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  motto:
    fontFamily: "Montserrat, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  gutter-phone: "20px"
  gutter-tablet: "32px"
  section-phone: "56px"
  section: "80px"
  panel-phone: "24px"
  panel: "40px"
  panel-wide: "56px"
components:
  button-primary:
    backgroundColor: "{colors.chocolate}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.chocolate-deep}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.cocoa-ink}"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "48px"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.cocoa-ink}"
    rounded: "{rounded.full}"
    padding: "0 28px"
    height: "48px"
  button-white-hover:
    backgroundColor: "{colors.oat-panel}"
  button-toffee:
    backgroundColor: "{colors.toffee}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "40px"
  button-toffee-hover:
    backgroundColor: "{colors.toffee-deep}"
  input-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.cocoa-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  chip-category:
    backgroundColor: "{colors.white}"
    textColor: "{colors.cocoa-ink}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "44px"
  chip-category-selected:
    backgroundColor: "{colors.chocolate}"
    textColor: "{colors.white}"
  card-product:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "10px"
  panel-oat:
    backgroundColor: "{colors.oat-panel}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel}"
  tile-category:
    backgroundColor: "{colors.butter-wash}"
    textColor: "{colors.cocoa-ink}"
    rounded: "{rounded.lg}"
    padding: "8px"
  tile-category-hover:
    backgroundColor: "{colors.butter}"
---

# Design System: Kin Kitchen

## Overview

**Creative North Star: "The Box Label"**

Kin Kitchen looks like its own packaging: chocolate ink on oat card, a butter-tan field, a toffee flourish, and the K-heart-K monogram stamped on the corner like the label on every box the sisters seal by hand. The site's structure, components, motion and agent rules (see `AGENTS.md`, which stays binding and is not repeated here) are the incumbent system, and this document records the visual world it now wears.

The voice is warm and unhurried, with real product photography doing the persuading. Playfair Display carries every heading the way it carries the pre-order posters, set soft (weight 500) for reading and pushed to black (900) only where the site speaks like a poster. Montserrat, the logo's face, carries everything a visitor reads or taps. Surfaces are soft, rounded, layered in tones of oat and butter rather than lines, with chocolate reserved for the bands and buttons that matter.

Density is relaxed: one idea per band, generous section rhythm, photography in large rounded crops and organic shapes (an arch, a blob, a stamp).

**Key Characteristics:**
- Oat page ground with lighter oat panels; chocolate bands for promises, CTA and footer.
- Playfair Display headings in sentence case, italic for the emotional words; Montserrat for all UI.
- Pill buttons, generous radii (12 to 24px), no hard edges anywhere.
- Shadows tinted with chocolate, never grey.
- The monogram lockup and its spaced-caps motto are the only uppercase on the site.

## Colors

A warm, low-chroma bakery palette sampled from the logo and posters, with one burnt-orange accent.

### Primary
- **Monogram Chocolate** (`chocolate`): the logo ink. Primary buttons, the add-to-basket disc, the hero stamp, promo and CTA cards, the promises band, active text and the section underline. 10.6:1 on the oat ground.
- **Chocolate Deep** (`chocolate-deep`): hover for chocolate buttons and the footer ground.

### Secondary
- **Poster Butter** (`butter`): the big quiet shapes, the hero blob, the cake promo card, category tile hover. Both the `brand-soft` and `latte` utilities resolve to this one value.
- **Butter Wash** (`butter-wash`): category tiles, the testimonial band, the soft error state for the basket.

### Tertiary
- **Toffee** (`toffee`): the posters' burnt-orange accent. The hero's drawn heart, the basket count badge, the toffee button. Small doses only (4.6:1 on white).
- **Toffee Deep** (`toffee-deep`): toffee for small text: category names on product cards, inline links in the order form, the italic cake promo headline (5.3:1 on butter wash).

### Neutral
- **Oat Ground** (`oat-ground`): the page background and the translucent sticky header.
- **Oat Panel** (`oat-panel`): lighter oat cards on the ground: page heroes, the info band, the order form, menu panels, hover fills for icon controls and list rows. Also the reversed logo and footer text.
- **Oat Line** (`oat-line`): every hairline: card borders, input borders, dividers, the header bottom rule.
- **Cocoa Ink** (`cocoa-ink`): headings and primary text.
- **Cocoa Muted** (`cocoa-muted`): intros, body copy, breadcrumbs, placeholders.
- **Crumb** (`crumb`): the placeholder behind product images while they load.
- **White** (`white`): product cards, inputs, popovers, the outline and white buttons, the photo frame ring.

### Named Rules
**The Panel On Ground Rule.** Content panels are a step lighter than the page (oat panel on oat ground), never the same tone and never a darker oat. The step is what reads as a card; there is no border on oat panels.

**The Toffee Pinch Rule.** Toffee is a flourish (a heart, a badge, one promo), never a section ground or a body-text colour. Small toffee text uses toffee deep.

**The Chocolate Shadow Rule.** Every shadow is tinted with chocolate or cocoa ink at low alpha. A neutral grey shadow does not exist in this world.

## Typography

**Display Font:** Playfair Display (with Georgia, serif)
**Body Font:** Montserrat (with system-ui, sans-serif)

**Character:** the poster serif against the logo sans. Playfair is set at a soft 500 with a hair of negative tracking, so it reads as editorial warmth rather than luxury; Montserrat stays plain and medium so the photography and serif carry the personality.

### Hierarchy
- **Display** (Playfair 500 italic, `display` clamp, line-height 1, chocolate): the hero's alternating large italic words ("memories,", "together."), set between smaller roman lines at clamp(2rem, 1.4rem + 2vw, 3.1rem).
- **Poster** (Playfair 900, `poster` clamp, 1.08): the closing CTA headline only. The one place the site shouts like a Facebook poster.
- **Page title** (Playfair 500, `page-title` clamp, 1.08): the single h1 in each inner page hero.
- **Headline** (Playfair 500, `headline` clamp, 1.25): every section h2. Promo cards run larger, 1.9 to 3.1rem, and the cake promo sets it italic in toffee deep.
- **Title** (Playfair 500, 18 to 24px): card and band titles (promises, info band, sent state, features). Quotes use Playfair italic at clamp(1.4rem, 1.1rem + 1.1vw, 2.1rem) in chocolate.
- **Body** (Montserrat 400, 15px phone, 16px from 640px, 1.625): intros and running copy in cocoa muted, held to about 25 to 38rem.
- **Label** (Montserrat 500 to 600, 13 to 15px): buttons, nav, field labels, product names, footer headings.
- **Motto** (Montserrat 500, 9px, 0.14em tracking, uppercase, 80% opacity): the logo lockup's "Sisterhood • Desserts • Est. 2026" line and the same words set round the hero stamp. Part of the mark, not a typographic role.

### Named Rules
**The Two Weights of Playfair Rule.** Playfair is 500 everywhere it reads and 900 only for the poster-voice CTA. No 600 or 700 headings in between.

**The Lockup Is The Only Caps Rule.** Uppercase spaced type belongs to the monogram lockup and its stamp. Headings, labels and buttons are sentence case, and nothing small sits above a heading (`AGENTS.md` rule 5).

**The Equal Words Rule.** In the logo lockup, "Kin" and "Kitchen" are stacked at the same size and weight (Montserrat 500, 19px, 21px from 640px) beside the monogram (40px, 44px from 640px). Never scale one word against the other.

## Layout

A single site container: full width with 20px gutters on phones, 32px from 640px, and capped at 80% of the viewport with no gutter from 1024px. Sections stack with 56px top spacing on phones and 80px from 640px (48px / 64px for the tighter bands under the hero). Two-column splits (copy plus image, form plus cards) collapse to one column below 768px; the desktop nav appears at 1280px, below which a right-side drawer takes over.

Bands alternate between ground-level content, rounded oat panels inset in the container, and full-bleed colour bands (chocolate promises, butter-wash testimonial, chocolate-deep footer). Panels pad at 24px on phones, 40px from 640px and 56px from 1024px. Product grids run two columns on phones; product cards adapt their internal layout by container width, not viewport.

Headings balance their lines and copy wraps pretty, globally (`app/globals.css`); never force breaks.

## Elevation & Depth

Depth is mostly tonal (oat panel on oat ground, white card on oat panel), with soft chocolate-tinted shadows on things that lift or float. Cards rest with a whisper of shadow and deepen on hover; popovers and drawers sit on a large diffuse shadow; the hero photo arch casts the one long dramatic shadow. The sticky header is the only glass: translucent oat with a backdrop blur and an oat-line bottom rule (glass motion constraints in `AGENTS.md` rule 6).

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 3px 0 rgb(84 60 42 / 0.05), 0 1px 2px -1px rgb(84 60 42 / 0.05)`): product cards at rest.
- **Card lift** (`box-shadow: 0 10px 15px -3px rgb(84 60 42 / 0.15), 0 4px 6px -4px rgb(84 60 42 / 0.15)`): product card hover, 300ms.
- **Button glow** (`box-shadow: 0 4px 6px -1px rgb(84 60 42 / 0.25), 0 2px 4px -2px rgb(84 60 42 / 0.25)`): primary buttons; the toffee button uses toffee at 30%.
- **Popover** (`box-shadow: 0 25px 50px -12px rgb(46 34 25 / 0.10)`): menu dropdown, basket panel, select list (at xl size).
- **Photo arch** (`box-shadow: 0 30px 40px -10px rgba(84,60,42,0.35)`): the hero's arched photo frame only.

### Named Rules
**The Lift On Intent Rule.** Shadows grow in response to hover or opening; nothing static carries more than the card-rest shadow except the hero arch and the stamp.

## Shapes

Everything is rounded and nothing is sharp. Pills for every button, chip, stepper and icon control; 24px for page-level panels and photo cards; 16px for product cards, tiles and popovers; 12px for inputs, select lists and image wells inside cards; 8px for thumbnails. Photography gets organic silhouettes: the hero's arch (fully round top, 2rem bottom) inside a butter blob, page-hero images in a soft asymmetric blob (`42% 58% 55% 45% / 48% 42% 58% 52%`) with an 8px white ring, category icons as round photo crops, and the circular monogram stamp. White frame borders (6px) sit on the hero arch and the testimonial screenshot.

**The Round Photo Icon Rule.** Category marks are real product photos cropped to circles (56 to 64px in tiles, 40px in the menu dropdown), never drawn glyphs.

## Components

### Buttons
Soft, confident pills.
- **Shape:** fully round (9999px), Montserrat 500, gap 10px for a trailing arrow.
- **Sizes:** small 40px tall with 20px sides at 14px; medium 48px with 28px sides at 15px; large 52px with 36px sides at 16px. `fluid` makes them full-width below 640px.
- **Primary:** chocolate with white text and the button glow; hover to chocolate deep.
- **Outline:** white with a 40% chocolate border and ink text; hover to a full chocolate border and chocolate text.
- **White:** on chocolate grounds (CTA, promo); hover to oat panel.
- **Toffee:** the cake promo's call; hover to toffee deep.
- **Focus:** 2px chocolate outline at 2px offset. Colour transitions 200ms.

### Cards / Containers
- **Product card:** white, 16px radius, oat-line border, 10px padding, square image well (12px radius, crumb placeholder) that zooms to 105% on hover over 500ms; name in Montserrat 500, category in toffee deep, a round chocolate add-to-basket disc (40 to 44px) that spins in on tap.
- **Oat panel:** 24px radius, oat panel fill, no border, no shadow.
- **Promo card:** 24px radius, chocolate or butter ground with the photo bleeding off the right edge under a gradient from the ground colour.
- **Popovers:** white, 16px radius, oat-line border, popover shadow.

### Inputs / Fields
- **Style:** white, 48px tall, 12px radius, oat-line border, 15px ink text, muted placeholder at 70%. Label above in Montserrat 500 14px ink.
- **Hover:** border to butter.
- **Focus:** border to chocolate plus a 4px chocolate ring at 10%.
- **Select:** the custom listbox shares the field style; options are 8px-radius rows with a chocolate tick on the chosen one. The date picker and checkbox are single custom components (`AGENTS.md` rules 8 and 9).

### Chips
- **Category filter chips (menu):** 44px pills, 14px Montserrat 500, with a 28px round photo icon. Unselected: white with an oat-line border, hover to a butter border on oat panel. Selected: chocolate with white text and the button glow.

### Navigation
- **Header:** sticky, 72px (80px from 640px), translucent oat ground with blur. Logo lockup at left; nav items are 15px Montserrat 500 ink pills that turn chocolate on hover; the Menu item opens a two-column dropdown of round photo categories with a "View full menu" bar in oat panel. Basket and menu triggers are 44px round icon controls with oat hover fills; a small primary "Pre-order" button closes the row from 640px.
- **Mobile:** below 1280px a white drawer slides in from the right (max 400px) over a 40% ink scrim.
- **Footer:** chocolate deep, oat text at 80%, white headings, the logo in its oat tone with the motto, and the tagline in Playfair italic.

### Monogram Lockup (signature)
The K-heart-K monogram beside "Kin / Kitchen" in equal-size Montserrat, chocolate on light grounds and oat on dark, with the spaced-caps motto beneath where there is room (footer). Its echo is the hero stamp: a chocolate disc with the oat monogram and the motto set round its edge.

### Section Underline
An optional 40 by 4px chocolate bar under a section heading (favourites, FAQ, getting here, the story timeline), drawn in from the left, or from the centre when the heading is centred. It replaces any label above the heading.

## Do's and Don'ts

### Do:
- **Do** set content panels in oat panel on the oat ground, and white cards inside them.
- **Do** keep every heading in Playfair 500, sentence case; save Playfair 900 for the closing CTA headline.
- **Do** use italic Playfair in chocolate (or toffee deep on butter) for the one emotional word or phrase in a hero, promo or quote.
- **Do** tint every shadow with chocolate or cocoa ink at 5 to 35% alpha.
- **Do** crop category marks and thumbnails from real Kin Kitchen photos, round.
- **Do** keep the logo's "Kin" and "Kitchen" equal in size, and the motto in spaced caps under it.
- **Do** follow `AGENTS.md` for content, copy, icon, glass, motion and scrollbar rules; it remains binding.

### Don't:
- **Don't** put anything small or uppercase above a heading; the lockup motto and the stamp ring are the only spaced caps.
- **Don't** use grey shadows, square corners or hard offset shadows.
- **Don't** spread toffee across grounds or body text; it is a pinch.
- **Don't** use Playfair at 600 or 700, or Montserrat for headings.
- **Don't** draw icons beside headings, facts or contact lines; icons live only inside controls (`AGENTS.md` rule 5).
- **Don't** set a panel darker than the oat ground or in the same tone as it.
