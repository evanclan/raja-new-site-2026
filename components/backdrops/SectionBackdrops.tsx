"use client";

/**
 * Section Backdrops — five themed, full-bleed decorative layers
 * keyed to the five navigation-SVG cards on the hero row.
 *
 * Palette policy
 * --------------
 * Each backdrop uses ONLY colours actually present in its
 * corresponding SVG card, so the section feels like the world
 * the card came from:
 *
 *   · Study Abroad  → white + green       (kaeruryugaku.svg)
 *   · Academy       → dark royal indigo   (academy.svg, #2e3192)
 *   · Preschool     → ocean cyan/blue     (preschool.svg, #00aeef)
 *   · Clab          → violet + green + pink pastels (clab.svg)
 *   · English       → orange + green       (letsgoenglish.svg)
 *
 * Technical contract (all backdrops)
 * ----------------------------------
 * - `absolute inset-0 pointer-events-none overflow-hidden` layer.
 * - Sits at `z-0` (content column is `z-[1]` in PanelShell).
 * - Compositions are CSS gradients + inline SVG paths, so each
 *   backdrop ships as a handful of KBs.
 * - Motion stays low-amplitude; `prefers-reduced-motion` is
 *   honoured globally in `globals.css`.
 */

import { motion, useReducedMotion } from "framer-motion";

// ————————————————————————————————————————————————————————
// Shared helpers
// ————————————————————————————————————————————————————————

const BackdropFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    {children}
  </div>
);

/** Soft radial blob — the workhorse ambient "glow" shape. */
function Glow({
  x,
  y,
  size,
  color,
  opacity = 0.6,
  blur = 60,
  delay = 0,
}: {
  x: string;
  y: string;
  size: string;
  color: string;
  opacity?: number;
  blur?: number;
  delay?: number;
}) {
  return (
    <motion.span
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1.05, 0.9] }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// ————————————————————————————————————————————————————————
// 1. Study Abroad — Kaeru Ryugaku (蛙留学)
//    Base palette is the green of the kaeru (frog) mascot, with
//    rainbow "confetti" in the six frame colours pulled directly
//    from /kaeruryugaku/home-assets/final.svg (#569ecc, #b15896,
//    #7db852, #e4703d, #3d5ca0, #61358b) — the same six-colour
//    stamp dots that scatter above the Logo.svg frog. The sheet
//    feels like a passport/brochure stage for the visual's
//    six-panel brochure.
// ————————————————————————————————————————————————————————

// Stamp-dot field — tuned to read like the confetti scatter at
// the top of Logo.svg. We reuse the exact six frame colours from
// final.svg so the backdrop and the visual feel like the same
// world. A few greens are kept as "home" accents.
const KAERU_STAMPS = [
  { c: "#569ecc", x: "7%", y: "16%", s: 14 }, // sky-blue — final.svg cls-4
  { c: "#b15896", x: "22%", y: "70%", s: 11 }, // pink — cls-5
  { c: "#7db852", x: "14%", y: "38%", s: 10 }, // green — cls-3
  { c: "#e4703d", x: "82%", y: "22%", s: 12 }, // orange — cls-6
  { c: "#3d5ca0", x: "90%", y: "60%", s: 9 }, // navy — cls-7
  { c: "#61358b", x: "76%", y: "84%", s: 11 }, // purple — cls-2
  { c: "#569ecc", x: "34%", y: "88%", s: 9 },
  { c: "#b15896", x: "62%", y: "12%", s: 8 },
  { c: "#7db852", x: "48%", y: "54%", s: 7 },
  { c: "#e4703d", x: "94%", y: "40%", s: 7 },
  { c: "#3d5ca0", x: "6%", y: "52%", s: 8 },
  { c: "#61358b", x: "68%", y: "44%", s: 9 },
  { c: "#2bb673", x: "30%", y: "22%", s: 6 }, // kaeru emerald accent
  { c: "#80c350", x: "58%", y: "76%", s: 6 },
];

