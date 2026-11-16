import { site } from "@/lib/site";

/**
 * Where a sent order goes. The site is a static export with no server, so
 * both calls run in the visitor's browser with public, write-only keys:
 *
 * 1. The Kin Kitchen CRM: a Supabase RPC, `submit_web_order`, that validates
 *    the order and drops it in the CRM's "From the website" inbox. It is the
 *    only thing the public key can call (see the CRM's migration 0010).
 * 2. The owner's inbox: Web3Forms emails the order to the address the access
 *    key was created with (kinkitchen4@gmail.com).
 *
 * Set at build time:
 *   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY   (same project and publishable key as the CRM)
 *   NEXT_PUBLIC_WEB3FORMS_KEY                                 (from web3forms.com, made with the owner's email)
 *
 * An order counts as sent when at least one of the two lands. With neither
 * configured, nothing is pretended: the form hands the customer a ready-made
 * email to send themselves.
 */

export type OrderKind = "basket" | "custom-cake";

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

export type SendResult =
  | { status: "sent"; crm: boolean; email: boolean }
  | { status: "unconfigured" }
  | { status: "failed"; reason: string };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export const orderChannelsConfigured = Boolean((SUPABASE_URL && SUPABASE_KEY) || WEB3FORMS_KEY);

/** The order as plain text: the email body, and the fallback the customer sends themselves. */
export function orderText(p: OrderPayload) {
  const lines = [
    p.kind === "basket" ? "New pre-order from the website" : "New cake request from the website",
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
  if (p.notes) lines.push("", "Notes:", p.notes);
  return lines.join("\n");
}

export function mailtoHref(p: OrderPayload) {
  const subject = p.kind === "basket" ? `Pre-order from ${p.customer}` : `Cake request from ${p.customer}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderText(p))}`;
}

async function toCrm(p: OrderPayload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_web_order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY! },
    body: JSON.stringify({ payload: p }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `CRM answered ${res.status}`);
  }
}

async function toEmail(p: OrderPayload) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: p.kind === "basket" ? `New pre-order from ${p.customer}` : `New cake request from ${p.customer}`,
      from_name: `${site.name} website`,
      name: p.customer,
      email: p.email || undefined,
      replyto: p.email || undefined,
      phone: p.phone,
      message: orderText(p),
    }),
  });
  const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
  if (!res.ok || !body?.success) throw new Error(body?.message || `Email service answered ${res.status}`);
}

export async function sendOrder(p: OrderPayload): Promise<SendResult> {
  const jobs: Promise<"crm" | "email">[] = [];
  if (SUPABASE_URL && SUPABASE_KEY) jobs.push(toCrm(p).then(() => "crm" as const));
  if (WEB3FORMS_KEY) jobs.push(toEmail(p).then(() => "email" as const));
  if (!jobs.length) return { status: "unconfigured" };

  const results = await Promise.allSettled(jobs);
  const landed = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  if (landed.length) return { status: "sent", crm: landed.includes("crm"), email: landed.includes("email") };
  const first = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
  return { status: "failed", reason: first?.reason instanceof Error ? first.reason.message : "Network error" };
}
