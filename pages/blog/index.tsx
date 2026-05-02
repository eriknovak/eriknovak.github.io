import type { GetStaticProps } from "next";

import SEO from "../../components/SEO";
import BlogList from "../../components/Blog/BlogList";
import { readAllPosts } from "../../utils/blog/posts";
import type { BlogPostMeta } from "../../Interfaces";

interface PageProps {
  posts: BlogPostMeta[];
}

export default function BlogIndexPage({ posts }: PageProps) {
  return (
    <div className="grid gap-12">
      <SEO
        title="Blog"
        description="Notes, essays, and research write-ups by Erik Novak."
        path="/blog/"
      />
      <header className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold">Blog</h1>
        <p className="text-xl text-highlight">
          Notes, essays, and research write-ups.
        </p>
      </header>
      <BlogList posts={posts} />
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { posts: readAllPosts() } };
};
