# Blog subpage — Tufte-styled MDX design

**Date:** 2026-05-01
**Status:** Approved (brainstorm complete; awaiting implementation plan)
**Branch:** `feat/blog-tufte-mdx`

## Summary

Add a `/blog` section to the existing Next.js homepage. Posts are authored as MDX, rendered in Edward Tufte's two-column "wide-margin with sidenotes" style, and statically generated alongside the rest of the site. English-only content, chronological listing with tag filtering, RSS feed, citation support against a shared BibTeX file.

## Goals

- Author posts in MDX with rich Tufte components (sidenotes, margin notes, epigraphs, full-width and margin figures, side-tables, smallcaps openers).
- Support academic content out of the box: math (KaTeX), code highlighting (Shiki), citations from `.bib`.
- Cleanly integrate with the existing site (header nav, theme toggle, SEO, i18n for UI strings).
- Maintain compatibility with the existing static export (`output: 'export'`) — no runtime fetching, no server.

## Non-goals

- Translated post bodies (UI strings translate; post content is English-only).
- Comments, reactions, or any user-generated content.
- A CMS or admin UI — posts are written as files in the repo.
- Drafts visible in production.

## Architecture overview

MDX content lives in `content/blog/`. At build time, `lib/blog/posts.ts` reads every `.mdx` file, parses frontmatter with `gray-matter`, filters drafts in production, sorts reverse-chronologically, and computes reading time. Template pages under `pages/blog/` use `getStaticPaths` + `getStaticProps` to serialize the relevant MDX with `next-mdx-remote/serialize` and render it through `<MDXRemote>` with a custom component map providing the Tufte primitives.

**Choice rationale:** `next-mdx-remote` over `@next/mdx` (rigid layout, no draft filtering) and over Contentlayer/Velite (heavier abstraction, tooling-stability risk for a small site). `next-mdx-remote` matches Pages-Router + static-export and keeps full control of the file layout, listings, RSS, and tag pages.

## File layout

```
content/
  blog/
    2026-05-01-tufte-styled-notes.mdx        # filename: YYYY-MM-DD-slug
  references.bib                              # shared bibliography

components/
  Blog/
    BlogPost/                                 # full post layout (Tufte article)
    BlogList/                                 # listing entry
    Sidenote/
    MarginNote/
    MarginFigure/
    FullWidthFigure/
    Epigraph/
    NewThought/
    SideTable/
    TagPill/

lib/
  blog/
    posts.ts        # readAllPosts(), getPost(slug), filterDrafts(), sortByDate()
    mdx.ts          # MDX serialization config (remark/rehype plugins)
    rss.ts          # RSS feed generation
    citations.ts    # .bib parsing helper for rehype-citation

pages/
  blog/
    index.tsx                # chronological list
    [year]/
      [slug].tsx             # individual post
    tags/
      index.tsx              # all tags
      [tag].tsx              # posts filtered by tag
    rss.xml.tsx              # writes static rss.xml at build

styles/
  blog/
    tufte.scss               # margin layout, sidenote rules, mobile collapse
    typography.scss          # body, smallcaps
```

The filename prefix `YYYY-MM-DD-` is a sortable convention but not used in URLs — the route is `/blog/{year}/{slug}/` derived from frontmatter `date` and the slug portion of the filename.

## Routing

| Route | Source | Build mechanism |
|---|---|---|
| `/blog/` | `pages/blog/index.tsx` | `getStaticProps` reads all post metadata |
| `/blog/[year]/[slug]/` | `pages/blog/[year]/[slug].tsx` | `getStaticPaths` + `getStaticProps` per post |
| `/blog/tags/` | `pages/blog/tags/index.tsx` | `getStaticProps` aggregates tag counts |
| `/blog/tags/[tag]/` | `pages/blog/tags/[tag].tsx` | `getStaticPaths` over unique tags |
| `/blog/rss.xml` | `pages/blog/rss.xml.tsx` | Page returns `null`; `getStaticProps` writes `public/blog/rss.xml` |

