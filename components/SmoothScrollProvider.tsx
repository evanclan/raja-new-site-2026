"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LenisCtx = {
  scrollTo: (
    target: string | number | HTMLElement,
    opts?: { immediate?: boolean }
  ) => void;
  /** Pause smooth scroll — lock the page behind a modal/lightbox. */
  stop: () => void;
  /** Resume smooth scroll after a modal closes. */
  start: () => void;
};

const Ctx = createContext<LenisCtx>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useSmoothScroll() {
  return useContext(Ctx);
}

/**
 * Lenis smooth scroll + GSAP ScrollTrigger directional snap.
 *
 * Why GSAP here: our previous hand-rolled snap had to guess "is the user
 * done scrolling yet?" from wheel deltas and timers. That worked on a fresh
 * mouse wheel but fought trackpad inertia, touch flings, and programmatic
 * scrollTo calls — sections sometimes refused to commit, or snapped twice.
 *
 * ScrollTrigger already solves this problem and ships a battle-tested
 * directional snap. We just need it to read/write scroll through Lenis
 * (via `scrollerProxy`) and to tick on Lenis' scroll events. Registering
 * ScrollTrigger here also unlocks it for scroll-linked animations across
 * the rest of the site (parallax, pinning, scrub) with zero extra setup.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    document.documentElement.classList.add("lenis", "lenis-smooth");

    // Keep ScrollTrigger in lock-step with Lenis' virtualized scroll.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so the whole page runs on one rAF.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Teach ScrollTrigger how to read/write scroll through Lenis.
    // The setter is used by ScrollTrigger's snap tween — we bypass Lenis
    // smoothing there (`immediate`) because ScrollTrigger does its own
    // easing; otherwise the two curves would compound.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true, force: true });
          return value;
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Compute each section's scroll-progress position. Using offsetTop
    // (not index * vh) means sections taller than the viewport still
    // snap cleanly to their own top. Returns null when the current page
    // has no (or a single) snap section — e.g. the /news/* article routes,
    // which are plain long-scroll documents and must NOT be snapped.
    const sectionProgress = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-snap-section]")
      );
      const max = ScrollTrigger.maxScroll(window);
      // Need at least two anchors for snapping to be meaningful. With zero
      // sections the old code returned [0], which snapped every scroll back
      // to the top of the page — breaking ordinary scrolling on article pages.
      if (max <= 0 || sections.length < 2) return null;
      // Use each section's TRUE document position. offsetTop is relative to
      // the nearest *positioned* ancestor — which is WRONG for any section
      // wrapped in a GSAP pin-spacer (e.g. Intro's CloudTheater pin): there
      // offsetTop collapses to ~0 and both corrupts that section's target and
      // injects a phantom snap point at the top of the page. rect.top + scrollY
      // is immune to offsetParent, so every target is correct under pinning.
      const scrollY = window.scrollY;
      return sections
        .map((s) => (s.getBoundingClientRect().top + scrollY) / max)
        .map((p) => Math.max(0, Math.min(1, p)));
    };

    // Section snapping is a DESKTOP-with-a-mouse affordance only. On touch
    // devices, full-viewport per-section snapping fights finger momentum:
    // you scroll down to read the lower half of a tall stacked section
    // (Academy onward, where the mobile columns stack taller than the
    // screen), pause — and the directional snap yanks you to the next
    // section's top. So we gate the whole snap behind a fine pointer + wide
    // viewport, and rebuild it if that changes (mouse plugged in, window
    // dragged across the breakpoint, tablet rotated).
    const snapMQ = window.matchMedia("(min-width: 768px) and (pointer: fine)");

    let snapTrigger: ScrollTrigger | null = null;
    const buildSnap = () => {
      snapTrigger?.kill();
      snapTrigger = null;
      if (prefersReducedMotion || !snapMQ.matches) return;
      snapTrigger = ScrollTrigger.create({
        id: "page-section-snap",
        trigger: document.body,
        start: 0,
        end: "max",
        snap: {
          snapTo: (value) => {
            const positions = sectionProgress();
            // No snap targets on this page → leave the scroll position
            // untouched (returning the incoming progress is a no-op snap).
            if (!positions) return value;
            return gsap.utils.snap(positions, value);
          },
          // Wait briefly after the user stops — long enough to not
          // interrupt them, short enough to feel intentional.
          delay: 0.08,
          duration: { min: 0.25, max: 0.7 },
          ease: "power2.out",
          directional: true,
          inertia: false,
        },
      });
    };
    buildSnap();
    snapMQ.addEventListener("change", buildSnap);

    // Recompute after fonts/images/dynamic content settle so the snap
    // positions match the final layout.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // ——— Resize / orientation: keep ScrollTrigger + snap in sync ———
    // Lenis 1.3 self-handles its own scroll-length recompute (internal
    // ResizeObserver + window 'resize'), so we never call lenis.resize().
    // But ScrollTrigger's start/end, every scrubbed Section cross-fade,
    // the parallax ranges, and the snap offsetTop positions are resolved
    // at refresh() time from document.body geometry — stale after any
    // viewport change. We gate on WIDTH so iOS Safari's URL-bar collapse
    // (a height-only "resize" fired on every scroll) doesn't yank the
    // user mid-scroll, and debounce so a drag-resize refreshes just once.
    //
    // The root font-size now also keys on viewport HEIGHT (see the height
    // guard in globals.css), so a desktop window height-drag changes every
    // section's height and the snap/fade measurements go stale. We therefore
    // also refresh on a *large* height change (>80px) — but only on wide
    // viewports (innerWidth >= 768). That preserves the mobile URL-bar
    // exclusion (phones are narrow, and the guard never engages there) while
    // keeping desktop live-resize correct.
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const widthChanged = w !== lastW;
      const heightChanged = w >= 768 && Math.abs(h - lastH) > 80;
      if (!widthChanged && !heightChanged) return;
      lastW = w;
      lastH = h;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      clearTimeout(resizeTimer);
      snapMQ.removeEventListener("change", buildSnap);
      snapTrigger?.kill();
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  const scrollTo: LenisCtx["scrollTo"] = (target, opts) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const duration = opts?.immediate ? 0 : 1.2;
    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target);
      if (!el) return;
      lenis.scrollTo(el, { duration });
    } else {
      lenis.scrollTo(target as number | HTMLElement, { duration });
    }
  };

  const stop = () => lenisRef.current?.stop();
  const start = () => lenisRef.current?.start();

  return (
    <Ctx.Provider value={{ scrollTo, stop, start }}>{children}</Ctx.Provider>
  );
}
