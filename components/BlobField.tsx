"use client";

import { motion } from "framer-motion";

/**
 * BlobField — inlined version of `public/hero-main/preloader-blobs.svg`.
 *
 * The component fills its parent and renders the original 7 blob paths from
 * the brand asset with their exact fills. Both the preloader and the hero
 * render this same component so the blob composition is visually identical —
 * what changes is the backdrop (dark ink → cream) and the mode:
 *
 *  - `mode="background"` — vibrant, still. Used by the preloader; the SVG is
 *    the decorative backdrop behind the word-mark.
 *  - `mode="ambient"` — softer, with a gentle per-blob drift so the hero feels
 *    alive once the scene settles.
 *
 * The SVG is stretched with `xMidYMid slice` so the same blob coordinates map
 * identically between preloader and hero viewports — that's what makes the
 * cross-fade feel like a single continuous scene.
 */
type BlobPath = {
  d: string;
  fill: string;
  /** Ambient drift in SVG-space units (viewBox is 65.71 × 43.63). */
  fx: number;
  fy: number;
};

const BLOB_PATHS: BlobPath[] = [
  {
    // Yellow (cls-5)
    d: "M19.19,23.94c-1.69-2.5-1.99-5.74-.92-8.51-.15-1.04.47-1.81,1.24-2.15.96-.87,2.91-.84,3.14.74.12.8.21,1.6.26,2.39,1.76,1.88,2.46,4.6,1.65,7.17-.35,1.09-1.4,1.52-2.31,1.25-.82.53-2.18.32-2.82-.53-.05-.07-.1-.14-.15-.21-.03-.04-.07-.09-.1-.14Z",
    fill: "#f3c43d",
    fx: 0.9,
    fy: -0.7,
  },
  {
    // Pink / magenta (cls-3)
    d: "M40.07,19.82c.67-1.07,2-1.18,2.93-.38,2.13,1.84,2.68,5.05,2.55,7.74-.07,1.49-.8,2.89-2.34,3.27-1.47.36-2.67-.56-3.16-1.9-.02-.06-.04-.12-.07-.18-1.6-2.59-1.54-5.96.09-8.55Z",
    fill: "#bc5ba3",
    fx: -0.8,
    fy: 1.0,
  },
  {
    // Green (cls-4)
    d: "M8.41,39.99c-.92-1.66-.95-3.69-.19-5.39-1.4-1.7,1.05-4.11,2.69-2.57.82-.08,1.61.41,1.96,1.33.23.61.44,1.25.61,1.9,1.44,1.18.96,3.77,0,5.61-.32.81-.83,1.57-1.59,2.24-1.05.92-2.7.58-3.12-.82-.1-.35-.18-.77-.24-1.24-.17-.35-.2-.71-.12-1.06Z",
    fill: "#80c350",
    fx: 0.7,
    fy: 1.1,
  },
  {
    // Light blue / sky (cls-7)
    d: "M.93,8.09c.21-.25.45-.46.72-.62.55-1.05,1.9-1.62,2.82-.46.13.16.25.33.36.5.48.22.89.64,1.12,1.2.04.09.08.19.11.29.3.56.51,1.18.7,1.78.74,2.42,1.51,6.16-1.14,7.77-2.18,1.33-5.1-.04-5.23-2.6-.02-.47.1-.85.32-1.14-.68-2.21-1.29-4.91.22-6.72Z",
    fill: "#53a6dc",
    fx: 1.1,
    fy: 0.6,
  },
  {
    // Orange (cls-2)
    d: "M39.57.15c1.09.36,1.97,1.54,2.42,2.73,1.04,1.45.78,3.4-.4,4.68-.65.7-1.45.71-2.09.35-.74.07-1.47-.14-2.07-.54-.54-.15-1.03-.46-1.41-.95-1.78-2.29.33-7.35,3.55-6.27Z",
    fill: "#f3733b",
    fx: -1.0,
    fy: -0.7,
  },
  {
    // Deep purple (cls-1)
    d: "M52.99,34.36c.11-.17.23-.31.36-.45-.25-1.89,2.75-2.62,3.62-.75.77.37,1.28,1.09,1.74,1.85.78,1.3,1.34,2.89,1.13,4.34.1.86.11,1.75-.32,2.48-.9,1.52-2.6,1.52-3.86.71-.59-.09-1.15-.33-1.63-.73-.05-.04-.1-.07-.14-.12-.2-.18-.38-.39-.54-.62-.26-.37-.35-.74-.33-1.08-.69-1.81-1.1-4.05-.03-5.64Z",
    fill: "#643996",
    fx: -0.9,
    fy: -1.0,
  },
  {
    // Indigo / blue (cls-6)
    d: "M60.6,22c.29-.87,1.08-1.53,1.99-1.26.58.04,1.14.32,1.42.9.06.11.1.23.16.35,1.04,1.23,1.49,2.78,1.34,4.34.18,1.11.25,2.24.18,3.39-.11,1.88-2.43,2.49-3.47.94-.4-.59-.72-1.19-.98-1.81-1.49-2-1.75-4.59-.63-6.85Z",
    fill: "#3d60ac",
    fx: 0.8,
    fy: 0.9,
  },
];

type Props = {
  mode: "background" | "ambient";
  /** Override the target opacity. */
  opacity?: number;
  /** Fade the whole field in from opacity 0 on mount. */
  fadeInOnMount?: boolean;
  className?: string;
};

export function BlobField({
  mode,
  opacity,
  fadeInOnMount = false,
  className = "",
}: Props) {
  const animated = mode === "ambient";
  const targetOpacity = opacity ?? (mode === "background" ? 0.9 : 0.55);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.svg
        viewBox="0 0 65.71 43.63"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: fadeInOnMount ? 0 : targetOpacity }}
        animate={{ opacity: targetOpacity }}
        transition={{
          duration: fadeInOnMount ? 1.1 : 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: fadeInOnMount ? 0.3 : 0,
        }}
      >
        {BLOB_PATHS.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill={p.fill}
            animate={
              animated
                ? {
                    x: [0, p.fx, -p.fx * 0.55, p.fx * 0.3, 0],
                    y: [0, p.fy, -p.fy * 0.45, p.fy * 0.25, 0],
                  }
                : { x: 0, y: 0 }
            }
            transition={
              animated
                ? {
                    duration: 14 + i * 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2 + i * 0.18,
                  }
                : { duration: 0.4 }
            }
          />
        ))}
      </motion.svg>
    </div>
  );
}
