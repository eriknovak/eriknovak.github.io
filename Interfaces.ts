export interface PublicationProps {
  /**
   * Stable identifier for the publication. A first-page image placed at
   * public/imgs/publications/<id>.png is picked up automatically at build
   * time (see scripts/generate-publication-thumbnails.mjs).
   */
  id?: string;
  /** Resolved at build time; path to the first-page image if one exists. */
  thumbnail?: string;
  /**
   * Featured paper: rendered with a larger first-page image, larger title,
   * and the abstract. Mark 3–5 entries at most so the contrast keeps meaning.
   */
  selected?: boolean;
  authors: string;
  title: string;
  url: string;
  reference: string;
  location?: string;
  year: number;
  presentation?: string;
  type?: string;
  keywords?: string[];
  doi?: string;
  pdf?: string;
  /** Optional one-paragraph abstract rendered on the Publications page. */
  abstract?: string;
}

export interface ProjectLink {
  type:
    | "homepage"
    | "service"
    | "code"
    | "data"
    | "model"
    | "github"
    | "github-org";
  label: string;
  url?: string;
  // For GitHub repos
  owner?: string;
  repo?: string;
  // For GitHub orgs
  org?: string;
}

export interface ProjectProps {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description?: string[];
  links?: ProjectLink[];
  resources?: ProjectLink[];
}

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
  /** Optional post type label (e.g. Notes, Technical, Summary, Paper review, Project log) */
  type?: string;
  /** Optional explicit TOC for the blog post — pairs of anchor id + title */
  toc?: { id: string; t: string }[];
}

export interface BlogPostFull extends BlogPostMeta {
  /** MDX source serialized via next-mdx-remote/serialize */
  mdxSource: import("next-mdx-remote").MDXRemoteSerializeResult;
}

export interface BlogTagSummary {
  tag: string;
  count: number;
}
