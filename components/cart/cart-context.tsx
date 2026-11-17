"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { productBySlug, type Flavour, type Product, type ProductOption } from "@/lib/data";

/** One basket line: a product in one size (and flavour, where it has them). */
export type Line = {
  key: string;
  product: Product;
  option: ProductOption;
  flavour: Flavour | null;
  qty: number;
  /** qty × the option's price. */
  total: number;
};
type Items = Record<string, number>;

type CartValue = {
  lines: Line[];
  count: number;
  /** Sum of every line at menu prices. */
  total: number;
  add: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  /** Bumps on every add so the header can play its "added" animation. */
  pulse: number;
};

const CartContext = createContext<CartValue | null>(null);

/** "fudgy-brownies~box-6" or "cinnamon-rolls~pair~vanilla". */
export const lineKey = (slug: string, optionId: string, flavourId?: string | null) =>
  [slug, optionId, flavourId].filter(Boolean).join("~");

/** Resolves a stored key against today's menu; anything no longer on it is dropped. */
function resolve(key: string) {
  const [slug, optionId, flavourId] = key.split("~");
  const product = productBySlug.get(slug);
  const option = product?.options.find((o) => o.id === optionId);
  if (!product || !option) return null;
  const flavour = product.flavours ? (product.flavours.choices.find((f) => f.id === flavourId) ?? null) : null;
  // A product with flavours needs one; one without must not carry one.
  if (Boolean(product.flavours) !== Boolean(flavour)) return null;
  return { product, option, flavour };
}

/*
 * The basket lives in a small external store backed by localStorage, so it
 * survives a reload and stays in step across tabs. It is a convenience in this
 * browser only, never the order record. The server (and hydration) always see
 * an empty basket; the stored one takes over right after.
 */
const STORAGE_KEY = "kin-kitchen-basket-2";
const EMPTY: Items = {};
let cache: Items | null = null;
const listeners = new Set<() => void>();

function readStored(): Items {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] =>
          resolve(entry[0]) !== null && Number.isInteger(entry[1]) && (entry[1] as number) > 0 && (entry[1] as number) < 100,
      ),
    );
  } catch {
    return EMPTY;
  }
}

const getSnapshot = () => (cache ??= readStored());
const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = readStored();
    listeners.forEach((l) => l());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(update: (prev: Items) => Items) {
  cache = update(getSnapshot());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Private mode or blocked storage: the basket still works for this visit.
  }
  listeners.forEach((l) => l());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [pulse, setPulse] = useState(0);

  const add = useCallback((key: string) => {
    if (!resolve(key)) return;
    write((prev) => ({ ...prev, [key]: Math.min(99, (prev[key] ?? 0) + 1) }));
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    write((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[key];
      else next[key] = Math.min(99, qty);
      return next;
    });
  }, []);

  const clear = useCallback(() => write(() => ({})), []);

  const value = useMemo(() => {
    const lines: Line[] = Object.entries(items).flatMap(([key, qty]) => {
      const hit = resolve(key);
      return hit ? [{ key, ...hit, qty, total: hit.option.price * qty }] : [];
    });
    // Menu order, then size order, so the basket reads like the menu.
    lines.sort(
      (a, b) =>
        a.product.order - b.product.order ||
        a.product.options.indexOf(a.option) - b.product.options.indexOf(b.option) ||
        a.key.localeCompare(b.key),
    );
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.total, 0),
      add,
      setQty,
      clear,
      pulse,
    };
  }, [items, add, setQty, clear, pulse]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** "Vanilla glaze" */
export const flavourText = (p: Product, f: Flavour | null) => (f && p.flavours ? `${f.label} ${p.flavours.name.toLowerCase()}` : "");

/** "2 pieces · Vanilla glaze": what sets a line apart from the product name. */
export const lineDetail = (l: Pick<Line, "product" | "option" | "flavour">) =>
  [l.option.label, flavourText(l.product, l.flavour)].filter(Boolean).join(" · ");
