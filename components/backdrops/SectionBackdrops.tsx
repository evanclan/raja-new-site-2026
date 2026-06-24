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

import { motion } from "framer-motion";

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

      {/* Faint globe meridians — dashed in a sage green, slowly
          rotating. Reads as a map-room globe, on-brand for 留学. */}
      <motion.svg
        className="absolute left-[-10%] top-[8%] h-[80%] w-[60%] md:left-[-4%]"
        viewBox="0 0 400 400"
        fill="none"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
      >
        {[180, 70, 120].map((ry, i) => (
          <ellipse
            key={i}
            cx="200"
            cy="200"
            rx={180}
            ry={ry}
            stroke="rgba(43,182,115,0.22)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        ))}
        {[180, 120, 70].map((rx, i) => (
          <ellipse
            key={`v${i}`}
            cx="200"
            cy="200"
            rx={rx}
            ry={180}
            stroke="rgba(43,182,115,0.18)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        ))}
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="rgba(43,182,115,0.28)"
          strokeWidth="1"
          strokeDasharray="2 8"
        />
      </motion.svg>

      {/* Flight arcs — six dashed curves, one per destination on
          the brochure, each coloured to match its card. The
          bundle reads as an "air-route map" across the sheet. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {[
          { d: "M -40 620 Q 400 300 900 520", delay: 0.2, color: "#569ecc" },
          { d: "M 100 200 Q 500 520 1200 260", delay: 0.6, color: "#b15896" },
          { d: "M 200 740 Q 700 420 1240 720", delay: 1.0, color: "#7db852" },
          { d: "M -20 480 Q 500 120 1100 360", delay: 1.4, color: "#e4703d" },
          { d: "M 60 120 Q 600 600 1180 480", delay: 1.8, color: "#3d5ca0" },
          { d: "M 160 680 Q 620 240 1220 560", delay: 2.2, color: "#61358b" },
        ].map((a, i) => (
          <motion.path
            key={i}
            d={a.d}
            stroke={a.color}
            strokeWidth="1.6"
            strokeDasharray="4 10"
            strokeLinecap="round"
            style={{ opacity: 0.4 }}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 3.2,
              delay: a.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>

      {/* Confetti stamps — scattered like passport stamps across
          the sheet, in the six brochure colours plus two kaeru
          greens, floating gently so the page feels alive. */}
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
          palette doesn't read as "just dots on paper". */}
      <svg
        className="absolute inset-0 h-full w-full"
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

      {/* Paper-stock grain. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
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
// 2. Academy — DARK ROYAL INDIGO
//    Main card rect of academy.svg is #2e3192 (deep royal). We
//    build a scholarly "night library / celestial map" stage
//    using the SVG's own #2f4c70 navy, #008ad0 cyan, #9099c4
//    periwinkle, and the amber #f99e49 accent.
// ————————————————————————————————————————————————————————

const ACADEMY_STARS = [
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

export function AcademyBackdrop() {
  return (
    <BackdropFrame>
      {/* Deep-field indigo vignette — a brighter royal in the
          upper-left fading into an inky blue-black at the
          bottom-right for cinematic depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 15% -10%, rgba(79,86,190,0.55) 0%, transparent 55%), radial-gradient(100% 80% at 100% 110%, rgba(15,17,66,0.75) 0%, transparent 60%)",
        }}
      />

      {/* Ambient glows — cyan + periwinkle + amber, placed
          asymmetrically for an editorial composition. */}
      <Glow x="-8%" y="0%" size="48vw" color="#008ad0" opacity={0.35} />
      <Glow x="68%" y="-6%" size="42vw" color="#9099c4" opacity={0.3} delay={2} />
      <Glow x="62%" y="62%" size="44vw" color="#f99e49" opacity={0.22} delay={4} blur={80} />
      <Glow x="-10%" y="58%" size="40vw" color="#2f4c70" opacity={0.5} delay={6} />

      {/* Celestial constellation field — scattered stars
          twinkling on a slow cycle. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {ACADEMY_STARS.map((st, i) => (
          <motion.circle
            key={i}
            cx={st.x}
            cy={st.y}
            r={st.s}
            fill={i % 5 === 0 ? "#f99e49" : "#ffffff"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              opacity: {
                duration: 2.2 + (i % 4) * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              },
            }}
            style={{
              filter: `drop-shadow(0 0 ${st.s * 2}px ${i % 5 === 0 ? "#f99e49" : "#ffffff"})`,
            }}
          />
        ))}
        {/* A few thin "constellation lines" linking three stars. */}
        <motion.path
          d="M 140 120 L 380 80 L 680 160"
          stroke="#ffffff"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="1 6"
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 0.35, pathLength: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 2, delay: 0.6 }}
        />
        <motion.path
          d="M 940 90 L 1080 440 L 980 680"
          stroke="#f99e49"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="1 6"
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 0.35, pathLength: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 2, delay: 1.2 }}
        />
      </svg>

      {/* Diamond outline — a direct echo of the hex-diamond crest
          at the centre of academy.svg. Two concentric, slowly
          rotating, held very quiet. */}
      <motion.svg
        className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 400 400"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 280, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="200,40 320,110 320,290 200,360 80,290 80,110"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
        <polygon
          points="200,80 290,130 290,270 200,320 110,270 110,130"
          stroke="rgba(249,158,73,0.18)"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
      </motion.svg>

      {/* Soft celestial grid — a ruled starmap, gently masked
          in a radial vignette so it only reads in the middle. */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)",
        }}
      />
    </BackdropFrame>
  );
}

