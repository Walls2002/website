/**
 * Site readiness audit.
 *
 *   npm run build && npm run qa
 *
 * Serves ./out exactly like a bucket host would (directory index.html, real
 * 404s), finds every route from the built HTML files and asserts what a
 * visual review cannot see, at 1440 and 390 wide:
 *   - zero console errors / page errors
 *   - exactly one <h1> per page, no <img> without alt
 *   - no em dashes in rendered copy
 *   - no horizontal overflow
 *   - no AI tells (AGENTS.md, "Keep it human"): no kicker/eyebrow label above
 *     a heading, no visible list numbering ("01", "Step 2 of 4", decimal
 *     markers), no stat counters ("48K+", data-count), no icon outside a
 *     link, button or form control. Checked on every page and again with
 *     each overlay open: the mobile drawer, the Menu mega dropdown, the
 *     basket panel, an open select on the menu and the order form's sent state.
 *   - the mobile drawer takes focus and gives it back on Escape
 *   - no scrollbar flash: while the header panels, the mobile drawer, a
 *     select and the date picker animate open, no scroll area overflows that
 *     doesn't at rest, the page gains no horizontal overflow and the layout
 *     doesn't jump; with real scrollbars, the drawer's scroll lock doesn't
 *     shift the page and the page scrollbar is the thin custom one
 *   - the order form date picker: focus moves to a day, full-date labels,
 *     arrow/PageUp/PageDown/Home/End keys, Enter picks and returns focus,
 *     Escape and an outside click close it (at 1440 and 390)
 *
 * Set QA_PORT to run the static server on another port. Exits non-zero on
 * any failure.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { chromium } from "playwright";

const OUT = resolve("out");
if (!existsSync(join(OUT, "index.html"))) {
  console.error("No ./out/index.html. Run `npm run build` first.");
  process.exit(1);
}

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

const server = createServer((req, res) => {
  const p = decodeURIComponent(req.url.split("?")[0]);
  let file = join(OUT, p);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/html" });
    createReadStream(join(OUT, "404.html")).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});
const PORT = Number(process.env.QA_PORT ?? 4186);
await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;

/* Every route is a directory with an index.html in out/ (trailingSlash export), plus the 404 page. */
function findRoutes(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = join(dir, d.name);
    if (d.isDirectory()) return d.name.startsWith("_") ? [] : findRoutes(full);
    if (d.name !== "index.html") return [];
    const rel = relative(OUT, dir).split(sep).join("/");
    return [rel ? `/${rel}/` : "/"];
  });
}
const routes = [...findRoutes(OUT).sort(), "/menu/?category=cakes", "/no-such-page/"];

const browser = await chromium.launch();
let failures = 0;
const fail = (msg) => {
  failures++;
  console.error("FAIL " + msg);
};

/*
 * AI tells. These patterns make a site read as machine-made, so the
 * crawl fails on them instead of leaving them to visual QA. Breadcrumbs
 * (nav links above a title) are fine; everything else above a heading is a
 * kicker. Each finding prints the offending text so it is easy to grep.
 */
