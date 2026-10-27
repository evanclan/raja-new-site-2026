"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Pins the hero so the page slides up over it like a sheet (after
// shin-ei-animation.jp). The hero itself is untouched.
//
// A hero taller than the screen scrolls normally until its BOTTOM reaches
// the bottom of the screen, then pins there (top = screen − hero), so its
// lower row of badges is always seen before the sheet covers it.
//
// Snap: a stuck element reports its top as "wherever you are", which would
// hand the section snap a moving target. So the hero's snap point moves to
// an invisible marker spanning the hero's real height at the top of the page
// (the snap adds a second stop for anything taller than the screen).
export function PinnedHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ top: 0, height: 0 });

  useEffect(() => {
    document.getElementById("hero")?.removeAttribute("data-snap-section");
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      setGeo({ top: Math.min(0, window.innerHeight - h), height: h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div data-snap-section aria-hidden className="pointer-events-none absolute left-0 top-0 w-px" style={{ height: geo.height }} />
      <div ref={ref} className="sticky z-0" style={{ top: geo.top }}>
        {children}
      </div>
    </>
  );
}

/** The sheet that slides over the pinned hero: a lifted top edge. */
export function OverHero({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 overflow-hidden rounded-t-[clamp(20px,3vw,36px)] shadow-[0_-18px_50px_rgba(10,12,30,0.35)]">
      {children}
    </div>
  );
}
