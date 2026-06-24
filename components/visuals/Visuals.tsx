"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useI18n } from "@/lib/i18n";
import { remPx } from "@/lib/useViewportPx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Illustrated placeholder visuals for each panel.
 * These are SVG/div compositions — replace with final illustrations later.
 */

// ————————————————————————————————————————————————————————
// Panel 1 — Kaeru Ryugaku · Passport brochure
//
// A direct staging of the reference composition in
// /kaeruryugaku/home-assets/final.svg — the six real brochure
// photos (1.svg through 6.svg) arranged in a horizontal row
// like the printed piece. Each source SVG already ships with
// its own parallelogram clip path and brand-coloured frame
// built in, so we just drop them in <img> and let the
// animation orchestrate them.
//
// The official kaeru (frog) mascot from Logo.svg hops into
// frame along an arc and lands above the row — a literal
// "蛙留学" (frog abroad) moment. Each card fans up into place
// in a staggered sequence, then settles into a slow idle bob
// so the row feels alive rather than static.
//
// Asset ordering matches the final.svg reading order:
//   1.svg → blue      (#569ecc)
//   2.svg → green     (#7db852)
//   3.svg → purple    (#61358b)
//   4.svg → orange    (#e4703d)
//   5.svg → pink      (#b15896)
//   6.svg → navy      (#3d5ca0)
// The frame colour of each file is repeated here so halos,
// labels, and the flight arcs can colour-match precisely.
// ————————————————————————————————————————————————————————

const KAERU_PANELS = [
  {
    src: "/kaeruryugaku/home-assets/1.svg",
    c: "#569ecc",
    label: "Sky",
    labelJa: "そら",
  },
  {
    src: "/kaeruryugaku/home-assets/2.svg",
    c: "#7db852",
    label: "Home",
    labelJa: "ホーム",
  },
  {
    src: "/kaeruryugaku/home-assets/3.svg",
    c: "#61358b",
    label: "Culture",
    labelJa: "文化",
  },
  {
    src: "/kaeruryugaku/home-assets/4.svg",
    c: "#e4703d",
    label: "Friends",
    labelJa: "なかま",
  },
  {
    src: "/kaeruryugaku/home-assets/5.svg",
    c: "#b15896",
    label: "Adventure",
    labelJa: "ぼうけん",
  },
  {
    src: "/kaeruryugaku/home-assets/6.svg",
    c: "#3d5ca0",
    label: "Growth",
    labelJa: "せいちょう",
  },
] as const;

