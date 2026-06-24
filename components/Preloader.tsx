"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLoading } from "./LoadingProvider";

gsap.registerPlugin(useGSAP);

/**
 * Preloader — "Bloom & Lift"
 *
 * The preloader doesn't *fade away* — it *becomes* the hero. A single GSAP
 * timeline choreographs six connected beats:
 *
 *   1. Hairline collapse  — the horizontal "radiant" line with its sweeping
 *                           dot scales inward from both edges and dissolves.
 *   2. Character cascade  — the vertical R·A·D·I·A·N·T column releases
 *                           upward, stagger 50ms top-down.
 *   3. Blob bloom         — each of the 7 brand blobs tweens outward along
 *                           its own velocity vector and fades, so the
 *                           cluster "explodes" outward into negative space.
 *   4. Lock-up split      — the centered logo-and-subtitle row splits into
 *                           two synchronized FLIP tweens:
 *                             • Logo   → hero's top-middle circular badge.
 *                             • Subtitle → hero's centered subtitle slot.
 *                           We measure both hero rects at the same frame
 *                           and tween with the same ease + duration so the
 *                           two halves of the mark feel connected — like a
 *                           single lock-up gracefully fanning apart to its
 *                           new home.
 *   5. Curtain sweep      — a mask-image gradient wipes the dark ink off
 *                           diagonally from the top-right ("sunrise"),
 *                           revealing the hero photo already painted
 *                           underneath. Times with the FLIP so the curtain
 *                           uncovers the logo and subtitle exactly as they
 *                           land — the viewer never sees an empty stage.
 *   6. Handoff crossfade  — the preloader's traveling logo + subtitle
 *                           crossfade with the hero's resting copies at the
 *                           landing frame, making the swap invisible.
 *
 * Signature easing: `cubic-bezier(0.76, 0, 0.24, 1)` (inOut quart) for the
 * big handoff beats. Premium motion personality — no overshoot, long arcs,
 * ~1.75s total reveal.
 */

const BLOBS: ReadonlyArray<{
  d: string;
  fill: string;
  /** Exit velocity vector in SVG viewBox units (box is 65.71 × 43.63).
   *  Magnitudes around 2 push the blob well beyond the viewBox so it
   *  disappears cleanly off-viewport during bloom. */
  vx: number;
  vy: number;
}> = [
  {
    // Yellow (cls-5) — center mass, drifts east + slightly up
    d: "M19.19,23.94c-1.69-2.5-1.99-5.74-.92-8.51-.15-1.04.47-1.81,1.24-2.15.96-.87,2.91-.84,3.14.74.12.8.21,1.6.26,2.39,1.76,1.88,2.46,4.6,1.65,7.17-.35,1.09-1.4,1.52-2.31,1.25-.82.53-2.18.32-2.82-.53-.05-.07-.1-.14-.15-.21-.03-.04-.07-.09-.1-.14Z",
    fill: "#f3c43d",
    vx: 1.6,
    vy: -1.2,
  },
  {
    // Pink (cls-3) — upper-right, flies further east
    d: "M40.07,19.82c.67-1.07,2-1.18,2.93-.38,2.13,1.84,2.68,5.05,2.55,7.74-.07,1.49-.8,2.89-2.34,3.27-1.47.36-2.67-.56-3.16-1.9-.02-.06-.04-.12-.07-.18-1.6-2.59-1.54-5.96.09-8.55Z",
    fill: "#bc5ba3",
    vx: 2.0,
    vy: -0.3,
  },
  {
    // Green (cls-4) — bottom-left, exits SW
    d: "M8.41,39.99c-.92-1.66-.95-3.69-.19-5.39-1.4-1.7,1.05-4.11,2.69-2.57.82-.08,1.61.41,1.96,1.33.23.61.44,1.25.61,1.9,1.44,1.18.96,3.77,0,5.61-.32.81-.83,1.57-1.59,2.24-1.05.92-2.7.58-3.12-.82-.1-.35-.18-.77-.24-1.24-.17-.35-.2-.71-.12-1.06Z",
    fill: "#80c350",
    vx: -1.4,
    vy: 1.6,
  },
  {
    // Sky (cls-7) — top-left, exits NW
    d: "M.93,8.09c.21-.25.45-.46.72-.62.55-1.05,1.9-1.62,2.82-.46.13.16.25.33.36.5.48.22.89.64,1.12,1.2.04.09.08.19.11.29.3.56.51,1.18.7,1.78.74,2.42,1.51,6.16-1.14,7.77-2.18,1.33-5.1-.04-5.23-2.6-.02-.47.1-.85.32-1.14-.68-2.21-1.29-4.91.22-6.72Z",
    fill: "#53a6dc",
    vx: -1.9,
    vy: -1.1,
  },
  {
    // Orange (cls-2) — top-right, exits NE
    d: "M39.57.15c1.09.36,1.97,1.54,2.42,2.73,1.04,1.45.78,3.4-.4,4.68-.65.7-1.45.71-2.09.35-.74.07-1.47-.14-2.07-.54-.54-.15-1.03-.46-1.41-.95-1.78-2.29.33-7.35,3.55-6.27Z",
    fill: "#f3733b",
    vx: 0.5,
    vy: -2.0,
  },
  {
    // Purple (cls-1) — bottom-right, exits SE
    d: "M52.99,34.36c.11-.17.23-.31.36-.45-.25-1.89,2.75-2.62,3.62-.75.77.37,1.28,1.09,1.74,1.85.78,1.3,1.34,2.89,1.13,4.34.1.86.11,1.75-.32,2.48-.9,1.52-2.6,1.52-3.86.71-.59-.09-1.15-.33-1.63-.73-.05-.04-.1-.07-.14-.12-.2-.18-.38-.39-.54-.62-.26-.37-.35-.74-.33-1.08-.69-1.81-1.1-4.05-.03-5.64Z",
    fill: "#643996",
    vx: 1.2,
    vy: 1.7,
  },
  {
    // Indigo (cls-6) — right edge, exits E
    d: "M60.6,22c.29-.87,1.08-1.53,1.99-1.26.58.04,1.14.32,1.42.9.06.11.1.23.16.35,1.04,1.23,1.49,2.78,1.34,4.34.18,1.11.25,2.24.18,3.39-.11,1.88-2.43,2.49-3.47.94-.4-.59-.72-1.19-.98-1.81-1.49-2-1.75-4.59-.63-6.85Z",
    fill: "#3d60ac",
    vx: 2.1,
    vy: 0.4,
  },
];

