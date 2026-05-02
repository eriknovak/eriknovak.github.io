import path from "path";
import { serialize } from "next-mdx-remote/serialize";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
// rehype-citation is CJS; import default
import rehypeCitationDefault from "rehype-citation";

const rehypeCitation =
  (rehypeCitationDefault as { default?: typeof rehypeCitationDefault })
    .default ?? rehypeCitationDefault;

const DEFAULT_BIB = path.join(
  process.cwd(),
  "content",
  "blog",
  "references.bib",
);

export interface SerializeOptions {
  /** Optional override for citation bibliography (relative to repo root) */
  bibliography?: string;
}

export async function serializeMdx(
  source: string,
  options: SerializeOptions = {},
) {
  const bibPath = options.bibliography
    ? path.join(process.cwd(), options.bibliography)
    : DEFAULT_BIB;

  return serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        [
          remarkSmartypants,
          { dashes: "oldschool", ellipses: true, quotes: true },
        ],
      ],
      rehypePlugins: [
        rehypeKatex,
        [
          rehypePrettyCode,
          {
            theme: { light: "github-light", dark: "github-dark" },
            keepBackground: false,
          },
        ],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor"],
              ariaLabel: "Link to section",
            },
          },
        ],
        [
          rehypeCitation,
          {
            bibliography: bibPath,
            csl: "apa",
            linkCitations: true,
            inlineClass: ["citation"],
          },
        ],
      ],
      format: "mdx",
    },
    parseFrontmatter: false,
  });
}
