import Head from "next/head";

import { SITE_URL } from "../../utils/config";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  noindex?: boolean;
}

const DEFAULT_IMAGE = `${SITE_URL}/imgs/profile.jpg`;

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Erik Novak",
  jobTitle: "Researcher in Artificial Intelligence",
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  worksFor: [
    {
      "@type": "Organization",
      name: "Event Registry",
      url: "https://eventregistry.org/",
    },
    {
      "@type": "Organization",
      name: "Jozef Stefan Institute",
      url: "https://ailab.ijs.si/",
    },
  ],
  sameAs: [
    "https://scholar.google.com/citations?user=QKeReOoAAAAJ&hl=en",
    "https://www.researchgate.net/profile/Erik_Novak3",
  ],
  knowsAbout: [
    "Natural Language Processing",
    "Artificial Intelligence",
    "Text Analysis",
    "Data Visualization",
  ],
};

export default function SEO({
  title,
  description,
  path = "",
  type = "website",
  image = DEFAULT_IMAGE,
  noindex = false,
}: SEOProps) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | Erik Novak`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Erik Novak" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
    </Head>
  );
}
