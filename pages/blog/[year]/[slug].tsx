import type { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";

import SEO from "../../../components/SEO";
import { readAllPosts, getPostRaw } from "../../../utils/blog/posts";
import { serializeMdx } from "../../../utils/blog/mdx";
import type { BlogPostFull } from "../../../Interfaces";

interface PageProps {
  post: BlogPostFull;
}

export default function BlogPostPage({ post }: PageProps) {
  return (
    <article className="blog-article">
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.year}/${post.slug}/`}
        type="article"
      />
      <header>
        <h1 className="blog-title">{post.title}</h1>
        <p className="blog-meta">
          <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes}{" "}
          min read
        </p>
      </header>
      <MDXRemote {...post.mdxSource} />
    </article>
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
  return { props: { post: { ...raw.meta, mdxSource } } };
};
