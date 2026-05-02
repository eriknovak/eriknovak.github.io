import { ReactNode } from "react";

interface Props {
  /** Image source. Optional — when omitted, render `children` as a placeholder. */
  src?: string;
  alt?: string;
  caption?: ReactNode;
  /** Optional small caption prefix shown in the margin (e.g. "FIG. 1"). */
  label?: string;
  /** Used only with placeholder children — sets a fixed visual height. */
  height?: number;
  children?: ReactNode;
}

// Inline figure: image (or placeholder) sits in the body column at full
// reading width; caption is absolutely positioned in the right gutter via
// `.blog-inline-figure > figcaption` rules in tufte.scss.
export default function Figure({
  src,
  alt = "",
  caption,
  label = "Fig.",
  height,
  children,
}: Props) {
  return (
    <figure className="blog-inline-figure">
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div
          className="blog-inline-figure-placeholder"
          style={height ? { height } : { aspectRatio: "16 / 9" }}
        >
          {children}
        </div>
      )}
      {caption && (
        <figcaption>
          <span className="blog-margin-caption-label">{label}</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
