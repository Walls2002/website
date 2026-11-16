"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/cart-context";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { MenuPicker } from "@/components/order/menu-picker";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { categories, consentCopy } from "@/lib/data";
import { gsap, useGSAP, useMotion } from "@/lib/gsap";
import { mailtoHref, sendOrder, type OrderKind, type OrderPayload } from "@/lib/send-order";
import { pickupPoints, site } from "@/lib/site";

type Enquiry = OrderKind;

/** `/order?for=cake` and `/order?for=question` open the form on that kind of message. */
const fromUrl: Record<string, Enquiry> = { cake: "custom-cake", question: "question", basket: "basket" };

const enquiryOptions: { value: Enquiry; label: string }[] = [
  { value: "basket", label: "A pre-order from my basket" },
  { value: "custom-cake", label: "A celebration cake" },
  { value: "question", label: "A question" },
];

const cakeOptions = [
  { value: "Icing cake, 6 by 2", label: "Icing cake, 6 by 2" },
  { value: "Full fondant cake", label: "Full fondant cake" },
  { value: "Number cake", label: "Number cake" },
  { value: "Message brownie tray", label: "Message brownie tray" },
  { value: "Cupcake box", label: "Cupcake box" },
  { value: "Not sure yet", label: "Not sure yet" },
];

const occasionOptions = [
  { value: "Birthday", label: "Birthday" },
  { value: "Mother's or Father's Day", label: "Mother's or Father's Day" },
  { value: "Anniversary", label: "Anniversary" },
  { value: "Christening or baby shower", label: "Christening or baby shower" },
  { value: "Just because", label: "Just because" },
];

const replyOptions = [
  { value: "Text or call", label: "Text or call" },
  { value: "Messenger", label: "Messenger" },
  { value: "Email", label: "Email" },
];

const pickupOptions = pickupPoints.map((p) => ({ value: p.value, label: p.label }));
const categoryLabel = new Map(categories.map((c) => [c.slug, c.label]));

const inputCls =
  "min-h-12 w-full rounded-xl border border-oat-line bg-white px-4 text-[15px] text-ink placeholder:text-muted/70 transition-colors hover:border-brand-soft focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none";

type Outcome =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent"; kind: Enquiry }
  | { state: "handoff"; mailto: string }
  | { state: "failed"; reason: string; mailto: string };