async function aiTells(page, label) {
  const found = await page.evaluate(() => {
    const out = [];
    const visible = (el) => {
      if (el.closest('[aria-hidden="true"], .sr-only, [hidden]')) return false;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0;
    };
    const text = (el) => (el.innerText ?? "").replace(/\s+/g, " ").trim();
    const numberControl = '[role="grid"], [role="listbox"], [role="option"], [role="spinbutton"], select, input, textarea, table, time, nav[aria-label*="pagination" i], [data-allow-number]';
    const control = 'a, button, label, summary, input, select, textarea, [role="button"], [role="combobox"], [role="option"], [role="switch"], [role="tab"], [role="grid"], [role="listbox"]';

    // 1. Kickers: a short label right before a heading (or before the
    //    wrapper the heading opens), or anything styled as "// LABEL".
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      if (!visible(h)) continue;
      const prev = h.previousElementSibling ?? (h.parentElement?.firstElementChild === h ? h.parentElement.previousElementSibling : null);
      if (!prev || !visible(prev) || prev.matches("nav, ol, ul, img, picture, figure, svg, hr") || prev.querySelector("a, button, nav, img, input")) continue;
      const t = text(prev);
      if (!t || t.length > 48) continue;
      const cs = getComputedStyle(prev);
      const caps = cs.textTransform === "uppercase" || (/[A-Za-z]/.test(t) && t === t.toUpperCase());
      if (t.startsWith("//") || caps || parseFloat(cs.fontSize) < parseFloat(getComputedStyle(h).fontSize) / 2.2) out.push(`kicker above "${text(h).slice(0, 40)}": "${t}"`);
    }
    for (const el of document.querySelectorAll("body *")) {
      if (el.children.length || !visible(el)) continue;
      const t = text(el);
      if (t.startsWith("//")) out.push(`"//" label: "${t.slice(0, 40)}"`);
    }
    // A heading dressed as a label (small caps over a bigger line) is the same tell.
    for (const h of document.querySelectorAll("h1, h2, h3, h4")) {
      if (!visible(h)) continue;
      const cs = getComputedStyle(h);
      if (cs.textTransform === "uppercase" && parseFloat(cs.fontSize) < 15) out.push(`label-styled heading: "${text(h).slice(0, 40)}"`);
    }
    for (const el of document.querySelectorAll('[class*="eyebrow"], [class*="kicker"]')) if (visible(el)) out.push(`eyebrow class: "${text(el).slice(0, 40)}"`);

    // 2. Visible numbering: "01" chips, "Step 2 of 4", decimal list markers.
    for (const el of document.querySelectorAll("body *")) {
      // Links and buttons are checked too (a linked card with "01" is still a tell); only
      // controls whose job is a number are exempt: calendars, pickers, pagination, tables.
      if (el.children.length || !visible(el) || el.closest(numberControl)) continue;
      const t = text(el);
      if (/^(0\d|\d{1,2})[.)]?$/.test(t) || /^(?=[IVX]{2,}[.)]?$|[IVX][.)]$)X{0,3}(?:IX|IV|V?I{0,3})[.)]?$/.test(t) || /^(step|steg)\s*\d+(\s*(of|av|\/)\s*\d+)?$/i.test(t) || /^\d+\s*\/\s*\d+$/.test(t)) out.push(`numbering: "${t}" in <${el.parentElement?.tagName.toLowerCase()} class="${(el.parentElement?.className ?? "").toString().slice(0, 60)}">`);
    }
    for (const li of document.querySelectorAll("li")) {
      if (!visible(li)) continue;
      const type = getComputedStyle(li).listStyleType;
      if (/decimal|roman|alpha|latin/.test(type)) out.push(`numbered list marker (${type}): "${text(li).slice(0, 40)}"`);
    }

    // 3. Stats and counters.
    for (const el of document.querySelectorAll("[data-count]")) out.push(`count-up stat: "${text(el)}"`);
    const stat = document.body.innerText.match(/.{0,20}\b\d+(?:[.,]\d+)?\s?[KkMm]\+.{0,20}/);
    if (stat) out.push(`stat counter: "${stat[0].trim()}"`);

    // 4. Icons only inside controls. Decorative icons next to headings,
    //    facts, list items and fields are the tell.
    for (const svg of document.querySelectorAll("svg[data-icon]")) {
      const host = svg.parentElement;
      if (!host || !visible(host) || svg.closest(control)) continue;
      out.push(`decorative icon "${svg.dataset.icon}" beside "${text(host.parentElement ?? host).slice(0, 40)}"`);
    }
    return [...new Set(out)];
  });
  for (const f of found.slice(0, 12)) fail(`${label} AI tell, ${f}`);
}

/*
 * Scrollbar flash: run `action` (opening an overlay) while sampling every
 * frame for ~700ms, then compare against the settled state. Fails if any
 * scroll container overflowed during the animation but not at rest (a
 * scrollbar that flashes in and out), if the page gained horizontal
 * overflow, or if the root's client width changed (the layout jumped
 * because the page scrollbar came or went).
 */
