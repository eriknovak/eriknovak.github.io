import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

import type { BlogPostMeta, BlogTagSummary } from "../../Interfaces";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

/** Filename convention: YYYY-MM-DD-slug.mdx */
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx$/;

interface ReadOptions {
  /** Include draft posts (default: include only when not in production) */
  includeDrafts?: boolean;
}

function defaultIncludeDrafts(): boolean {
  return process.env.NODE_ENV !== "production";
}

function parseFile(filename: string): BlogPostMeta & { rawContent: string } {
  const match = FILENAME_RE.exec(filename);
  if (!match) {
    throw new Error(
      `Blog post filename does not match YYYY-MM-DD-slug.mdx: ${filename}`,
    );
  }
  const [, year, , , slug] = match;

  const fullPath = path.join(CONTENT_DIR, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  if (!data.title || !data.date || !data.description || !data.tags) {
    throw new Error(
      `Missing required frontmatter (title/date/description/tags) in ${filename}`,
    );
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    throw new Error(
      `Frontmatter 'tags' must be a non-empty array in ${filename}`,
    );
  }

  const dateString =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date);

  return {
    slug,
    title: String(data.title),
    date: dateString,
    year,
    description: String(data.description),
    tags: (data.tags as string[]).map((t) => String(t).toLowerCase()),
    draft: Boolean(data.draft),
    updated:
      data.updated instanceof Date
        ? data.updated.toISOString().slice(0, 10)
        : data.updated
          ? String(data.updated)
          : undefined,
    epigraph: data.epigraph
      ? {
          quote: String(data.epigraph.quote ?? ""),
          attribution: data.epigraph.attribution
            ? String(data.epigraph.attribution)
            : undefined,
          source: data.epigraph.source
            ? String(data.epigraph.source)
            : undefined,
        }
      : undefined,
    bibliography: data.bibliography ? String(data.bibliography) : undefined,
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    rawContent: content,
  };
}

/** Read every post; sorted reverse-chronologically. Drafts filtered per options. */
export function readAllPosts(options: ReadOptions = {}): BlogPostMeta[] {
  const includeDrafts = options.includeDrafts ?? defaultIncludeDrafts();
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") && FILENAME_RE.test(f));

  const posts = files.map((f) => {
    const { rawContent: _omit, ...meta } = parseFile(f);
    return meta;
  });

  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Read a specific post (meta + raw MDX content). */
export function getPostRaw(
  year: string,
  slug: string,
): { meta: BlogPostMeta; content: string } | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;
  const files = fs.readdirSync(CONTENT_DIR);
  const filename = files.find((f) => {
    const match = FILENAME_RE.exec(f);
    return match && match[1] === year && match[4] === slug;
  });
  if (!filename) return null;
  const parsed = parseFile(filename);
  const { rawContent, ...meta } = parsed;
  return { meta, content: rawContent };
}

/** Aggregate tag counts across all (non-draft, in production) posts. */
export function readAllTags(options: ReadOptions = {}): BlogTagSummary[] {
  const counts = new Map<string, number>();
  for (const post of readAllPosts(options)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => (a.tag < b.tag ? -1 : 1));
}

/** Compute the previous and next neighbors in chronological order. */
export function getPostNeighbors(
  year: string,
  slug: string,
  options: ReadOptions = {},
): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const all = readAllPosts(options);
  const idx = all.findIndex((p) => p.year === year && p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    // `all` is reverse-chronological: index-1 is newer ("next"), index+1 is older ("prev")
    next: idx > 0 ? all[idx - 1] : null,
    prev: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
