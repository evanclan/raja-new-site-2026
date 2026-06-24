"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useT } from "@/lib/i18n";

// ————————————————————————————————————————————————————————
// ClabCarat — "Carat" spotlight.
//
// One large gem-cut photo of the ACTIVE program holds the stage; a
// big data panel reads its title, description, instructor and key
// fact; a rail of small gem "facets" lets you pick a program (and
// auto-cycles). The gem turns to show each of its faces — the Carat
// metaphor, now at a size you can actually read.
//
// Entrance is choreographed by the section timeline in Clab.tsx via
// the data-clab="*" hooks; idle/auto-cycle/re-glint live here.
// ————————————————————————————————————————————————————————

const DWELL_MS = 5000;

// Big spotlight gem silhouette + small selector facet (CSS clip-path).
// The spotlight is a cut-corner (chamfered) rectangle so the WHOLE photo
// fits inside with only the very corners beveled — not a hard polygon that
// slices the image.
const SPOTLIGHT_SHAPE =
  "polygon(13% 0%, 87% 0%, 100% 13%, 100% 87%, 87% 100%, 13% 100%, 0% 87%, 0% 13%)";
const SELECTOR_SHAPE =
  "polygon(50% 0%, 100% 28%, 100% 72%, 50% 100%, 0% 72%, 0% 28%)";

type ClabProgram = {
  key: string;
  name: string;
  desc: string;
  instructor: string;
  chip: string;
  photoAlt: string;
};

// Non-translatable visuals, zipped by index with i18n programs:
//   0 swimming · 1 music · 2 rit · 3 programming · 4 abacus
const PROGRAM_VISUALS: ReadonlyArray<{
  kind: "photo" | "robot" | "illustration";
  img?: string;
  objectPosition?: string;
  // Extra zoom for the big spotlight ONLY where the source photo is a
  // marketing collage (Swimming, Piano) and its non-photo regions must
  // be pushed out of frame. Clean photos (RIT) and the robot use 1.
  zoom?: number;
  accent: string;
  tint: string;
}> = [
  { kind: "photo", img: "/clab/Swimming.jpg", objectPosition: "46% 40%", zoom: 1.22, accent: "#3fa9d4", tint: "#c3e8f1" },
  { kind: "photo", img: "/clab/Piano.jpg", objectPosition: "50% 18%", zoom: 1.2, accent: "#e06aa6", tint: "#f3c8de" },
  { kind: "photo", img: "/clab/RIT.jpg", objectPosition: "50% 34%", zoom: 1, accent: "#8a68c4", tint: "#c8b7d9" },
  { kind: "robot", img: "/clab/Wonder code robot.png", zoom: 1, accent: "#46b277", tint: "#c8e5c6" },
  { kind: "illustration", accent: "#e2914a", tint: "#fae3c2" },
];

// ————————————————————————————————————————————————————————
// Facet lines drawn over the big gem (the "cut").
// Outer vertices match SPOTLIGHT_SHAPE; inner "table" is pulled 40%
// toward the centre. Eight spokes + the table outline.
// ————————————————————————————————————————————————————————
const GEM_OUTER: ReadonlyArray<[number, number]> = [
  [13, 0], [87, 0], [100, 13], [100, 87], [87, 100], [13, 100], [0, 87], [0, 13],
];
const GEM_INNER = GEM_OUTER.map(([x, y]) => [
  50 + 0.4 * (x - 50),
  52 + 0.4 * (y - 52),
]) as ReadonlyArray<[number, number]>;

function GemFacetLines() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {GEM_OUTER.map(([ox, oy], i) => (
        <line
          key={i}
          x1={ox}
          y1={oy}
          x2={GEM_INNER[i][0]}
          y2={GEM_INNER[i][1]}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.5"
        />
      ))}
      <polygon
        points={GEM_INNER.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function AbacusGlyph({ accent, big = false }: { accent: string; big?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={big ? "h-2/5 w-2/5" : "h-1/2 w-1/2"} aria-hidden>
      <rect x="10" y="12" width="44" height="40" rx="4" fill="none" stroke={accent} strokeWidth="3" />
      {[22, 32, 42].map((y) => (
        <line key={y} x1="12" y1={y} x2="52" y2={y} stroke={accent} strokeWidth="2" opacity="0.6" />
      ))}
      {[[18, 22], [30, 22], [24, 32], [40, 32], [20, 42], [34, 42]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.4" fill={accent} />
      ))}
    </svg>
  );
}

