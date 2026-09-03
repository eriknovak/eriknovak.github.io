# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic homepage for Erik Novak - an AI researcher. Built with Next.js (Pages Router) using TypeScript, Tailwind CSS, and SCSS.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production (outputs to ./frontend directory)
npm run start    # Start production server
```

## Architecture

### Project Structure

```
pages/              # Next.js pages (index, publications, projects)
components/         # React components with barrel exports (index.tsx re-exports Component.tsx)
assets/             # Static data files (profile info, publications, projects)
styles/             # Global SCSS styles with Tailwind
public/             # Static assets (images, fonts)
```

### Data Flow

Content is defined as TypeScript objects in `assets/`:
- `assets/profile/` - Profile info, academic links, programming skills
- `assets/publications/` - Journal papers and conference papers
- `assets/projects/` - Research projects

Pages import these data files and render them using components. No backend or CMS.

### Publication thumbnails

Each publication entry has a stable `id`. A first-page image at
`public/imgs/publications/<id>.png` is picked up automatically at build time
(via `getStaticProps` in `pages/publications.tsx`) and rendered in the
publication card. Generate images with `npm run thumbnails` (requires
poppler's `pdftoppm`); for paywalled papers or unpublished posters run
`node scripts/generate-publication-thumbnails.mjs <id> <path-to.pdf>` with a
manually downloaded PDF.

### Component Pattern

Components use barrel exports:
```
components/ComponentName/
├── index.tsx           # Re-exports: export { default } from "./ComponentName"
├── ComponentName.tsx   # Actual component implementation
└── ComponentName.module.scss  # Component-specific styles (optional)
```

### Styling

- Tailwind CSS with custom theme in `tailwind.config.js`
- CSS variables for theming (dark/light mode) defined in `styles/globals.scss`
- SCSS modules for component-specific styles
- Custom color system using RGB values with opacity support

### Type Definitions

Interfaces for data structures are in `Interfaces.ts`:
- `PublicationProps` - Journal/conference paper metadata
- `ProjectProps` - Research project info
- `SoftwareProps` - Software project details

## Build Configuration

- Static export enabled (`output: 'export'` in next.config.js)
- Outputs to `frontend/` directory instead of `.next/`
- Supports `BASE_PATH` environment variable for deployment subdirectories

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

`rehype-citation` requires `options.path` (directory) and `options.bibliography` (filename) to be passed separately — passing a full absolute path as `bibliography` causes it to join `file.cwd` with the absolute path, producing a broken path. See `utils/blog/mdx.ts` for the correct split approach.
