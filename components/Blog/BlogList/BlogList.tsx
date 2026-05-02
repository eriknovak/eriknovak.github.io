import Link from "../../Link";
import TagPill from "../TagPill";
import type { BlogPostMeta } from "../../../Interfaces";

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogList({ posts }: Props) {
  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }
  return (
    <ul className="grid gap-8 list-none p-0">
      {posts.map((post) => (
        <li key={`${post.year}-${post.slug}`} className="grid gap-1">
          <h3 className="text-xl font-semibold">
            <Link href={`/blog/${post.year}/${post.slug}/`} legacyBehavior>
              <a className="text-link hover:text-link-hover">{post.title}</a>
            </Link>
          </h3>
          <p className="text-sm text-highlight">
            <time dateTime={post.date}>{post.date}</time>
            {" · "}
            {post.readingMinutes} min read
          </p>
          <p className="leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {post.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