// The image/illustration that fills a gem-cut frame (shared by the big
// spotlight and the small selectors), sized by its container.
function FacetImage({
  v,
  alt,
  sizes,
  fit = "cover",
}: {
  v: (typeof PROGRAM_VISUALS)[number];
  alt: string;
  sizes: string;
  /** "contain" shows the WHOLE image (letterboxed on the tint); "cover"
   *  fills the frame (used for the small selector thumbnails). */
  fit?: "cover" | "contain";
}) {
  const bg = `linear-gradient(150deg, #ffffff 0%, ${v.tint} 100%)`;
  if (v.kind === "illustration") {
    return (
      <div className="grid h-full w-full place-items-center" style={{ background: bg }}>
        <AbacusGlyph accent={v.accent} big />
      </div>
    );
  }
  const contain = fit === "contain";
  return (
    <div className="relative h-full w-full" style={{ background: bg }}>
      {v.kind === "robot" ? (
        <Image src={v.img!} alt={alt} fill sizes={sizes} quality={85} className="object-contain p-[12%]" />
      ) : contain ? (
        // Whole image, fit inside the gem (corners stay clear of the bevel).
        <Image src={v.img!} alt={alt} fill sizes={sizes} quality={85} className="object-contain p-[7%]" />
      ) : (
        <>
          <Image src={v.img!} alt={alt} fill sizes={sizes} quality={85} className="object-cover" style={{ objectPosition: v.objectPosition }} />
          <div aria-hidden className="absolute inset-0 mix-blend-overlay" style={{ background: v.tint, opacity: 0.1 }} />
        </>
      )}
    </div>
  );
}

