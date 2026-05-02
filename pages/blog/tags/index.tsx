import type { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import SEO from "../../../components/SEO";
import TagPill from "../../../components/Blog/TagPill";
import { readAllTags } from "../../../utils/blog/posts";
import type { BlogTagSummary } from "../../../Interfaces";
import styles from "../blog.module.scss";

interface PageProps {
  tags: BlogTagSummary[];
}

export default function TagsIndexPage({ tags }: PageProps) {
  const { t, ready } = useTranslation("blog");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  return (
    <div className={styles.page}>
      <SEO
        title={tt("tagsPage.seoTitle", "Blog tags")}
        description={tt("tagsPage.seoDescription", "Browse blog posts by tag.")}
        path="/blog/tags/"
      />

      <div style={{ marginBottom: 56 }}>
        <div
          style={{
            fontSize: 12,
            color: "var(--ed-muted)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {tags.length}{" "}
          {tags.length === 1
            ? tt("tagsPage.tagOne", "tag")
            : tt("tagsPage.tagMany", "tags")}
        </div>
        <h1 className={styles.heroH1}>{tt("tagsPage.h1", "Tags")}</h1>
        <p className={styles.heroLead}>
          {tt(
            "tagsPage.lead",
            "Every distinct tag across the blog. Click one to see the posts that carry it.",
          )}
        </p>
      </div>

      {tags.length === 0 ? (
        <p style={{ color: "var(--ed-muted)" }}>
          {tt("tagsPage.empty", "No tags yet.")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            paddingTop: 20,
            borderTop: "1px solid var(--ed-rule)",
          }}
        >
          {tags.map((t) => (
            <TagPill key={t.tag} tag={t.tag} count={t.count} />
          ))}
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return { props: { tags: readAllTags() } };
};