export function KaeruRyugakuVisual() {
  const { locale } = useI18n();

  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-[620px]">
      {/* ——— Coloured halos behind each card ———
          Large blurred discs in the exact frame colour of the
          card above them, echoing the confetti scatter at the
          top of Logo.svg. They bloom in just before the card
          arrives so the stage feels pre-lit. */}
      <div className="pointer-events-none absolute inset-0">
        {KAERU_PANELS.map((p, i) => (
          <motion.span
            key={`halo-${i}`}
            className="absolute rounded-full"
            style={{
              width: 96,
              height: 96,
              left: `calc(${6 + i * 14.6}% )`,
              top: `${58 + (i % 2 === 0 ? -4 : 4)}%`,
              background: p.c,
              filter: "blur(32px)",
              opacity: 0,
            }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{ scale: [1, 1.12, 1] }}
            transition={{
              scale: {
                duration: 5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              },
              opacity: { duration: 1, delay: 0.4 + i * 0.08 },
            }}
          />
        ))}
      </div>

      {/* ——— Kaeru mascot (Logo.svg) — hops into frame ———
          The official brand logo travels in along an arc that
          evokes a frog's leap, then settles above the card row
          with a gentle idle bob.
          Two-layer structure:
            · outer motion layer runs the once-off arrival arc.
            · inner motion layer runs the infinite idle bob,
              independent of the arrival transform, so framer's
              looping animation can't conflict with the entrance
              transform. */}
      <div className="pointer-events-none absolute left-[32%] top-[-4%] z-20 w-[36%]">
        <motion.div
          initial={{ x: -220, y: 40, rotate: -18, opacity: 0 }}
          whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            x: { duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 1.4, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] },
            rotate: { duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6, delay: 0.2 },
          }}
          style={{
            filter:
              "drop-shadow(0 18px 30px rgba(43,182,115,0.35)) drop-shadow(0 6px 10px rgba(32,35,58,0.18))",
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1.5, -1.5, 0] }}
            transition={{
              y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image
              src="/kaeruryugaku/home-assets/Logo.svg"
              alt="かえる留学"
              width={320}
              height={380}
              draggable={false}
              priority={false}
              className="h-auto w-full select-none"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ——— Six-card brochure row ———
          Each card is the real 1.svg…6.svg file, rendered as a
          plain <img>. The parallelogram clip path and brand
          colour are baked into each source file, so we don't
          have to re-draw them — we just stage entrance + idle
          motion. Cards overlap slightly (negative margins) so
          their slanted edges kiss, matching final.svg.
          <img> is used rather than next/image because each
          file embeds a large base64 PNG that Next's image
          optimizer would not process further — regular <img>
          plus lazy loading is the right call here. */}
      <div className="absolute inset-x-0 bottom-0 top-[32%] flex items-end justify-center px-[2%]">
        {KAERU_PANELS.map((panel, i) => {
          const restTilt = i % 2 === 0 ? -1.4 : 1.4;
          return (
            <motion.div
              key={panel.src}
              className="relative -mx-[6px] flex-1"
              style={{ aspectRatio: "148 / 262" }}
              initial={{
                opacity: 0,
                y: 90,
                scale: 0.72,
                rotate: restTilt * 5,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: restTilt,
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.95,
                delay: 0.55 + i * 0.11,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.6 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.6 + i * 0.15,
                }}
                style={{
                  transformOrigin: "50% 100%",
                  filter:
                    "drop-shadow(0 18px 28px rgba(32,35,58,0.22)) drop-shadow(0 4px 8px rgba(32,35,58,0.12))",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={panel.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full select-none"
                />
              </motion.div>
              {/* Destination label — a pill riding under each
                  card, colour-matched to its frame and swapped
                  by locale. */}
              <motion.span
                className="absolute left-1/2 top-[102%] -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium leading-none shadow-sm md:text-[11px]"
                style={{
                  background: "#ffffff",
                  color: panel.c,
                  border: `1.5px solid ${panel.c}`,
                }}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: 1.2 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {locale === "ja" ? panel.labelJa : panel.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* ——— Flight path + mascot plane ———
          A dashed green arc drawn across the top of the row,
          traced in as the section enters view. A tiny green
          plane glides along the arc on an infinite loop — the
          "journey" connecting the six destinations. */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 600 500"
        fill="none"
      >
        <motion.path
          d="M 40 220 Q 140 140 240 220 T 440 220 T 560 220"
          stroke="#2bb673"
          strokeWidth="1.8"
          strokeDasharray="4 8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            pathLength: {
              duration: 2.2,
              delay: 1.1,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: { duration: 0.4, delay: 1.1 },
          }}
        />
        <motion.path
          d="M0 0 L12 -4 L16 0 L12 4 Z"
          fill="#2bb673"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ once: true, amount: 0.3 }}
          animate={{
            x: [40, 240, 440, 560, 40],
            y: [220, 180, 220, 200, 220],
            rotate: [0, -10, 10, 0, 0],
          }}
          transition={{
            x: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 },
            y: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 },
            rotate: {
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            },
            opacity: { duration: 0.4, delay: 1.9 },
          }}
        />
      </svg>
    </div>
  );
}

// Panel 1 — Study Abroad · Global Map (legacy — kept for reference)
export function GlobeVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Orbit rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: "rgba(32,35,58,0.2)" }}
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1 - i * 0.12, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {/* Planet */}
      <motion.div
        className="absolute inset-[20%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #8fd8f5 0%, #3ba7d4 55%, #1e6fa3 100%)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Continents (abstract) */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M40,80 Q60,50 90,60 T150,70 Q160,90 140,110 Q120,130 90,120 T50,110 Q30,100 40,80 Z"
            fill="rgba(88,194,125,0.85)"
          />
          <path
            d="M110,140 Q140,130 160,150 T170,170 Q150,180 130,170 T110,140 Z"
            fill="rgba(88,194,125,0.75)"
          />
        </motion.svg>
      </motion.div>

      {/* Location pins orbiting */}
      {[
        { x: 10, y: 15, label: "Tokyo", color: "var(--color-peach)" },
        { x: 75, y: 10, label: "London", color: "var(--color-sun)" },
        { x: 85, y: 70, label: "Sydney", color: "var(--color-leaf)" },
        { x: 5, y: 70, label: "NYC", color: "var(--color-berry)" },
      ].map((p, i) => (
        <motion.div
          key={p.label}
          className="absolute flex flex-col items-center"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ scale: 0, y: -10 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            delay: 0.8 + i * 0.12,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <div
            className="h-5 w-5 rounded-full border-[3px] border-white shadow-lg"
            style={{ background: p.color }}
          />
          <div className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[var(--color-ink)] shadow-sm">
            {p.label}
          </div>
        </motion.div>
      ))}

      {/* Paper airplane crossing */}
      <motion.div
        aria-hidden
        className="absolute left-0 top-1/2 text-3xl"
        initial={{ x: 0, opacity: 0 }}
        whileInView={{ x: "500%", opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 3.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        ✈
      </motion.div>
    </div>
  );
}

