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


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
