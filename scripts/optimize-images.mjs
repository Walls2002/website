/**
 * Builds responsive WebP variants of everything in public/images for the
 * custom next/image loader (lib/image-loader.ts). A static export has no image
 * optimiser, so this runs before `next build` / `next dev`.
 *
 * - Variants go to public/_img/<path>.<hash>.<width>.webp (git-ignored). The
 *   content hash in the name lets them be cached as immutable.
 * - lib/image-manifest.json records each source's width and hash so the loader
 *   can build URLs without touching the filesystem. It is deterministic, so it
 *   is committed and only changes when an image does.
 */
import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { imageWidths } from "../lib/image-widths.mjs";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "public/images");
const outDir = path.join(root, "public/_img");
const manifestPath = path.join(root, "lib/image-manifest.json");
const QUALITY = 75;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat().filter((f) => /\.(webp|png|jpe?g)$/i.test(f));
}

async function exists(file) {
  return stat(file).then(
    () => true,
    () => false,
  );
}

async function build(file) {
  const input = await readFile(file);
  const hash = createHash("sha256").update(input).update(`q${QUALITY}`).digest("hex").slice(0, 8);
  const { width, height } = await sharp(input).metadata();
  const rel = path.relative(srcDir, file).split(path.sep).join("/");
  const base = rel.replace(/\.[^.]+$/, "");
  const targets = [...imageWidths.filter((w) => w < width), width];

  await Promise.all(
    targets.map(async (w) => {
      const dest = path.join(outDir, `${base}.${hash}.${w}.webp`);
      if (await exists(dest)) return;
      await mkdir(path.dirname(dest), { recursive: true });
      const buf = await sharp(input).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toBuffer();
      // At full size, keep the original WebP if re-encoding would not shrink it.
      if (w === width && /\.webp$/i.test(file) && buf.length >= input.length) return copyFile(file, dest);
      await writeFile(dest, buf);
    }),
  );

  return [`/images/${rel}`, { w: width, h: height, v: hash }];
}

const files = (await walk(srcDir)).sort();
const entries = await Promise.all(files.map(build));
const manifest = Object.fromEntries(entries);

// Drop variants whose source changed or was removed.
const keep = new Set(
  Object.entries(manifest).flatMap(([src, { w, v }]) => {
    const base = src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "");
    return [...imageWidths.filter((x) => x < w), w].map((x) => `${base}.${v}.${x}.webp`);
  }),
);
for (const f of await walk(outDir)) {
  const rel = path.relative(outDir, f).split(path.sep).join("/");
  if (!keep.has(rel)) await rm(f);
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`optimize-images: ${files.length} sources, ${keep.size} variants`);
