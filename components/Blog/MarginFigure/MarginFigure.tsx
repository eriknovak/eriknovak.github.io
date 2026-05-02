interface Props {
  src: string;
  alt: string;
  caption?: string;
  /** Optional small caption prefix (e.g. "FIG. 1"). */
  label?: string;
}

export default function MarginFigure({
  src,
  alt,
  caption,
  label = "Fig.",
}: Props) {
  return (
    <figure className="blog-aside margin-figure">
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
      {caption ? (
        <figcaption>
          <span className="blog-margin-caption-label">{label}</span>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
