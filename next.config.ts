import type { NextConfig } from "next";
import { deviceSizes, imageSizes } from "./lib/image-widths.mjs";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` for any bucket host (R2, Pages, Workers static assets).
  output: "export",
  // Every route becomes <route>/index.html, so a plain static host serves /about/ without rewrites.
  trailingSlash: true,
  images: {
    // Static hosting has no image-optimisation server. `npm run build` pre-renders
    // WebP width variants (scripts/optimize-images.mjs) and this loader picks one
    // per srcset entry.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    imageSizes,
    deviceSizes,
  },
};

export default nextConfig;
