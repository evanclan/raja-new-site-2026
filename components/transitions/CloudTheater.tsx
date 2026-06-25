"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CLOUD_SHAPE } from "../backdrops/SectionBackdrops";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// CloudTheater — the pinned "clouds → sky" scene for the mini section.
//
// Coming out of Study Abroad the Intro section PINS and a single scrubbed
// master timeline plays four beats:
//
//   1. GATHER   — cloud banks flood in from top + bottom and fill the screen.
//   2. WHITEOUT — a brief near-white flash at peak density.
//   3. PART     — the banks lift/sink apart as the white clears, revealing the
//                 two mini-section assets (ink phrase + RaJA) in the clearing.
//   4. OPEN     — the clouds thin into the top band and the backdrop opens to
//                 Preschool's exact sky cyan (#b8e8fa); the assets exit.
//
// The scene ENDS on #b8e8fa with a few thin high clouds lingering, so when the
// pin releases the page flows straight into Preschool (same cyan, same
// CLOUD_SHAPE silhouette) with no visible seam — the clouds *become* the sky.
//
// Layers, bottom → top:  bgFill · assets stage · cloud banks · whiteout veil.
// Clouds + whiteout sit ABOVE the assets, so parting/clearing UNCOVERS them.
//
// Reduced motion / small screens: no pin, no whiteout flash — a calm static
// reveal of the assets on a near-cyan sky that still hands gently to Preschool.
// ————————————————————————————————————————————————————————

// Colour bridge: Study-Abroad pale green-white → near-white → Preschool cyan.
const BG_START = "#eef6ee"; // pale green-white (end of Study Abroad)
const BG_FILL = "#f6f9fb"; // lifting toward white as clouds gather
const BG_SKY = "#b8e8fa"; // Preschool's exact sky-top cyan
const WHITEOUT = "#fcfdff"; // the brief full whiteout
const BG_CALM = "#dceffa"; // reduced-motion resting sky
const CUE_COLOR = "rgba(46,49,90,0.55)"; // muted indigo scroll cue — reads on the pale clouds

// Pin length in viewport-heights. Mobile gets a shorter, less "sticky" pin.
const PIN_VH_DESKTOP = 1.5;
const PIN_VH_MOBILE = 1.2;

// Two depth tiers' worth of puffy clouds per bank. Generous sizes + overlap so
// each bank covers well over half the viewport; the whiteout veil guarantees
// the remaining gaps at peak. Positions are tuned for full-width coverage.
type CloudCfg = { cls: string; blur: number; op: number };

const TOP_BANK: CloudCfg[] = [
  { cls: "left-[-8%] top-[-6%] w-[46vw] h-[26vw]", blur: 0.5, op: 0.96 },
  { cls: "left-[26%] top-[-10%] w-[52vw] h-[28vw]", blur: 0.4, op: 1 },
  { cls: "left-[62%] top-[-6%] w-[48vw] h-[26vw]", blur: 0.6, op: 0.95 },
  { cls: "left-[6%] top-[24%] w-[44vw] h-[24vw]", blur: 1, op: 0.85 },
  { cls: "left-[44%] top-[28%] w-[50vw] h-[26vw]", blur: 1.2, op: 0.8 },
  { cls: "left-[-4%] top-[48%] w-[40vw] h-[22vw]", blur: 2, op: 0.6 },
  { cls: "left-[58%] top-[50%] w-[42vw] h-[22vw]", blur: 2, op: 0.58 },
];

const BOTTOM_BANK: CloudCfg[] = [
  { cls: "left-[-6%] bottom-[-8%] w-[48vw] h-[26vw]", blur: 0.5, op: 0.96 },
  { cls: "left-[30%] bottom-[-12%] w-[54vw] h-[28vw]", blur: 0.4, op: 1 },
  { cls: "left-[64%] bottom-[-8%] w-[46vw] h-[26vw]", blur: 0.6, op: 0.95 },
  { cls: "left-[10%] bottom-[22%] w-[44vw] h-[24vw]", blur: 1, op: 0.84 },
  { cls: "left-[48%] bottom-[26%] w-[50vw] h-[26vw]", blur: 1.2, op: 0.8 },
  { cls: "left-[-4%] bottom-[46%] w-[40vw] h-[22vw]", blur: 2, op: 0.6 },
  { cls: "left-[60%] bottom-[48%] w-[42vw] h-[22vw]", blur: 2, op: 0.56 },
];

function Cloud({ cls, blur, op }: CloudCfg) {
  return (
    <svg
      aria-hidden
      className={`absolute ${cls}`}
      viewBox="0 0 240 120"
      preserveAspectRatio="none"
      fill="#ffffff"
      style={{ filter: `blur(${blur}px)`, opacity: op, willChange: "transform" }}
    >
      {CLOUD_SHAPE}
    </svg>
  );
}

