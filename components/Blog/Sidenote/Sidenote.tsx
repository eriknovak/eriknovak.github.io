import { ReactNode, useContext, useState } from "react";
import { SidenoteCounterContext } from "./SidenoteCounter";

interface SidenoteProps {
  children: ReactNode;
}

export default function Sidenote({ children }: SidenoteProps) {
  const ctx = useContext(SidenoteCounterContext);
  // useState's lazy initializer runs exactly once per mount, so the counter
  // advances once per Sidenote even though the hook itself is called every render.
  const [n] = useState<number>(() => ctx?.next() ?? 0);

  return (
    <>
      <sup className="sidenote-ref">{n}</sup>
      <aside className="blog-aside sidenote">
        <sup>{n}</sup> {children}
      </aside>
    </>
  );
}
