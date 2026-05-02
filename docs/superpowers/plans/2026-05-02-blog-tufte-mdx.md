# Blog (Tufte-styled MDX) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/blog` section to the existing Next.js homepage where posts are authored as MDX and rendered in Edward Tufte's two-column "wide-margin with sidenotes" style, statically exported alongside the rest of the site.

**Architecture:** Posts live in `content/blog/*.mdx`. Build-time helpers in `utils/blog/` parse frontmatter, serialize MDX with a remark/rehype plugin chain (math, code highlighting, citations, smart typography), and feed template pages under `pages/blog/`. A custom React component map (`Sidenote`, `MarginNote`, `Epigraph`, `NewThought`, `MarginFigure`, `FullWidthFigure`, `SideTable`, `References`) gives authors Tufte primitives. Static export (`output: 'export'`) preserved.

**Tech Stack:** Next.js 16 (Pages Router), TypeScript, MDX via `next-mdx-remote`, remark/rehype plugins, KaTeX, Shiki, `rehype-citation`, Tailwind + SCSS.

**Reference spec:** `docs/superpowers/specs/2026-05-01-blog-tufte-design.md`

**Verification approach:** Project has no test framework configured. Verification is per-task via TypeScript compilation (`npx tsc --noEmit`), production build (`npm run build`), small Node scripts for pure-data logic, and visual checks in `npm run dev`. Each task names the exact command and expected output.

---

## Task 1: Install dependencies and add KaTeX CSS import

**Files:**
- Modify: `package.json`
- Modify: `pages/_app.tsx`

- [ ] **Step 1: Install runtime + build-time deps**

Run:
```bash
npm install next-mdx-remote@^5 gray-matter@^4 reading-time@^1.5 feed@^4
npm install remark-gfm@^4 remark-math@^6 remark-smartypants@^3 \
            rehype-katex@^7 rehype-pretty-code@^0.13 shiki@^1 \
            rehype-slug@^6 rehype-autolink-headings@^7 rehype-citation@^2 \
            katex@^0.16
```

Expected: `package.json` lists every package above under `dependencies`; `npm install` exits 0.

- [ ] **Step 2: Import KaTeX CSS once globally**

Edit `pages/_app.tsx`. After the existing global SCSS imports add:

```tsx
import "katex/dist/katex.min.css";
```

The full file becomes:

```tsx
import type { AppProps } from "next/app";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Initialize i18n
import "../utils/i18n";

import "../styles/globals.scss";
import "../styles/index.scss";
import "katex/dist/katex.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main className="px-4 max-w-screen-lg mx-auto pt-32 pb-20">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json pages/_app.tsx
git commit -m "feat(blog): add MDX/Tufte dependencies and global KaTeX CSS"
```

---

## Task 2: Add blog TypeScript interfaces

**Files:**
- Modify: `Interfaces.ts`

- [ ] **Step 1: Append blog interfaces**

Append to `Interfaces.ts`:

```ts
export interface BlogPostMeta {
  /** URL slug derived from filename (no date prefix) */
  slug: string;
  /** Frontmatter title */
  title: string;
  /** ISO date string from frontmatter `date` */
  date: string;
  /** Year extracted from `date`, used as URL segment */
  year: string;
  /** Frontmatter description (one-liner used in lists and meta tags) */
  description: string;
  /** Frontmatter tags (lowercased) */
  tags: string[];
  /** True if post is a draft (excluded from production builds) */
  draft: boolean;
  /** Optional ISO date string when post was last updated */
  updated?: string;
  /** Optional epigraph block at top of post */
  epigraph?: {
    quote: string;
    attribution?: string;
    source?: string;
  };
  /** Optional override path (relative to repo root) for citation bibliography */
  bibliography?: string;
  /** Reading time in minutes (computed at build time) */
  readingMinutes: number;
}

export interface BlogPostFull extends BlogPostMeta {
  /** MDX source serialized via next-mdx-remote/serialize */
  mdxSource: import("next-mdx-remote").MDXRemoteSerializeResult;
}

export interface BlogTagSummary {
  tag: string;
  count: number;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (`next-mdx-remote` types come from the install in Task 1.)

- [ ] **Step 3: Commit**

```bash
git add Interfaces.ts
git commit -m "feat(blog): add BlogPostMeta, BlogPostFull, BlogTagSummary types"
```

---

## Task 3: Implement `utils/blog/posts.ts`

**Files:**
- Create: `utils/blog/posts.ts`

- [ ] **Step 1: Write the module**

Create `utils/blog/posts.ts`:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

import type { BlogPostMeta } from "../../Interfaces";

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
export function readAllTags(options: ReadOptions = {}): {
  tag: string;
  count: number;
}[] {
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Smoke-test with a Node script**

Create a temporary file `/tmp/blog-smoke.ts`:

```ts
import { readAllPosts, readAllTags } from "../home/erikn/code/homepage/utils/blog/posts";
console.log("posts:", readAllPosts({ includeDrafts: true }));
console.log("tags:", readAllTags({ includeDrafts: true }));
```

Run: `cd /home/erikn/code/homepage && npx tsx /tmp/blog-smoke.ts`
Expected: `posts: []` and `tags: []` (no posts yet — returns empty without crashing). Delete `/tmp/blog-smoke.ts` afterwards.

If `tsx` is not installed: `npx -p tsx tsx /tmp/blog-smoke.ts`.

- [ ] **Step 4: Commit**

```bash
git add utils/blog/posts.ts
git commit -m "feat(blog): add post reader, draft filter, neighbors, tag aggregator"
```

---

## Task 4: Implement `utils/blog/mdx.ts` (serialization config)

**Files:**
- Create: `utils/blog/mdx.ts`

- [ ] **Step 1: Write the module**

Create `utils/blog/mdx.ts`:

```ts
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
// rehype-citation is CJS; import default
import rehypeCitationDefault from "rehype-citation";