// ————————————————————————————————————————————————————————
// 3. Preschool — OCEAN BLUE
//    Main card rect is #00aeef (bright ocean cyan). Supporting
//    blues: #005baa deep, #3f6eb6 / #819bd0 wave tones.
//    We build a gentle underwater / horizon scene: ocean wash,
//    floating bubbles, soft swells, drifting clouds.
// ————————————————————————————————————————————————————————

const PRESCHOOL_BUBBLES = [
  { x: "8%", y: "88%", s: 44, d: 0 },
  { x: "20%", y: "92%", s: 22, d: 1.2 },
  { x: "34%", y: "78%", s: 30, d: 0.6 },
  { x: "48%", y: "94%", s: 18, d: 2.0 },
  { x: "62%", y: "82%", s: 38, d: 1.4 },
  { x: "76%", y: "90%", s: 26, d: 0.3 },
  { x: "88%", y: "76%", s: 20, d: 1.8 },
  { x: "14%", y: "60%", s: 14, d: 2.4 },
  { x: "70%", y: "54%", s: 16, d: 3.0 },
];

export function PreschoolBackdrop() {
  return (
    <BackdropFrame>
      {/* Horizon wash — sky-cyan up top, deep ocean-blue on the
          bottom, a warm sun-glow bleeding through the top-right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(184,232,250,0.8) 0%, rgba(75,198,239,0.5) 50%, rgba(0,91,170,0.55) 100%), radial-gradient(60% 40% at 85% 10%, rgba(255,236,95,0.32) 0%, transparent 60%)",
        }}
      />

      {/* Two soft cloud silhouettes drifting across the top. */}
      <motion.svg
        className="absolute left-[4%] top-[12%] h-20 w-44 md:h-28 md:w-64"
        viewBox="0 0 240 120"
        fill="#ffffff"
        style={{ opacity: 0.85 }}
        initial={{ x: -60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.85 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <circle cx="60" cy="70" r="36" />
        <circle cx="100" cy="52" r="42" />
        <circle cx="150" cy="64" r="36" />
        <circle cx="180" cy="78" r="28" />
        <rect x="50" y="70" width="140" height="30" rx="15" />
      </motion.svg>

      <motion.svg
        className="absolute right-[8%] top-[24%] h-16 w-32 md:h-24 md:w-48"
        viewBox="0 0 240 120"
        fill="#ffffff"
        style={{ opacity: 0.7 }}
        initial={{ x: 80, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.7 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ y: [0, 8, 0] }}
        transition={{
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          x: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <circle cx="70" cy="68" r="40" />
        <circle cx="120" cy="50" r="46" />
        <circle cx="170" cy="66" r="38" />
        <rect x="60" y="68" width="120" height="30" rx="15" />
      </motion.svg>

      {/* Ocean swells — three layered wave bands along the
          bottom, low-opacity, gently phasing. */}
      <svg
        className="absolute bottom-0 left-0 h-[45%] w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        {[
          { c: "#005baa", o: 0.55, y: 180, amp: 30 },
          { c: "#3f6eb6", o: 0.45, y: 230, amp: 26 },
          { c: "#819bd0", o: 0.4, y: 290, amp: 22 },
          { c: "#ffffff", o: 0.25, y: 340, amp: 18 },
        ].map((w, i) => (
          <motion.path
            key={i}
            d={`M 0 ${w.y} Q 150 ${w.y - w.amp} 300 ${w.y} T 600 ${w.y} T 900 ${w.y} T 1200 ${w.y} L 1200 400 L 0 400 Z`}
            fill={w.c}
            style={{ opacity: w.o }}
            animate={{
              d: [
                `M 0 ${w.y} Q 150 ${w.y - w.amp} 300 ${w.y} T 600 ${w.y} T 900 ${w.y} T 1200 ${w.y} L 1200 400 L 0 400 Z`,
                `M 0 ${w.y} Q 150 ${w.y + w.amp} 300 ${w.y} T 600 ${w.y} T 900 ${w.y} T 1200 ${w.y} L 1200 400 L 0 400 Z`,
                `M 0 ${w.y} Q 150 ${w.y - w.amp} 300 ${w.y} T 600 ${w.y} T 900 ${w.y} T 1200 ${w.y} L 1200 400 L 0 400 Z`,
              ],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </svg>

      {/* Rising bubbles — small round circles with a highlight
          dot, drifting upward in a slow loop. */}
      {PRESCHOOL_BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 35%, rgba(255,255,255,0.05) 80%)",
            border: "1px solid rgba(255,255,255,0.45)",
          }}
          initial={{ y: 0, opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          animate={{
            y: [0, -180, -360],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 9 + (i % 4),
            repeat: Infinity,
            ease: "easeOut",
            delay: b.d,
          }}
        />
      ))}

      {/* Faint sun-shimmer on the horizon. */}
      <motion.div
        className="absolute right-[12%] top-[6%] h-20 w-20 rounded-full md:h-28 md:w-28"
        style={{
          background:
            "radial-gradient(circle, #fff5c9 0%, rgba(255,236,95,0.5) 50%, transparent 100%)",
          filter: "blur(4px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.8, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.2 },
        }}
      />
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
          hopeful "pastel rainbow" motif. */}
      <svg
        className="absolute left-1/2 top-[56%] h-[150vh] w-[190vw] -translate-x-1/2 md:top-[60%]"
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
          three anchors, so the whole stage reads tri-tone. */}
      <svg
        className="absolute inset-0 h-full w-full"
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

      {/* Very fine grain to keep it from feeling flat. */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
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

      {/* Alternating orange + green candy stripes — bold pop. */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f15a29 0 2px, transparent 2px 20px, #3a9984 20px 22px, transparent 22px 40px)",
        }}
      />

      {/* Burst rings — one orange cluster top-left, one green
          cluster bottom-right, rotating opposite directions. */}
      <motion.svg
        className="absolute -left-[10%] top-[-12%] h-[70vmin] w-[70vmin]"
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
        className="absolute -right-[12%] bottom-[-18%] h-[80vmin] w-[80vmin]"
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
          orange + green + amber. Bounce-in, then gentle idle. */}
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

      {/* Halftone dots — comic-book lettering texture. */}
      <div
        className="absolute inset-0 opacity-[0.07]"
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
