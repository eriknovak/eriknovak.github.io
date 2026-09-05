#!/usr/bin/env node
/**
 * Generate the site favicon set from a single inline SVG.
 *
 * The mark is a typographic "E" on the Editorial Minimal navy tile
 * (--ed-bg), glyph in --ed-fg, middle bar in the --ed-accent blue that the
 * nav uses for the active underline. Built from plain rects so it needs no
 * font at render time and stays crisp at 16px.
 *
 * Output (public/):
 *   favicon.svg           modern browsers, scales to any size
 *   favicon.ico           16/32/48 PNG-in-ICO for legacy UAs and /favicon.ico probes
 *   apple-touch-icon.png  180px, full-bleed (iOS applies its own corner mask)
 *
 * Usage: npm run favicon
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public");

const BG = "#141821";
const FG = "#e6eaf2";
const ACCENT = "#93a9de";
const RULE = "#2a3140";

// `rounded` draws the tile with corners + hairline; apple-touch-icon is square.
const svg = (rounded) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="${BG}"/>
  ${rounded ? `<rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" stroke="${RULE}"/>` : ""}
  <rect x="18" y="16" width="8" height="32" fill="${FG}"/>
  <rect x="18" y="16" width="28" height="7" fill="${FG}"/>
  <rect x="18" y="28.5" width="22" height="7" fill="${ACCENT}"/>
  <rect x="18" y="41" width="28" height="7" fill="${FG}"/>
</svg>
`;

const png = (source, size) =>
  sharp(Buffer.from(source), { density: 72 * (size / 64) * 4 })
    .resize(size, size)
    .png()
    .toBuffer();

// ICO container holding PNG-encoded images (supported by all current browsers).
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const rounded = svg(true);
fs.writeFileSync(path.join(OUT, "favicon.svg"), rounded);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(rounded, size) })),
);
fs.writeFileSync(path.join(OUT, "favicon.ico"), ico(icoImages));

fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), await png(svg(false), 180));

console.log("wrote public/favicon.svg, favicon.ico, apple-touch-icon.png");