`getStaticPaths` always returns `fallback: false`. Drafts are filtered out of the path list in production builds, so they don't get a route.

## Frontmatter

```yaml
---
title: "Post title"
date: 2026-05-01
description: "One-line summary for the listing and meta tags"
tags: [research, nlp]
draft: false
epigraph:
  quote: "..."
  attribution: "..."
  source: "..."
updated: 2026-05-15
---
```

Required: `title`, `date`, `description`, `tags`, `draft`. Optional: `epigraph`, `updated`, `bibliography` (path to a `.bib` file overriding the default `content/blog/references.bib`).

## Draft handling

`readAllPosts({ includeDrafts })` is called with:
- `true` when `process.env.NODE_ENV !== 'production'` (dev server).
- `false` during `next build`.

Drafts are excluded from listings, tag pages, RSS, prev/next, and the static path list — so they do not produce a route in the exported site.

## MDX pipeline

**Remark plugins (markdown → mdast):**
- `remark-gfm` — tables, task lists, strikethrough, autolinks.
- `remark-math` — `$inline$` / `$$display$$`.
- `remark-smartypants` — typographic quotes, em-dashes, ellipses.

**Rehype plugins (mdast → hast → HTML):**
- `rehype-katex` — render math; KaTeX CSS imported once in `_app.tsx`.
- `rehype-pretty-code` (Shiki) — code highlighting at build time. Two themes (`github-light` / `github-dark`) toggled by `:root[data-theme]`.
- `rehype-slug` — heading IDs.
- `rehype-autolink-headings` — `#` anchors on hover.
- `rehype-citation` — resolves `[@key]` against `references.bib`; renders bibliography at the `<References />` insertion point.

**MDX components passed to `<MDXRemote>`:**
- Tufte primitives: `Sidenote`, `MarginNote`, `MarginFigure`, `FullWidthFigure`, `Epigraph`, `NewThought`, `SideTable`, `References`.
- Element overrides: `h1`, `h2`, `h3`, `p`, `blockquote`, `table`, `code`, `pre`, `a`, `img` — to apply Tufte typography automatically.

**Reading time:** computed in `lib/blog/posts.ts` via the `reading-time` package on the raw MDX source; attached to post metadata, surfaced as a small "N min read" badge.

**Static-export safety:** all plugins run at build time on Node — no runtime browser execution required. Confirmed compatible with `output: 'export'`.

## Visual design (Tufte layout)

### Grid

The `<article>` is a CSS Grid:
- `grid-template-columns: minmax(0, 55ch) minmax(0, 25ch)` with `column-gap: 3ch`.
- Body content: `grid-column: 1`.
- Sidenotes / margin notes: `grid-column: 2`, `align-self: start`.
- Full-width figures: `grid-column: 1 / -1`.

### Typography

- **Body:** Atkinson Hyperlegible (already in the project) — kept for accessibility and consistency with the rest of the site, in place of Tufte's traditional et-book serif.
- **Headings:** Fira Sans (already in the project), tighter tracking on post titles.
- **Sidenotes:** 0.85em, slightly distinguished from body.
- **Smallcaps (`<NewThought>`):** `font-variant: small-caps; letter-spacing: 0.05em`.

### Sidenote mechanics

- Author writes `<Sidenote>This is the note.</Sidenote>` inline in a paragraph.
- Component renders two elements: a superscript number (`<sup>¹</sup>`) inline + an `<aside>` in the margin column with the same number.
- Numbering is automatic via a `SidenoteCounter` React context, scoped to a single post.
- `<MarginNote>` is the same primitive minus the numeric label.

### Mobile (≤ 900px)

The grid collapses to a single column. Sidenotes render inline immediately **after the paragraph that contains them**, in a slightly indented block (`<div class="sidenote--inline">`). Numbers are preserved for cross-reference. CSS-only swap; no JS.

