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

const DEFAULT_BIB_DIR = path.join(process.cwd(), "content", "blog");
const DEFAULT_BIB_FILE = "references.bib";

export interface MdxSerializeOptions {
  /** Optional override for citation bibliography path (relative to repo root) */
  bibliography?: string;
}

export async function serializeMdx(
  source: string,
  options: MdxSerializeOptions = {},
) {
  // rehype-citation joins options.path + options.bibliography, so we must
  // split the path into a directory and filename.
  let bibDir: string;
  let bibFile: string;
  if (options.bibliography) {
    const absPath = path.join(process.cwd(), options.bibliography);
    bibDir = path.dirname(absPath);
    bibFile = path.basename(absPath);
  } else {
    bibDir = DEFAULT_BIB_DIR;
    bibFile = DEFAULT_BIB_FILE;
  }

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
            bibliography: bibFile,
            path: bibDir,
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
