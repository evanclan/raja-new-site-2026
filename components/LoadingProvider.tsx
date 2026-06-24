"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Phase = "loading" | "reveal" | "ready";

type LoadingState = {
  phase: Phase;
  loaded: boolean; // true once the blobs are spreading into hero position
  done: boolean; // true once the preloader has fully unmounted
  beginReveal: () => void;
  markReady: () => void;
};

const Ctx = createContext<LoadingState>({
  phase: "loading",
  loaded: false,
  done: false,
  beginReveal: () => {},
  markReady: () => {},
});

export const useLoading = () => useContext(Ctx);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");

  const beginReveal = useCallback(() => {
    setPhase((p) => (p === "loading" ? "reveal" : p));
  }, []);

  const markReady = useCallback(() => {
    setPhase("ready");
  }, []);

  const value = useMemo(
    () => ({
      phase,
      loaded: phase !== "loading",
      done: phase === "ready",
      beginReveal,
      markReady,
    }),
    [phase, beginReveal, markReady],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