### Theme integration

- Sidenote text inherits `var(--color-text-highlight)` — both light and dark covered by existing variables.
- Code blocks: Shiki dual-theme; CSS swaps based on `:root[data-theme="light"]`.
- Math: KaTeX defaults inherit `currentColor`.

## Component contracts

```ts
<Sidenote>{children}</Sidenote>
<MarginNote>{children}</MarginNote>
<MarginFigure src="" alt="" caption="" />
<FullWidthFigure src="" alt="" caption="" />
<Epigraph quote="" attribution="" source="" />
<NewThought>{children}</NewThought>
<SideTable caption="" headers={[]} rows={[[]]} />
<References />
```

## Site integration

**Header:** add `{ titleKey: "nav.blog", fallback: "Blog", route: "/blog" }` to the `pages` array in `components/Header/Header.tsx`. Add the `nav.blog` key to `public/locales/en/common.json` and `public/locales/sl/common.json` (value: `"Blog"` in both).

**Active-link highlighting:** change the comparison in `Header.tsx` from `router.route === page.route` to `router.route === page.route || router.route.startsWith(page.route + '/')` so deep blog routes still highlight the "Blog" nav item. Verify this does not change behavior for the existing `/`, `/projects`, `/publications` entries.

**SEO:** reuse `components/SEO`. Per-post pages add `<meta property="article:published_time">` and `<meta property="article:tag">` for proper Open Graph article cards.

**Static export:** existing `output: 'export'`, `trailingSlash: true`, and `basePath` settings work unchanged. All blog routes are pre-rendered with `fallback: false`.

## Dependencies

```
next-mdx-remote
gray-matter
remark-gfm remark-math remark-smartypants
rehype-katex rehype-pretty-code shiki
rehype-slug rehype-autolink-headings rehype-citation
reading-time
katex          # CSS only, imported once in _app.tsx
feed           # RSS generation
```

All build-time only except `next-mdx-remote` runtime + KaTeX CSS.

## Implementation phases

**Phase 1 — Plumbing.** Install deps; create `content/blog/` with one sample post + `references.bib`; build `lib/blog/posts.ts` and `lib/blog/mdx.ts`; verify `readAllPosts()` output.

**Phase 2 — Single post page.** `pages/blog/[year]/[slug].tsx` rendering with `<MDXRemote>` (no Tufte styling yet). Verify frontmatter, math, code highlighting, citations resolve.

**Phase 3 — Tufte components and styling.** Build all components; write `styles/blog/tufte.scss`; wire components into `<MDXRemote>`; exercise every primitive in the sample post; verify desktop + ≤900px.

**Phase 4 — Listing pages.** `/blog/`, `/blog/tags/`, `/blog/tags/[tag]/`, prev/next on posts.

**Phase 5 — RSS and nav integration.** `pages/blog/rss.xml.tsx`; header nav entry; i18n locale keys; active-link match for deep routes; SEO meta.

**Phase 6 — Polish.** Full `npm run build` validation; Lighthouse pass on a sample post; "writing a blog post" section in `CLAUDE.md`.

## Open questions

None.

## Risks

- **`rehype-citation` maturity.** Smaller package than the others. If it has issues, fallback is to use plain markdown footnotes for citations and skip the BibTeX integration in Phase 1, treating citations as Phase 6 polish.
- **Mobile sidenote ordering.** Rendering sidenotes "after the paragraph" requires the component to know its containing `<p>`. The simplest implementation is to break the paragraph at the `<Sidenote>` boundary on mobile via CSS `display: block` — this works because the `<aside>` is already a sibling in the DOM. Verify visually in Phase 3.
- **Static export + `rss.xml.tsx` pattern.** The "page that returns null and writes a file from `getStaticProps`" trick depends on `getStaticProps` running before the static export step. Confirmed working in Next.js 16 but worth a quick smoke test in Phase 5.
