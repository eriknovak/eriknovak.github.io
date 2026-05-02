import { ReactNode } from "react";

// Inline-safe span (the float layout still pulls it into the right margin).
// <aside> would be auto-closed by the parser when nested inside <p>.
export default function MarginNote({ children }: { children: ReactNode }) {
  return <span className="blog-aside margin-note">{children}</span>;
}
