import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SidenoteCounterProvider } from "../Sidenote";
import Epigraph from "../Epigraph";
import BlogTOC from "../BlogTOC";
import type { BlogPostMeta } from "../../../Interfaces";

interface Props {
  meta: BlogPostMeta;
  children: ReactNode;
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function BlogPost({ meta, children }: Props) {
  const { t, ready } = useTranslation("blog");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tt = (key: string, fallback: string) =>
    mounted && ready ? t(key) : fallback;

  const hasTOC = !!(meta.toc && meta.toc.length > 0);
  const tocTitle = tt("contents", "Contents");

  const article = (
    <article className="blog-article">
      <header>
        <p className="blog-kicker">
          {fmtDate(meta.date)}
          {meta.type ? ` · ${meta.type}` : ""}
        </p>
        <h1 className="blog-title">{meta.title}</h1>
        {meta.description && <p className="blog-dek">{meta.description}</p>}
        <p className="blog-meta">
          <time dateTime={meta.date}>{meta.date}</time>
          {meta.updated ? (
            <>
              {" · "}
              updated <time dateTime={meta.updated}>{meta.updated}</time>
            </>
          ) : null}
          {" · "}
          {meta.readingMinutes} min read
        </p>
      </header>
      {meta.epigraph && (
        <Epigraph
          quote={meta.epigraph.quote}
          attribution={meta.epigraph.attribution}
          source={meta.epigraph.source}
        />
      )}
      {hasTOC && (
        <BlogTOC headings={meta.toc!} title={tocTitle} variant="inline" />
      )}
      {children}
      {meta.tags.length > 0 && (
        <footer className="blog-footer">
          {tt("filed", "Filed under")}{" "}
          {meta.tags.map((tag, i) => (
            <span key={tag}>
              <span className="blog-footer-tag">{tag}</span>
              {i < meta.tags.length - 1 ? ", " : ""}
            </span>
          ))}
          . {tt("comments", "Comments by email.")}
        </footer>
      )}
    </article>
  );

  return (
    <SidenoteCounterProvider>
      {hasTOC ? (
        <div className="blog-with-toc">
          <BlogTOC headings={meta.toc!} title={tocTitle} variant="sidebar" />
          {article}
        </div>
      ) : (
        article
      )}
    </SidenoteCounterProvider>
  );
}
