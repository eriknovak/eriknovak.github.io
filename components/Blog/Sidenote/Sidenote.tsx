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

  // <span> instead of <aside> so the element is valid inside <p>; the float
  // styling on .blog-aside still pulls it into the right margin.
  return (
    <>
      <sup className="sidenote-ref">{n}</sup>
      <span className="blog-aside sidenote">
        <sup>{n}</sup>
        {children}
      </span>
    </>
  );
}
