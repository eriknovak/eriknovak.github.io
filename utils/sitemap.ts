import fs from "fs";
import path from "path";

import { SITE_URL } from "./config";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
}

const escapeXml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function entryXml({
  loc,
  lastmod,
  changefreq,
  priority,
}: SitemapEntry): string {
  const lines = [`    <loc>${escapeXml(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority !== undefined) {
    lines.push(`    <priority>${priority.toFixed(1)}</priority>`);
  }
  return `  <url>\n${lines.join("\n")}\n  </url>`;
}

/** Generate sitemap.xml from the static routes. */
export function writeSitemap(): void {
  const entries: SitemapEntry[] = [
    { loc: `${SITE_URL}/`, changefreq: "monthly", priority: 1.0 },
    { loc: `${SITE_URL}/projects/`, changefreq: "monthly", priority: 0.8 },
    { loc: `${SITE_URL}/publications/`, changefreq: "monthly", priority: 0.8 },
  ];


  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map(entryXml).join("\n") +
    `\n</urlset>\n`;

  fs.writeFileSync(
    path.join(process.cwd(), "public", "sitemap.xml"),
    xml,
    "utf8",
  );
}
