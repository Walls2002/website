"use client";

import type { ImageLoaderProps } from "next/image";
import manifest from "./image-manifest.json";

type Entry = { w: number; h: number; v: string };

/**
 * Maps a next/image request to a variant pre-rendered by
 * scripts/optimize-images.mjs. Requests wider than the source get the
 * full-size variant; anything not in the manifest is served as-is.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const entry = (manifest as Record<string, Entry>)[src];
  if (!entry) return src;
  const base = src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "");
  return `/_img/${base}.${entry.v}.${Math.min(width, entry.w)}.webp`;
}
