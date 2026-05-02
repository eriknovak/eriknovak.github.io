import type { GetStaticProps } from "next";

import SEO from "../../../components/SEO";
import TagPill from "../../../components/Blog/TagPill";
import { readAllTags } from "../../../utils/blog/posts";

interface PageProps {
  tags: { tag: string; count: number }[];
}

export default function TagsIndexPage({ tags }: PageProps) {
  return (
    <div className="grid gap-8">
      <SEO
        title="Blog tags"
        description="Browse blog posts by tag."
        path="/blog/tags/"
      />
      <h1 className="text-4xl font-bold">Tags</h1>
      <div className="flex flex-wrap gap-3">
        {tags.length === 0 ? <p>No tags yet.</p> : null}
        {tags.map((t) => (
          <TagPill key={t.tag} tag={t.tag} count={t.count} />
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { tags: readAllTags() } };
};
