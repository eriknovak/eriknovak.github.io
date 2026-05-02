interface Props {
  src: string;
  alt: string;
  caption?: string;
}

export default function FullWidthFigure({ src, alt, caption }: Props) {
  return (
    <figure className="blog-fullwidth full-width-figure">
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
