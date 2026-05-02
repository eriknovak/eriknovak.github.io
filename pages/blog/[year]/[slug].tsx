import Link from "../../../components/Link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";

import SEO from "../../../components/SEO";
import BlogPost from "../../../components/Blog/BlogPost";
import Sidenote from "../../../components/Blog/Sidenote";
import MarginNote from "../../../components/Blog/MarginNote";
import MarginFigure from "../../../components/Blog/MarginFigure";
import FullWidthFigure from "../../../components/Blog/FullWidthFigure";
import Epigraph from "../../../components/Blog/Epigraph";
import NewThought from "../../../components/Blog/NewThought";
import SideTable from "../../../components/Blog/SideTable";
import References from "../../../components/Blog/References";

import {
  readAllPosts,
  getPostRaw,
  getPostNeighbors,
} from "../../../utils/blog/posts";
import { serializeMdx } from "../../../utils/blog/mdx";
import type { BlogPostFull, BlogPostMeta } from "../../../Interfaces";

interface PageProps {
  post: BlogPostFull;
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
}

const mdxComponents = {
  Sidenote,
  MarginNote,
  MarginFigure,
  FullWidthFigure,
  Epigraph,
  NewThought,
  SideTable,
  References,
};

export default function BlogPostPage({ post, prev, next }: PageProps) {
  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.year}/${post.slug}/`}
        type="article"
      />
      <BlogPost meta={post}>
        <MDXRemote {...post.mdxSource} components={mdxComponents} />
      </BlogPost>
      <nav className="grid grid-cols-2 gap-4 mt-12 max-w-3xl mx-auto">
        <div>
          {prev && (
            <Link href={`/blog/${prev.year}/${prev.slug}/`} legacyBehavior>
              <a className="block text-link hover:text-link-hover">
                <span className="text-sm text-highlight block">← Previous</span>
                <span>{prev.title}</span>
              </a>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link href={`/blog/${next.year}/${next.slug}/`} legacyBehavior>
              <a className="block text-link hover:text-link-hover">
                <span className="text-sm text-highlight block">Next →</span>
                <span>{next.title}</span>
              </a>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = readAllPosts();
  return {
    paths: posts.map((p) => ({ params: { year: p.year, slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const year = String(params?.year);
  const slug = String(params?.slug);
  const raw = getPostRaw(year, slug);
  if (!raw) return { notFound: true };
  const mdxSource = await serializeMdx(raw.content, {
    bibliography: raw.meta.bibliography,
  });
  const { prev, next } = getPostNeighbors(year, slug);
  return { props: { post: { ...raw.meta, mdxSource }, prev, next } };
};
