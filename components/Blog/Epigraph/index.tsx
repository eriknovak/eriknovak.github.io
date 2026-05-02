interface Props {
  quote: string;
  attribution?: string;
  source?: string;
}

export default function Epigraph({ quote, attribution, source }: Props) {
  return (
    <blockquote className="epigraph">
      <p>{quote}</p>
      {(attribution || source) && (
        <span className="epigraph-attribution">
          {attribution}
          {attribution && source ? ", " : ""}
          {source ? <cite>{source}</cite> : null}
        </span>
      )}
    </blockquote>
  );
}
