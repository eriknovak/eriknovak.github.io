import { createContext, useRef, ReactNode } from "react";

interface CounterAPI {
  next: () => number;
}

export const SidenoteCounterContext = createContext<CounterAPI | null>(null);

export function SidenoteCounterProvider({ children }: { children: ReactNode }) {
  const counter = useRef(0);
  // Stable API object across renders.
  const api = useRef<CounterAPI>({
    next: () => {
      counter.current += 1;
      return counter.current;
    },
  });
  return (
    <SidenoteCounterContext.Provider value={api.current}>
      {children}
    </SidenoteCounterContext.Provider>
  );
}
