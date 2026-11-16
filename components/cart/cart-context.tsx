"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { productBySlug, type Product } from "@/lib/data";

type Line = { product: Product; qty: number };
type Items = Record<string, number>;

type CartValue = {
  lines: Line[];
  count: number;
  add: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  /** Bumps on every add so the header can play its "added" animation. */
  pulse: number;
};

const CartContext = createContext<CartValue | null>(null);

/*
 * The basket lives in a small external store backed by localStorage, so it
 * survives a reload and stays in step across tabs. It is a convenience in this
 * browser only, never the order record. The server (and hydration) always see
 * an empty basket; the stored one takes over right after.
 */
const STORAGE_KEY = "kin-kitchen-basket";
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
          productBySlug.has(entry[0]) && Number.isInteger(entry[1]) && (entry[1] as number) > 0 && (entry[1] as number) < 100,
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

  const add = useCallback((slug: string) => {
    write((prev) => ({ ...prev, [slug]: Math.min(99, (prev[slug] ?? 0) + 1) }));
    setPulse((n) => n + 1);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    write((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[slug];
      else next[slug] = Math.min(99, qty);
      return next;
    });
  }, []);

  const clear = useCallback(() => write(() => ({})), []);

  const value = useMemo(() => {
    const lines = Object.entries(items).flatMap(([slug, qty]) => {
      const product = productBySlug.get(slug);
      return product ? [{ product, qty }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
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