export function CloudTheater({
  ready,
  children,
}: {
  /** True once the ink SVG is inlined so its `.cls-2` glyphs exist to type. */
  ready: boolean;
  /** The two centred assets (ink phrase host + RaJA mascot). */
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const topBankRef = useRef<HTMLDivElement | null>(null);
  const botBankRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const whiteRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const section = root?.closest<HTMLElement>("section");
      const bg = bgRef.current;
      const topBank = topBankRef.current;
      const botBank = botBankRef.current;
      const stage = stageRef.current;
      const white = whiteRef.current;
      const hint = hintRef.current;
      const dot = dotRef.current;
      if (!root || !section || !bg || !topBank || !botBank || !stage || !white || !hint || !dot)
        return;
      if (!ready) return;

      // Ink glyphs live inside the inlined SVG (a descendant of `stage`).
      const svg = stage.querySelector("svg");
      const fills = svg
        ? Array.from(svg.querySelectorAll<SVGPathElement>(".cls-2"))
        : [];
      const strokes = svg
        ? Array.from(svg.querySelectorAll<SVGPathElement>(".cls-1"))
        : [];
      // Type in reading order (left → right) — strokes are redundant, hide them.
      const glyphs = fills.slice().sort((a, b) => a.getBBox().x - b.getBBox().x);
      gsap.set(strokes, { opacity: 0 });

      const snap = ScrollTrigger.getById("page-section-snap");
      const enableSnap = () => snap?.enable();
      const disableSnap = () => snap?.disable();

      const mm = gsap.matchMedia();

      // ——— Reduced motion: static, calm reveal. No pin, no flash. ———
      // The end-of-scene sky (a few thin high clouds, assets fully shown) —
      // banks parked OUT of the clearing so nothing veils the pair.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(bg, { backgroundColor: BG_CALM });
        gsap.set(topBank, { yPercent: -96, opacity: 0.3 });
        gsap.set(botBank, { yPercent: 168, opacity: 0 });
        gsap.set(white, { opacity: 0 });
        gsap.set(stage, { opacity: 1, scale: 1, y: 0 });
        gsap.set(glyphs, { opacity: 1, y: 0 });
        // No pinned scroll scene here, so no "scroll" cue.
        gsap.set(hint, { opacity: 0 });
      });

      // ——— Motion OK: the pinned, scrubbed cloud theatre. ———
      mm.add(
        {
          isMobile: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
          isDesktop:
            "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        },
        (ctx) => {
          const isMobile = !!ctx.conditions?.isMobile;
          const pinVh = isMobile ? PIN_VH_MOBILE : PIN_VH_DESKTOP;

          // Initial state — clouds already drifting IN from top/bottom (so the
          // entry frame is never an empty screen), assets hidden, no whiteout.
          gsap.set(bg, { backgroundColor: BG_START });
          gsap.set(topBank, { yPercent: -40, opacity: 0.55 });
          gsap.set(botBank, { yPercent: 40, opacity: 0.55 });
          gsap.set(white, { opacity: 0 });
          gsap.set(stage, { opacity: 0, scale: 0.92, y: 14 });
          gsap.set(glyphs, { opacity: 0, y: 16 });
          gsap.set(hint, { opacity: 1, y: 0 });

          // Scroll cue — a looping drip inside the mouse glyph + a gentle bob,
          // so the cloud-filled opening reads as "scroll", not "stuck". These
          // loops run independent of scroll; the timeline only gates opacity.
          const drip = gsap.fromTo(
            dot,
            { y: 0, opacity: 1 },
            { y: 12, opacity: 0, duration: 1.1, ease: "power1.in", repeat: -1, repeatDelay: 0.15 },
          );
          const bob = gsap.to(hint, { y: 5, duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true });

          // Master timeline — total duration 1; the scrub maps scroll 0→1
          // linearly onto it. Positions below are absolute progress fractions.
          const tl = gsap.timeline();

          // 1 — GATHER (0 → .30): banks flood in and fill; bg lifts to white.
          tl.to(topBank, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(botBank, { yPercent: 0, opacity: 1, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(bg, { backgroundColor: BG_FILL, duration: 0.3, ease: "power1.inOut" }, 0);

          // Scroll cue fades out as soon as the scene gets moving — its job
          // (telling the user this is scroll-driven) is done by then.
          tl.to(hint, { opacity: 0, duration: 0.12, ease: "power1.in" }, 0.08);

          // 2 — WHITEOUT (.30 → .44): brief near-white flash at peak density.
          tl.to(white, { opacity: 1, duration: 0.14, ease: "power1.in" }, 0.3);

          // 3 — PART (.46 → .70): banks lift/sink apart; the white clears from
          // behind them (not popped off) — revealing the clearing.
          tl.to(topBank, { yPercent: -118, opacity: 0.85, duration: 0.24, ease: "power2.out" }, 0.46)
            .to(botBank, { yPercent: 118, opacity: 0.85, duration: 0.24, ease: "power2.out" }, 0.46)
            .to(white, { opacity: 0, duration: 0.18, ease: "power1.out" }, 0.46);

          // 4 — REVEAL (.52 → .70): the pair settles in; ink types L→R.
          tl.to(stage, { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: "power3.out" }, 0.52);
          if (glyphs.length) {
            // `amount` (not `each`) spreads ALL glyphs across a fixed total
            // window regardless of glyph count — otherwise the per-glyph
            // stagger inflates the timeline's duration and shifts every beat.
            tl.to(glyphs, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out", stagger: { amount: 0.12, from: "start" } }, 0.5);
          }

          // (.70 → .76 dwell — no tweens, the payoff frame holds.)

          // 5 — OPEN TO SKY (.76 → 1.0): clouds thin into the top band, bg
          // opens to Preschool cyan, the assets exit. Ends EXACTLY on #b8e8fa.
          tl.to(topBank, { yPercent: -96, opacity: 0.3, duration: 0.24, ease: "power1.inOut" }, 0.76)
            .to(botBank, { yPercent: 168, opacity: 0, duration: 0.24, ease: "power1.inOut" }, 0.76)
            .to(bg, { backgroundColor: BG_SKY, duration: 0.24, ease: "power1.inOut" }, 0.76)
            .to(stage, { opacity: 0, y: -12, scale: 0.98, duration: 0.22, ease: "power1.in" }, 0.78);

          const pin = ScrollTrigger.create({
            id: "cloud-theater",
            trigger: section,
            pin: section,
            // Body is a proxied scroller (Lenis drives native scroll); a
            // transform pin would drift, so force fixed positioning.
            pinType: "fixed",
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // This pin's spacer shifts every section BELOW Intro. Refresh it
            // before those sections' fade triggers so they measure with the
            // spacer already in place — otherwise Preschool (and the rest) end
            // up past their fade-out and render at opacity 0 (content hidden).
            refreshPriority: 1,
            scrub: 0.5,
            start: () => "top top",
            end: () => "+=" + window.innerHeight * pinVh,
            animation: tl,
            // The page's directional snap must not yank the user to a section
            // edge mid-scene — pause it for the scene, resume on the way out.
            onEnter: disableSnap,
            onEnterBack: disableSnap,
            onLeave: enableSnap,
            onLeaveBack: enableSnap,
          });

          // The pin is built after the async ink-SVG load — i.e. after the
          // provider's initial load-refresh — so the spacer it just added has
          // not been accounted for by the triggers below. Refresh once now
          // (refreshPriority above keeps the order correct) so every section's
          // fade trigger re-measures against the real, spacer-inclusive layout.
          ScrollTrigger.refresh();

          return () => {
            enableSnap();
            pin.kill(true);
            tl.kill();
            drip.kill();
            bob.kill();
          };
        },
      );

      return () => {
        enableSnap();
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [ready] },
  );

  return (
    <div ref={rootRef} className="relative h-screen w-full overflow-hidden">
      {/* bgFill — the colour bridge (green-white → white → sky cyan). */}
      <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: BG_START }} />

      {/* Assets stage — centred pair, revealed in the clearing. */}
      <div ref={stageRef} className="absolute inset-0 z-[1] grid place-items-center">
        <div className="shell flex w-full max-w-[72rem] flex-col items-center justify-center gap-7 md:flex-row md:gap-10">
          {children}
        </div>
      </div>

      {/* Cloud banks — above the assets so parting UNCOVERS them. */}
      <div ref={topBankRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[72vh]" style={{ willChange: "transform" }}>
        {TOP_BANK.map((c, i) => (
          <Cloud key={i} {...c} />
        ))}
      </div>
      <div ref={botBankRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[72vh]" style={{ willChange: "transform" }}>
        {BOTTOM_BANK.map((c, i) => (
          <Cloud key={i} {...c} />
        ))}
      </div>

      {/* Whiteout veil — the brief full flash; guarantees 100% coverage at peak. */}
      <div ref={whiteRef} aria-hidden className="pointer-events-none absolute inset-0 z-[3]" style={{ backgroundColor: WHITEOUT, opacity: 0 }} />

      {/* Scroll cue — a mouse glyph (drip dot) + chevron at the bottom, telling
          users the cloud scene is scroll-driven, not stuck. Outer div owns the
          horizontal centring; inner (hintRef) is what GSAP bobs/fades, so its
          transform never clobbers the -translate-x-1/2. */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-[4] -translate-x-1/2">
        <div ref={hintRef} className="flex flex-col items-center gap-2">
          <span
            className="flex h-9 w-[1.35rem] justify-center rounded-full border-2 pt-1.5"
            style={{ borderColor: CUE_COLOR }}
          >
            <span ref={dotRef} className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CUE_COLOR }} />
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden>
            <path d="M1 1l7 7 7-7" stroke={CUE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
