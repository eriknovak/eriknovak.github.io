import type { GetStaticPaths, GetStaticProps } from "next";

import SEO from "../../../components/SEO";
import BlogList from "../../../components/Blog/BlogList";
import { readAllPosts, readAllTags } from "../../../utils/blog/posts";
import type { BlogPostMeta } from "../../../Interfaces";

interface PageProps {
  tag: string;
  posts: BlogPostMeta[];
}

export default function TagPage({ tag, posts }: PageProps) {
  return (
    <div className="grid gap-8">
      <SEO
        title={`#${tag}`}
        description={`Blog posts tagged ${tag}.`}
        path={`/blog/tags/${tag}/`}
      />
      <header>
        <h1 className="text-4xl font-bold">#{tag}</h1>
        <p className="text-highlight">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
      </header>
      <BlogList posts={posts} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = readAllTags();
  return {
    paths: tags.map((t) => ({ params: { tag: t.tag } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const tag = String(params?.tag);
  const posts = readAllPosts().filter((p) => p.tags.includes(tag));
  return { props: { tag, posts } };
};
