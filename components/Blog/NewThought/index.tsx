import { ReactNode } from "react";

export default function NewThought({ children }: { children: ReactNode }) {
  return <span className="new-thought">{children}</span>;
}
