"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  window.addEventListener("orientationchange", cb);
  return () => {
    window.removeEventListener("resize", cb);
    window.removeEventListener("orientationchange", cb);
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Live, resize-subscribed parallax distance in px. Scales with viewport
 * HEIGHT so the travel tracks how much of a section actually scrolls past,
 * clamped to a sane range. Use to drive Framer `useTransform` ranges (which
 * need numbers, not CSS vars):
 *
 *   const p = useParallaxPx();
 *   const y = useTransform(scrollYProgress, [0, 1], [p, -p]);
 *
 * It re-reads on resize/orientationchange, so ranges never go stale.
 */
export function useParallaxPx(vhFraction = 0.06, min = 32, max = 96) {
  return useSyncExternalStore(
    subscribe,
    () => clamp(window.innerHeight * vhFraction, min, max),
    () => min // SSR fallback
  );
}

/**
 * Resolve a rem value to px against the CURRENT root font-size. Our root
 * font-size is fluid, so this returns a viewport-appropriate px value —
 * use it for GSAP numeric APIs (`quickTo`, `"+=" ` tweens) that can't take
 * a CSS-var string. Call at animation setup time so it reads the live root
 * size. Falls back to rem*16 on the server.
 */
export function remPx(rem: number) {
  if (typeof window === "undefined") return rem * 16;
  const root =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return rem * root;
}