const rehypeCitation = (rehypeCitationDefault as { default?: typeof rehypeCitationDefault }).default
  ?? rehypeCitationDefault;

const DEFAULT_BIB = path.join(process.cwd(), "content", "blog", "references.bib");

export interface SerializeOptions {
  /** Optional override for citation bibliography (relative to repo root) */
  bibliography?: string;
}

export async function serializeMdx(source: string, options: SerializeOptions = {}) {
  const bibPath = options.bibliography
    ? path.join(process.cwd(), options.bibliography)
    : DEFAULT_BIB;

  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        [remarkSmartypants, { dashes: "oldschool", ellipses: true, quotes: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypePrettyCode,
          {
            theme: { light: "github-light", dark: "github-dark" },
            keepBackground: false,
          },
        ],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: { className: ["heading-anchor"], ariaLabel: "Link to section" },
          },
        ],
        [
          rehypeCitation,
          {
            bibliography: bibPath,
            csl: "apa",
            linkCitations: true,
            inlineClass: ["citation"],
          },
        ],
      ],
      format: "mdx",
    },
    parseFrontmatter: false,
  });
}
```

Note: `rehype-citation` and some remark plugins are ESM-only. If `npm run build` later reports `ERR_REQUIRE_ESM` for one of them, switch the offending import to a dynamic `await import(...)` inside `serializeMdx`. Document this contingency in `CLAUDE.md` (Task 22).

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors. If a plugin lacks types, add a one-line `declare module "..."` ambient declaration at the top of `utils/blog/mdx.ts`.

- [ ] **Step 3: Commit**

```bash
git add utils/blog/mdx.ts
git commit -m "feat(blog): add MDX serialize helper with remark/rehype plugin chain"
```

---

## Task 5: Add sample post and `references.bib`

**Files:**
- Create: `content/blog/2026-05-01-tufte-styled-notes.mdx`
- Create: `content/blog/references.bib`

- [ ] **Step 1: Write the bibliography**

Create `content/blog/references.bib`:

```bibtex
@article{tufte1990envisioning,
  author    = {Tufte, Edward R.},
  title     = {Envisioning Information},
  publisher = {Graphics Press},
  year      = {1990}
}

@article{tufte2001visual,
  author    = {Tufte, Edward R.},
  title     = {The Visual Display of Quantitative Information},
  publisher = {Graphics Press},
  year      = {2001},
  edition   = {2nd}
}
```

- [ ] **Step 2: Write the sample post**

Create `content/blog/2026-05-01-tufte-styled-notes.mdx`:

````mdx
---
title: "Tufte-styled notes on a personal homepage"
date: 2026-05-01
description: "First post — exercising every Tufte primitive end-to-end."
tags: [meta, tufte]
draft: false
epigraph:
  quote: "The minimum we should hope for with any display technology is that it should do no harm."
  attribution: "Edward R. Tufte"
  source: "Envisioning Information"
---

<NewThought>This is the very first post</NewThought> on the blog, written to exercise every Tufte primitive that the site supports.

The body column is narrow on purpose; the right margin is wide enough to hold sidenotes alongside the paragraph that references them. <Sidenote>Sidenotes are numbered automatically — you do not pick the number.</Sidenote> Margin notes are similar but unnumbered. <MarginNote>Like this one — useful for asides that do not need a numeric reference.</MarginNote>

## Math

The cross-entropy loss for a binary classifier is
$$\mathcal{L} = -\sum_{i=1}^{N} \bigl[y_i \log \hat{y}_i + (1 - y_i) \log (1 - \hat{y}_i)\bigr].$$

## Code

```python
def softmax(x):
    e = np.exp(x - x.max())
    return e / e.sum()
```

## Citations

Tufte's principles are laid out across two foundational works [@tufte2001visual; @tufte1990envisioning].

## Figures

<MarginFigure
  src="/imgs/profile.jpg"
  alt="Profile placeholder"
  caption="Margin figures sit in the right gutter."
/>

<FullWidthFigure
  src="/imgs/profile.jpg"
  alt="Full-width placeholder"
  caption="Full-width figures span both columns."
/>

## Side tables

<SideTable
  caption="Three numbers."
  headers={["Item", "Value"]}
  rows={[
    ["Alpha", "1"],
    ["Beta", "2"],
    ["Gamma", "3"],
  ]}
/>

## References

<References />
````

- [ ] **Step 3: Commit**

```bash
git add content/blog/
git commit -m "feat(blog): add sample post and shared references.bib"
```

---

## Task 6: Render the post page (no Tufte styling yet)

**Files:**
- Create: `pages/blog/[year]/[slug].tsx`

- [ ] **Step 1: Write the page**

Create `pages/blog/[year]/[slug].tsx`:

```tsx
import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";

import SEO from "../../../components/SEO";
import { readAllPosts, getPostRaw } from "../../../utils/blog/posts";
import { serializeMdx } from "../../../utils/blog/mdx";
import type { BlogPostFull } from "../../../Interfaces";

interface PageProps {
  post: BlogPostFull;
}

