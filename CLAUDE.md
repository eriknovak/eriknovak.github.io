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