export function OrderForm() {
  const ref = useRef<HTMLElement>(null);
  const { lines, setQty, clear } = useCart();
  const [enquiry, setEnquiry] = useState<Enquiry>("basket");
  const touchedEnquiry = useRef(false);
  const [cake, setCake] = useState("");
  const [occasion, setOccasion] = useState("");
  const [reply, setReply] = useState("Text or call");
  const [pickup, setPickup] = useState(pickupPoints[0].value);
  const [date, setDate] = useState("");
  const [outcome, setOutcome] = useState<Outcome>({ state: "idle" });
  const [basketError, setBasketError] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [consentPulse, setConsentPulse] = useState(0);
  const consentRef = useRef<HTMLInputElement>(null);

  // A link can ask for a cake request or a question (static export: read in the browser).
  useEffect(() => {
    const wanted = fromUrl[new URLSearchParams(window.location.search).get("for") ?? ""];
    if (wanted && !touchedEnquiry.current) setEnquiry(wanted);
  }, []);

  useMotion(ref, (el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true } });
    tl.from("[data-form-head]", { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "transform" })
      .from(
        "[data-field]",
        { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "transform" },
        "-=0.3",
      )
      .fromTo(
        "[data-form-art]",
        { clipPath: "inset(0% 0% 100% 0% round 1.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 1.1, ease: "power4.inOut" },
        0,
      );
  });

  const done = outcome.state === "sent" || outcome.state === "handoff";

  useGSAP(
    () => {
      if (!done || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-sent-text]", { y: 16, autoAlpha: 0, stagger: 0.1, duration: 0.5 });
    },
    { scope: ref, dependencies: [done] },
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (outcome.state === "sending") return;
    if (enquiry === "basket" && !lines.length) {
      setBasketError(true);
      return;
    }
    // Consent is validated here (not with native `required`) so the prompt can be
    // animated and announced next to our custom checkbox instead of a browser bubble.
    if (!consent) {
      setConsentError(true);
      setConsentPulse((n) => n + 1);
      consentRef.current?.focus();
      return;
    }

    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    const point = pickupPoints.find((p) => p.value === pickup);
    const payload: OrderPayload = {
      kind: enquiry,
      customer: text("name"),
      phone: text("phone"),
      email: text("email"),
      contact_pref: reply,
      pickup_point: enquiry === "question" ? "" : (point?.label ?? ""),
      pickup_date: enquiry === "question" ? null : date || null,
      occasion: enquiry === "custom-cake" ? occasion : "",
      notes: [enquiry === "custom-cake" && cake ? `Cake: ${cake}` : "", text("message")]
        .filter(Boolean)
        .join("\n"),
      items:
        enquiry === "basket"
          ? lines.map(({ product, qty }) => ({
              name: product.name,
              category: categoryLabel.get(product.category) ?? product.category,
              qty,
              note: null,
            }))
          : [],
    };

    setOutcome({ state: "sending" });
    const result = await sendOrder(payload);
    if (result.status === "sent") {
      if (enquiry === "basket") clear();
      setOutcome({ state: "sent", kind: enquiry });
    } else if (result.status === "unconfigured") {
      setOutcome({ state: "handoff", mailto: mailtoHref(payload) });
    } else {
      setOutcome({ state: "failed", reason: result.reason, mailto: mailtoHref(payload) });
    }
  };

  const reset = () => {
    setOutcome({ state: "idle" });
    setConsent(false);
    setDate("");
  };

  const isCake = enquiry === "custom-cake";
  const isQuestion = enquiry === "question";
  const sending = outcome.state === "sending";

  return (
    <section ref={ref} id="order" aria-labelledby="order-title" className="container-site scroll-mt-28 pt-14 sm:pt-20">
      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        <div className="min-w-0 rounded-3xl bg-oat p-5 sm:p-8 lg:p-10">
          <h2
            id="order-title"
            data-form-head
            className="font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] leading-tight text-ink"
          >
            Send your order
          </h2>
          <p data-form-head className="mt-3 max-w-[38rem] text-[15px] leading-relaxed text-muted">
            We bake in batches and confirm every order by message, with the price and the pick-up details.
          </p>

          {outcome.state === "sent" ? (
            <div className="mt-8 rounded-2xl bg-white p-8 text-center" role="status">
              <p data-sent-text className="font-serif text-2xl text-ink">
                Thank you, it&apos;s with us!
              </p>
              <p data-sent-text className="mx-auto mt-2 max-w-[28rem] text-[15px] text-muted">
                {outcome.kind === "question"
                  ? "We'll reply as soon as we're out of the kitchen."
                  : "We'll message you to confirm the price, the date and where to pick up."}
              </p>
              <span data-sent-text className="mt-6 inline-block">
                <Button variant="outline" onClick={reset}>
                  Send another
                </Button>
              </span>
            </div>
          ) : outcome.state === "handoff" ? (
            <div className="mt-8 rounded-2xl bg-white p-8 text-center" role="status">
              <p data-sent-text className="font-serif text-2xl text-ink">
                Thank you! One last step
              </p>
              <p data-sent-text className="mx-auto mt-2 max-w-[28rem] text-[15px] text-muted">
                Your order is written up in an email to {site.email}. Open it and press send, and we&apos;ll reply to
                confirm.
              </p>
              <span data-sent-text className="mt-6 inline-flex flex-wrap justify-center gap-3">
                <ButtonLink href={outcome.mailto}>Open the email</ButtonLink>
                <Button variant="outline" onClick={reset}>
                  Edit my order
                </Button>
              </span>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <div data-field className="sm:col-span-2">
                <Select
                  label="What are you sending?"
                  name="enquiry"
                  options={enquiryOptions}
                  value={enquiry}
                  onChange={(v) => {
                    touchedEnquiry.current = true;
                    setBasketError(false);
                    setEnquiry(v as Enquiry);
                  }}
                />
              </div>

              {enquiry === "basket" && (
                <div data-field className="min-w-0 rounded-2xl bg-white p-3 sm:col-span-2 sm:p-4">
                  <p className="px-1 pb-2 text-[15px] font-semibold text-ink">Your basket</p>
                  {lines.length ? (
                    <ul className="divide-y divide-oat-line">
                      {lines.map(({ product, qty }) => (
                        <li key={product.slug} className="flex items-center gap-3 py-2">
                          <Image
                            src={`/images/products/${product.slug}.webp`}
                            alt=""
                            width={48}
                            height={48}
                            className="size-12 rounded-lg bg-cream object-cover"
                          />
                          <span className="min-w-0 flex-1 text-sm font-medium text-ink">{product.name}</span>
                          <span data-allow-number className="flex items-center gap-1 rounded-full border border-oat-line p-0.5">
                            <button
                              type="button"
                              aria-label={`Remove one ${product.name}`}
                              onClick={() => setQty(product.slug, qty - 1)}
                              className="grid size-8 place-items-center rounded-full text-ink hover:bg-oat"
                            >
                              <MinusIcon className="size-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-medium">{qty}</span>
                            <button
                              type="button"
                              aria-label={`Add one ${product.name}`}
                              onClick={() => setQty(product.slug, qty + 1)}
                              className="grid size-8 place-items-center rounded-full text-ink hover:bg-oat"
                            >
                              <PlusIcon className="size-3.5" />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`rounded-xl px-3 py-4 text-sm ${basketError ? "bg-latte-soft text-caramel-dark" : "bg-oat text-muted"}`} role={basketError ? "alert" : undefined}>
                      {basketError
                        ? "Add at least one treat from the menu below, or choose a celebration cake above."
                        : "Nothing in it yet. Add treats from the menu below."}
                    </p>
                  )}
                  <MenuPicker />
                </div>
              )}

              <label data-field className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Full name</span>
                <input required name="name" autoComplete="name" maxLength={120} placeholder="Juana Dela Cruz" className={inputCls} />
              </label>
              <label data-field className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Mobile number</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  placeholder="0917 123 4567"
                  className={inputCls}
                />
              </label>
              <label data-field className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Email (optional)</span>
                <input type="email" name="email" autoComplete="email" maxLength={200} placeholder="juana@email.com" className={inputCls} />
              </label>
              <div data-field>
                <Select label="Best way to reply" name="reply" options={replyOptions} value={reply} onChange={setReply} />
              </div>

              {!isQuestion && (
                <>
                  <div data-field>
                    <Select label="Pick-up point" name="pickup" options={pickupOptions} value={pickup} onChange={setPickup} />
                  </div>
                  <div data-field>
                    <DatePicker
                      label={isCake ? "Date of the celebration" : "Preferred pick-up date"}
                      name="date"
                      value={date}
                      onChange={setDate}
                      minDaysAhead={Math.ceil(site.terms.earliestPickupHours / 24)}
                      note="We confirm every date by message."
                    />
                  </div>
                </>
              )}

              {isCake && (
                <>
                  <div data-field>
                    <Select label="Cake" name="cake" options={cakeOptions} value={cake} onChange={setCake} placeholder="Choose one" />
                  </div>
                  <div data-field>
                    <Select
                      label="Occasion"
                      name="occasion"
                      options={occasionOptions}
                      value={occasion}
                      onChange={setOccasion}
                      placeholder="Choose one"
                    />
                  </div>
                </>
              )}

              <label data-field className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-ink">{isQuestion ? "Your question" : "Anything we should know?"}</span>
                <textarea
                  name="message"
                  required={isQuestion}
                  rows={4}
                  maxLength={2000}
                  placeholder={
                    isCake
                      ? "The message on the cake, colours, a photo you'll send on Messenger…"
                      : isQuestion
                        ? "Ask away"
                        : "Drizzle choice, who's picking up, allergies…"
                  }
                  className={`${inputCls} resize-y py-3`}
                />
              </label>
              <div data-field className="sm:col-span-2">
                <Checkbox
                  name="consent"
                  checked={consent}
                  onChange={(value) => {
                    setConsent(value);
                    if (value) setConsentError(false);
                  }}
                  error={consentError ? consentCopy.error : undefined}
                  errorPulse={consentPulse}
                  inputRef={consentRef}
                >
                  {consentCopy.label}
                </Checkbox>
              </div>
              {outcome.state === "failed" && (
                <div role="alert" className="rounded-2xl bg-latte-soft p-4 text-sm text-ink sm:col-span-2">
                  <p className="font-semibold">We couldn&apos;t send that just now.</p>
                  <p className="mt-1 text-muted">
                    Try again, or{" "}
                    <a href={outcome.mailto} className="font-semibold text-brand underline underline-offset-4">
                      send it by email
                    </a>{" "}
                    or{" "}
                    <a href={site.messengerUrl} className="font-semibold text-brand underline underline-offset-4">
                      on Messenger
                    </a>
                    .
                  </p>
                </div>
              )}
              <div data-field className="sm:col-span-2">
                <Button type="submit" size="lg" fluid disabled={sending} aria-busy={sending}>
                  {sending ? "Sending…" : isQuestion ? "Send message" : "Send order"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div data-form-art className="relative hidden aspect-[4/5] overflow-hidden rounded-3xl lg:block lg:aspect-auto">
          <Image
            src="/images/okasan-cake.webp"
            alt="White birthday cake piped with lilac and lettered Happy birthday Okasan"
            fill
            sizes="(min-width: 1024px) 32vw, 0px"
            className="object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-5">
            <p className="font-serif text-lg text-ink">Your words, piped on top</p>
            <p className="mt-1 text-sm text-muted">
              Send the message and colours with your order, or a photo on Messenger.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
