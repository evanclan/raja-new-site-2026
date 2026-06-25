"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// Preschool gallery — a SMALL horizontal marquee of the LINE-album
// candids, embedded in the panel below the campus cards. Deliberately
// compact (a thin scrolling strip) so it doesn't lengthen the panel.
//
// Technique (matches StudyAbroad's PhotoMarquee): the track holds the
// photo list twice back-to-back and a single linear `xPercent 0 → -50`
// tween scrolls it forever — when it wraps, the second copy sits exactly
// where the first began, so the loop seam is invisible. Constant pixel
// speed (re-timed on resize) reads the same on phone and widescreen.
// Reduced-motion users get a still, legible row. Each thumb keeps its
// own aspect (fixed height, auto width) so nothing is cropped.
// ————————————————————————————————————————————————————————

// n = file index; w/h = intrinsic size (6 portrait, 2 landscape).
const PHOTOS = [
  { n: 1, w: 1108, h: 1477 },
  { n: 5, w: 1477, h: 1108 },
  { n: 2, w: 1108, h: 1477 },
  { n: 3, w: 1108, h: 1477 },
  { n: 6, w: 1477, h: 1108 },
  { n: 4, w: 1108, h: 1477 },
  { n: 7, w: 1108, h: 1477 },
  { n: 8, w: 1108, h: 1477 },
] as const;

const SPEED = 26; // px/sec

export function PreschoolGallery() {
  const { locale } = useI18n();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Doubled list → seamless loop.
  const loop = [...PHOTOS, ...PHOTOS];

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        let tween: gsap.core.Tween | null = null;
        const build = () => {
          tween?.kill();
          gsap.set(track, { xPercent: 0 });
          const dist = track.scrollWidth / 2; // one copy's width
          tween = gsap.to(track, {
            xPercent: -50,
            duration: Math.max(16, dist / SPEED),
            ease: "none",
            repeat: -1,
          });
        };
        build();
        // Re-time on layout change (provider debounces a refresh on resize).
        ScrollTrigger.addEventListener("refresh", build);
        return () => {
          tween?.kill();
          ScrollTrigger.removeEventListener("refresh", build);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const label = locale === "ja" ? "アルバム" : "Gallery";

  return (
    <div className="mt-7 max-w-md">
      <p
        className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.22em] uppercase"
        style={{ color: "#0e1b3c", opacity: 0.6 }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--color-peach)" }}
          aria-hidden
        />
        {label}
      </p>

      <div
        ref={rootRef}
        className="relative overflow-hidden max-md:overflow-x-auto max-md:overscroll-x-contain max-md:[scroll-snap-type:x_proximity] max-md:[-webkit-overflow-scrolling:touch]"
        // Soft edge fades so thumbs emerge / exit rather than hard-clipping.
        // On mobile the mask still applies but overflow-x-auto overrides overflow-hidden
        // for the cross-axis, enabling touch-swipe while keeping the fade aesthetic.
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
        }}
        aria-label={label}
        aria-roledescription="marquee"
      >
        <div
          ref={trackRef}
          className="flex w-max items-center gap-3 py-1 max-md:pr-4"
          style={{ willChange: "transform" }}
        >
          {loop.map((p, i) => {
            const dup = i >= PHOTOS.length;
            return (
              <div
                key={i}
                aria-hidden={dup}
                className="relative h-20 shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_6px_16px_-10px_rgba(8,10,40,0.55)] ring-1 ring-white/60 max-md:[scroll-snap-align:start]"
              >
                <Image
                  src={`/preschool/gallery/LINE_ALBUM_2026.04_260624_${p.n}.jpg`}
                  alt={dup ? "" : `${label} ${p.n}`}
                  width={p.w}
                  height={p.h}
                  sizes="160px"
                  draggable={false}
                  className="h-20 w-auto object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
