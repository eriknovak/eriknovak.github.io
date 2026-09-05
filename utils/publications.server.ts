import fs from "fs";
import path from "path";

/**
 * First-page images live in public/imgs/publications/<id>.png (generated via
 * scripts/generate-publication-thumbnails.mjs). Call from getStaticProps to
 * collect the ids that have one, so cards only render thumbnails that exist.
 * Server-only: keep this import inside getStaticProps usage.
 */
export function getThumbnailIds(): string[] {
  const dir = path.join(process.cwd(), "public", "imgs", "publications");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".png"))
      .map((f) => f.replace(/\.png$/, ""));
  } catch {
    // Directory may not exist yet; render without thumbnails.
    return [];
  }
}