async function noScrollFlash(page, label, action) {
  await page.evaluate(() => {
    const scan = () => {
      const hits = [];
      for (const el of document.querySelectorAll("[data-panel], [data-panel] *, #mobile-drawer *, [role='dialog'], [role='dialog'] *, [role='listbox']")) {
        const cs = getComputedStyle(el);
        const id = `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}`;
        if (/auto|scroll/.test(cs.overflowY) && el.scrollHeight > el.clientHeight) hits.push(`${id} y`);
        if (/auto|scroll/.test(cs.overflowX) && el.scrollWidth > el.clientWidth) hits.push(`${id} x`);
      }
      const root = document.documentElement;
      if (root.scrollWidth > root.clientWidth) hits.push("page x");
      return { hits, width: root.clientWidth };
    };
    const first = scan();
    window.__flash = { scan, before: first.width, already: first.hits, frames: [] };
    const t0 = performance.now();
    const tick = () => {
      window.__flash.frames.push(scan());
      if (performance.now() - t0 < 700) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await action();
  await page.waitForTimeout(900);
  const { before, already, frames, rest } = await page.evaluate(() => ({ ...window.__flash, rest: window.__flash.scan() }));
  const flashed = new Set(frames.flatMap((f) => f.hits).filter((h) => !rest.hits.includes(h) && !already.includes(h)));
  for (const h of flashed) fail(`${label} scrollbar flash while opening: ${h} overflows mid-animation`);
  const widths = new Set([before, ...frames.map((f) => f.width), rest.width]);
  if (widths.size > 1) fail(`${label} layout jumped while opening (root width ${[...widths].join(" -> ")})`);
}

/*
 * The order form's date picker: opens with focus on a day, every day has a
 * full-date label, arrows/PageUp/PageDown/Home/End move focus, Enter picks
 * and returns focus to the field, Escape and an outside click close it.
 */
async function datePickerChecks(page, label) {
  const trigger = page.getByRole("button", { name: /^(Date of the celebration|Preferred pick-up date)/ });
  const dialog = page.getByRole("dialog", { name: /Date of the celebration|Preferred pick-up date/ });
  const focused = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      return el?.closest("[role='grid']") ? el.getAttribute("aria-label") : null;
    });
  const dayOf = (aria) => new Date(aria.split(", ").slice(0, 3).join(", ").replace(/^\w+, /, ""));
  const plusDays = (a, b) => Math.round((dayOf(b) - dayOf(a)) / 86_400_000);

  await trigger.scrollIntoViewIfNeeded();
  await noScrollFlash(page, `${label} date picker`, () => trigger.click());
  if (!(await dialog.isVisible())) return fail(`${label} date picker did not open`);
  await aiTells(page, `${label} date picker open`);

  const start = await focused();
  if (!start) return fail(`${label} date picker did not move focus to a day`);
  const labels = await dialog.locator("[data-day]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label") ?? ""));
  const bad = labels.filter((l) => !/^[A-Z][a-z]+day, [A-Z][a-z]+ \d{1,2}, \d{4}/.test(l));
  if (bad.length) fail(`${label} date picker days without a full-date label: ${bad.slice(0, 3).join(" | ")}`);
  // Today is only on screen when the notice period doesn't push the first open day into next month.
  const thisMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  if ((await dialog.locator("[aria-live]").innerText()) === thisMonth) {
    if (!(await dialog.locator('[aria-current="date"]').count())) fail(`${label} date picker does not mark today`);
    if (!(await dialog.locator('[aria-disabled="true"]').count())) fail(`${label} date picker disables no days before the notice period`);
  }

  const press = async (key) => {
    const from = await focused();
    await page.keyboard.press(key);
    await page.waitForTimeout(80);
    return [from, await focused()];
  };
  for (const [key, want] of [["ArrowRight", 1], ["ArrowDown", 7], ["ArrowLeft", -1], ["ArrowUp", -7]]) {
    const [a, b] = await press(key);
    if (!b || plusDays(a, b) !== want) fail(`${label} date picker ${key} moved focus from "${a}" to "${b}"`);
  }
  const month = () => dialog.locator("[aria-live]").innerText();
  const m0 = await month();
  await press("PageDown");
  if ((await month()) === m0) fail(`${label} date picker PageDown did not change month`);
  await press("PageUp");
  if ((await month()) !== m0) fail(`${label} date picker PageUp did not come back to ${m0}`);
  const firstCol = await dialog.locator("[role='columnheader']").first().getAttribute("aria-label");
  const lastCol = await dialog.locator("[role='columnheader']").last().getAttribute("aria-label");
  const [, home] = await press("Home");
  if (!home?.startsWith(firstCol)) fail(`${label} date picker Home went to "${home}", not a ${firstCol}`);
  const [, end] = await press("End");
  if (!end?.startsWith(lastCol)) fail(`${label} date picker End went to "${end}", not a ${lastCol}`);

  // End lands on an available day once the week is past the notice period; move a week on to be sure.
  await press("ArrowDown");
  const picked = await focused();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  if (await dialog.count()) fail(`${label} date picker stayed open after Enter`);
  if (!(await trigger.evaluate((el) => el === document.activeElement))) fail(`${label} date picker did not return focus to the field after picking`);
  const value = await page.locator('input[name="date"]').inputValue();
  const d = dayOf(picked);
  const want = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (value !== want) fail(`${label} date picker stored "${value}" after picking "${picked}"`);

  await trigger.click();
  await page.waitForTimeout(350);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  if (await dialog.count()) fail(`${label} date picker did not close on Escape`);
  if (!(await trigger.evaluate((el) => el === document.activeElement))) fail(`${label} date picker did not return focus on Escape`);

  await trigger.click();
  await page.waitForTimeout(350);
  await page.locator("#order-title").click();
  await page.waitForTimeout(350);
  if (await dialog.count()) fail(`${label} date picker did not close on an outside click`);
}

