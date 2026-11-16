import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for route handlers under `output: "export"`: render once at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return site.nav.map((item) => ({
    url: `${site.url}${item.href === "/" ? "/" : `${item.href}/`}`,
    changeFrequency: item.href === "/menu" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
