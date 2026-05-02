import { ReactNode } from "react";

interface Props {
  /** Header strings — first is left-aligned, the rest right-aligned (numeric). */
  cols: string[];
  rows: ReactNode[][];
  caption?: ReactNode;
  /** Optional small caption prefix shown in the margin (e.g. "TBL. 1"). */
  label?: string;
}

// Inline table: full body-column width with the caption absolutely positioned
// in the right gutter via `.blog-inline-table > .blog-margin-caption` rules
// in tufte.scss.
export default function Table({ cols, rows, caption, label = "Tbl." }: Props) {
  return (
    <div className="blog-inline-table">
      <table>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <div className="blog-margin-caption">
          <span className="blog-margin-caption-label">{label}</span>
          {caption}
        </div>
      )}
    </div>
  );
}