export function ClabCarat() {
  const t = useT();
  const reduce = useReducedMotion();
  const p = t.panels.clab;
  const programs = p.programs as readonly ClabProgram[];

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [auto, setAuto] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? auto;

  // Auto-cycle — paused by hover/focus, off under reduced motion.
  useEffect(() => {
    if (reduce || hover !== null) return;
    let paused = false;
    const onVis = () => (paused = document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const id = setInterval(() => {
      if (!paused) setAuto((a) => (a + 1) % programs.length);
    }, DWELL_MS);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce, hover, programs.length]);

  // Re-glint the gem on every change.
  const firstGlint = useRef(true);
  useEffect(() => {
    if (firstGlint.current) {
      firstGlint.current = false;
      return;
    }
    if (reduce || !rootRef.current) return;
    const gleams = rootRef.current.querySelectorAll('[data-clab="gleam"]');
    gsap.fromTo(gleams, { xPercent: -130 }, { xPercent: 130, duration: 0.7, ease: "power2.inOut" });
  }, [active, reduce]);

  return (
    <div ref={rootRef} className="relative md:col-span-8">
      <div className="flex flex-col gap-7 md:gap-8">
        {/* ——— Spotlight photo + data panel ——— */}
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-9">
          {/* BIG gem-cut spotlight */}
          <div data-clab="spotlight" className="relative mx-auto w-full max-w-[clamp(18rem,28vw,30rem)]">
            <div
              className="relative aspect-square w-full"
              style={{
                filter:
                  "drop-shadow(0 26px 44px rgba(60,64,96,0.26)) drop-shadow(0 8px 16px rgba(60,64,96,0.16))",
              }}
            >
              {/* Leaf-green brand halo behind the gem. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-[12%] rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(88,194,125,0.30) 0%, rgba(88,194,125,0.08) 50%, transparent 74%)",
                  filter: "blur(8px)",
                }}
              />
              <div
                className="relative h-full w-full overflow-hidden"
                style={{ clipPath: SPOTLIGHT_SHAPE, boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.7)" }}
              >
                {/* All program photos stacked; only the active one is
                    opaque — a crossfade that can never wedge or pile up. */}
                {programs.map((pr, i) => (
                  <motion.div
                    key={pr.key}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ pointerEvents: "none" }}
                  >
                    {/* Whole image, fit inside the gem — nothing cropped. */}
                    <FacetImage v={PROGRAM_VISUALS[i]} alt={pr.photoAlt} sizes="(max-width:768px) 80vw, 360px" fit="contain" />
                  </motion.div>
                ))}

                <GemFacetLines />

                {/* Specular gleam. */}
                <div
                  data-clab="gleam"
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[55%]"
                  style={{
                    transform: "translateX(-130%) skewX(-18deg)",
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* BIG data panel — all programs stacked in one grid cell so the
              box sizes to the tallest copy (no overflow onto the rail). */}
          <div data-clab="panel" className="relative grid min-h-[14rem]">
            {programs.map((pr, i) => {
              const pv = PROGRAM_VISUALS[i];
              const on = active === i;
              return (
                <motion.div
                  key={pr.key}
                  className="[grid-area:1/1]"
                  initial={false}
                  animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ pointerEvents: on ? "auto" : "none" }}
                  aria-hidden={!on}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: pv.accent }} />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: pv.accent }}>
                      {pr.chip}
                    </span>
                  </div>

                  <h3
                    className="font-display mt-2 text-display-3 tracking-tight"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {pr.name}
                  </h3>

                  <p
                    className="mt-4 max-w-[46ch] text-base leading-relaxed"
                    style={{ color: "var(--color-ink-soft)" }}
                  >
                    {pr.desc}
                  </p>

                  {pr.instructor && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                      style={{ background: `color-mix(in srgb, ${pv.accent} 14%, transparent)` }}>
                      <span className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-ink)", opacity: 0.55 }}>
                        {p.instructorLabel}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                        {pr.instructor}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ——— Selector rail ——— */}
        <ul
          role="tablist"
          aria-label={p.label}
          className="flex gap-3 overflow-x-auto pb-1 md:gap-4 md:overflow-visible [scrollbar-width:none]"
          style={{ scrollbarWidth: "none" }}
        >
          {programs.map((pr, i) => {
            const pv = PROGRAM_VISUALS[i];
            const on = active === i;
            return (
              <li key={pr.key} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={pr.name}
                  data-clab="sel"
                  onClick={() => setAuto(i)}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="group flex w-[clamp(4.5rem,5.5vw,5.25rem)] flex-col items-center gap-2 outline-none"
                >
                  <motion.span
                    className="relative block aspect-square w-full"
                    animate={{ scale: on ? 1.12 : 1, y: on ? -3 : 0 }}
                    transition={{ duration: 0.35, ease: [0.175, 0.885, 0.32, 1.275] }}
                    style={{
                      filter: on
                        ? `drop-shadow(0 10px 18px ${pv.accent}66)`
                        : "drop-shadow(0 6px 12px rgba(60,64,96,0.18))",
                    }}
                  >
                    <span
                      className="absolute inset-0 overflow-hidden transition-[box-shadow] duration-300"
                      style={{
                        clipPath: SELECTOR_SHAPE,
                        boxShadow: on
                          ? `inset 0 0 0 2.5px ${pv.accent}`
                          : "inset 0 0 0 2px rgba(255,255,255,0.7)",
                      }}
                    >
                      <FacetImage v={pv} alt="" sizes="84px" />
                      {!on && <span aria-hidden className="absolute inset-0 bg-white/35 transition-opacity duration-300 group-hover:opacity-0" />}
                    </span>
                  </motion.span>
                  <span
                    className="max-w-[6rem] truncate text-center text-xs font-medium leading-tight transition-colors"
                    style={{ color: on ? "var(--color-ink)" : "var(--color-ink-soft)", opacity: on ? 1 : 0.7 }}
                  >
                    {pr.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