// Panel 2 — Academy · Playground shapes
export function PlaygroundVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Ground arc */}
      <motion.div
        className="absolute bottom-[10%] left-0 right-0 h-[60%] rounded-t-[50%]"
        style={{ background: "rgba(255, 255, 255, 0.4)" }}
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Slide */}
      <motion.div
        className="absolute right-[15%] top-[20%] h-[50%] w-[14%] origin-top rounded-full"
        style={{ background: "var(--color-peach)" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Blocks */}
      {[
        { x: 20, y: 60, c: "var(--color-peach)", d: 0.4 },
        { x: 32, y: 65, c: "var(--color-leaf)", d: 0.55 },
        { x: 15, y: 72, c: "var(--color-berry)", d: 0.7 },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute h-[12%] w-[12%] rounded-xl shadow-lg"
          style={{ left: `${b.x}%`, top: `${b.y}%`, background: b.c }}
          initial={{ y: -200, rotate: -12, opacity: 0 }}
          whileInView={{ y: 0, rotate: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.9,
            delay: b.d,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        />
      ))}

      {/* Sun */}
      <motion.div
        className="absolute right-[10%] top-[6%] h-[18%] w-[18%] rounded-full"
        style={{
          background: "var(--color-sun)",
          boxShadow: "0 0 60px rgba(255, 210, 61, 0.7)",
        }}
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
      />

      {/* Balloon */}
      <motion.div
        className="absolute left-[55%] top-[8%] h-[18%] w-[12%] rounded-[50%]"
        style={{ background: "var(--color-berry)" }}
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: 0.7 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full rounded-[50%]"
          style={{ background: "var(--color-berry)" }}
        />
      </motion.div>

      {/* Character circles */}
      {[
        { x: 40, y: 78, c: "var(--color-sky)" },
        { x: 55, y: 80, c: "var(--color-peach)" },
        { x: 68, y: 78, c: "var(--color-leaf)" },
      ].map((ch, i) => (
        <motion.div
          key={i}
          className="absolute flex h-[9%] w-[9%] flex-col items-center"
          style={{ left: `${ch.x}%`, top: `${ch.y}%` }}
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.8 + i * 0.08 }}
        >
          <div
            className="h-full w-full rounded-full shadow-md"
            style={{ background: ch.c }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ————————————————————————————————————————————————————————
// Panel 3 — Preschool · the real child, cut out and floating
//
// The hero is a real photo (public/preschool/child.png) whose
// white studio background has been flood-filled to transparency,
// so the child reads as cut out — "no bg", floating in the ocean
// scene rather than boxed in a card. Design language:
//   · a soft white "ma" cushion (間) blooms behind the child so
//     the photo has breathing room and stays legible on the cyan
//     ocean — it doubles as a cloud/bubble the child rests in;
//   · a warm peach halo offsets behind for depth and ties to the
//     section's peach accent;
//   · an elliptical contact shadow grounds him on the wave line;
//   · entrance is a gentle bounce-in, then a slow idle bob.
// All amplitudes stay low; reduced-motion is honoured globally.
// ————————————————————————————————————————————————————————
export function PreschoolPhoto({
  fullHeight = false,
}: {
  /**
   * Fill the full height of the section (bottom-anchored hero) on
   * desktop. On mobile the photo always falls back to the boxed,
   * aspect-ratio'd layout so it stacks cleanly above the copy.
   */
  fullHeight?: boolean;
}) {
  const { t } = useI18n();
  const p = t.panels.preschool;

  return (
    <div
      className={
        fullHeight
          ? "relative mx-auto h-full min-h-[64svh] w-full md:min-h-0"
          : "relative mx-auto aspect-[1065/1265] w-full max-w-[clamp(18rem,40vw,27.5rem)]"
      }
    >
      {/* Warm peach halo — sits furthest back, offset up-left for
          depth and a hint of the section accent behind the cool
          photo. */}
      <motion.div
        className="absolute left-[8%] top-[8%] h-[78%] w-[78%] rounded-full"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,154,107,0.5) 0%, rgba(255,154,107,0) 72%)",
          filter: "blur(8px)",
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Soft white "ma" cushion — the cloud/bubble the child rests
          in; gives breathing room + legibility on the cyan. As a
          full-height hero it becomes a tall soft column of light
          behind the child rather than a tight blob. */}
      {fullHeight ? (
        <motion.div
          className="absolute inset-x-[3%] bottom-[2%] top-[6%]"
          style={{
            background:
              "radial-gradient(46% 50% at 50% 56%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 76%)",
            filter: "blur(2px)",
          }}
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <motion.div
          className="blob absolute left-1/2 top-1/2 h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(58% 58% at 50% 42%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 52%, rgba(255,255,255,0) 78%)",
            filter: "blur(1px)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="h-full w-full"
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {/* Contact shadow — a soft ellipse on the "floor" so the
          child is grounded rather than pasted. */}
      <motion.div
        className="absolute bottom-[2%] left-1/2 h-[6%] w-[56%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(0,52,98,0.4) 0%, rgba(0,52,98,0) 72%)",
          filter: "blur(4px)",
        }}
        initial={{ scaleX: 0.6, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* The child — cut out, anchored to the bottom of the frame,
          bounce-in then a slow idle bob. */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: 44, scale: 0.94, opacity: 0 }}
        whileInView={{ y: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: 1,
          ease: [0.175, 0.885, 0.32, 1.275],
        }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            filter:
              "drop-shadow(0 24px 30px rgba(0,52,98,0.32)) drop-shadow(0 6px 10px rgba(0,52,98,0.18))",
          }}
        >
          <Image
            src="/preschool/child-cutout.png"
            alt={p.imageAlt}
            width={1065}
            height={1265}
            sizes={
              fullHeight
                ? "(max-width: 768px) 80vw, 46vw"
                : "(max-width: 768px) 78vw, 440px"
            }
            draggable={false}
            priority={false}
            className="h-full w-full select-none object-contain object-bottom"
          />
        </motion.div>
      </motion.div>

      {/* Two small foreground bubbles for depth — distinct from the
          backdrop's rising bubbles, anchored near the child. */}
      {[
        { x: "6%", y: "30%", s: 26, d: 0.6 },
        { x: "86%", y: "48%", s: 18, d: 1.2 },
      ].map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 38%, rgba(255,255,255,0.05) 82%)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: 0.9 + i * 0.15,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <motion.span
            className="block h-full w-full rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.d,
            }}
          />
        </motion.span>
      ))}
    </div>
  );
}

