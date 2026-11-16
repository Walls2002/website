# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 App Router, Tailwind 4 and GSAP, exported as a static site for a bucket host (Cloudflare). Orders leave the browser through one public, write-only endpoint: the Kin Kitchen CRM's Supabase RPC `submit_web_order`. Saving an order emails the owner from Supabase through Brevo; no email key reaches the browser.

## Users

Customers of Kin Kitchen in Quezon City and San Jose del Monte, mostly on phones, who found the business on Facebook or Instagram and want to pre-order a batch item or plan a celebration cake.

## Product Purpose

The public website for Kin Kitchen, a home dessert kitchen run by sisters ("Sisterhood · Desserts · Est. 2026"). Visitors browse the menu, fill a basket and send a pre-order, or request a celebration cake. Every order lands in the owner's email and on the CRM's Inquiries page, and the owner confirms the price, date and pick-up spot by message.

Success: a visitor knows what Kin Kitchen bakes, how pre-orders and pick-up work, and sends an order in a few taps.

## Positioning

Baked to order in batches with a set pick-up date, by sisters, with the customer's own words and colours on celebration cakes. No shop, no stock on a shelf.

## Operating Context

- Pre-orders open per batch for a few days, then a pick-up date (seen on their posters).
- Two pick-up points: Commonwealth, Quezon City (Luzon Avenue, Matandang Balara) and Kelsey Hills, San Jose del Monte. The exact spot is sent on confirmation.
- Contact: 0991 517 4907, 0929 141 4364, kinkitchen4@gmail.com, Facebook page 61572144501732, Instagram @_kinkitchen.
- Language: English with Taglish customers; currency PHP.

## Capabilities and Constraints

- Prices are deliberately hidden on the site (owner's choice); quoted on confirmation.
- No opening hours (owner's choice); no delivery offered on the site.
- The basket persists in the browser only; the order record lives in the CRM.
- If the order endpoints are not configured, the form hands the customer a prefilled email instead of pretending to send.
- Open: the earliest pick-up date the form allows is a 48-hour working minimum, not a stated notice period.

## Brand Commitments

- Logo: the K-heart-K monogram (their artwork, `public/images/kin-monogram*.png`) with "Kin Kitchen" in Montserrat.
- Fonts: Playfair Display (their poster serif) and Montserrat (their logo face). Owner asked for the business's own fonts and colours.
- Colours from their materials: chocolate `#543c2a`, oat (page `#efe7da`, panels `#f8f2e9`), butter tan `#ead4ae`, toffee `#b34f17`.
- Tagline: "Sweet memories, created together."

## Evidence on Hand

- 75 photos from their Facebook page (product shots, posters, packaging); the site uses the cleanest product and process shots.
- One real customer review (Messenger screenshot, Taglish).
- Real dated events from posts: April 2026 launch, Mother's and Father's Day cakes, July banana loaf pre-orders and brownies as best seller, October Halloween boxes, November 18 free dessert cups in Brgy. Bagong Pag-asa.
- Absent and never to be invented: owner names and faces, prices beyond those posted, more testimonials, delivery terms, shop hours.

## Product Principles

1. Order in a few taps on a phone; the owner confirms by message.
2. Only real facts, photos and words from the business; mark what is unknown.
3. The brand's own colours, fonts and logo, used with commitment.
4. Never lose an order: if sending fails, give the customer another way to send it.