const CHARS = ["R", "A", "D", "I", "A", "N", "T"] as const;

const SUBTITLE_WIDTH = 360;
const SUBTITLE_ASPECT = 353.69 / 34.21;
// Logo is larger now so there's more visual gravity in the center
// lock-up — and so the FLIP traveling distance to the hero's ~120px
// top-middle badge is short and natural rather than a dramatic scale.
const LOGO_SIZE = 72;

// power3.inOut is our everyday ease; power4.inOut approximates the
// signature cubic-bezier(0.76, 0, 0.24, 1) for the big sweep/FLIP beats.
const SIGNATURE_EASE = "power3.inOut";
const CURTAIN_EASE = "power4.inOut";

export function Preloader() {
  const { phase, beginReveal, markReady } = useLoading();
  const rootRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const [unmount, setUnmount] = useState(false);

  // Lock scroll for the full preloader lifecycle. Unlocks on unmount.
  useEffect(() => {
    if (unmount) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [unmount]);

  // Load-phase timer — give the character column, subtitle reveal, and
  // hairline enough time to establish a rhythm, then fire the reveal.
  useEffect(() => {
    if (phase !== "loading") return;
    const id = setTimeout(() => beginReveal(), 2000);
    return () => clearTimeout(id);
  }, [phase, beginReveal]);

  // Restore scroll as soon as the page is ready (belt + braces with the
  // unmount effect above).
  useEffect(() => {
    if (phase === "ready") {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
    }
  }, [phase]);

  // ————————————————————————————————————————
  // The reveal — one timeline, everything in sync
  // ————————————————————————————————————————
  useGSAP(
    () => {
      if (phase !== "reveal" || !rootRef.current) return;
      const root = rootRef.current;

      const curtain = root.querySelector<HTMLElement>("[data-curtain]");
      const vignette = root.querySelector<HTMLElement>("[data-vignette]");
      const blobGroups = gsap.utils.toArray<SVGGElement>(
        root.querySelectorAll("[data-blob]"),
      );
      const chars = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-char]"),
      );
      const subtitleEl = subtitleRef.current;
      const logoEl = logoRef.current;
      const hairlineEl = hairlineRef.current;

      // Respect reduced-motion — short, quiet fade instead of the full
      // choreography. Still flips phase so the hero reveals.
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.to(root, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            markReady();
            setTimeout(() => setUnmount(true), 80);
          },
        });
        return;
      }

      // Manual FLIP measurement — we defer one RAF so Hero's subtitle +
      // logo have both committed their `reveal`-phase layout (y: 0,
      // opacity: 0) before we read their bounding rects.
      //
      // We return **two** delta sets (logo + subtitle) measured on the
      // same frame. Measuring together is important: any layout shift
      // between the two reads would desynchronise the landing, and the
      // whole handoff depends on the two halves arriving at exactly the
      // same instant.
      const measureFlip = () => {
        const subtitleTarget = document.querySelector<HTMLElement>(
          "[data-flip-target='raja-subtitle']",
        );
        const logoTarget = document.querySelector<HTMLElement>(
          "[data-flip-target='raja-logo']",
        );

        const subtitleDelta = (() => {
          if (!subtitleEl || !subtitleTarget) return null;
          const src = subtitleEl.getBoundingClientRect();
          const dst = subtitleTarget.getBoundingClientRect();
          if (dst.width <= 0 || dst.height <= 0) return null;
          return {
            x: dst.left - src.left,
            y: dst.top - src.top,
            sx: dst.width / src.width,
            sy: dst.height / src.height,
          };
        })();

        const logoDelta = (() => {
          if (!logoEl || !logoTarget) return null;
          const src = logoEl.getBoundingClientRect();
          const dst = logoTarget.getBoundingClientRect();
          if (dst.width <= 0 || dst.height <= 0) return null;
          // Logo is a circle, so we average sx/sy into a single scale to
          // avoid any non-uniform squash on the final frame. The hero's
          // logo container is also 1:1, so sx and sy agree within a
          // rounding error, but forcing uniform scale is cheap insurance.
          const sx = dst.width / src.width;
          const sy = dst.height / src.height;
          const scale = (sx + sy) / 2;
          return {
            x: dst.left - src.left,
            y: dst.top - src.top,
            scale,
          };
        })();

        return { subtitleDelta, logoDelta };
      };

      let rafId = 0;
      let tl: gsap.core.Timeline | null = null;

      rafId = requestAnimationFrame(() => {
        const { subtitleDelta, logoDelta } = measureFlip();

        tl = gsap.timeline({
          defaults: { ease: SIGNATURE_EASE },
          onComplete: () => {
            setTimeout(() => setUnmount(true), 60);
          },
        });

        // — Beat 1: radiant hairline collapses inward and dissolves
        if (hairlineEl) {
          tl.to(
            hairlineEl,
            {
              scaleX: 0,
              opacity: 0,
              duration: 0.5,
              ease: "power3.in",
              transformOrigin: "50% 50%",
            },
            0,
          );
        }

        // — Beat 2: character column cascades upward (top-down stagger)
        if (chars.length) {
          tl.to(
            chars,
            {
              opacity: 0,
              y: -14,
              stagger: 0.05,
              duration: 0.55,
              ease: "power3.in",
            },
            0.05,
          );
        }

        // — Beat 3: blobs bloom outward along their velocity vectors
        blobGroups.forEach((g, i) => {
          const { vx, vy } = BLOBS[i];
          tl!.to(
            g,
            {
              x: vx * 32,
              y: vy * 32,
              scale: 1.45,
              opacity: 0,
              transformOrigin: "50% 50%",
              duration: 1.15 + (i % 3) * 0.05,
              ease: "power2.in",
            },
            0.12 + i * 0.055,
          );
        });

        // — Beat 4a: LOGO FLIPs from the center lock-up to the hero's
        //   top-middle badge. Runs on the *same* curve + duration as the
        //   subtitle FLIP below so the two halves feel emotionally bound —
        //   like a lock-up gently fanning apart to take its stations.
        //
        //   We start the logo FLIP a hair before the subtitle's — 0.18s
        //   vs 0.24s — because the logo's travel is shorter (it rises to
        //   the header) and the early start makes it lead the handoff,
        //   arriving just *before* the subtitle settles. The two land
        //   together at ~1.38s, the same moment the curtain completes.
        if (logoEl) {
          if (logoDelta) {
            tl.to(
              logoEl,
              {
                x: logoDelta.x,
                y: logoDelta.y,
                scale: logoDelta.scale,
                rotate: 0,
                transformOrigin: "50% 50%",
                duration: 1.2,
                ease: CURTAIN_EASE,
              },
              0.18,
            );
          } else {
            // No target available (e.g. hero not mounted yet) — fall back
            // to the old graceful exit so the reveal still finishes.
            tl.to(
              logoEl,
              {
                y: -18,
                rotate: -14,
                scale: 0.55,
                opacity: 0,
                duration: 0.85,
                ease: "power3.in",
                transformOrigin: "50% 50%",
              },
              0.45,
            );
          }
        }

        // — Beat 4b: SUBTITLE FLIPs to its centered hero slot.
        if (subtitleEl) {
          if (subtitleDelta) {
            tl.to(
              subtitleEl,
              {
                x: subtitleDelta.x,
                y: subtitleDelta.y,
                scaleX: subtitleDelta.sx,
                scaleY: subtitleDelta.sy,
                transformOrigin: "0 0",
                duration: 1.2,
                ease: CURTAIN_EASE,
              },
              0.24,
            );
          } else {
            tl.to(
              subtitleEl,
              { opacity: 0, y: -12, duration: 0.5, ease: "power2.in" },
              0.3,
            );
          }
        }

        // — Beat 5: vignette lifts, curtain sweeps diagonally from top-right
        if (vignette) {
          tl.to(
            vignette,
            { opacity: 0, duration: 0.7, ease: "power2.out" },
            0.15,
          );
        }
        if (curtain) {
          tl.to(
            curtain,
            {
              "--wipe": "-15%",
              duration: 1.4,
              ease: CURTAIN_EASE,
            },
            0.35,
          );
        }

        // — Beat 6: Handoff crossfade (position 1.38s)
        //   Both traveling copies (logo + subtitle) fade out while the
        //   hero's resting logo + subtitle fade in via `markReady()`.
        //   Because the preloader copies are now overlapping the hero's
        //   target rects exactly, the crossfade is invisible — the
        //   viewer just sees a single lock-up settle into the hero.
        tl.call(
          () => {
            markReady();
          },
          undefined,
          1.38,
        );
        if (subtitleEl) {
          tl.to(
            subtitleEl,
            { opacity: 0, duration: 0.4, ease: "power2.out" },
            1.38,
          );
        }
        if (logoEl) {
          tl.to(
            logoEl,
            { opacity: 0, duration: 0.35, ease: "power2.out" },
            1.42,
          );
        }
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (tl) tl.kill();
      };
    },
    { scope: rootRef, dependencies: [phase] },
  );

  if (unmount) return null;

  const exiting = phase !== "loading";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] isolate"
      // pointer-events are allowed so the preloader swallows clicks while
      // it owns the stage; remove on unmount (root unmounts entirely).
    >
      {/* ————————————————————————————————————————
          Curtain layer — dark ink + blobs + vignette all live inside,
          so the diagonal mask wipes them as one plate.
         ———————————————————————————————————————— */}
      <div
        data-curtain
        className="absolute inset-0 bg-[#0b0c10]"
        style={
          {
            "--wipe": "110%",
            WebkitMaskImage:
              "linear-gradient(225deg, black 0%, black calc(var(--wipe) - 10%), transparent var(--wipe), transparent 100%)",
            maskImage:
              "linear-gradient(225deg, black 0%, black calc(var(--wipe) - 10%), transparent var(--wipe), transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          } as React.CSSProperties
        }
      >
        {/* Full-viewport blob field — inlined from preloader-blobs.svg so
            each blob can be individually tweened during the bloom. */}
        <svg
          viewBox="0 0 65.71 43.63"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: 0.92 }}
          aria-hidden
        >
          {BLOBS.map((b, i) => (
            <g key={i} data-blob style={{ willChange: "transform, opacity" }}>
              <path d={b.d} fill={b.fill} />
            </g>
          ))}
        </svg>

        {/* Ambient radial vignette — adds depth while the ink holds. */}
        <div
          data-vignette
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.42) 80%)",
          }}
        />

        {/* Fine grain — editorial texture, very subtle. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>

      {/* ————————————————————————————————————————
          Vertical character column — R · A · D · I · A · N · T
          Sits on the left edge. Fades in letter-by-letter during load,
          cascades up and out during reveal.
         ———————————————————————————————————————— */}
      <div
        className="pointer-events-none absolute left-5 md:left-10 top-1/2 z-[3] flex -translate-y-1/2 flex-col gap-3 md:gap-4 font-display text-[11px] md:text-[13px] font-medium uppercase"
        style={{ letterSpacing: "0.38em" }}
        aria-hidden
      >
        {CHARS.map((c, i) => (
          <motion.span
            key={i}
            data-char
            className="block text-white/65"
            initial={{ opacity: 0, y: 6 }}
            animate={
              exiting
                ? undefined // GSAP owns the exit — don't double-drive
                : { opacity: 0.7, y: 0 }
            }
            transition={{
              duration: 0.6,
              delay: 0.25 + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {c}
          </motion.span>
        ))}
      </div>

      {/* ————————————————————————————————————————
          Center stage — logo + subtitle row, radiant hairline below
         ———————————————————————————————————————— */}
      <div className="relative z-[4] grid h-full place-items-center px-6">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          {/* Logo + subtitle row */}
          <motion.div
            className="flex items-center gap-3 md:gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              // During load: normal entrance.
              // During reveal: GSAP owns the subtitle's motion; the row
              // stops driving y so our Flip reads correct bounding rect.
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15,
            }}
          >
            {/* Logo — stays mounted through the full reveal so GSAP can
                dissolve it gracefully. The Nav renders its own logo from
                its own entrance animation on `loaded`, so no handoff is
                needed here. */}
            <motion.div
              ref={logoRef}
              className="relative shrink-0 will-change-transform"
              style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={exiting ? undefined : { opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
            >
              <Image
                src="/hero-main/RaJA-Logo.svg"
                alt="RaJA International"
                fill
                priority
                sizes={`${LOGO_SIZE}px`}
                className="select-none"
              />
            </motion.div>

            {/* Subtitle — clip-revealed L→R on load, then manually FLIPped
                to the hero's subtitle slot on reveal. */}
            <motion.div
              ref={subtitleRef}
              data-flip-source="raja-subtitle"
              className="relative will-change-transform"
              style={{
                width: `min(72vw, ${SUBTITLE_WIDTH}px)`,
                aspectRatio: `${SUBTITLE_ASPECT}`,
              }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 1.0,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src="/hero-main/RaJA-subtitle.svg"
                alt="Radiant Japan Association"
                fill
                priority
                className="select-none"
              />
            </motion.div>
          </motion.div>

          {/* Radiant hairline — a thin horizon line with a glowing dot
              that sweeps back and forth. Evokes "Radiant" (a ray of
              light on a horizon) and echoes the hero's scroll-indicator
              hairline, so the eye recognises the aesthetic before the
              reveal completes. Scales inward on exit. */}
          <motion.div
            ref={hairlineRef}
            className="relative mt-3 h-px overflow-visible will-change-transform"
            style={{
              width: "clamp(140px, 24vw, 220px)",
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={exiting ? undefined : { opacity: 1, scaleX: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-hidden
          >
            {/* Traveling dot — sweeps back and forth while loading. The
                outer glow gives the "radiant" feel; inner pin is crisp
                so it reads clearly on all backgrounds. */}
            <motion.span
              className="absolute top-1/2 block rounded-full bg-white"
              style={{
                width: 7,
                height: 7,
                marginTop: -3.5,
                marginLeft: -3.5,
                boxShadow:
                  "0 0 22px 5px rgba(255, 247, 230, 0.55), 0 0 6px 1.5px rgba(255, 255, 255, 0.9)",
              }}
              initial={{ left: "0%" }}
              animate={
                exiting
                  ? { left: "50%", opacity: 0 }
                  : { left: ["0%", "100%", "0%"] }
              }
              transition={
                exiting
                  ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                  : {
                      duration: 2.4,
                      repeat: Infinity,
                      ease: [0.65, 0, 0.35, 1],
                      delay: 0.9,
                    }
              }
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
