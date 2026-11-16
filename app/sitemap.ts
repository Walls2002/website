import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for route handlers under `output: "export"`: render once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Every page the nav or the footer help links reach, once each (hashes and filters dropped).
  const paths = Array.from(new Set([...site.nav, ...site.help].map((item) => item.href.split(/[?#]/)[0])));
  return paths.map((path) => ({
    url: `${site.url}${path === "/" ? "/" : `${path}/`}`,
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
