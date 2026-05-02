interface Props {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export default function SideTable({ caption, headers, rows }: Props) {
  return (
    <aside className="blog-aside side-table">
      {caption ? <p className="side-table-caption">{caption}</p> : null}
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