export function StudyAbroadBackdrop() {
  return (
    <BackdropFrame>
      {/* Ivory passport-paper base with a soft green wash at the
          bottom-right — like light filtering through leaves. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 70% at 100% 100%, rgba(128,195,80,0.45) 0%, rgba(128,195,80,0) 60%)",
        }}
      />

      {/* Confetti stamps — scattered like passport stamps across
          the sheet, in the six brochure colours plus two kaeru
          greens, floating gently so the page feels alive.
          Hidden on mobile: reads as random specks on a small screen. */}
      <div className="absolute inset-0 max-md:hidden">
        {KAERU_STAMPS.map((d, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: d.x,
              top: d.y,
              width: d.s,
              height: d.s,
              background: d.c,
              boxShadow: `0 4px 12px ${d.c}55`,
            }}
            initial={{ y: 0, opacity: 0 }}
            whileInView={{ opacity: 0.85 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: {
                duration: 4 + (i % 5) * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              },
              opacity: { duration: 0.9, delay: 0.1 + i * 0.05 },
            }}
          />
        ))}
      </div>

      {/* Ambient colour blooms — one soft radial glow in each of
          the six brochure colours, anchored at the corners so the
          sheet breathes rather than sitting flat. Kept very
          low-opacity so the green kaeru base still leads. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(28% 22% at 12% 16%, rgba(86,158,204,0.28) 0%, transparent 70%), radial-gradient(26% 20% at 88% 18%, rgba(228,112,61,0.22) 0%, transparent 70%), radial-gradient(30% 22% at 86% 82%, rgba(97,53,139,0.22) 0%, transparent 70%), radial-gradient(28% 22% at 14% 82%, rgba(177,88,150,0.22) 0%, transparent 70%), radial-gradient(34% 24% at 50% 6%, rgba(61,92,160,0.16) 0%, transparent 70%)",
        }}
      />

      {/* A few leaf silhouettes — quiet nods to foliage so the
          palette doesn't read as "just dots on paper".
          Hidden on mobile: too small to read at 375px. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {[
          { x: 140, y: 140, r: -18, c: "#80c350" },
          { x: 1050, y: 640, r: 22, c: "#2bb673" },
          { x: 220, y: 620, r: -32, c: "#8acc9c" },
        ].map((l, i) => (
          <motion.path
            key={i}
            d={`M ${l.x} ${l.y} C ${l.x + 30} ${l.y - 40}, ${l.x + 70} ${l.y - 30}, ${l.x + 90} ${l.y + 10} C ${l.x + 60} ${l.y + 20}, ${l.x + 20} ${l.y + 30}, ${l.x} ${l.y} Z`}
            fill={l.c}
            style={{
              opacity: 0.22,
              transformOrigin: `${l.x + 45}px ${l.y}px`,
              transform: `rotate(${l.r}deg)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.22 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.2 }}
          />
        ))}
      </svg>

      {/* Paper-stock grain. Hidden on mobile: noise at small size. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply max-md:hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(32,35,58,0.8) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
    </BackdropFrame>
  );
}

// ————————————————————————————————————————————————————————
// 2. Academy — DARK ROYAL INDIGO  ·  concept: DEEP OCEAN
//    Same palette the client loves (academy.svg colours):
//      · #2e3192 / #4f56be  deep royal indigo  → the water body
//      · #2f4c70            navy               → deep-water shade
//      · #008ad0            cyan               → sunlit shallows
//      · #9099c4            periwinkle         → drifting light
//      · #f99e49            amber              → warm sun-glints
//    The concept is no longer a starfield/constellation but a
//    sub-surface ocean: sunlight god-rays shafting down from the
//    surface, slow caustic shimmer, marine particles drifting in
//    the current, and bubbles rising to the light.
// ————————————————————————————————————————————————————————

// Marine-snow / plankton motes — what used to be "stars" are now
// suspended particles drifting in the current. Same scatter, but
// they slide laterally and bob rather than twinkle in place.
const ACADEMY_MOTES = [
  { x: 140, y: 120, s: 2.2 },
  { x: 380, y: 80, s: 1.6 },
  { x: 680, y: 160, s: 2.8 },
  { x: 940, y: 90, s: 1.8 },
  { x: 1120, y: 200, s: 2.4 },
  { x: 240, y: 320, s: 1.4 },
  { x: 520, y: 260, s: 2.0 },
  { x: 820, y: 360, s: 1.6 },
  { x: 1080, y: 440, s: 2.2 },
  { x: 160, y: 560, s: 1.8 },
  { x: 420, y: 620, s: 2.6 },
  { x: 720, y: 520, s: 1.4 },
  { x: 980, y: 680, s: 2.0 },
  { x: 1160, y: 720, s: 1.6 },
  { x: 60, y: 380, s: 1.4 },
];

// Rising bubbles — column + size + timing, drifting up to the surface.
const ACADEMY_BUBBLES = [
  { x: "12%", y: "92%", s: 10, d: 0 },
  { x: "26%", y: "84%", s: 6, d: 1.6 },
  { x: "44%", y: "96%", s: 13, d: 0.8 },
  { x: "58%", y: "88%", s: 7, d: 2.4 },
  { x: "72%", y: "94%", s: 9, d: 1.1 },
  { x: "86%", y: "82%", s: 5, d: 3.0 },
  { x: "34%", y: "74%", s: 8, d: 2.0 },
  { x: "66%", y: "70%", s: 6, d: 0.4 },
];

// Fish silhouette — a clean teardrop body + tail wedge (no detail, so
// it reads as a refined silhouette gliding in the current, not a cartoon).
// Drawn nose-right in a ~44-wide local box; direction is set by flipping
// scaleX, size by a uniform scale = px / 44.
const FISH_PATH =
  "M6 12 Q 18 3 34 9 Q 40 11 42 12 Q 40 13 34 15 Q 18 21 6 12 Z M6 12 L -2 6 L 1 12 L -2 18 Z";

type FishDef = {
  id: string;
  y: number; // vertical band in the 0..800 viewBox
  size: number; // body length in viewBox units
  dir: 1 | -1; // swim direction (1 → right, -1 → left)
  op: number; // depth opacity
  fill: string;
  driftDur: number; // seconds to cross the water
  bob: number; // vertical bob amplitude
  bobDur: number;
  delay: number;
  restX: number; // static placement when reduced-motion
};

// Two loose schools in the UPPER water + a couple of faint strays in the
// mid water at the edges — kept clear of the copy (left) and the
// graduation faces (right).
const ACADEMY_FISH_BACK: FishDef[] = [
  { id: "F1", y: 150, size: 34, dir: 1, op: 0.2, fill: "#141652", driftDur: 38, bob: 10, bobDur: 6, delay: 0, restX: 300 },
  { id: "F2", y: 185, size: 28, dir: 1, op: 0.18, fill: "#141652", driftDur: 40, bob: 12, bobDur: 7, delay: 1.2, restX: 640 },
  { id: "F4", y: 128, size: 30, dir: 1, op: 0.19, fill: "#141652", driftDur: 42, bob: 9, bobDur: 6.5, delay: 2.0, restX: 900 },
  { id: "F5", y: 300, size: 22, dir: -1, op: 0.12, fill: "#141652", driftDur: 52, bob: 6, bobDur: 8, delay: 0.8, restX: 980 },
  { id: "F6", y: 340, size: 20, dir: -1, op: 0.12, fill: "#141652", driftDur: 54, bob: 7, bobDur: 8.5, delay: 1.6, restX: 220 },
];

const ACADEMY_FISH_FRONT: FishDef[] = [
  { id: "F3", y: 215, size: 44, dir: 1, op: 0.32, fill: "#0c0e36", driftDur: 32, bob: 8, bobDur: 5.5, delay: 0.5, restX: 480 },
  { id: "F7", y: 92, size: 40, dir: 1, op: 0.3, fill: "#0c0e36", driftDur: 30, bob: 9, bobDur: 5, delay: 2.6, restX: 140 },
];

function Fish({ f, reduce }: { f: FishDef; reduce: boolean }) {
  const k = f.size / 44;
  const scale = `scale(${f.dir * k} ${k})`;

  // Reduced motion → a still fish placed on-screen at its rest position.
  if (reduce) {
    return (
      <g transform={`translate(${f.restX} ${f.y})`} opacity={f.op}>
        <g transform={scale}>
          <path d={FISH_PATH} fill={f.fill} />
        </g>
      </g>
    );
  }

  // Glide fully across and off the far edge; opacity fades in/out at the
  // edges (synced to the drift) so the loop reset is never visible.
  const startX = f.dir > 0 ? -90 : 1290;
  const endX = f.dir > 0 ? 1320 : -120;
  return (
    <g transform={`translate(0 ${f.y})`}>
      <motion.g
        initial={{ opacity: 0 }}
        animate={{
          x: [startX, endX],
          opacity: [0, f.op, f.op, f.op, 0],
          y: [0, -f.bob, 0, f.bob, 0],
          rotate: [-2.5, 2.5, -2.5],
        }}
        transition={{
          x: { duration: f.driftDur, repeat: Infinity, ease: "linear", delay: f.delay },
          opacity: {
            duration: f.driftDur,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.06, 0.5, 0.94, 1],
            delay: f.delay,
          },
          y: { duration: f.bobDur, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: f.bobDur * 0.95, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <g transform={scale}>
          <path d={FISH_PATH} fill={f.fill} />
        </g>
      </motion.g>
    </g>
  );
}

export function AcademyBackdrop() {
  const reduce = useReducedMotion() ?? false;
  return (
    <BackdropFrame>
      {/* Water column — sunlit royal-indigo near the surface up
          top, darkening into an inky navy-black in the deep at the
          bottom. Same indigo the client approved, re-read as the
          body of water itself. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(79,86,190,0.55) 0%, rgba(46,49,146,0.7) 42%, rgba(20,24,82,0.85) 78%, rgba(12,14,54,0.95) 100%), radial-gradient(120% 70% at 50% -20%, rgba(0,138,208,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Ambient glows — cyan + periwinkle near the surface, navy
          + amber in the deep, drifting like diffuse underwater light. */}
      <Glow x="-8%" y="-6%" size="48vw" color="#008ad0" opacity={0.35} />
      <Glow x="60%" y="-10%" size="42vw" color="#9099c4" opacity={0.3} delay={2} />
      <Glow x="62%" y="64%" size="44vw" color="#f99e49" opacity={0.16} delay={4} blur={90} />
      <Glow x="-10%" y="60%" size="42vw" color="#2f4c70" opacity={0.55} delay={6} />

      {/* Deep-sea life — a far/mid school gliding through the upper
          water, rendered BEHIND the god-rays so the light shafts pass
          in front of them. Navy silhouettes, faint with depth.
          Hidden on mobile: creatures are invisible/clipped behind stacked content. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {ACADEMY_FISH_BACK.map((f) => (
          <Fish key={f.id} f={f} reduce={reduce} />
        ))}
      </svg>

      {/* God-rays — shafts of sunlight slanting down from the
          surface. Soft cyan/periwinkle gradients, each breathing
          on its own slow cycle and skewing gently like light
          refracting through a moving surface.
          Hidden on mobile: vw-width shafts don't render well at 375px. */}
      <div
        className="absolute inset-x-0 top-0 h-full overflow-hidden max-md:hidden"
        style={{
          maskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
        }}
      >
        {[
          { left: "12%", w: "13vw", c: "rgba(0,138,208,0.30)", rot: -10, dur: 9, delay: 0 },
          { left: "30%", w: "9vw", c: "rgba(144,153,196,0.26)", rot: -6, dur: 11, delay: 1.5 },
          { left: "52%", w: "15vw", c: "rgba(255,255,255,0.16)", rot: -8, dur: 10, delay: 0.8 },
          { left: "70%", w: "10vw", c: "rgba(0,138,208,0.24)", rot: -5, dur: 12, delay: 2.2 },
          { left: "85%", w: "8vw", c: "rgba(249,158,73,0.14)", rot: -9, dur: 13, delay: 1.1 },
        ].map((r, i) => (
          <motion.span
            key={i}
            className="absolute top-[-12%] h-[130%] origin-top"
            style={{
              left: r.left,
              width: r.w,
              background: `linear-gradient(180deg, ${r.c} 0%, transparent 75%)`,
              filter: "blur(8px)",
              transform: `rotate(${r.rot}deg)`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={{
              opacity: [0.5, 0.95, 0.5],
              scaleX: [1, 1.15, 1],
            }}
            transition={{
              duration: r.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: r.delay,
            }}
          />
        ))}
      </div>

      {/* Drifting marine particles — the old "stars" now suspended
          in the water, sliding sideways and bobbing with the
          current instead of twinkling in place.
          Hidden on mobile: tiny specks are noise on a small screen. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {ACADEMY_MOTES.map((m, i) => (
          <motion.circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.s}
            fill={i % 5 === 0 ? "#f99e49" : i % 3 === 0 ? "#9099c4" : "#cfe6f5"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={{
              opacity: [0.25, 0.7, 0.25],
              x: [0, (i % 2 ? 18 : -18), 0],
              y: [0, (i % 3 ? -12 : 14), 0],
            }}
            transition={{
              duration: 9 + (i % 5) * 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.25,
            }}
            style={{
              filter: `drop-shadow(0 0 ${m.s * 1.6}px ${i % 5 === 0 ? "#f99e49" : "#9bd3f0"})`,
            }}
          />
        ))}
      </svg>

      {/* Caustics — the rippling lattice of light cast on the
          sea floor. A wavy grid, gently sliding, masked to read
          strongest in the upper-middle where the light pools.
          Hidden on mobile: invisible behind stacked content. */}
      <motion.div
        className="absolute inset-0 opacity-[0.12] max-md:hidden"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 30% 20%, rgba(180,225,250,0.5) 0 2px, transparent 2px 26px), repeating-radial-gradient(circle at 75% 35%, rgba(0,138,208,0.45) 0 2px, transparent 2px 32px)",
          maskImage:
            "radial-gradient(ellipse at 50% 25%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 25%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
        }}
        animate={{ backgroundPosition: ["0px 0px, 0px 0px", "26px 14px, -32px 18px", "0px 0px, 0px 0px"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slow ocean current — broad undulating bands anchored to the
          section floor (bottom 0) and rising into the mid-water, in
          navy + cyan, phasing against each other so the whole column
          feels like it's gently flowing.
          Hidden on mobile: clipped by stacked content layout. */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[55%] w-full max-md:hidden"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        fill="none"
      >
        {[
          { c: "#2f4c70", o: 0.4, y: 180, amp: 46 },
          { c: "#008ad0", o: 0.22, y: 260, amp: 54 },
          { c: "#9099c4", o: 0.2, y: 340, amp: 40 },
        ].map((w, i) => (
          <motion.path
            key={i}
            fill={w.c}
            style={{ opacity: w.o, filter: "blur(2px)" }}
            animate={{
              d: [
                `M 0 ${w.y} Q 300 ${w.y - w.amp} 600 ${w.y} T 1200 ${w.y} L 1200 500 L 0 500 Z`,
                `M 0 ${w.y} Q 300 ${w.y + w.amp} 600 ${w.y} T 1200 ${w.y} L 1200 500 L 0 500 Z`,
                `M 0 ${w.y} Q 300 ${w.y - w.amp} 600 ${w.y} T 1200 ${w.y} L 1200 500 L 0 500 Z`,
              ],
            }}
            transition={{
              duration: 12 + i * 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
      </svg>

      {/* Near fish — a couple of larger, darker silhouettes passing IN
          FRONT of the god-rays, giving the water real depth.
          Hidden on mobile: invisible/clipped behind stacked content. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {ACADEMY_FISH_FRONT.map((f) => (
          <Fish key={f.id} f={f} reduce={reduce} />
        ))}
      </svg>

      {/* A single jellyfish drifting at the far-left margin — periwinkle
          and faint, so it sits quietly behind the copy column. Bell
          pulses while the whole body slowly rises and sinks.
          Hidden on mobile: clipped behind stacked content. */}
      <motion.svg
        className="absolute left-[4%] top-[13%] h-24 w-16 md:h-28 md:w-20 max-md:hidden"
        viewBox="0 0 60 110"
        fill="none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.18 }}
        viewport={{ once: true, amount: 0.1 }}
        animate={reduce ? undefined : { y: [0, -26, 0] }}
        transition={
          reduce ? undefined : { y: { duration: 14, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <motion.path
          d="M6 34 Q 30 -6 54 34 Q 54 47 30 44 Q 6 47 6 34 Z"
          fill="#9099c4"
          style={{ transformOrigin: "30px 34px" }}
          animate={reduce ? undefined : { scaleY: [1, 0.86, 1] }}
          transition={
            reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {[16, 24, 30, 36, 44].map((x, i) => (
          <path
            key={i}
            d={`M${x} 44 Q ${x + (i % 2 ? 5 : -5)} 72 ${x} 98`}
            stroke="#9099c4"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
          />
        ))}
      </motion.svg>

      {/* Kelp — two fronds rooted in the bottom corners, swaying from
          their base with the current. Clear of the copy and the photo.
          Hidden on mobile: below stacked content, not visible. */}
      <div className="max-md:hidden">
      {[
        { side: "left-[2%]", blades: [-3, 4], delay: 0 },
        { side: "right-[2%]", blades: [3, -4], delay: 1.2 },
      ].map((kp, ki) => (
        <svg
          key={ki}
          className={`absolute bottom-0 ${kp.side} h-[32%] w-16`}
          viewBox="0 0 40 200"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
        >
          {kp.blades.map((sway, bi) => (
            <motion.path
              key={bi}
              d={`M${20 + bi * 6} 200 C ${8 + bi * 6} 150 ${32 + bi * 6} 110 ${16 + bi * 6} 70 C ${6 + bi * 6} 44 ${26 + bi * 6} 20 ${20 + bi * 6} 2`}
              stroke="#2f4c70"
              strokeWidth={6 - bi}
              strokeLinecap="round"
              fill="none"
              style={{ transformOrigin: "20px 200px", filter: "blur(1px)", opacity: 0.3 }}
              animate={reduce ? undefined : { rotate: [sway, -sway, sway] }}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 8 + bi * 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: kp.delay + bi * 0.4,
                    }
              }
            />
          ))}
        </svg>
      ))}
      </div>

      {/* Rising bubbles — small glassy spheres climbing toward the
          surface and fading as they thin into the light.
          Hidden on mobile: lost in stacked single-column layout. */}
      <div className="max-md:hidden">
        {ACADEMY_BUBBLES.map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.x,
              top: b.y,
              width: b.s,
              height: b.s,
              background:
                "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9) 0%, rgba(155,211,240,0.3) 40%, rgba(0,138,208,0.06) 80%)",
              border: "1px solid rgba(207,230,245,0.45)",
            }}
            initial={{ y: 0, opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true, amount: 0.2 }}
            animate={{ y: [0, -220, -440], opacity: [0, 0.75, 0] }}
            transition={{
              duration: 10 + (i % 4) * 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: b.d,
            }}
          />
        ))}
      </div>
    </BackdropFrame>
  );
}

// ————————————————————————————————————————————————————————
// 3. Preschool — PURE SKY  ·  concept: the open sky
//    Same cyan card palette the client loves (#00aeef ocean cyan
//    re-read as a bright daytime sky), with supporting tints
//    #b8e8fa / #4bc6ef and the deep #005baa at the very bottom —
//    the horizon that sets up the dive into the Academy sea.
//    The scene is now SKY ONLY: a warm sun with soft god-rays,
//    layered drifting clouds at three depths, floating light
//    motes, a far-off bird pair, and a single paper-plane. The
//    ocean swells + underwater bubbles are gone (they belonged to
//    the old "classroom by the sea" reading and now live in the
//    dive transition instead).
// ————————————————————————————————————————————————————————

// One reusable puffy-cloud silhouette (circle cluster + base bar),
// reused across every cloud — size/opacity/blur vary by depth tier.
// Exported so the Intro "cloud theater" transition reuses the EXACT same
// silhouette — that shared shape is what makes the clouds→sky hand-off into
// Preschool read as one continuous sky rather than a swap.
export const CLOUD_SHAPE = (
  <>
    <circle cx="60" cy="70" r="36" />
    <circle cx="100" cy="52" r="42" />
    <circle cx="150" cy="64" r="36" />
    <circle cx="180" cy="78" r="28" />
    <rect x="50" y="70" width="140" height="30" rx="15" />
  </>
);

// Five clouds across three depth tiers. Near = larger, more opaque,
// crisper, faster bob; far = smaller, fainter, blurrier, slower. All
// kept in the TOP band so they clear the copy (right) and child photo
// (left). Drift is a slow lateral sway; bob is a gentle vertical lilt.
// hideMobile: true → smaller/far clouds hidden on <768px; keep the 2 nearest.
const SKY_CLOUDS = [
  { cls: "left-[4%] top-[7%] h-20 w-44 md:h-28 md:w-64", op: 0.9, blur: 0.5, bob: [0, -8, 0], drift: [0, 40, 0], bobDur: 7, driftDur: 38, delay: 0, hideMobile: false },
  { cls: "left-[54%] top-[5%] h-16 w-40 md:h-24 md:w-52", op: 0.72, blur: 1, bob: [0, 10, 0], drift: [0, -30, 0], bobDur: 8.5, driftDur: 46, delay: 0.6, hideMobile: true },
  { cls: "left-[74%] top-[13%] h-12 w-28 md:h-16 md:w-36", op: 0.5, blur: 2, bob: [0, -6, 0], drift: [0, 26, 0], bobDur: 10, driftDur: 60, delay: 1.2, hideMobile: true },
  { cls: "left-[30%] top-[16%] h-16 w-44 md:h-24 md:w-56", op: 0.8, blur: 0.6, bob: [0, 7, 0], drift: [0, 34, 0], bobDur: 9, driftDur: 52, delay: 0.3, hideMobile: false },
  { cls: "right-[3%] top-[4%] h-10 w-24 md:h-14 md:w-32", op: 0.45, blur: 2, bob: [0, -5, 0], drift: [0, -22, 0], bobDur: 11, driftDur: 66, delay: 1.8, hideMobile: true },
];

// Floating light motes (pollen / sun-specks) drifting in the upper-right
// sky. A few warm ones (#fff5c9) among the white.
const SKY_MOTES = [
  { x: 700, y: 90, r: 2.4, warm: true },
  { x: 860, y: 150, r: 1.8, warm: false },
  { x: 980, y: 110, r: 2.0, warm: false },
  { x: 1080, y: 200, r: 2.6, warm: true },
  { x: 760, y: 240, r: 1.6, warm: false },
  { x: 930, y: 290, r: 2.2, warm: false },
  { x: 1140, y: 300, r: 1.6, warm: true },
];

export function PreschoolBackdrop() {
  const reduce = useReducedMotion() ?? false;
  return (
    <BackdropFrame>
      {/* Sky wash — bright cyan up top, deepening toward the horizon,
          with a warm sun-glow bleeding through the top-right. The deep
          blue at the very bottom is the horizon we dive through. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(184,232,250,0.85) 0%, rgba(75,198,239,0.45) 48%, rgba(0,91,170,0.45) 100%), radial-gradient(60% 40% at 85% 10%, rgba(255,236,95,0.32) 0%, transparent 60%)",
        }}
      />

      {/* Sun — a warm disc in the top-right, breathing gently. */}
      <motion.div
        className="absolute right-[12%] top-[6%] h-24 w-24 rounded-full md:h-32 md:w-32"
        style={{
          background:
            "radial-gradient(circle, #fff5c9 0%, rgba(255,236,95,0.6) 45%, transparent 72%)",
          filter: "blur(3px)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.9, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
        transition={
          reduce ? undefined : { scale: { duration: 7, repeat: Infinity, ease: "easeInOut" } }
        }
      />

      {/* Sun god-rays — soft warm shafts fanning down-left from the sun,
          masked so they fade out long before the copy/photo.
          Hidden on mobile: vw-width shafts don't scale to 375px well. */}
      <div
        aria-hidden
        className="absolute inset-0 max-md:hidden"
        style={{
          maskImage:
            "linear-gradient(165deg, black 0%, black 36%, transparent 76%)",
          WebkitMaskImage:
            "linear-gradient(165deg, black 0%, black 36%, transparent 76%)",
        }}
      >
        {[
          { left: "78%", w: "7vw", rot: -8, dur: 10, delay: 0 },
          { left: "70%", w: "9vw", rot: -14, dur: 12, delay: 1.5 },
          { left: "62%", w: "6vw", rot: -20, dur: 13, delay: 0.8 },
          { left: "54%", w: "8vw", rot: -26, dur: 15, delay: 2.2 },
        ].map((r, i) => (
          <motion.span
            key={i}
            className="absolute top-[-10%] h-[120%] origin-top"
            style={{
              left: r.left,
              width: r.w,
              background:
                "linear-gradient(180deg, rgba(255,245,201,0.18) 0%, transparent 72%)",
              filter: "blur(10px)",
              transform: `rotate(${r.rot}deg)`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4], scaleX: [1, 1.12, 1] }}
            transition={
              reduce
                ? undefined
                : { duration: r.dur, repeat: Infinity, ease: "easeInOut", delay: r.delay }
            }
          />
        ))}
      </div>

      {/* Cloud layers — five puffy clouds across three depth tiers,
          drifting and bobbing low and slow in the top band.
          Far/small clouds hidden on mobile (hideMobile flag). */}
      {SKY_CLOUDS.map((c, i) => (
        <motion.svg
          key={i}
          className={`absolute ${c.cls}${c.hideMobile ? " max-md:hidden" : ""}`}
          viewBox="0 0 240 120"
          fill="#ffffff"
          style={{
            filter: `blur(${c.blur}px) drop-shadow(0 8px 14px rgba(0,91,170,0.42))`,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: c.op }}
          viewport={{ once: true, amount: 0.2 }}
          animate={reduce ? undefined : { x: c.drift, y: c.bob }}
          transition={
            reduce
              ? undefined
              : {
                  x: { duration: c.driftDur, repeat: Infinity, ease: "easeInOut", delay: c.delay },
                  y: { duration: c.bobDur, repeat: Infinity, ease: "easeInOut", delay: c.delay },
                }
          }
        >
          {CLOUD_SHAPE}
        </motion.svg>
      ))}

      {/* Floating light motes — tiny sun-specks drifting in the
          upper-right sky.
          Hidden on mobile: invisible at 375px. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {SKY_MOTES.map((m, i) => (
          <motion.circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={m.warm ? "#fff5c9" : "#ffffff"}
            style={{ filter: `drop-shadow(0 0 ${m.r * 1.6}px rgba(255,245,201,0.8))` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={
              reduce
                ? undefined
                : {
                    opacity: [0.2, 0.6, 0.2],
                    x: [0, i % 2 ? 12 : -12, 0],
                    y: [0, i % 3 ? -10 : 8, 0],
                  }
            }
            transition={
              reduce
                ? undefined
                : { duration: 9 + (i % 5) * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
            }
          />
        ))}
      </svg>

      {/* Two far-off birds — faint gull silhouettes soaring high, with
          a slow wing-flap.
          Hidden on mobile: too small to read, and crowd the small sky. */}
      {[
        { cls: "top-[10%] left-[64%]", dur: 30, delay: 0 },
        { cls: "top-[13%] left-[70%]", dur: 34, delay: 1.5 },
      ].map((b, i) => (
        <motion.svg
          key={i}
          className={`absolute ${b.cls} h-3 w-10 md:h-4 md:w-12 max-md:hidden`}
          viewBox="0 0 48 16"
          fill="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -6, 0] }}
          transition={
            reduce
              ? undefined
              : {
                  x: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: b.delay },
                }
          }
        >
          <motion.path
            d="M2 10 Q 12 2 24 9 Q 36 2 46 10"
            stroke="#4bc6ef"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            style={{ transformOrigin: "24px 9px" }}
            animate={reduce ? undefined : { scaleY: [1, 0.6, 1] }}
            transition={
              reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: b.delay }
            }
          />
        </motion.svg>
      ))}

      {/* A single paper-plane drifting on a gentle arc — a quiet nod to
          learning taking flight.
          Hidden on mobile: too far off-canvas to be visible. */}
      <motion.svg
        className="absolute left-[80%] top-[18%] h-6 w-6 md:h-8 md:w-8 max-md:hidden"
        viewBox="0 0 32 32"
        fill="#ffffff"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -10, 0], rotate: [-4, 3, -4] }}
        transition={
          reduce
            ? undefined
            : {
                x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 22, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <path d="M2 16 L30 4 L18 30 L15 19 Z" />
        <path d="M15 19 L30 4 L18 22 Z" fill="#b8e8fa" />
      </motion.svg>
    </BackdropFrame>
  );
}

// ————————————————————————————————————————————————————————
// 4. Clab — PASTEL VIOLET + GREEN + PINK
//    The three anchor swatches from clab.svg:
//      · #c8b7d9  light violet
//      · #c8e5c6  light green (mint)
//      · #f3c8de  light pink
//    The whole scene is those three colours, woven together as
//    three-arc rainbow, tri-blob watercolour, tri-colour sparkle.
// ————————————————————————————————————————————————————————

const CLAB_TRI = ["#c8b7d9", "#c8e5c6", "#f3c8de"] as const;

export function ClabBackdrop() {
  return (
    <BackdropFrame>
      {/* Tri-wash — each corner is one of the three pastel
          anchors, blended together in the middle. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 15% 15%, rgba(200,183,217,0.75) 0%, transparent 60%), radial-gradient(80% 60% at 85% 20%, rgba(243,200,222,0.65) 0%, transparent 60%), radial-gradient(80% 60% at 50% 90%, rgba(200,229,198,0.7) 0%, transparent 65%)",
        }}
      />

      {/* Three arcs — one violet, one mint, one pink — the
          hopeful "pastel rainbow" motif.
          Hidden on mobile: 190vw wide — way off-canvas on a 375px screen. */}
      <svg
        className="absolute left-1/2 top-[56%] h-[150vh] w-[190vw] -translate-x-1/2 md:top-[60%] max-md:hidden"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {[
          { c: "#c8b7d9", r: 520 },
          { c: "#c8e5c6", r: 480 },
          { c: "#f3c8de", r: 440 },
        ].map((arc, i) => (
          <motion.circle
            key={i}
            cx="600"
            cy="600"
            r={arc.r}
            stroke={arc.c}
            strokeWidth="32"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.62 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 2.4,
              delay: i * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ filter: "blur(6px)" }}
          />
        ))}
      </svg>

      {/* Tri-colour sparkle field — each sparkle is one of the
          three anchors, so the whole stage reads tri-tone.
          Hidden on mobile: individual sparkles read as noise at 375px. */}
      <svg
        className="absolute inset-0 h-full w-full max-md:hidden"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          // A full tri-tone sparkle field across the whole stage.
          { x: 150, y: 110, s: 9 },
          { x: 420, y: 80, s: 6 },
          { x: 820, y: 150, s: 11 },
          { x: 1060, y: 110, s: 8 },
          { x: 300, y: 340, s: 7 },
          { x: 920, y: 420, s: 9 },
          { x: 120, y: 560, s: 7 },
          { x: 640, y: 250, s: 10 },
          { x: 1140, y: 520, s: 7 },
          { x: 500, y: 540, s: 8 },
          { x: 760, y: 650, s: 9 },
          { x: 240, y: 720, s: 6 },
        ].map((sp, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.9, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={{ opacity: [0.4, 0.95, 0.4] }}
            transition={{
              opacity: {
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              },
              scale: { duration: 0.9, delay: 0.2 + i * 0.1 },
            }}
            style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
          >
            <path
              d={`M ${sp.x} ${sp.y - sp.s} L ${sp.x + sp.s * 0.3} ${sp.y - sp.s * 0.3} L ${sp.x + sp.s} ${sp.y} L ${sp.x + sp.s * 0.3} ${sp.y + sp.s * 0.3} L ${sp.x} ${sp.y + sp.s} L ${sp.x - sp.s * 0.3} ${sp.y + sp.s * 0.3} L ${sp.x - sp.s} ${sp.y} L ${sp.x - sp.s * 0.3} ${sp.y - sp.s * 0.3} Z`}
              fill={CLAB_TRI[i % 3]}
            />
          </motion.g>
        ))}
      </svg>

      {/* A few soft tri-blobs anchored in the corners for depth. */}
      <Glow x="-8%" y="-6%" size="42vw" color="#c8b7d9" opacity={0.55} blur={80} />
      <Glow x="72%" y="-4%" size="38vw" color="#f3c8de" opacity={0.5} delay={3} blur={80} />
      <Glow x="50%" y="70%" size="46vw" color="#c8e5c6" opacity={0.55} delay={6} blur={80} />

      {/* Very fine grain to keep it from feeling flat.
          Hidden on mobile: noise at small size. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay max-md:hidden"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </BackdropFrame>
  );
}

// ————————————————————————————————————————————————————————
// 5. English — ORANGE + GREEN
//    The letsgoenglish.svg characters are outlined black but
//    the dominant fill palette reads orange + teal-green:
//      · #f15a29 / #f5835b / #e8b020  oranges + amber
//      · #3a9984 / #2da98c            teal-greens
//    Stage: orange-to-green diagonal pop wash, orange/green
//    stripes, floating letters, burst rings in both hues.
// ————————————————————————————————————————————————————————

// Kept to three small glyphs in the far corners so the teacher
// lineup and copy read as the focus — the letters are flavour, not
// foreground.
const ENGLISH_LETTERS = [
  { ch: "A", x: "3%", y: "9%", c: "#f15a29", r: -8, s: "clamp(2.4rem, 6vw, 4.8rem)" },
  { ch: "B", x: "93%", y: "14%", c: "#3a9984", r: 10, s: "clamp(2.1rem, 5vw, 4rem)" },
  { ch: "!", x: "95%", y: "82%", c: "#e8b020", r: -6, s: "clamp(1.9rem, 4.5vw, 3.6rem)" },
];

export function EnglishBackdrop() {
  return (
    <BackdropFrame>
      {/* Orange top-left → green bottom-right diagonal wash —
          the literal combination of the two palettes. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 80% at 0% 0%, rgba(241,90,41,0.30) 0%, transparent 55%), radial-gradient(100% 80% at 100% 100%, rgba(58,153,132,0.35) 0%, transparent 55%), radial-gradient(60% 60% at 70% 20%, rgba(232,176,32,0.25) 0%, transparent 60%)",
        }}
      />

      {/* Alternating orange + green candy stripes — bold pop.
          Hidden on mobile: busy at small size. */}
      <div
        className="absolute inset-0 opacity-[0.06] max-md:hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f15a29 0 2px, transparent 2px 20px, #3a9984 20px 22px, transparent 22px 40px)",
        }}
      />

      {/* Burst rings — one orange cluster top-left, one green
          cluster bottom-right, rotating opposite directions.
          Hidden on mobile: 70-80vmin is oversized and distracting at 375px. */}
      <motion.svg
        className="absolute -left-[10%] top-[-12%] h-[70vmin] w-[70vmin] max-md:hidden"
        viewBox="0 0 400 400"
        fill="none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.3, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ rotate: 360 }}
        transition={{
          rotate: { duration: 180, repeat: Infinity, ease: "linear" },
          opacity: { duration: 1.2 },
          scale: { duration: 1.2 },
        }}
      >
        {["#f15a29", "#e8b020", "#f5835b", "#faaf88"].map((c, i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r={60 + i * 34}
            stroke={c}
            strokeWidth="3"
            strokeDasharray={i % 2 ? "8 14" : "2 10"}
          />
        ))}
      </motion.svg>

      <motion.svg
        className="absolute -right-[12%] bottom-[-18%] h-[80vmin] w-[80vmin] max-md:hidden"
        viewBox="0 0 400 400"
        fill="none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.28, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ rotate: -360 }}
        transition={{
          rotate: { duration: 220, repeat: Infinity, ease: "linear" },
          opacity: { duration: 1.2, delay: 0.3 },
          scale: { duration: 1.2, delay: 0.3 },
        }}
      >
        {["#3a9984", "#2da98c", "#8acc9c", "#6fb59e"].map((c, i) => (
          <circle
            key={i}
            cx="200"
            cy="200"
            r={80 + i * 38}
            stroke={c}
            strokeWidth="3"
            strokeDasharray={i % 2 ? "12 10" : "3 12"}
          />
        ))}
      </motion.svg>

      {/* Floating letters — the English alphabet, scattered in
          orange + green + amber. Bounce-in, then gentle idle.
          Hidden on mobile: positioned at far-edge % coordinates off-canvas at 375px. */}
      <div className="max-md:hidden">
      {ENGLISH_LETTERS.map((l, i) => (
        <motion.span
          key={i}
          className="font-display absolute select-none leading-none"
          style={{
            left: l.x,
            top: l.y,
            color: l.c,
            fontSize: l.s,
            fontWeight: 900,
            textShadow: `4px 4px 0 rgba(32,35,58,0.75)`,
            WebkitTextStroke: "2px #20233a",
          }}
          initial={{ opacity: 0, scale: 0.3, rotate: l.r * 3 }}
          whileInView={{ opacity: 0.5, scale: 1, rotate: l.r }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.9,
            delay: 0.1 + i * 0.12,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            animate={{
              y: [0, -10, 0],
              rotate: [l.r, l.r + 3, l.r],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            {l.ch}
          </motion.span>
        </motion.span>
      ))}
      </div>

      {/* Halftone dots — comic-book lettering texture.
          Hidden on mobile: busy at small size. */}
      <div
        className="absolute inset-0 opacity-[0.07] max-md:hidden"
        style={{
          backgroundImage:
            "radial-gradient(#20233a 1.3px, transparent 1.3px)",
          backgroundSize: "20px 20px",
          maskImage:
            "linear-gradient(120deg, black 0%, transparent 55%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(120deg, black 0%, transparent 55%, black 100%)",
        }}
      />
    </BackdropFrame>
  );
}
