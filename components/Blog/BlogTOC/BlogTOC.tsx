interface Heading {
  id: string;
  t: string;
}

interface Props {
  headings: Heading[];
  title?: string;
  /**
   * "sidebar" — sticky narrow column shown beside the article on wide
   * viewports. "inline" — boxed widget rendered inside the article on
   * narrow viewports so the TOC reads as part of the content flow.
   */
  variant?: "sidebar" | "inline";
}

export default function BlogTOC({
  headings,
  title = "Contents",
  variant = "sidebar",
}: Props) {
  return (
    <details className={`blog-toc blog-toc--${variant}`} open>
      <summary className="blog-toc-summary">{title}</summary>
      <div className="blog-toc-inner">
        <ol className="blog-toc-list">
          {headings.map((h, i) => (
            <li key={h.id}>
              <a href={`#${h.id}`}>
                <span className="blog-toc-num">{i + 1}.</span>
                <span>{h.t}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
