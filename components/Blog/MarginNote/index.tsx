import { ReactNode } from "react";

export default function MarginNote({ children }: { children: ReactNode }) {
  return <aside className="blog-aside margin-note">{children}</aside>;
}
