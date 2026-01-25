export interface PublicationProps {
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
