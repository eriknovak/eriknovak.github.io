# Erik Novak — Personal Homepage

Personal academic homepage for Erik Novak, a researcher in Artificial Intelligence.
It presents a profile/bio, a list of publications (journal, conference, arXiv) and
datasets, and research projects.

Built with **Next.js** (Pages Router), **TypeScript**, **Tailwind CSS**, and **SCSS**.
Content lives in plain TypeScript data files — there is no backend or CMS, so most
updates are a matter of editing a list in `assets/`.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # static production build (outputs to ./frontend)
npm run start    # serve the production build
```

The site is statically exported (`output: 'export'`). A `BASE_PATH` environment
variable is supported for deployment under a subdirectory.

## Project structure

```
assets/                 # Site content as TypeScript data (edit these)
  profile/              #   bio text, academic links, programming skills
  publications/         #   journal / conference / arXiv papers + datasets
  projects/             #   research projects
public/                 # Static files: images, fonts, and i18n locale JSON
  locales/{en,sl}/      #   UI translation strings (edit when adding labels)
pages/                  # Next.js routes (mostly layout — edit with care)
components/             # Reusable React components (leave alone unless changing UI)
utils/                  # Helpers: bibtex, sorting, i18n, sitemap
styles/                 # Global SCSS + Tailwind layer
Interfaces.ts           # TypeScript types for the content data
tailwind.config.js      # Theme (colors, fonts)
next.config.js          # Build / static-export config
frontend/               # GENERATED build output — never edit
```

## What to edit

Almost all routine content updates happen in `assets/`. These are typed against
`Interfaces.ts`, so run `npx tsc --noEmit` after
editing to catch mistakes.

### Publications

The publications page groups entries by source. Each group is its own file and an
array of `PublicationProps` (see `Interfaces.ts`):

| File | Shows up under |
|------|----------------|
| `assets/publications/journal_papers.ts` | **Journal** filter |
| `assets/publications/conference_papers.ts` | **Conference** filter |
| `assets/publications/arxiv_papers.ts` | **arXiv** filter |
| `assets/publications/datasets.ts` | **Datasets** filter |

To add a paper, copy an existing entry and fill in the fields:

```ts
{
  authors: "E. Novak, D. Mladenić, M. Grobelnik",   // "F. Surname" initials, comma-separated
  title: "Paper Title",
  url: "https://...",                                 // links the title
  reference: "Journal or Proceedings name",           // shown in italics on the card
  location: "Ljubljana",                              // or null
  year: 2025,
  doi: "10.0000/xxxxx",                               // optional — renders a DOI chip
  pdf: "https://.../paper.pdf",                        // optional — renders a PDF chip
  keywords: ["nlp", "llm"],                            // optional — used in BibTeX export
},
```

Entries are sorted by year automatically; order within a file does not matter.
The BibTeX "copy" button is generated from these fields (`utils/bibtex.ts`).

### Publication thumbnails (first-page PNGs)

Every paper entry has a stable `id` (e.g. `news-stream-clustering-2021`). If a
PNG exists at `public/imgs/publications/<id>.png`, the publications page picks
it up **automatically at build time** and renders the paper's first page in the
card — adding or regenerating an image never requires a code change.

Rendering requires poppler's `pdftoppm`:

```bash
sudo apt-get install poppler-utils   # Debian/Ubuntu
brew install poppler                 # macOS
```

**Automatic** — downloads every openly available PDF and renders page 1
(skips images that already exist; add `--force` to regenerate):

```bash
npm run thumbnails
```

**Manual** — for a single entry, or for papers whose PDF is not openly
downloadable (paywalled journals, unpublished posters): download the PDF
yourself, then pass the entry's `id` and the file (a URL also works):

```bash
node scripts/generate-publication-thumbnails.mjs tarnet-2024 ~/Downloads/tarnet.pdf
```

Commit the generated PNGs. The id → PDF-URL list used by the automatic mode
lives at the top of `scripts/generate-publication-thumbnails.mjs`; when adding
a new paper, add its `id` there too (or just use the manual form once).

### Projects

`assets/projects/research_projects.ts` — an array of `ProjectProps`. `links` are
external buttons (homepage, platform); `resources` are typically GitHub repos:

```ts
{
  type: "github",
  label: "PREPARE Extraction Tool",   // button text
  owner: "E3-JSI",                    // GitHub org/user
  repo: "PREPARE-Extraction-Tool",    // repo name
},
```

Set `endDate: "Present"` for active projects (these also surface on the home page).

### Profile

- `assets/profile/profile.tsx` — name, subtitle, and the bio paragraphs (JSX).
- `assets/profile/academic.ts` — the academic/contact links (Scholar, GitHub, email, …).

### UI text / translations

User-facing labels are translated. When you add a new label (e.g. a new filter
chip), add the key to **both** `public/locales/en/*.json` and
`public/locales/sl/*.json` for the relevant namespace (`publications`, `projects`,
`home`, `common`).

## What to generally leave alone

These are framework, build, or wiring concerns — only touch them when you are
deliberately changing how the site works, not when updating content:

- **`frontend/`, `.next/`, `node_modules/`** — generated; never edit or commit by hand.
- **`pages/`** — route layouts. Adding a publication/project does **not** require
  changes here; editing is only needed for new pages or layout changes. If you add a
  whole new publication *group*, the wiring lives in `pages/publications.tsx`.
- **`components/`** — reusable UI (cards, header, footer, theme toggle). Change only
  for visual/behavioral tweaks.
- **`utils/`** — BibTeX generation, sorting, i18n, sitemap.
- **`Interfaces.ts`** — change only when a content field needs to be added/changed.
- **`tailwind.config.js`, `styles/globals.scss`** — theme and design tokens
  (colors, fonts, dark/light variables).
- **`next.config.js`, `tsconfig.json`, `postcss.config.js`** — build configuration.
- **`public/sitemap.xml`** — generated during the build.

## Notes

- After editing any data file, run `npx tsc --noEmit` to type-check.
