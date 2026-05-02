interface Props {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
  /** Optional small caption prefix (e.g. "TBL. 1"). */
  label?: string;
}

export default function SideTable({
  caption,
  headers,
  rows,
  label = "Tbl.",
}: Props) {
  return (
    <aside className="blog-aside side-table">
      {caption ? (
        <p className="side-table-caption">
          <span className="blog-margin-caption-label">{label}</span>
          {caption}
        </p>
      ) : null}
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}
