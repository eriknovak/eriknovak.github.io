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
  /** Volume, issue and page range (or article number); used in BibTeX. */
  volume?: string;
  number?: string;
  pages?: string;
  /** Publisher of a book chapter or proceedings volume. */
  publisher?: string;
  /** Book chapter: emitted as a BibTeX @incollection entry. */
  chapter?: boolean;
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
  /** Wayback Machine copy of a page that no longer exists. */
  archived?: boolean;
  // For GitHub repos
  owner?: string;
  repo?: string;
  // For GitHub orgs
  org?: string;
}

export interface ProjectProps {
  title: string;
  type: string;
  /** CORDIS project ID (EU-funded projects only). */
  cordis?: string;
  startDate: string;
  endDate: string;
  description?: string[];
  /** Own contribution to the project, rendered as a highlighted block. */
  contribution?: string;
  links?: ProjectLink[];
  resources?: ProjectLink[];
}
