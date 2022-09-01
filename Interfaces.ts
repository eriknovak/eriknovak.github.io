export interface PublicationProps {
  authors: string;
  title: string;
  url: string;
  reference: string;
  location?: string;
  year: number;
  presentation?: string;
}

export interface ProjectProps {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description?: string[];
  links?: {
    type: string;
    label: string;
    url: string;
  }[];
}

export interface SoftwareProps {
  title: string;
  labels?: string[];
  description?: string[];
  links?: {
    label: string;
    url: string;
  }[];
}
