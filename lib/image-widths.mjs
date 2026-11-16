/**
 * Widths next/image may request (imageSizes + deviceSizes in next.config.ts).
 * Shared with scripts/optimize-images.mjs, which pre-renders each one.
 */
export const imageSizes = [48, 96, 128, 256, 384, 512];
export const deviceSizes = [640, 828, 1080, 1280, 1920];
export const imageWidths = [...imageSizes, ...deviceSizes];
