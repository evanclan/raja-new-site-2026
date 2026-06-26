"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ————————————————————————————————————————————————————————
// DiveSeam — the wave divider straddling the Preschool↔Academy seam.
//
// A measurement target (`ref`, absolute inset-0) lives inside Academy so
// `useScroll` can track the seam crossing. The visible divider itself is
// a viewport-FIXED layer (escaping Academy's `overflow-hidden`, which
// would otherwise clip anything above the section's top edge), positioned
// so its VERTICAL MIDDLE sits exactly on the seam line — half above (over
// Preschool), half below (over Academy).
//
// Geometry: the seam (Academy top) travels from the bottom of the
// viewport (progress 0) to the top (progress 1) across one viewport
// height, so its viewport Y is (1 − p)·100vh — which we feed straight
// into the fixed layer's `top`.
//
// The divider is the COLOUR BRIDGE: its body gradients from ocean blue
// (Preschool's water) down into Academy's indigo, so the sky→sea hand-off
// flows. Thin blue, light-blue and white foam crest lines roll across the
// surface. Opacity is gated to the crossing so it never floats over other
// sections.
// ————————————————————————————————————————————————————————

// Tiling wave drawn from x=-600..2400 with a half-period of `half` (so a
// continuous translateX of one full period = 2·half loops seamlessly).
// `waveFill` closes to the bottom for the gradient body; `waveLine` is the
// open crest line for the thin strokes.
function waveFill(amp: number, base: number, bottom: number, half: number): string {
  let d = `M -600 ${base}`;
  let up = true;
  for (let x = -600; x < 2400; x += half) {
    d += ` Q ${x + half / 2} ${up ? base - amp : base + amp} ${x + half} ${base}`;
    up = !up;
  }
  return d + ` L 2400 ${bottom} L -600 ${bottom} Z`;
}
function waveLine(amp: number, base: number, half: number): string {
  let d = `M -600 ${base}`;
  let up = true;
  for (let x = -600; x < 2400; x += half) {
    d += ` Q ${x + half / 2} ${up ? base - amp : base + amp} ${x + half} ${base}`;
    up = !up;
  }
  return d;
}

// viewBox is 0 0 1200 200 (so the vertical middle = y100). Big amplitude +
// a shorter wavelength so the surface reads as real rolling waves rather
// than a flat line (the SVG is stretched with preserveAspectRatio="none",
// which compresses the vertical, so amp is deliberately large). The body
// and all three crest lines share the amplitude/wavelength so the lines
// ride the body's curve.
const HALF = 220; // half-period → wavelength 440
const AMP = 44;
const ROLL_X = 2 * HALF; // one full period — the seamless loop distance
const BODY_PATH = waveFill(AMP, 84, 200, HALF);
const DIVIDER_LINES = [
  { d: waveLine(AMP, 79, HALF), stroke: "rgba(255,255,255,0.95)", w: 2.5, dur: 10 }, // white foam
  { d: waveLine(AMP, 84, HALF), stroke: "#a6e3fb", w: 2, dur: 12 }, // thin light blue
  { d: waveLine(AMP, 89, HALF), stroke: "#0a6fb8", w: 2, dur: 14 }, // thin blue
];

// SSR-safe desktop flag — mirrors the useTategaki / useIsDesktop pattern.
// Default false so SSR and first client paint agree (mobile/static branch).
// Upgrades to true after mount on >=768px viewports.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isDesktop;
}

export function DiveSeam() {
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement | null>(null);

  // 0 = seam at viewport bottom · 1 = seam at viewport top.
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  // Visible across the crossing, clears at rest.
  const dividerOpacity = useTransform(p, [0.08, 0.3, 0.74, 0.95], [0, 1, 1, 0]);

  // Live VISUAL viewport height. Starts at 0 so the server and the first
  // client render agree (avoids a hydration mismatch — `window` doesn't
  // exist on the server); the effect fills it in after mount and keeps it
  // current. `visualViewport.height` is the real, URL-bar-aware height on
  // phones — exactly what the seam math needs.
  const [vh, setVh] = useState(0);
  useEffect(() => {
    const update = () =>
      setVh(window.visualViewport?.height ?? window.innerHeight);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  // Viewport Y of the seam line, fed straight into the fixed layer's top.
  //
  // With offset ["start end","start start"], Academy's top travels linearly
  // from the viewport BOTTOM (p=0) to the viewport TOP (p=1), so its viewport
  // Y is (1 − p) · viewportHeight. The fix vs the old code is using the LIVE
  // measured `vh` here instead of the CSS unit `100vh`: on phones `100vh` is
  // the tall (URL-bar-collapsed) viewport, so as the address bar showed/hid,
  // the old `(1 − p)·100vh` drifted off the real seam and jumped when the bar
  // snapped — the "weird" wobble. The measured visual-viewport height tracks
  // the real chrome, and `p` stays layout-accurate, so the wave stays glued
  // to the boundary on every device with no cached geometry to go stale.
  const seamTop = useTransform(p, (v) => `${(1 - v) * vh}px`);

  // Roll props — disabled under reduced motion. (Desktop only renders the
  // wave at all; see the mobile bail-out below.)
  const roll = (dur: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, -ROLL_X] as number[] },
          transition: { duration: dur, repeat: Infinity, ease: "linear" as const },
        };

  // The measurement target (`ref`) stays mounted on every breakpoint so
  // `useScroll` always has a hydrated DOM node — returning null here would
  // leave its target ref unattached and Framer would throw
  // "Target ref is defined but not hydrated". The VISIBLE wave, however, is
  // desktop-only: the fixed, scroll-driven divider tracked the seam poorly on
  // phones (the URL-bar show/hide kept nudging the visual viewport, so it
  // wobbled and sat off the boundary). On mobile we simply don't paint it —
  // the sky→sea colour change across the section gradients reads cleanly on
  // its own. `isDesktop` defaults false on SSR/first paint, so the mobile/
  // static branch is hydration-safe.
  return (
    <div ref={ref} className="absolute inset-0">
      {/* Fixed layer pinned to the seam's viewport position; the inner
          band is shifted up by half its height so its MIDDLE lands on the
          seam line, straddling both sections. Desktop only. */}
      {isDesktop && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 z-[35]"
          style={{ top: seamTop, opacity: dividerOpacity }}
        >
          <div className="absolute inset-x-0 h-24 -translate-y-1/2 md:h-32">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Colour bridge: ocean blue at the surface → Academy indigo
                    at the bottom, so the sky→sea hand-off flows. */}
                <linearGradient id="diveWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a3e6" />
                  <stop offset="42%" stopColor="#0a63b4" />
                  <stop offset="100%" stopColor="#2e3192" />
                </linearGradient>
              </defs>

              {/* Gradient body — the water, waving up from Academy's indigo. */}
              <motion.path d={BODY_PATH} fill="url(#diveWave)" {...roll(18)} />

              {/* Thin crest lines — white foam, light blue, blue. */}
              {DIVIDER_LINES.map((l, i) => (
                <motion.path
                  key={i}
                  d={l.d}
                  fill="none"
                  stroke={l.stroke}
                  strokeWidth={l.w}
                  {...roll(l.dur)}
                />
              ))}
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}
