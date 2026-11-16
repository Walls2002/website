import { site } from "@/lib/site";

/**
 * Where a sent order goes. The site is a static export with no server, so the
 * call runs in the visitor's browser with the public, write-only key:
 *
 * The Kin Kitchen CRM's Supabase RPC, `submit_web_order`, validates the order
 * and files it on the CRM's Inquiries page. Saving it also emails the owner:
 * a database trigger calls the CRM's `notify-web-order` function, which sends
 * through Brevo with a key that never reaches the browser (CRM migration 0012).
 *
 * Set at build time:
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY   (same project and publishable key as the CRM)
 *
 * Without them nothing is pretended: the form hands the customer a ready-made
 * email to send themselves, and does the same if the CRM can't be reached.
 */

export type OrderKind = "basket" | "custom-cake" | "question";

export type OrderItem = { name: string; category: string; qty: number; note: string | null };

export type OrderPayload = {
  kind: OrderKind;
  customer: string;
  phone: string;
  email: string;
  contact_pref: string;
  pickup_point: string;
  /** ISO date (YYYY-MM-DD) or null. */
  pickup_date: string | null;
  occasion: string;
  notes: string;
  items: OrderItem[];
};

export type SendResult = { status: "sent" } | { status: "unconfigured" } | { status: "failed"; reason: string };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const heading: Record<OrderKind, string> = {
  basket: "New pre-order from the website",
  "custom-cake": "New cake request from the website",
  question: "New question from the website",
};

const subjectFor: Record<OrderKind, string> = {
  basket: "Pre-order",
  "custom-cake": "Cake request",
  question: "Question",
};

/** The order as plain text: the fallback email the customer sends themselves. */
export function orderText(p: OrderPayload) {
  const lines = [
    heading[p.kind],
    "",
    `Name: ${p.customer}`,
    p.phone && `Mobile: ${p.phone}`,
    p.email && `Email: ${p.email}`,
    p.contact_pref && `Reply by: ${p.contact_pref}`,
    p.pickup_point && `Pick-up: ${p.pickup_point}`,
    p.pickup_date && `Date: ${p.pickup_date}`,
    p.occasion && `Occasion: ${p.occasion}`,
  ].filter(Boolean) as string[];
  if (p.items.length) {
    lines.push("", "Items:", ...p.items.map((i) => `- ${i.qty} x ${i.name}${i.note ? ` (${i.note})` : ""}`));
  }
  if (p.notes) lines.push("", p.kind === "question" ? "Question:" : "Notes:", p.notes);
  return lines.join("\n");
}

export function mailtoHref(p: OrderPayload) {
  const subject = `${subjectFor[p.kind]} from ${p.customer}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderText(p))}`;
}

export async function sendOrder(p: OrderPayload): Promise<SendResult> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { status: "unconfigured" };
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_web_order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
      body: JSON.stringify({ payload: p }),
    });
    if (res.ok) return { status: "sent" };
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    return { status: "failed", reason: body?.message || `The kitchen's inbox answered ${res.status}` };
  } catch {
    return { status: "failed", reason: "Network error" };
  }
}
