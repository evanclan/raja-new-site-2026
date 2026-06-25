"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Uniform section brand-mark.
 *
 * Every program section (Study Abroad · Academy · Preschool · Clab · English)
 * renders its logo through this one component, directly beneath the section's
 * number badge + label, so all section headers share a single format:
 *
 *   02 · RaJA アカデミー   ← number badge + label
 *   [ logo ]              ← here, uniform height, grows on wider screens
 *
 * Sizing is HEIGHT-based (the clamp lives on the image, width auto) so logos
 * of different aspect ratios — a square crest, a wide wordmark, a tall frog —
 * all read at the same visual height. The height is fluid: it scales up on
 * bigger screens and down on mobile, matching the rest of the site.
 */
export function SectionLogo({
  src,
  width,
  height,
  alt = "",
  className = "",
  large = false,
  sizeClassName,
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
  /** Positioning only (e.g. spacing above). Size is owned by this component. */
  className?: string;
  /** Render at a larger size than the default uniform height. */
  large?: boolean;
  /** Override the fluid height clamp for this instance (e.g. a tall crest). */
  sizeClassName?: string;
}) {
  const reduce = useReducedMotion();
  // SVGs skip Next's image optimizer (it blocks SVG without
  // `dangerouslyAllowSVG`); they're already tiny vectors. PNGs stay optimized.
  const unoptimized = src.toLowerCase().endsWith(".svg");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`w-fit ${className}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="w-fit"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={unoptimized}
          // Large emblems render up to ~24rem (≈384px) on widescreen, so they
          // need a bigger source there to stay crisp; mobile stays light.
          sizes={large ? "(min-width: 768px) 384px, 160px" : "240px"}
          draggable={false}
          // Height owns the size (uniform across sections); width follows the
          // image's own aspect ratio. Grows strongly on widescreen via the vw
          // term. Default: ~60px mobile · ~94px @1440 · ~125px @1920. Large
          // emblems run bigger: ~216px @1440 · ~288px @1920 · 384px cap.
          className={`${sizeClassName ?? (large ? "h-[clamp(8rem,15vw,24rem)] max-md:h-[6rem]" : "h-[clamp(4.25rem,6.5vw,9rem)] max-md:h-[3.25rem]")} w-auto select-none`}
          style={{ filter: "drop-shadow(0 8px 16px rgba(8,10,40,0.18))" }}
        />
      </motion.div>
    </motion.div>
  );
}
