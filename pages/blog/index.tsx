import { useEffect, useMemo, useState } from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Link from "../../components/Link";
import SEO from "../../components/SEO";
import { readAllPosts } from "../../utils/blog/posts";
import { writeRssFeed } from "../../utils/blog/rss";
import { writeSitemap } from "../../utils/sitemap";
import type { BlogPostMeta } from "../../Interfaces";
import styles from "./blog.module.scss";

interface PageProps {
  posts: BlogPostMeta[];
}

interface Tone {
  bg: string;
  fg: string;
}

const TYPE_TONE: Record<string, Tone> = {
  Notes: { bg: "rgba(120,120,140,0.10)", fg: "#5a5a6a" },
  Technical: { bg: "rgba(160,80,80,0.10)", fg: "#8a3a3a" },
  Essay: { bg: "rgba(80,120,80,0.10)", fg: "#3a6a3a" },
  "Reading list": { bg: "rgba(140,110,60,0.10)", fg: "#7a5a2a" },
};

const TYPE_TONE_DARK: Record<string, Tone> = {
  Notes: { bg: "rgba(180,180,200,0.12)", fg: "#b8b8c8" },
  Technical: { bg: "rgba(220,140,140,0.12)", fg: "#d89898" },
  Essay: { bg: "rgba(140,200,140,0.12)", fg: "#a8d4a8" },
  "Reading list": { bg: "rgba(200,170,100,0.12)", fg: "#d4ba80" },
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const postType = (p: BlogPostMeta): string => p.type ?? "Notes";

const getTone = (type: string, isDark: boolean): Tone => {
  const map = isDark ? TYPE_TONE_DARK : TYPE_TONE;
  return map[type] ?? { bg: "transparent", fg: "var(--ed-muted)" };
};

const PostRow = ({
  p,
  isDark,
  readLabel,
}: {
  p: BlogPostMeta;
  isDark: boolean;
  readLabel: string;
}) => {
  const type = postType(p);
  const tone = getTone(type, isDark);
  return (
    <div className={styles.postRow}>
      <div className={styles.postRowMeta}>
        <div>{fmtDate(p.date)}</div>
        <div className={styles.postRowMetaSecondary}>
          {p.readingMinutes} min
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "var(--ed-sans)",
              fontSize: 10,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              padding: "3px 8px",
              background: tone.bg,
              color: tone.fg,
              borderRadius: 2,
            }}
          >
            {type}
          </span>
        </div>
        <Link
          href={`/blog/${p.year}/${p.slug}/`}
          style={{
            fontFamily: "var(--ed-serif)",
            fontSize: 22,
            lineHeight: 1.3,
            fontWeight: 500,
            color: "var(--ed-fg)",
            textDecoration: "none",
            display: "block",
            marginBottom: 6,
            letterSpacing: "-0.2px",
          }}
        >
          {p.title}
        </Link>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: "var(--ed-text-secondary)",
            margin: "0 0 10px",
          }}
        >
          {p.description}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            fontFamily: "var(--ed-sans)",
            fontSize: 11,
            color: "var(--ed-muted)",
            letterSpacing: "0.4px",
          }}
        >
          {p.tags.map((tag) => (
            <span
              key={tag}
              style={{
                border: "1px solid var(--ed-rule)",
                padding: "2px 7px",
                borderRadius: 2,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.postRowCta}>
        <span>{readLabel}</span>
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10 }} />
      </div>
    </div>
  );
};

export default function BlogIndexPage({ posts }: PageProps) {
  const { t, ready } = useTranslation("blog");
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      setIsDark(
        document.documentElement.getAttribute("data-theme") !== "light",
      );
      const observer = new MutationObserver(() => {
        setIsDark(
          document.documentElement.getAttribute("data-theme") !== "light",
        );
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => observer.disconnect();
    }
  }, []);

  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const types = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => s.add(postType(p)));
    return Array.from(s);
  }, [posts]);

  const filtered = useMemo(
    () =>
      filter === "all" ? posts : posts.filter((p) => postType(p) === filter),
    [posts, filter],
  );

  const byYear = useMemo(() => {
    return filtered.reduce<Record<string, BlogPostMeta[]>>((acc, p) => {
      const y = p.year;
      (acc[y] = acc[y] || []).push(p);
      return acc;
    }, {});
  }, [filtered]);
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  const FilterChip = ({
    value,
    label,
    count,
  }: {
    value: string;
    label: string;
    count: number;
  }) => {
    const active = filter === value;
    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--ed-sans)",
          fontSize: 12,
          color: active ? "var(--ed-fg)" : "var(--ed-muted)",
          letterSpacing: "1px",
          textTransform: "uppercase",
          borderBottom: active
            ? "1px solid currentColor"
            : "1px solid transparent",
          paddingBottom: 2,
        }}
      >
        {label} ({count})
      </button>
    );
  };

  return (
    <div className={styles.page}>
      <SEO
        title="Blog"
        description="Notes, essays, and research write-ups by Erik Novak."
        path="/blog/"
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
          {posts.length} {tt("kickerSuffix", "posts")}
        </div>
        <h1 className={styles.heroH1}>{tt("h1", "Blog")}</h1>
        <p className={styles.heroLead}>
          {tt(
            "lead",
            "Notes, technical write-ups, and longer essays — typeset in the Tufte tradition with margin sidenotes.",
          )}
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: "var(--ed-muted)" }}>No posts yet.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              borderTop: "1px solid var(--ed-rule)",
              borderBottom: "1px solid var(--ed-rule)",
              padding: "12px 0",
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <FilterChip
              value="all"
              label={tt("filterAll", "All")}
              count={posts.length}
            />
            {types.map((ty) => (
              <FilterChip
                key={ty}
                value={ty}
                label={ty}
                count={posts.filter((p) => postType(p) === ty).length}
              />
            ))}
            <Link
              href="/blog/tags/"
              style={{
                marginLeft: "auto",
                fontFamily: "var(--ed-sans)",
                fontSize: 12,
                color: "var(--ed-muted)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: "1px solid var(--ed-rule)",
                paddingBottom: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{tt("browseTags", "Browse tags")}</span>
              <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 10 }} />
            </Link>
          </div>

          {years.map((y) => (
            <div key={y} style={{ marginBottom: 48 }}>
              <div className={styles.yearHeader}>
                <div className={styles.yearLabel}>{y}</div>
                <div className={styles.yearMeta}>
                  {byYear[y].length}{" "}
                  {byYear[y].length === 1
                    ? tt("yearMetaOne", "post")
                    : tt("yearMetaMany", "posts")}
                </div>
              </div>
              {byYear[y].map((p) => (
                <PostRow
                  key={`${p.year}-${p.slug}`}
                  p={p}
                  isDark={isDark}
                  readLabel={tt("read", "Read")}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  writeRssFeed();
  writeSitemap();
  return { props: { posts: readAllPosts() } };
};
