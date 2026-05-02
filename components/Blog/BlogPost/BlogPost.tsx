import { ReactNode } from "react";
import { SidenoteCounterProvider } from "../Sidenote";
import Epigraph from "../Epigraph";
import type { BlogPostMeta } from "../../../Interfaces";

interface Props {
  meta: BlogPostMeta;
  children: ReactNode;
}

export default function BlogPost({ meta, children }: Props) {
  return (
    <SidenoteCounterProvider>
      <article className="blog-article">
        <header>
          <h1 className="blog-title">{meta.title}</h1>
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
          {meta.tags.length > 0 && (
            <p className="blog-meta">tags: {meta.tags.join(", ")}</p>
          )}
        </header>
        {meta.epigraph && (
          <Epigraph
            quote={meta.epigraph.quote}
            attribution={meta.epigraph.attribution}
            source={meta.epigraph.source}
          />
        )}
        {children}
      </article>
    </SidenoteCounterProvider>
  );
}
