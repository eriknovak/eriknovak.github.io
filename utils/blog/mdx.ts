import path from "path";
import { serialize } from "next-mdx-remote/serialize";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeCitation from "rehype-citation";

const DEFAULT_BIB_FILE = "references.bib";

// rehype-citation resolves `bibliography` via `path.join(options.path, value)`,
// so we anchor at the project root with `path: cwd` and pass a relative path.
const DEFAULT_BIB_REL = path.join("content", "blog", DEFAULT_BIB_FILE);

export interface MdxSerializeOptions {
  /** Optional override for citation bibliography path (relative to repo root) */
  bibliography?: string;
}

export async function serializeMdx(
  source: string,
  options: MdxSerializeOptions = {},
) {
  const bibRel = options.bibliography ?? DEFAULT_BIB_REL;

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
            bibliography: bibRel,
            path: process.cwd(),
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
