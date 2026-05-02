import Link from "../../Link";

interface Props {
  tag: string;
  count?: number;
}

export default function TagPill({ tag, count }: Props) {
  return (
    <Link href={`/blog/tags/${tag}/`} legacyBehavior>
      <a className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-base-highlight text-sm text-link hover:text-link-hover">
        <span>#{tag}</span>
        {typeof count === "number" ? <span>({count})</span> : null}
      </a>
    </Link>
  );
}