// Panel 3 — Preschool · Soft nurturing (legacy abstract — kept for reference)
export function PreschoolVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Nest / cradle shape */}
      <motion.div
        className="absolute inset-[10%] blob"
        style={{ background: "rgba(255,255,255,0.5)" }}
        initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Heart */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <motion.svg
          viewBox="0 0 100 100"
          className="h-full w-full"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M50,85 C20,60 10,40 30,25 C45,15 50,30 50,40 C50,30 55,15 70,25 C90,40 80,60 50,85 Z"
            fill="var(--color-berry)"
          />
        </motion.svg>
      </motion.div>

      {/* Floating bottles / toys */}
      {[
        { x: 10, y: 20, icon: "🧸", d: 0.4 },
        { x: 80, y: 25, icon: "🍼", d: 0.55 },
        { x: 15, y: 75, icon: "📚", d: 0.7 },
        { x: 78, y: 72, icon: "🎨", d: 0.85 },
      ].map((t, i) => (
        <motion.div
          key={i}
          className="absolute grid h-[12%] w-[12%] place-items-center rounded-full bg-white text-2xl shadow-lg"
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
          initial={{ y: -30, opacity: 0, rotate: -20 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.7,
            delay: t.d,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <motion.span
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {t.icon}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// Panel 4 — Clab · Experiments & creativity
export function ClabVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Flask */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
      >
        <motion.path
          d="M85,40 L85,80 L45,160 Q40,180 60,180 L140,180 Q160,180 155,160 L115,80 L115,40 Z"
          fill="rgba(255,255,255,0.5)"
          stroke="var(--color-ink)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Liquid fill */}
        <motion.path
          d="M60,140 Q100,130 140,140 L150,165 Q150,175 140,175 L60,175 Q50,175 50,165 Z"
          fill="var(--color-sun)"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Bubbles */}
        {[
          { cx: 90, cy: 155, r: 4, d: 1.0 },
          { cx: 110, cy: 145, r: 6, d: 1.3 },
          { cx: 100, cy: 120, r: 5, d: 1.6 },
        ].map((b, i) => (
          <motion.circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill="white"
            initial={{ opacity: 0, cy: b.cy + 20 }}
            whileInView={{ opacity: [0, 1, 0], cy: b.cy - 30 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 2,
              delay: b.d,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>

      {/* Sparks */}
      {[
        { x: 20, y: 30, c: "var(--color-peach)", d: 0.4 },
        { x: 80, y: 25, c: "var(--color-sky)", d: 0.55 },
        { x: 10, y: 60, c: "var(--color-berry)", d: 0.7 },
        { x: 85, y: 55, c: "var(--color-sun)", d: 0.85 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-[8%] w-[8%] rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, background: s.c }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.8] }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.8,
            delay: s.d,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
        >
          <motion.div
            className="h-full w-full rounded-full"
            style={{ background: s.c }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Panel 5 — English · Modern learning
export function EnglishVisual() {
  const { locale } = useI18n();
  const letters = ["A", "B", "C", "1", "2", "3"];
  // Two chat lines alternate between locales so the visual always feels
  // bilingual — whichever locale you're viewing, the "other" voice is present.
  const bubbles =
    locale === "ja"
      ? ["こんにちは！", "Hello!", "いっしょに学ぼう。"]
      : ["Hello!", "こんにちは", "Let's learn together."];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <motion.div
        key={`b1-${locale}`}
        className="absolute left-[10%] top-[15%] rounded-[24px] rounded-bl-[4px] bg-white px-6 py-4 shadow-lg"
        initial={{ x: -40, y: 20, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-display text-xl text-[var(--color-ink)]">
          {bubbles[0]}
        </span>
      </motion.div>

      <motion.div
        key={`b2-${locale}`}
        className="absolute right-[10%] top-[35%] rounded-[24px] rounded-br-[4px] px-6 py-4 shadow-lg"
        style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}
        initial={{ x: 40, y: 20, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-display text-xl">{bubbles[1]}</span>
      </motion.div>

      <motion.div
        key={`b3-${locale}`}
        className="absolute left-[25%] top-[60%] rounded-[24px] rounded-bl-[4px] bg-white px-6 py-4 shadow-lg"
        initial={{ x: -40, y: 20, opacity: 0 }}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-display text-xl text-[var(--color-ink)]">
          {bubbles[2]}
        </span>
      </motion.div>

      {/* Floating letters */}
      {letters.map((l, i) => {
        const x = 8 + (i * 14) % 90;
        const y = 75 + Math.sin(i) * 8;
        return (
          <motion.span
            key={l}
            className="absolute font-display text-2xl"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              color:
                i % 3 === 0
                  ? "var(--color-sun)"
                  : i % 3 === 1
                  ? "var(--color-sky)"
                  : "var(--color-peach)",
            }}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.6,
              delay: 1.1 + i * 0.08,
              ease: [0.175, 0.885, 0.32, 1.275],
            }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.4 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            >
              {l}
            </motion.span>
          </motion.span>
        );
      })}
    </div>
  );
}

// ————————————————————————————————————————————————————————
// Let's Go English — Teacher lineup (GSAP centerpiece)
//
// The four real teachers (white-background studio portraits) are
// staged as tilted "sticker" cards on coloured backings drawn
// from the letsgoenglish.svg palette. The choreography ports the
// hero navigation-card pattern: a staggered fan-in on scroll, a
// slow idle bob, and a hover/focus state that lifts the card,
// pops a bilingual speech bubble, and dims the siblings so the
// chosen teacher takes the stage. A one-time "greeting wave"
// pops each bubble in turn after entrance, so the row feels alive
// even on touch devices. Everything is gated behind
// prefers-reduced-motion via gsap.matchMedia.
// ————————————————————————————————————————————————————————

const TEACHER_ASSETS = [
  { src: "/lets-go-english/chris.png", color: "#f15a29" }, // orange
  { src: "/lets-go-english/erika.png", color: "#3a9984" }, // teal
  { src: "/lets-go-english/miwa.png", color: "#e8b020" }, // amber
  { src: "/lets-go-english/maita.png", color: "#00bfe3" }, // cyan
] as const;

export function TeacherLineup() {
  const { t } = useI18n();
  const teachers = t.panels.english.teachers;
  const rootRef = useRef<HTMLUListElement | null>(null);
  const idleRef = useRef<gsap.core.Tween[]>([]);

  useGSAP(
    (_ctx, contextSafe) => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-teacher]"),
        );
        if (!cards.length) return;
        // Motion distances scaled to the fluid root (baseline ≈ original px).
        const drop = remPx(6); // ~96px entrance
        const lift = remPx(1); // ~16px hover lift
        const idleBob = remPx(0.5); // ~8px idle bob
        const pick = (sel: string) =>
          cards.map((c) => c.querySelector(sel) as HTMLElement);
        const photos = pick("[data-teacher-photo]");
        const bubbles = pick("[data-teacher-bubble]");
        const halos = pick("[data-teacher-halo]");
        const btns = pick("[data-teacher-btn]");
        const restRot = (i: number) => (i % 2 === 0 ? -2.2 : 2.2);

        const popBubble = (i: number) => {
          gsap.killTweensOf(bubbles[i]);
          gsap.to(bubbles[i], {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(2)",
          });
        };
        const hideBubble = (i: number) => {
          gsap.killTweensOf(bubbles[i]);
          gsap.to(bubbles[i], {
            opacity: 0,
            scale: 0.6,
            y: 10,
            duration: 0.3,
            ease: "power2.in",
          });
        };

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
          defaults: { ease: "power3.out" },
          onComplete: () => {
            idleRef.current.forEach((tw) => tw.kill());
            idleRef.current = cards.map((card, i) =>
              gsap.to(card, {
                y: "+=" + idleBob,
                rotate: restRot(i) + (i % 2 === 0 ? 0.8 : -0.8),
                duration: 2.6 + (i % 3) * 0.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: i * 0.1,
              }),
            );
            // Greeting wave — each teacher says hello in turn.
            bubbles.forEach((_, i) => {
              gsap.delayedCall(0.3 + i * 0.55, () => popBubble(i));
              gsap.delayedCall(0.3 + i * 0.55 + 1.5, () => hideBubble(i));
            });
          },
        });

        tl.set(cards, { transformOrigin: "50% 92%" })
          .set(bubbles, { opacity: 0, scale: 0.6, y: 10 })
          .fromTo(
            cards,
            {
              opacity: 0,
              y: drop,
              scale: 0.8,
              rotate: (i: number) => restRot(i) * 3,
              filter: "blur(10px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: (i: number) => restRot(i),
              filter: "blur(0px)",
              duration: 1.0,
              ease: "back.out(1.5)",
              stagger: { each: 0.12, from: "center" },
            },
          )
          .fromTo(
            halos,
            { opacity: 0, scale: 0.6 },
            { opacity: 0.32, scale: 1.05, duration: 0.6, stagger: 0.12 },
            "<0.15",
          );

        // Hover / focus — quickTo allocate-once, fire-often.
        const hov = cards.map((card, i) => ({
          y: gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" }),
          scale: gsap.quickTo(card, "scale", { duration: 0.5, ease: "power3.out" }),
          rotate: gsap.quickTo(card, "rotate", { duration: 0.5, ease: "power3.out" }),
          ps: gsap.quickTo(photos[i], "scale", { duration: 0.5, ease: "power3.out" }),
          ho: gsap.quickTo(halos[i], "opacity", { duration: 0.5, ease: "power2.out" }),
        }));

        const onEnter = contextSafe!((i: number) => {
          idleRef.current[i]?.pause();
          hov[i].y(-lift);
          hov[i].scale(1.05);
          hov[i].rotate(0);
          hov[i].ps(1.05);
          hov[i].ho(0.85);
          popBubble(i);
          cards.forEach((c, j) => {
            if (j === i) return;
            gsap.to(c, { opacity: 0.5, scale: 0.97, duration: 0.4, ease: "power2.out" });
          });
        });

        const onLeave = contextSafe!((i: number) => {
          hov[i].y(0);
          hov[i].scale(1);
          hov[i].rotate(restRot(i));
          hov[i].ps(1);
          hov[i].ho(0.32);
          hideBubble(i);
          idleRef.current[i]?.kill();
          idleRef.current[i] = gsap.to(cards[i], {
            y: "+=" + idleBob,
            rotate: restRot(i) + (i % 2 === 0 ? 0.8 : -0.8),
            duration: 2.6 + (i % 3) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 0.3,
          });
          cards.forEach((c, j) => {
            if (j === i) return;
            gsap.to(c, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" });
          });
        });

        const cleanups: Array<() => void> = [];
        btns.forEach((btn, i) => {
          const en = () => onEnter(i);
          const lv = () => onLeave(i);
          btn.addEventListener("mouseenter", en);
          btn.addEventListener("mouseleave", lv);
          btn.addEventListener("focus", en);
          btn.addEventListener("blur", lv);
          cleanups.push(() => {
            btn.removeEventListener("mouseenter", en);
            btn.removeEventListener("mouseleave", lv);
            btn.removeEventListener("focus", en);
            btn.removeEventListener("blur", lv);
          });
        });

        return () => {
          cleanups.forEach((fn) => fn());
          idleRef.current.forEach((tw) => tw.kill());
          idleRef.current = [];
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          root.querySelectorAll("[data-teacher]"),
        );
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "none" });
        gsap.set(root.querySelectorAll("[data-teacher-bubble]"), {
          opacity: 1,
          scale: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [] },
  );

  return (
    <ul
      ref={rootRef}
      className="grid grid-cols-2 gap-x-6 gap-y-12 md:flex md:items-end md:justify-center md:gap-8"
      aria-label="Let's Go English teachers"
    >
      {teachers.map((teacher, i) => {
        const a = TEACHER_ASSETS[i];
        return (
          <li
            key={teacher.name}
            data-teacher
            className="relative flex flex-col items-center md:w-[clamp(9.375rem,15vw,13rem)]"
            style={{ opacity: 0, willChange: "transform, opacity, filter" }}
          >
            {/* Bilingual speech bubble — popped by GSAP on hover/focus. */}
            <div
              data-teacher-bubble
              aria-hidden
              className="font-display pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2 -translate-y-full rounded-2xl bg-white px-3.5 py-2 text-sm whitespace-nowrap shadow-lg"
              style={{ color: a.color, opacity: 0 }}
            >
              {teacher.bubble}
              <span
                aria-hidden
                className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
              />
            </div>

            <button
              data-teacher-btn
              type="button"
              aria-label={`${teacher.name} — ${teacher.role}`}
              className="relative block w-full rounded-[26px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ink)]/40 focus-visible:ring-offset-2"
              style={{ willChange: "transform" }}
            >
              {/* Hover halo */}
              <span
                aria-hidden
                data-teacher-halo
                className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] blur-2xl"
                style={{ background: a.color, opacity: 0 }}
              />
              {/* Coloured sticker backing */}
              <span
                aria-hidden
                className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[26px]"
                style={{ background: a.color }}
              />
              {/* White photo card (teacher's white studio bg blends in) */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[26px] bg-white shadow-xl ring-1 ring-black/5">
                <Image
                  data-teacher-photo
                  src={a.src}
                  alt={teacher.name}
                  fill
                  quality={85}
                  sizes="(max-width: 768px) 44vw, 200px"
                  draggable={false}
                  className="select-none object-cover object-top"
                  style={{ transformOrigin: "50% 100%" }}
                />
              </div>
            </button>

            {/* Name + role */}
            <div className="mt-3 text-center">
              <div
                className="font-display text-lg leading-tight"
                style={{ color: "var(--color-ink)" }}
              >
                {teacher.name}
              </div>
              <div
                className="mt-0.5 inline-flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-ink)", opacity: 0.65 }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: a.color }}
                />
                {teacher.role}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