export default function BlogPostPage({ post }: PageProps) {
  return (
    <article>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.year}/${post.slug}/`}
        type="article"
      />
      <header>
        <h1>{post.title}</h1>
        <p>
          <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read
        </p>
      </header>
      <MDXRemote {...post.mdxSource} />
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = readAllPosts();
  return {
    paths: posts.map((p) => ({ params: { year: p.year, slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const year = String(params?.year);
  const slug = String(params?.slug);
  const raw = getPostRaw(year, slug);
  if (!raw) return { notFound: true };

  const mdxSource = await serializeMdx(raw.content, {
    bibliography: raw.meta.bibliography,
  });
  return { props: { post: { ...raw.meta, mdxSource } } };
};
```

- [ ] **Step 2: Run dev server and verify**

Run (in a separate terminal): `npm run dev`
Open: `http://localhost:3000/blog/2026/tufte-styled-notes/`

Expected: Page renders. Title, date, reading-time line, and post body all visible. Math equation typeset by KaTeX. Code block syntax highlighted. Citations show as bracketed numbers; "References" section appears at the bottom. Tufte components (`<Sidenote>`, `<MarginNote>`, etc.) appear as **unstyled inline content** because we have not implemented them yet — that is expected at this stage.

If the build errors with `ERR_REQUIRE_ESM` on a plugin, convert the offending import in `utils/blog/mdx.ts` to dynamic import.

- [ ] **Step 3: Commit**

```bash
git add pages/blog/
git commit -m "feat(blog): render individual post page via MDXRemote"
```

---

## Task 7: Tufte typography and grid layout

**Files:**
- Create: `styles/blog/tufte.scss`
- Create: `styles/blog/typography.scss`
- Modify: `pages/_app.tsx`

- [ ] **Step 1: Write `styles/blog/typography.scss`**

```scss
.blog-article {
  --measure: 55ch;
  --margin-col: 25ch;
  --column-gap: 3ch;

  font-family: var(--font-family-body);
  line-height: 1.7;

  h1.blog-title {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-size: 2.5rem;
    line-height: 1.15;
    letter-spacing: -0.01em;
    margin: 0 0 0.5rem 0;
  }

  .blog-meta {
    color: rgb(var(--color-text-highlight));
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-size: 1.6rem;
    margin: 2.4rem 0 0.6rem 0;
  }

  h3 {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-size: 1.25rem;
    margin: 1.6rem 0 0.4rem 0;
  }

  p {
    margin: 0 0 1rem 0;
  }

  .heading-anchor {
    margin-left: 0.4rem;
    opacity: 0;
    transition: opacity 0.15s ease;
    color: rgb(var(--color-text-link));
    text-decoration: none;
  }
  h1:hover .heading-anchor,
  h2:hover .heading-anchor,
  h3:hover .heading-anchor {
    opacity: 1;
  }

  .new-thought {
    font-variant: small-caps;
    letter-spacing: 0.06em;
  }
}
```

- [ ] **Step 2: Write `styles/blog/tufte.scss`**

```scss
@import "./typography.scss";

.blog-article {
  display: grid;
  grid-template-columns: minmax(0, var(--measure)) minmax(0, var(--margin-col));
  column-gap: var(--column-gap);
  max-width: calc(var(--measure) + var(--margin-col) + var(--column-gap));
  margin: 0 auto;

  > * {
    grid-column: 1;
  }

  .blog-aside {
    grid-column: 2;
    align-self: start;
    font-size: 0.85rem;
    line-height: 1.4;
    color: rgb(var(--color-text-highlight));
  }

  .blog-fullwidth {
    grid-column: 1 / -1;
  }

  figure {
    margin: 1.5rem 0;
    figcaption {
      font-size: 0.85rem;
      color: rgb(var(--color-text-highlight));
      margin-top: 0.4rem;
    }
  }

  .epigraph {
    font-style: italic;
    border-left: 2px solid rgb(var(--color-text-highlight));
    padding-left: 1rem;
    margin: 0 0 2rem 0;
    .epigraph-attribution {
      display: block;
      margin-top: 0.5rem;
      font-style: normal;
      font-size: 0.9rem;
      color: rgb(var(--color-text-highlight));
    }
  }

  .sidenote-ref {
    color: rgb(var(--color-text-link));
    cursor: default;
  }

  // Mobile: collapse to single column, sidenotes appear after the
  // paragraph that contains them, slightly indented.
  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);

    .blog-aside {
      grid-column: 1;
      display: block;
      margin: 0.5rem 0 1rem 1.5rem;
      padding-left: 0.75rem;
      border-left: 2px solid rgb(var(--color-text-highlight));
    }
  }
}
```

- [ ] **Step 3: Import the stylesheet globally**

Edit `pages/_app.tsx`. Append after the existing global SCSS imports:

```tsx
import "../styles/blog/tufte.scss";
```

- [ ] **Step 4: Apply the article wrapper class**

Edit `pages/blog/[year]/[slug].tsx`. Change the `<article>` and header markup:

```tsx
return (
  <article className="blog-article">
    <SEO
      title={post.title}
      description={post.description}
      path={`/blog/${post.year}/${post.slug}/`}
      type="article"
    />
    <header>
      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-meta">
        <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read
      </p>
    </header>
    <MDXRemote {...post.mdxSource} />
  </article>
);
```

- [ ] **Step 5: Verify visually**

Run: `npm run dev`
Open: `http://localhost:3000/blog/2026/tufte-styled-notes/`

Expected: post body now sits in a narrower column with empty space to the right (the future sidenote margin). Title and headings use Fira Sans. At ≤900px viewport (resize the window), the grid collapses to one column.

- [ ] **Step 6: Commit**

```bash
git add styles/blog/ pages/_app.tsx pages/blog/[year]/[slug].tsx
git commit -m "feat(blog): add Tufte two-column grid and typography"
```

---

## Task 8: `Sidenote` component with auto-numbering context

**Files:**
- Create: `components/Blog/Sidenote/index.tsx`
- Create: `components/Blog/Sidenote/Sidenote.tsx`
- Create: `components/Blog/Sidenote/SidenoteCounter.tsx`

- [ ] **Step 1: Write the counter context**

Create `components/Blog/Sidenote/SidenoteCounter.tsx`:

```tsx
import { createContext, useRef, ReactNode } from "react";

interface CounterAPI {
  next: () => number;
}

export const SidenoteCounterContext = createContext<CounterAPI | null>(null);

export function SidenoteCounterProvider({ children }: { children: ReactNode }) {
  const counter = useRef(0);
  // Stable API object across renders.
  const api = useRef<CounterAPI>({
    next: () => {
      counter.current += 1;
      return counter.current;
    },
  });
  return (
    <SidenoteCounterContext.Provider value={api.current}>
      {children}
    </SidenoteCounterContext.Provider>
  );
}
```

- [ ] **Step 2: Write the Sidenote component**

Create `components/Blog/Sidenote/Sidenote.tsx`:

```tsx
import { ReactNode, useContext, useState } from "react";
import { SidenoteCounterContext } from "./SidenoteCounter";

interface SidenoteProps {
  children: ReactNode;
}

export default function Sidenote({ children }: SidenoteProps) {
  const ctx = useContext(SidenoteCounterContext);
  // useState's lazy initializer runs exactly once per mount, so the counter
  // advances once per Sidenote even though the hook itself is called every render.
  const [n] = useState<number>(() => ctx?.next() ?? 0);

  return (
    <>
      <sup className="sidenote-ref">{n}</sup>
      <aside className="blog-aside sidenote">
        <sup>{n}</sup> {children}
      </aside>
    </>
  );
}
```

- [ ] **Step 3: Write the barrel export**

Create `components/Blog/Sidenote/index.tsx`:

```tsx
export { default } from "./Sidenote";
export { SidenoteCounterProvider } from "./SidenoteCounter";
```

- [ ] **Step 4: Commit**

```bash
git add components/Blog/Sidenote/
git commit -m "feat(blog): add Sidenote component with auto-numbered context"
```

---

## Task 9: `MarginNote`, `MarginFigure`, `FullWidthFigure` components

**Files:**
- Create: `components/Blog/MarginNote/index.tsx`
- Create: `components/Blog/MarginFigure/index.tsx`
- Create: `components/Blog/FullWidthFigure/index.tsx`

- [ ] **Step 1: Write `MarginNote`**

Create `components/Blog/MarginNote/index.tsx`:

```tsx
import { ReactNode } from "react";

export default function MarginNote({ children }: { children: ReactNode }) {
  return <aside className="blog-aside margin-note">{children}</aside>;
}
```

- [ ] **Step 2: Write `MarginFigure`**

Create `components/Blog/MarginFigure/index.tsx`:

```tsx
interface Props {
  src: string;
  alt: string;
  caption?: string;
}

export default function MarginFigure({ src, alt, caption }: Props) {
  return (
    <figure className="blog-aside margin-figure">
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
```

- [ ] **Step 3: Write `FullWidthFigure`**

Create `components/Blog/FullWidthFigure/index.tsx`:

```tsx
interface Props {
  src: string;
  alt: string;
  caption?: string;
}

export default function FullWidthFigure({ src, alt, caption }: Props) {
  return (
    <figure className="blog-fullwidth full-width-figure">
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Blog/MarginNote/ components/Blog/MarginFigure/ components/Blog/FullWidthFigure/
git commit -m "feat(blog): add margin/full-width figure and margin-note components"
```

---

## Task 10: `Epigraph` and `NewThought` components

**Files:**
- Create: `components/Blog/Epigraph/index.tsx`
- Create: `components/Blog/NewThought/index.tsx`

- [ ] **Step 1: Write `Epigraph`**

Create `components/Blog/Epigraph/index.tsx`:

```tsx
interface Props {
  quote: string;
  attribution?: string;
  source?: string;
}

export default function Epigraph({ quote, attribution, source }: Props) {
  return (
    <blockquote className="epigraph">
      <p>{quote}</p>
      {(attribution || source) && (
        <span className="epigraph-attribution">
          {attribution}
          {attribution && source ? ", " : ""}
          {source ? <cite>{source}</cite> : null}
        </span>
      )}
    </blockquote>
  );
}
```

- [ ] **Step 2: Write `NewThought`**

Create `components/Blog/NewThought/index.tsx`:

```tsx
import { ReactNode } from "react";

export default function NewThought({ children }: { children: ReactNode }) {
  return <span className="new-thought">{children}</span>;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Blog/Epigraph/ components/Blog/NewThought/
git commit -m "feat(blog): add Epigraph and NewThought components"
```

---

## Task 11: `SideTable` component

**Files:**
- Create: `components/Blog/SideTable/index.tsx`

- [ ] **Step 1: Write `SideTable`**

Create `components/Blog/SideTable/index.tsx`:

```tsx
interface Props {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export default function SideTable({ caption, headers, rows }: Props) {
  return (
    <aside className="blog-aside side-table">
      {caption ? <p className="side-table-caption">{caption}</p> : null}
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
```

- [ ] **Step 2: Append minimal table styles**

Append to `styles/blog/tufte.scss` (under the `.blog-article` block):

```scss
.blog-article {
  .side-table {
    font-size: 0.85rem;
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      text-align: left;
      padding: 0.2rem 0.5rem;
      border-bottom: 1px solid rgb(var(--color-text-highlight));
    }
    th {
      font-weight: 600;
    }
    .side-table-caption {
      font-style: italic;
      margin-bottom: 0.3rem;
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Blog/SideTable/ styles/blog/tufte.scss
git commit -m "feat(blog): add SideTable component and styling"
```

---

## Task 12: `References` placeholder component

**Files:**
- Create: `components/Blog/References/index.tsx`

`rehype-citation` already inserts a generated bibliography into the DOM where it sees a `<div class="references">…</div>` placeholder, depending on configuration. The simplest reliable approach is to render `<References />` as that placeholder. If the plugin's behavior differs in practice, this component is the single place to adjust the markup.

- [ ] **Step 1: Write the component**

Create `components/Blog/References/index.tsx`:

```tsx
export default function References() {
  // rehype-citation walks the post tree and replaces this node
  // (or appends below it) with the resolved bibliography.
  return <div id="refs" className="references" />;
}
```

- [ ] **Step 2: Add minimal references styling**

Append to `styles/blog/tufte.scss` (inside the existing `.blog-article` block):

```scss
.blog-article {
  .references {
    margin-top: 3rem;
    font-size: 0.95rem;
    .csl-entry {
      margin-bottom: 0.6rem;
      padding-left: 1.5rem;
      text-indent: -1.5rem;
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Blog/References/ styles/blog/tufte.scss
git commit -m "feat(blog): add References placeholder for rehype-citation output"
```

---

## Task 13: `BlogPost` wrapper component

The wrapper centralises the article shell (epigraph rendering from frontmatter, sidenote counter provider, header) so the page file stays small.

**Files:**
- Create: `components/Blog/BlogPost/index.tsx`

- [ ] **Step 1: Write the wrapper**

Create `components/Blog/BlogPost/index.tsx`:

```tsx
import { ReactNode } from "react";
import { SidenoteCounterProvider } from "../Sidenote";
import Epigraph from "../Epigraph";
import type { BlogPostMeta } from "../../../Interfaces";

interface Props {
  meta: BlogPostMeta;
  children: ReactNode;
}

export default function BlogPost({ meta, children }: Props) {
  return (
    <SidenoteCounterProvider>
      <article className="blog-article">
        <header>
          <h1 className="blog-title">{meta.title}</h1>
          <p className="blog-meta">
            <time dateTime={meta.date}>{meta.date}</time>
            {meta.updated ? <> · updated <time dateTime={meta.updated}>{meta.updated}</time></> : null}
            {" · "}{meta.readingMinutes} min read
          </p>
          {meta.tags.length > 0 && (
            <p className="blog-meta">tags: {meta.tags.join(", ")}</p>
          )}
        </header>
        {meta.epigraph && (
          <Epigraph
            quote={meta.epigraph.quote}
            attribution={meta.epigraph.attribution}
            source={meta.epigraph.source}
          />
        )}
        {children}
      </article>
    </SidenoteCounterProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Blog/BlogPost/
git commit -m "feat(blog): add BlogPost wrapper with sidenote provider and epigraph"
```

---

## Task 14: Wire components into `<MDXRemote>` and update the page

**Files:**
- Modify: `pages/blog/[year]/[slug].tsx`

- [ ] **Step 1: Replace the page implementation**

Overwrite `pages/blog/[year]/[slug].tsx`:

```tsx
import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";

import SEO from "../../../components/SEO";
import BlogPost from "../../../components/Blog/BlogPost";
import Sidenote from "../../../components/Blog/Sidenote";
import MarginNote from "../../../components/Blog/MarginNote";
import MarginFigure from "../../../components/Blog/MarginFigure";
import FullWidthFigure from "../../../components/Blog/FullWidthFigure";
import Epigraph from "../../../components/Blog/Epigraph";
import NewThought from "../../../components/Blog/NewThought";
import SideTable from "../../../components/Blog/SideTable";
import References from "../../../components/Blog/References";

import { readAllPosts, getPostRaw } from "../../../utils/blog/posts";
import { serializeMdx } from "../../../utils/blog/mdx";
import type { BlogPostFull } from "../../../Interfaces";

interface PageProps {
  post: BlogPostFull;
}

const mdxComponents = {
  Sidenote,
  MarginNote,
  MarginFigure,
  FullWidthFigure,
  Epigraph,
  NewThought,
  SideTable,
  References,
};

export default function BlogPostPage({ post }: PageProps) {
  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.year}/${post.slug}/`}
        type="article"
      />
      <BlogPost meta={post}>
        <MDXRemote {...post.mdxSource} components={mdxComponents} />
      </BlogPost>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = readAllPosts();
  return {
    paths: posts.map((p) => ({ params: { year: p.year, slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const year = String(params?.year);
  const slug = String(params?.slug);
  const raw = getPostRaw(year, slug);
  if (!raw) return { notFound: true };
  const mdxSource = await serializeMdx(raw.content, {
    bibliography: raw.meta.bibliography,
  });
  return { props: { post: { ...raw.meta, mdxSource } } };
};
```

- [ ] **Step 2: Verify visually (desktop)**

Run: `npm run dev`
Open: `http://localhost:3000/blog/2026/tufte-styled-notes/`

Expected:
- Post title and metadata visible.
- Epigraph block (italic, left border) appears under the metadata.
- `<NewThought>` opening of the first paragraph rendered in small caps.
- Sidenote: superscript `¹` inline + a small numbered entry in the right margin.
- Margin note: small block in the right margin without a number.
- Margin figure: profile image rendered in the right margin with a caption.
- Full-width figure: profile image spans both columns.
- Math equation typeset by KaTeX.
- Code block syntax highlighted.
- Side-table appears in the right margin.
- "References" section at the bottom shows resolved citations.

- [ ] **Step 3: Verify visually (mobile)**

In the browser, resize the viewport to ≤ 900px (or use devtools' device toolbar).
Expected: grid collapses to single column. Sidenotes/margin notes/margin figures/side-tables appear inline immediately after the paragraph that contains them, indented with a left border. Full-width figure stays the same.

If sidenotes appear in the wrong order on mobile, the most likely cause is markdown's paragraph wrapping: the `<aside>` is a block element nested inside an inline `<p>`, which browsers handle by closing the `<p>` early. This is the desired behavior here. Verify by inspecting the DOM.

- [ ] **Step 4: Commit**

```bash
git add pages/blog/[year]/[slug].tsx
git commit -m "feat(blog): wire Tufte components into MDXRemote pipeline"
```

---

## Task 15: `BlogList` component and chronological index

**Files:**
- Create: `components/Blog/BlogList/index.tsx`
- Create: `components/Blog/TagPill/index.tsx`
- Create: `pages/blog/index.tsx`

- [ ] **Step 1: Write `TagPill`**

Create `components/Blog/TagPill/index.tsx`:

```tsx
import Link from "next/link";

interface Props {
  tag: string;
  count?: number;
}

export default function TagPill({ tag, count }: Props) {
  return (
    <Link
      href={`/blog/tags/${tag}/`}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-base-highlight text-sm text-link hover:text-link-hover"
    >
      <span>#{tag}</span>
      {typeof count === "number" ? <span>({count})</span> : null}
    </Link>
  );
}
```

- [ ] **Step 2: Write `BlogList`**

Create `components/Blog/BlogList/index.tsx`:

```tsx
import Link from "next/link";
import TagPill from "../TagPill";
import type { BlogPostMeta } from "../../../Interfaces";

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogList({ posts }: Props) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }
  return (
    <ul className="grid gap-8 list-none p-0">
      {posts.map((post) => (
        <li key={`${post.year}-${post.slug}`} className="grid gap-1">
          <h3 className="text-xl font-semibold">
            <Link
              href={`/blog/${post.year}/${post.slug}/`}
              className="text-link hover:text-link-hover"
            >
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-highlight">
            <time dateTime={post.date}>{post.date}</time>
            {" · "}{post.readingMinutes} min read
          </p>
          <p className="leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Write the index page**

Create `pages/blog/index.tsx`:

```tsx
import type { GetStaticProps } from "next";

import SEO from "../../components/SEO";
import BlogList from "../../components/Blog/BlogList";
import { readAllPosts } from "../../utils/blog/posts";
import type { BlogPostMeta } from "../../Interfaces";

interface PageProps {
  posts: BlogPostMeta[];
}

export default function BlogIndexPage({ posts }: PageProps) {
  return (
    <div className="grid gap-12">
      <SEO
        title="Blog"
        description="Notes, essays, and research write-ups by Erik Novak."
        path="/blog/"
      />
      <header className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold">Blog</h1>
        <p className="text-xl text-highlight">Notes, essays, and research write-ups.</p>
      </header>
      <BlogList posts={posts} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { posts: readAllPosts() } };
};
```

- [ ] **Step 4: Verify**

Run: `npm run dev`
Open: `http://localhost:3000/blog/`
Expected: page heading "Blog", subtitle, and one entry for the sample post showing title, date, reading-time, description, and a `#meta` `#tufte` pill row.

- [ ] **Step 5: Commit**

```bash
git add components/Blog/BlogList/ components/Blog/TagPill/ pages/blog/index.tsx
git commit -m "feat(blog): add chronological index page and tag pill"
```

---

## Task 16: Tag listing and per-tag pages

**Files:**
- Create: `pages/blog/tags/index.tsx`
- Create: `pages/blog/tags/[tag].tsx`

- [ ] **Step 1: Write `pages/blog/tags/index.tsx`**

```tsx
import type { GetStaticProps } from "next";

import SEO from "../../../components/SEO";
import TagPill from "../../../components/Blog/TagPill";
import { readAllTags } from "../../../utils/blog/posts";

interface PageProps {
  tags: { tag: string; count: number }[];
}

export default function TagsIndexPage({ tags }: PageProps) {
  return (
    <div className="grid gap-8">
      <SEO
        title="Blog tags"
        description="Browse blog posts by tag."
        path="/blog/tags/"
      />
      <h1 className="text-4xl font-bold">Tags</h1>
      <div className="flex flex-wrap gap-3">
        {tags.length === 0 ? <p>No tags yet.</p> : null}
        {tags.map((t) => (
          <TagPill key={t.tag} tag={t.tag} count={t.count} />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { tags: readAllTags() } };
};
```

- [ ] **Step 2: Write `pages/blog/tags/[tag].tsx`**

```tsx
import type { GetStaticPaths, GetStaticProps } from "next";

import SEO from "../../../components/SEO";
import BlogList from "../../../components/Blog/BlogList";
import { readAllPosts, readAllTags } from "../../../utils/blog/posts";
import type { BlogPostMeta } from "../../../Interfaces";

interface PageProps {
  tag: string;
  posts: BlogPostMeta[];
}

export default function TagPage({ tag, posts }: PageProps) {
  return (
    <div className="grid gap-8">
      <SEO
        title={`#${tag}`}
        description={`Blog posts tagged ${tag}.`}
        path={`/blog/tags/${tag}/`}
      />
      <header>
        <h1 className="text-4xl font-bold">#{tag}</h1>
        <p className="text-highlight">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
      </header>
      <BlogList posts={posts} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = readAllTags();
  return {
    paths: tags.map((t) => ({ params: { tag: t.tag } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const tag = String(params?.tag);
  const posts = readAllPosts().filter((p) => p.tags.includes(tag));
  return { props: { tag, posts } };
};
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Open: `http://localhost:3000/blog/tags/` — shows two pills (`#meta`, `#tufte`).
Click `#meta` → URL becomes `/blog/tags/meta/`, page shows the sample post listed with the tag pills under it.

- [ ] **Step 4: Commit**

```bash
git add pages/blog/tags/
git commit -m "feat(blog): add tag listing and per-tag pages"
```

---

## Task 17: Prev/next navigation on post pages

**Files:**
- Modify: `pages/blog/[year]/[slug].tsx`

- [ ] **Step 1: Add neighbors to props and render**

Edit `pages/blog/[year]/[slug].tsx`. Update the imports, types, page component, and `getStaticProps`:

```tsx
import Link from "next/link";
// ... other imports unchanged
import { readAllPosts, getPostRaw, getPostNeighbors } from "../../../utils/blog/posts";

interface PageProps {
  post: BlogPostFull;
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
}
```

Replace the page component body to render neighbors after the article:

```tsx
export default function BlogPostPage({ post, prev, next }: PageProps) {
  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.year}/${post.slug}/`}
        type="article"
      />
      <BlogPost meta={post}>
        <MDXRemote {...post.mdxSource} components={mdxComponents} />
      </BlogPost>
      <nav className="grid grid-cols-2 gap-4 mt-12 max-w-3xl mx-auto">
        <div>
          {prev && (
            <Link
              href={`/blog/${prev.year}/${prev.slug}/`}
              className="block text-link hover:text-link-hover"
            >
              <span className="text-sm text-highlight block">← Previous</span>
              <span>{prev.title}</span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link
              href={`/blog/${next.year}/${next.slug}/`}
              className="block text-link hover:text-link-hover"
            >
              <span className="text-sm text-highlight block">Next →</span>
              <span>{next.title}</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
```

Also add `BlogPostMeta` to the type imports at the top of the file:

```tsx
import type { BlogPostFull, BlogPostMeta } from "../../../Interfaces";
```

Update `getStaticProps`:

```tsx
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const year = String(params?.year);
  const slug = String(params?.slug);
  const raw = getPostRaw(year, slug);
  if (!raw) return { notFound: true };
  const mdxSource = await serializeMdx(raw.content, {
    bibliography: raw.meta.bibliography,
  });
  const { prev, next } = getPostNeighbors(year, slug);
  return { props: { post: { ...raw.meta, mdxSource }, prev, next } };
};
```

- [ ] **Step 2: Verify**

With only one post, both prev and next are `null` so the nav row stays empty. To verify the rendering path, temporarily duplicate the sample post under a different filename (e.g. `2026-04-01-stub.mdx`) so neighbors exist; confirm both links render; then `git restore` the stub file.

- [ ] **Step 3: Commit**

```bash
git add pages/blog/[year]/[slug].tsx
git commit -m "feat(blog): add prev/next navigation between posts"
```

---

## Task 18: RSS feed generation

**Files:**
- Create: `utils/blog/rss.ts`
- Modify: `pages/blog/index.tsx`

The "page that returns null and writes a file" trick fights the project's `trailingSlash: true` config (a `pages/blog/rss.xml.tsx` route would emit `frontend/blog/rss.xml/index.html`, colliding with the static `public/blog/rss.xml` file). Cleaner approach: piggy-back the feed write on the blog index's `getStaticProps`, which always runs during build. The RSS file is written into `public/blog/rss.xml`, where the Next.js export step copies it into `frontend/blog/rss.xml`.

- [ ] **Step 1: Write the feed generator**

Create `utils/blog/rss.ts`:

```ts
import fs from "fs";
import path from "path";
import { Feed } from "feed";

import { readAllPosts } from "./posts";

const SITE_URL = "https://ailab.ijs.si/eriknovak";

export function writeRssFeed(): void {
  const posts = readAllPosts();

  const feed = new Feed({
    title: "Erik Novak — Blog",
    description: "Notes, essays, and research write-ups by Erik Novak.",
    id: `${SITE_URL}/blog/`,
    link: `${SITE_URL}/blog/`,
    language: "en",
    image: `${SITE_URL}/imgs/profile.jpg`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Erik Novak`,
    feedLinks: { rss2: `${SITE_URL}/blog/rss.xml` },
    author: { name: "Erik Novak" },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.year}/${post.slug}/`,
      link: `${SITE_URL}/blog/${post.year}/${post.slug}/`,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((t) => ({ name: t })),
    });
  }

  const outDir = path.join(process.cwd(), "public", "blog");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "rss.xml"), feed.rss2(), "utf8");
}
```

- [ ] **Step 2: Trigger the feed write from the blog index page**

Edit `pages/blog/index.tsx`. Add an import at the top alongside the existing imports:

```tsx
import { writeRssFeed } from "../../utils/blog/rss";
```

Replace `getStaticProps`:

```tsx
export const getStaticProps: GetStaticProps<PageProps> = async () => {
  writeRssFeed();
  return { props: { posts: readAllPosts() } };
};
```

- [ ] **Step 3: Verify the file is written**

Run: `npm run build`
Expected: build exits 0; `public/blog/rss.xml` exists; `frontend/blog/rss.xml` exists in the export output. Opening either shows valid RSS XML with the sample post listed under `<item>`.

- [ ] **Step 4: Commit**

```bash
git add utils/blog/rss.ts pages/blog/index.tsx public/blog/rss.xml
git commit -m "feat(blog): generate RSS feed during blog index build"
```

---

## Task 19: Header navigation, i18n keys, active-link fix

**Files:**
- Modify: `components/Header/Header.tsx`
- Modify: `public/locales/en/common.json`
- Modify: `public/locales/sl/common.json`

- [ ] **Step 1: Add `nav.blog` to English locale**

Edit `public/locales/en/common.json`. Update the `nav` block:

```json
{
  "nav": {
    "home": "Home",
    "publications": "Publications",
    "projects": "Projects",
    "blog": "Blog",
    "collaborate": "Collaborate"
  },
  "language": {
    "en": "English",
    "sl": "Slovenian"
  },
  "notFound": {
    "title": "Page Not Found",
    "description": "The page you're looking for doesn't exist or has been moved.",
    "backHome": "Back to Home"
  }
}
```

- [ ] **Step 2: Add `nav.blog` to Slovene locale**

Edit `public/locales/sl/common.json`. Add the `"blog": "Blog"` entry to the `nav` block at the same position.

- [ ] **Step 3: Update `Header.tsx`**

Edit `components/Header/Header.tsx`. Add `Blog` to the `pages` array (between Projects and Publications) and update the active-link comparison:

```tsx
const pages = [
  { titleKey: "nav.home", fallback: "Home", route: "/" },
  { titleKey: "nav.projects", fallback: "Projects", route: "/projects" },
  { titleKey: "nav.publications", fallback: "Publications", route: "/publications" },
  { titleKey: "nav.blog", fallback: "Blog", route: "/blog" },
];
```

Replace the active-link className expression:

```tsx
<a
  className={cn(styles.link, {
    [styles["link--active"]]:
      router.route === page.route ||
      (page.route !== "/" && router.route.startsWith(page.route + "/")),
  })}
>
```

- [ ] **Step 4: Verify**

Run: `npm run dev`. On any page, the header now has a "Blog" link that navigates to `/blog/`. Visit `/blog/2026/tufte-styled-notes/` — the "Blog" entry stays highlighted because of the `startsWith` rule. Visit `/projects/` (no sub-routes exist) — its highlight still works (the `route === '/'` exclusion prevents the `startsWith` rule from accidentally matching the home link on every page).

- [ ] **Step 5: Commit**

```bash
git add components/Header/Header.tsx public/locales/en/common.json public/locales/sl/common.json
git commit -m "feat(blog): add Blog to header nav with deep-route active matching"
```

---

## Task 20: Article-flavored SEO meta on post pages

**Files:**
- Modify: `components/SEO/index.tsx`
- Modify: `pages/blog/[year]/[slug].tsx`

- [ ] **Step 1: Extend `SEOProps` to support article fields**

Edit `components/SEO/index.tsx`. Update the `SEOProps` interface and component signature:

```tsx
interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  noindex?: boolean;
  /** ISO date when the article was first published (for type="article") */
  publishedTime?: string;
  /** ISO date when the article was last modified (for type="article") */
  modifiedTime?: string;
  /** Article tags (for type="article") */
  tags?: string[];
}
```

In the component signature add the new fields and after the existing OG `<meta property="og:image">`, insert:

```tsx
{type === "article" && publishedTime && (
  <meta property="article:published_time" content={publishedTime} />
)}
{type === "article" && modifiedTime && (
  <meta property="article:modified_time" content={modifiedTime} />
)}
{type === "article" &&
  tags?.map((tag) => (
    <meta key={tag} property="article:tag" content={tag} />
  ))}
```

- [ ] **Step 2: Pass article fields from the post page**

Edit `pages/blog/[year]/[slug].tsx`. Update the `<SEO>` invocation:

```tsx
<SEO
  title={post.title}
  description={post.description}
  path={`/blog/${post.year}/${post.slug}/`}
  type="article"
  publishedTime={post.date}
  modifiedTime={post.updated}
  tags={post.tags}
/>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. Open `/blog/2026/tufte-styled-notes/` and view source — expect to see `<meta property="article:published_time" content="2026-05-01">` and one `<meta property="article:tag">` per tag.

- [ ] **Step 4: Commit**

```bash
git add components/SEO/index.tsx pages/blog/[year]/[slug].tsx
git commit -m "feat(blog): emit article OG meta on post pages"
```

---

## Task 21: Build verification + author docs

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: build exits 0. Output in `frontend/` includes:
- `frontend/blog/index.html`
- `frontend/blog/2026/tufte-styled-notes/index.html`
- `frontend/blog/tags/index.html`
- `frontend/blog/tags/meta/index.html`
- `frontend/blog/tags/tufte/index.html`
- `public/blog/rss.xml` exists

If `npm run build` fails on a plugin with `ERR_REQUIRE_ESM`:
1. Edit `utils/blog/mdx.ts`.
2. Replace the static import of the offending plugin with a dynamic import inside `serializeMdx`:
   ```ts
   const { default: rehypeCitation } = await import("rehype-citation");
   ```
3. Re-run the build.

If `rehype-citation` produces no output (empty References section), open the post HTML in `frontend/blog/2026/tufte-styled-notes/index.html` and inspect the rendered DOM. As a fallback, remove `rehype-citation` from the plugin chain and rewrite citations as plain markdown footnotes; document that the bibliography flow is on hold until the plugin issue is resolved.

- [ ] **Step 2: Smoke-test the static export**

Run: `npx serve frontend -p 4173 -l 4173 &` (or any static server). Visit each route in the list above. Confirm:
- `/blog/` lists the sample post.
- `/blog/2026/tufte-styled-notes/` renders fully.
- `/blog/tags/` shows the two tags.
- `/blog/tags/meta/` lists the post.
- `/blog/rss.xml` returns the feed.
Stop the server.

- [ ] **Step 3: Update `CLAUDE.md`**

Edit `CLAUDE.md`. Append a new section:

````markdown
## Blog

Blog posts live in `content/blog/` as MDX files named `YYYY-MM-DD-slug.mdx`. Frontmatter:

```yaml
---
title: "Post title"
date: 2026-05-01
description: "One-line summary"
tags: [research, nlp]
draft: false           # set true to hide from production builds
# Optional:
# updated: 2026-05-15
# epigraph:
#   quote: "..."
#   attribution: "..."
#   source: "..."
# bibliography: content/blog/some-other.bib   # default is content/blog/references.bib
---
```

Available MDX components inside posts (no import needed): `Sidenote`, `MarginNote`, `MarginFigure`, `FullWidthFigure`, `Epigraph`, `NewThought`, `SideTable`, `References`. Math (`$inline$`/`$$display$$`) and code fences are rendered with KaTeX and Shiki respectively. Citations use `[@bibtex-key]` and resolve against `content/blog/references.bib`; place `<References />` where the bibliography should appear.

Drafts (`draft: true`) appear in `npm run dev` but are excluded from `npm run build`.

The MDX plugin chain lives in `utils/blog/mdx.ts`. Some remark/rehype plugins are ESM-only; if `npm run build` reports `ERR_REQUIRE_ESM`, switch the offending import to a dynamic `await import(...)` inside `serializeMdx`.
````

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(blog): document blog post authoring and known ESM gotcha"
```

---

## Self-review summary

- **Spec coverage:** every spec section maps to one or more tasks above (deps→T1, types→T2, post reader→T3, MDX pipeline→T4, sample content→T5, post page→T6/T14, Tufte styling→T7/T11/T12, components→T8/T9/T10/T11/T12/T13, listing→T15, tags→T16, prev/next→T17, RSS→T18, header/i18n→T19, SEO→T20, build/docs→T21).
- **Risks called out in the spec** are addressed inline: the `rehype-citation`/ESM contingency appears in T4, T6, and T21; the mobile-sidenote ordering in T14; the static-export RSS pattern is verified in T18.
- **Type consistency:** `BlogPostMeta`, `BlogPostFull`, `BlogTagSummary` are defined once in T2 and used unchanged across later tasks. `readAllPosts`, `getPostRaw`, `readAllTags`, `getPostNeighbors` are defined in T3 and the signatures used elsewhere match.
- **No placeholders:** every step has executable commands or full code.
