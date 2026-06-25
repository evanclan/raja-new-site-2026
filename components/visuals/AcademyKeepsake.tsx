"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useT } from "@/lib/i18n";
import { useParallaxPx } from "@/lib/useViewportPx";
import { AcademyGallery } from "./AcademyGallery";

// ————————————————————————————————————————————————————————
// Academy · 「星に手をのばす」— Reaching for the Stars
//
// The real RaJA 卒園式 (preschool graduation) photo — now a
// background-free cutout — stands FULL-HEIGHT in the academy's
// indigo night sky. No frame, no matte: the two graduates simply
// *are there*, grounded by a soft contact shadow and lifted by a
// warm starlight halo, with a single dashed constellation line and
// one gold seal as the only ornament (the "three jewels" rule).
//
// Motion:
//   · Entrance (halo bloom, photo rise, seal pop) is choreographed by
//     the section's single GSAP timeline in Academy.tsx, so the photo
//     LEADS one coherent reveal instead of several independent ones.
//   · INNER wrapper = infinite, tiny idle "breath" (decoupled).
//   · Column parallax via useScroll/useTransform.
// Everything heavy is gated behind prefers-reduced-motion.
// ————————————————————————————————————————————————————————

const EASE = [0.22, 1, 0.36, 1] as const;

export function AcademyKeepsake() {
  const t = useT();
  const p = t.panels.academy;
  const reduce = useReducedMotion();

  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const par = useParallaxPx(0.05, 28, 60); // ~±40px, scales with viewport height
  const parallaxY = useTransform(scrollYProgress, [0, 1], [par, -par]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[clamp(60vh,70vw,94vh)] w-full max-w-[min(52.5rem,90vw)] md:ml-auto md:mr-0"
    >
      {/* Warm starlight halo — a soft radial bloom behind the figures
          that lifts them off the starfield without dimming the
          star-map. Gold core fading into an indigo cushion. */}
      <div
        aria-hidden
        data-academy="halo"
        className="pointer-events-none absolute left-1/2 top-[36%] h-[72%] w-[88%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,210,61,0.16) 0%, rgba(255,210,61,0.05) 38%, rgba(25,29,92,0.0) 72%)",
        }}
      />

      {/* Constellation line — drawn from down by the seal up to one
          bright amber star, in the backdrop's dashed-stroke language. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.path
          d="M 36 250 C 60 190, 120 150, 168 44"
          stroke="#f99e49"
          strokeWidth="0.7"
          strokeDasharray="1 6"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.45 : 0 }}
          whileInView={{ pathLength: 1, opacity: 0.45 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, delay: 0.9, ease: EASE }}
        />
        <motion.circle
          cx="168"
          cy="44"
          r="2.2"
          fill="#ffd23d"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 5px #ffd23d)" }}
        >
          {!reduce && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2.6s"
              begin="2s"
              repeatCount="indefinite"
            />
          )}
        </motion.circle>
      </svg>

      {/* Soft contact shadow — grounds the figures so the cutout
          doesn't read as pasted-on. A blurred indigo ellipse under
          their feet at the very bottom. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[2%] left-1/2 h-[5%] w-[58%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(8,10,40,0.55) 0%, rgba(8,10,40,0) 80%)",
          filter: "blur(6px)",
        }}
      />

      {/* OUTER — column parallax (scroll-linked). */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0">
        {/* ENTRANCE — opacity/rise/scale, driven by the section's single
            GSAP timeline (Academy.tsx) so the photo leads the reveal. */}
        <div data-academy="photo" className="absolute inset-0">
          {/* INNER — tiny, slow idle "breath", decoupled from entrance.
              Calmed (−4px / 8s) so the hero stays alive without competing
              with the other ornaments for attention. */}
          <motion.div
            className="absolute inset-0 origin-bottom scale-[1.15]"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/academy/academy-hero-main-last.png"
              alt={p.photoAlt}
              fill
              sizes="(max-width: 768px) 80vw, 600px"
              quality={85}
              className="object-contain object-bottom"
              style={{
                // A grounded drop-shadow so the figures sit in the
                // indigo air rather than float flatly.
                filter:
                  "drop-shadow(0 24px 40px rgba(8,10,40,0.45)) drop-shadow(0 6px 12px rgba(8,10,40,0.35))",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Class of 2026 — the student photos as a constellation floating
          in the sky around the graduates; click any node to open the
          lightbox. */}
      <AcademyGallery />
    </div>
  );
}