/* Page-level checks shared by both widths. */
async function pageChecks(page, label) {
  const h1 = await page.locator("h1").count();
  if (h1 !== 1) fail(`${label} has ${h1} <h1> elements`);
  const noAlt = await page.locator("img:not([alt])").count();
  if (noAlt) fail(`${label} has ${noAlt} <img> without alt`);
  const dash = await page.evaluate(() => document.body.innerText.match(/.{0,30}—.{0,30}/)?.[0]);
  if (dash) fail(`${label} em dash in rendered copy: "${dash}"`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) fail(`${label} horizontal overflow of ${overflow}px`);
  await aiTells(page, label);
}

/* Scroll through so every scroll-triggered entrance has played before the checks look (instant: the CSS has smooth scrolling). */
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1500);
}

for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  for (const route of routes) {
    errors.length = 0;
    const label = `${route} @${width}`;
    const res = await page.goto(base + route, { waitUntil: "networkidle" });
    if (route !== "/no-such-page/" && res?.status() !== 200) fail(`${label} returned ${res?.status()}`);
    await settle(page);
    await pageChecks(page, label);
    for (const e of errors) fail(`${label} console error: ${e.slice(0, 200)}`);
  }

  if (width === 390) {
    /* Mobile drawer: opens, takes focus, passes the tells, closes on Escape and gives focus back. */
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await settle(page);
    const trigger = page.getByRole("button", { name: "Open menu" });
    await noScrollFlash(page, "/ mobile drawer", () => trigger.click());
    await aiTells(page, "/ mobile drawer");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    if (await page.locator("#mobile-drawer").count()) fail("/ mobile drawer did not close on Escape");

    /* The date picker on a phone: same keyboard contract, opens without a flash. */
    await page.goto(base + "/order/", { waitUntil: "networkidle" });
    await settle(page);
    await datePickerChecks(page, "/order/ @390");
  } else {
    /* Header panels: Menu mega dropdown and basket (with items in it). */
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await settle(page);
    // Three lines in the basket: the list then has rows that could overflow it mid-entrance.
    const adds = page.getByRole("button", { name: /^Add .* to basket$/ });
    for (let i = 0; i < 3; i++) await adds.nth(i).click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    for (const name of [/^Menu$/, /^Basket/]) {
      await noScrollFlash(page, `/ header panel ${name}`, () => page.getByRole("banner").getByRole("button", { name }).click());
      if (!(await page.locator("[data-panel]").count())) fail(`/ header panel ${name} did not open`);
      await aiTells(page, `/ header panel ${name}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }

    /* Menu: an open select (the sort order) re-sorts the grid. */
    await page.goto(base + "/menu/", { waitUntil: "networkidle" });
    await settle(page);
    const sort = page.getByRole("combobox", { name: "Sort by" });
    await noScrollFlash(page, "/menu/ select", () => sort.click());
    await aiTells(page, "/menu/ select open");
    await page.getByRole("option").nth(2).click();
    await page.waitForTimeout(600);
    await aiTells(page, "/menu/ sorted");

    /* Order: the menu picker, the form's consent error and its sent state. */
    // Start from an empty basket (the header checks above filled it), so the picker opens.
    await page.evaluate(() => window.localStorage.removeItem("kin-kitchen-basket"));
    await page.goto(base + "/order/", { waitUntil: "networkidle" });
    await settle(page);
    await datePickerChecks(page, "/order/");
    await page.getByLabel("Full name").fill("Jane Baker");
    await page.getByLabel("Mobile number").fill("0917 123 4567");
    // An empty basket blocks a pre-order; adding from the picker unblocks it and shows a stepper.
    await page.getByRole("button", { name: /^Send order$/ }).click();
    await page.waitForTimeout(300);
    if (!(await page.getByRole("alert").filter({ hasText: /at least one treat/i }).count())) fail("/order/ empty basket was not flagged");
    await page.getByRole("button", { name: /^Add .* to your order$/ }).first().click();
    await page.waitForTimeout(300);
    if (!(await page.getByRole("button", { name: /^Add one more / }).count())) fail("/order/ menu picker did not add to the basket");
    await aiTells(page, "/order/ menu picker");
    await page.getByRole("button", { name: /^Send (order|message)$/ }).click();
    await page.waitForTimeout(400);
    if (!(await page.getByRole("alert").filter({ hasText: /tick the box/i }).count())) fail("/order/ consent error not shown");
    if (!(await page.evaluate(() => document.activeElement?.getAttribute("name") === "consent")))
      fail("/order/ a blocked submit did not move focus to the consent box");
    if (await page.getByRole("status").filter({ hasText: /thank you/i }).count()) fail("/order/ form sent without consent");
    await aiTells(page, "/order/ form error");
    await page.keyboard.press("Space");
    if (!(await page.locator('input[name="consent"]').isChecked())) fail("/order/ Space did not tick the consent box");
    if (await page.getByRole("alert").filter({ hasText: /tick the box/i }).count()) fail("/order/ consent error stayed after ticking");
    await page.getByRole("button", { name: /^Send (order|message)$/ }).click();
    await page.waitForTimeout(900);
    if (!(await page.getByRole("status").filter({ hasText: /thank you/i }).count())) fail("/order/ form did not reach its sent state");
    // The short note replaces a long form: it must land on screen, not above it.
    await page.waitForTimeout(900);
    const noteTop = await page.getByRole("status").filter({ hasText: /thank you/i }).first().evaluate((el) => el.getBoundingClientRect().top);
    if (noteTop < 0 || noteTop > (await page.evaluate(() => window.innerHeight)) - 120) fail(`/order/ sent note is off screen (top ${Math.round(noteTop)}px)`);
    await aiTells(page, "/order/ sent state");
  }
  await context.close();
}

await browser.close();

/*
 * Real scrollbars. Headless Chromium hides them by default, so the checks
 * that depend on one taking up width run in a second browser that keeps
 * them: the drawer's scroll lock must not shift the page sideways (1024 is
 * a tablet or narrow desktop window with a page scrollbar and the drawer).
 */
{
  const sbBrowser = await chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] });
  const page = await sbBrowser.newPage({ viewport: { width: 1024, height: 800 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const gutter = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  if (gutter <= 0 || gutter > 12) fail(`page scrollbar is ${gutter}px wide (expected the thin custom bar)`);
  const logoX = () => page.evaluate(() => document.querySelector("header a").getBoundingClientRect().x);
  const before = await logoX();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(800);
  const open = await logoX();
  if (Math.abs(open - before) > 0.5) fail(`/ mobile drawer scroll lock shifted the page by ${open - before}px`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);
  if (Math.abs((await logoX()) - before) > 0.5) fail("/ mobile drawer left the page shifted after closing");
  await sbBrowser.close();
}

server.close();
if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`QA passed: ${routes.length} routes at 1440 and 390, header panels, mobile drawer, menu sort select, date picker, order form, scrollbar flash.`);
