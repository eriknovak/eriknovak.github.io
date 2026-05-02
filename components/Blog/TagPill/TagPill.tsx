import Link from "../../Link";

interface Props {
  tag: string;
  count?: number;
}

export default function TagPill({ tag, count }: Props) {
  return (
    <Link
      href={`/blog/tags/${tag}/`}
      style={{
        fontFamily: "var(--ed-sans)",
        fontSize: 12,
        color: "var(--ed-fg)",
        textDecoration: "none",
        border: "1px solid var(--ed-rule)",
        background: "var(--ed-card)",
        padding: "4px 10px",
        borderRadius: 2,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: "0.2px",
      }}
    >
      <span>#{tag}</span>
      {typeof count === "number" ? (
        <span style={{ color: "var(--ed-muted)", fontSize: 11 }}>{count}</span>
      ) : null}
    </Link>
  );
}
