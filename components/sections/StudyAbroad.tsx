"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { Section } from "../Section";
import { StudyAbroadBackdrop } from "../backdrops/SectionBackdrops";
import { useT, useI18n } from "@/lib/i18n";
import { remPx } from "@/lib/useViewportPx";
import { SectionLogo } from "../SectionLogo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// Kaeru Ryugaku — redesigned fullscreen section
//
// Layout
//   ┌─────────────────────────────────────────────┐
//   │  TOP  ~44vh                                 │
//   │  ┌────────────────┬──────────────────────┐  │
//   │  │ Logo + copy    │ Photo-pebble conveyor│  │
//   │  │ (left column)  │ (right → left loop)  │  │
//   │  └────────────────┴──────────────────────┘  │
//   ├─────────────────────────────────────────────┤
//   │  BOTTOM  ~56vh                              │
//   │  Six 1.svg–6.svg brochure panels, big       │
//   └─────────────────────────────────────────────┘
//
// Design notes
// • Right column is a seamless right→left marquee of 6 organic
//   "photo pebble" frames — one per study-abroad destination
//   (New Zealand, UK, Canada, Australia, Philippines, Malta).
//   Track holds two copies of the frame list back-to-back and
//   tweens xPercent 0 → -50 at a constant linear speed, so the
//   loop point is invisible.
// • Frames are intentionally small (clamp-capped width, 3:4
//   aspect) so 4–5 read at once on a typical viewport with
//   comfortable gaps between them — no "wall of postcards".
// • The pebble clipPath is applied directly to the destination
//   photo, so imagery fills the entire frame silhouette edge
//   to edge — no white matte, no inner padding.
// • Every frame carries a real Kaeru frog-mascot sticker
//   (1.svg…5.svg), each at a different corner (tl/tr/bl/br), so
//   placement reads as hand-arranged rather than templated.
//   Stickers overhang the pebble edge and bob on their own
//   short timing.
// • Breathe: each frame's inner photo wrapper scales 1 ↔ 1.04
//   with a different duration + delay per frame, while the outer
//   marquee track continues its linear scroll — the zoom is
//   decoupled from the conveyor, so both motions read cleanly.
// • Left and right edge mask-image fades give the emergence
//   feeling ("coming out from the left inner container") without
//   a hard clip.
// • Reduced-motion users see a still row — both the conveyor and
//   the breathe are gated behind `gsap.matchMedia`.
// • The six brochure panels at the bottom are the real 1.svg…6.svg
//   files (parallelogram frames + coloured border are already baked
//   into the source SVGs) scaled up to carry the whole lower half.
//   They enter with a staggered back-ease lift on scroll, then
//   settle into a quiet sine bob — matching the Hero card idle so
//   the two rows feel like one visual family.
// ————————————————————————————————————————————————————————

// Ordered left→right, matching final.svg reading order + the colour
// tokens baked into each source SVG. Kept here (duplicated from
// Visuals.tsx) so this section owns its own data and can be moved
// or restyled without touching the legacy KaeruRyugakuVisual.
const KAERU_PANELS = [
  { src: "/kaeruryugaku/home-assets/1.svg", c: "#569ecc", label: "Sky", labelJa: "そら" },
  { src: "/kaeruryugaku/home-assets/2.svg", c: "#7db852", label: "Home", labelJa: "ホーム" },
  { src: "/kaeruryugaku/home-assets/3.svg", c: "#61358b", label: "Culture", labelJa: "文化" },
  { src: "/kaeruryugaku/home-assets/4.svg", c: "#e4703d", label: "Friends", labelJa: "なかま" },
  { src: "/kaeruryugaku/home-assets/5.svg", c: "#b15896", label: "Adventure", labelJa: "ぼうけん" },
  { src: "/kaeruryugaku/home-assets/6.svg", c: "#3d5ca0", label: "Growth", labelJa: "せいちょう" },
] as const;

// Destination "postcard" frames for the marquee. Six study-abroad
// countries, doubled in the DOM to make the loop point invisible.
//
// `photo` fills the entire pebble silhouette (object-cover). `accent`
// is a colour pulled from each destination, used for the caption-pill
// border so the row stays colour-coded per country.
//
// `icon` assigns one of the real Kaeru frog-mascot stickers
// (/kaeruryugaku/1.svg … 5.svg) to a distinct corner of each frame.
// Corners are varied across the six frames so the eye reads the
// placements as hand-arranged rather than templated. Icon 3 repeats
// once (Canada + Malta) — spaced three frames apart, the maximum
// separation in a six-frame loop, so the repeat never sits adjacent.
type IlloAnchor = "tl" | "tr" | "bl" | "br";
type MarqueeFrame = {
  id: string;
  // Destination photo — fills the pebble silhouette edge to edge.
  photo: string;
  // Per-destination accent (caption-pill border).
  accent: string;
  label: string;
  labelJa: string;
  shape: 0 | 1 | 2 | 3;
  // Subtle resting tilt (deg) — the marquee track doesn't rotate,
  // but each frame sits at its own angle for that sticker-book feel.
  rot: number;
  // Resting vertical offset (% of the frame's own height). Each
  // frame sits a little higher or lower than its neighbour, so
  // the row reads as a hand-placed zig-zag rather than a flat
  // conveyor belt. Applied as translateY on the flex child, so
  // the breathe/illustration tweens stay independent.
  yOffset: number;
  // Breath tween — different duration and phase per frame so the
  // row never pulses in unison.
  breathDur: number;
  breathDelay: number;
  // Real frog-mascot sticker at a unique corner per frame.
  icon: { src: string; anchor: IlloAnchor; size: number };
};

const MARQUEE_FRAMES: MarqueeFrame[] = [
  {
    id: "new-zealand",
    photo: "/kaeruryugaku/destinations/new-zealand.webp",
    accent: "#2f8f5b",
    label: "New Zealand",
    labelJa: "ニュージーランド",
    shape: 0,
    rot: -3,
    yOffset: -22,
    breathDur: 5.6,
    breathDelay: 0,
    icon: { src: "/kaeruryugaku/1.svg", anchor: "tr", size: 50 },
  },
  {
    id: "united-kingdom",
    photo: "/kaeruryugaku/destinations/united-kingdom.webp",
    accent: "#c0362c",
    label: "United Kingdom",
    labelJa: "イギリス",
    shape: 1,
    rot: 2.4,
    yOffset: 18,
    breathDur: 6.4,
    breathDelay: 0.9,
    icon: { src: "/kaeruryugaku/2.svg", anchor: "tl", size: 48 },
  },
  {
    id: "canada",
    photo: "/kaeruryugaku/destinations/canada.webp",
    accent: "#c8472f",
    label: "Canada",
    labelJa: "カナダ",
    shape: 2,
    rot: -2,
    yOffset: -14,
    breathDur: 5.2,
    breathDelay: 1.6,
    icon: { src: "/kaeruryugaku/3.svg", anchor: "br", size: 50 },
  },
  {
    id: "australia",
    photo: "/kaeruryugaku/destinations/australia.webp",
    accent: "#1f7fb8",
    label: "Australia",
    labelJa: "オーストラリア",
    shape: 3,
    rot: 3.2,
    yOffset: 22,
    breathDur: 6.0,
    breathDelay: 2.2,
    icon: { src: "/kaeruryugaku/4.svg", anchor: "bl", size: 50 },
  },
  {
    id: "philippines",
    photo: "/kaeruryugaku/destinations/philippines.webp",
    accent: "#0fa3a3",
    label: "Philippines",
    labelJa: "フィリピン",
    shape: 0,
    rot: -2.6,
    yOffset: -10,
    breathDur: 5.8,
    breathDelay: 0.4,
    icon: { src: "/kaeruryugaku/5.svg", anchor: "tr", size: 48 },
  },
  {
    id: "malta",
    photo: "/kaeruryugaku/destinations/malta.webp",
    accent: "#d39a2e",
    label: "Malta",
    labelJa: "マルタ",
    shape: 2,
    rot: 2.0,
    yOffset: 14,
    breathDur: 6.2,
    breathDelay: 1.2,
    icon: { src: "/kaeruryugaku/3.svg", anchor: "tl", size: 50 },
  },
];

// Four pebble / droplet silhouettes in objectBoundingBox coords
// (0..1). Organic, rounded, no sharp torn teeth — matches the soft
// "water droplet" feeling of yamatoen.or.jp. Each shape is subtly
// different so adjacent cards don't read as duplicates.
function FrameShapeDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      className="pointer-events-none absolute"
      style={{ position: "absolute" }}
    >
      <defs>
        <clipPath id="kaeru-pebble-0" clipPathUnits="objectBoundingBox">
          <path d="M 0.12 0.08 Q 0.02 0.20 0.04 0.42 Q 0.0 0.66 0.10 0.86 Q 0.22 1.00 0.46 0.96 Q 0.70 1.00 0.88 0.92 Q 1.0 0.78 0.96 0.58 Q 1.0 0.34 0.92 0.16 Q 0.78 0.02 0.56 0.06 Q 0.30 0.0 0.12 0.08 Z" />
        </clipPath>
        <clipPath id="kaeru-pebble-1" clipPathUnits="objectBoundingBox">
          <path d="M 0.08 0.22 Q 0.02 0.06 0.24 0.04 Q 0.52 0.0 0.80 0.08 Q 0.98 0.22 0.94 0.46 Q 1.0 0.70 0.88 0.88 Q 0.70 1.0 0.46 0.96 Q 0.20 1.0 0.10 0.80 Q 0.0 0.58 0.06 0.40 Q 0.04 0.30 0.08 0.22 Z" />
        </clipPath>
        <clipPath id="kaeru-pebble-2" clipPathUnits="objectBoundingBox">
          <path d="M 0.06 0.18 Q 0.0 0.38 0.08 0.58 Q 0.02 0.82 0.24 0.94 Q 0.48 1.0 0.72 0.94 Q 0.96 0.88 0.96 0.66 Q 1.0 0.40 0.90 0.20 Q 0.74 0.02 0.50 0.06 Q 0.26 0.04 0.10 0.10 Q 0.04 0.12 0.06 0.18 Z" />
        </clipPath>
        <clipPath id="kaeru-pebble-3" clipPathUnits="objectBoundingBox">
          <path d="M 0.16 0.08 Q 0.02 0.20 0.06 0.48 Q 0.0 0.74 0.22 0.92 Q 0.46 1.0 0.68 0.94 Q 0.94 0.86 0.96 0.62 Q 1.0 0.36 0.86 0.18 Q 0.70 0.02 0.46 0.06 Q 0.24 0.04 0.16 0.08 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// Map an IlloAnchor corner code to absolute offsets relative to
// the parent frame. The illustration overhangs the frame edge so
// it reads as "resting on" the pebble — hand-arranged sticker
// vibe. Size is a percentage of the frame's own width so stickers
// scale with the frame.
function illoStyle(anchor: IlloAnchor, size: number): CSSProperties {
  const w = `${size}%`;
  const overhang = "-12%";
  switch (anchor) {
    case "tl":
      return { left: overhang, top: overhang, width: w, aspectRatio: "1", zIndex: 3 };
    case "tr":
      return { right: overhang, top: overhang, width: w, aspectRatio: "1", zIndex: 3 };
    case "bl":
      return { left: overhang, bottom: overhang, width: w, aspectRatio: "1", zIndex: 3 };
    case "br":
    default:
      return { right: overhang, bottom: overhang, width: w, aspectRatio: "1", zIndex: 3 };
  }
}

// ————————————————————————————————————————————————————————
// PhotoMarquee — right→left looping conveyor of five small
// photo-pebble frames.
//
// Implementation notes
// • Track holds the frame list twice back-to-back. A single
//   `xPercent: 0 → -50` linear tween scrolls it forever; when
//   the tween wraps, the second copy is in the exact pixel
//   position the first was at frame 0, so the loop is invisible.
// • Each frame has its own breathe tween (inner wrapper, scale
//   1 ↔ 1.04) with a distinct duration + delay, so the zoom
//   "breathing" doesn't pulse in unison across the row.
// • The pebble clipPath is applied to the gradient "photo" itself,
//   not to a surrounding matte — the image fills the entire frame
//   silhouette, which is what the design calls for.
// • Mask-image fades on the left and right edges let frames
//   emerge/disappear smoothly rather than clipping at a hard edge.
// • Both motion layers are gated behind `gsap.matchMedia`; users
//   who prefer reduced motion get a still, legible row.
// ————————————————————————————————————————————————————————
function PhotoMarquee() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { locale } = useI18n();

  // Duplicate the list so the marquee can loop seamlessly.
  const loopFrames = [...MARQUEE_FRAMES, ...MARQUEE_FRAMES];

  useGSAP(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tweens: gsap.core.Tween[] = [];

      // Right → left conveyor at a CONSTANT pixel speed: a frame takes
      // the same time to cross the viewport at any width. A fixed
      // duration would make frames race on widescreen (wider track,
      // same seconds) and crawl on mobile. Distance = 50% of the
      // doubled track's own width.
      let conveyor: gsap.core.Tween | null = null;
      const SPEED = 32; // px/sec — preserves the original ~6s-per-frame feel
      const buildConveyor = () => {
        conveyor?.kill();
        // Reset to 0 so the 0 → -50% loop stays seamless after a rebuild.
        gsap.set(track, { xPercent: 0 });
        const dist = track.scrollWidth / 2;
        conveyor = gsap.to(track, {
          xPercent: -50,
          duration: Math.max(18, dist / SPEED),
          ease: "none",
          repeat: -1,
        });
      };
      buildConveyor();
      // Re-time on layout change — the provider fires a debounced
      // ScrollTrigger.refresh() on resize/orientation.
      ScrollTrigger.addEventListener("refresh", buildConveyor);

      // Per-frame breathe (scale 1 ↔ 1.04). We target every DOM
      // copy — both halves of the doubled list animate identically
      // so the loop seam stays invisible.
      const photos = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-marquee-photo]"),
      );
      photos.forEach((photo) => {
        const dur = Number(photo.dataset.breathDur) || 6;
        const delay = Number(photo.dataset.breathDelay) || 0;
        tweens.push(
          gsap.to(photo, {
            scale: 1.04,
            duration: dur,
            delay,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );
      });

      // Sticker bob — short, softly offset per index so corners
      // don't all nod together.
      const illos = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-marquee-illo]"),
      );
      const stickerBob = remPx(0.3); // ~5px, scales with the root
      illos.forEach((illo, i) => {
        tweens.push(
          gsap.to(illo, {
            y: i % 2 === 0 ? -stickerBob : stickerBob,
            rotation: `+=${i % 2 === 0 ? 4 : -4}`,
            duration: 3 + (i % 3) * 0.6,
            delay: (i % 5) * 0.3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );
      });

      return () => {
        conveyor?.kill();
        ScrollTrigger.removeEventListener("refresh", buildConveyor);
        tweens.forEach((t) => t.kill());
      };
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex h-full w-full items-center overflow-hidden"
      style={{
        // Soft edge fades — frames emerge from / exit into the
        // background rather than popping against a hard clip.
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)",
      }}
      aria-label="Kaeru Ryugaku destinations marquee"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center"
        style={{ willChange: "transform" }}
      >
        {loopFrames.map((frame, idx) => (
          <div
            key={`${frame.id}-${idx}`}
            className="relative shrink-0"
            style={{
              // Small frames with comfortable spacing on either
              // side. clamp keeps them legible on phones and
              // from overwhelming on ultra-wide displays.
              width: "clamp(7rem, 11vw, 9.5rem)",
              aspectRatio: "3 / 4",
              marginInline: "clamp(0.75rem, 1.6vw, 1.5rem)",
              // translateY first so each frame sits at its own
              // resting elevation, then rotate for the tilt. The
              // pattern repeats identically in both halves of the
              // doubled list, so the loop seam stays invisible.
              transform: `translateY(${frame.yOffset}%) rotate(${frame.rot}deg)`,
            }}
          >
            {/* Photo layer — pebble-clipped destination photo filling
                the whole frame. Breathe tween targets this wrapper so
                the zoom stays inside the clip. */}
            <div
              data-marquee-photo
              data-breath-dur={frame.breathDur}
              data-breath-delay={frame.breathDelay}
              className="relative h-full w-full"
              style={{
                transformOrigin: "50% 50%",
                willChange: "transform",
                filter:
                  "drop-shadow(0 16px 30px rgba(32,35,58,0.20)) drop-shadow(0 4px 10px rgba(32,35,58,0.12))",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ clipPath: `url(#kaeru-pebble-${frame.shape})` }}
              >
                {/* Destination photo — fills the entire pebble
                    silhouette edge to edge. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.photo}
                  alt={frame.label}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full select-none object-cover"
                />
                {/* Halftone overlay — subtle print texture so the
                    photo reads as a warm postcard, not a flat crop. */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.75) 1px, transparent 1.4px)",
                    backgroundSize: "5px 5px",
                  }}
                />
                {/* Soft bottom scrim so the caption pill stays legible
                    over bright skies and water. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(32,35,58,0.28), transparent)",
                  }}
                />
                {/* Destination pill — colour-matched, locale-swapped. */}
                <div className="absolute inset-x-0 bottom-[9%] flex justify-center">
                  <div
                    className="rounded-full bg-white/95 px-2 py-[2px] text-[9px] font-medium leading-none text-[var(--color-ink)] shadow-sm md:text-[10px]"
                    style={{ border: `1.2px solid ${frame.accent}` }}
                  >
                    {locale === "ja" ? frame.labelJa : frame.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Frog-mascot sticker — a real Kaeru icon at a unique
                corner per frame so placement reads as hand-arranged.
                Overhang keeps it half-on / half-off the pebble edge. */}
            <div
              data-marquee-illo
              className="absolute"
              style={illoStyle(frame.icon.anchor, frame.icon.size)}
            >
              <div
                style={{
                  filter:
                    "drop-shadow(0 5px 8px rgba(32,35,58,0.22)) drop-shadow(0 2px 3px rgba(32,35,58,0.12))",
                  willChange: "transform",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.icon.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full select-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————
// BigPanelsRow — the six brochure cards, scaled up to carry the
// whole bottom half of the section. On enter: a staggered back-ease
// lift (hero-card vocabulary) → settle into an infinite sine bob.
// ————————————————————————————————————————————————————————
function BigPanelsRow() {
  const rowRef = useRef<HTMLUListElement | null>(null);
  const { locale } = useI18n();

  useGSAP(() => {
    const row = rowRef.current;
    if (!row) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      row.querySelectorAll("[data-big-card]"),
    );
    if (cards.length === 0) return;

    const restTilt = (i: number) => (i % 2 === 0 ? -1.3 : 1.3);

    // Motion distances scaled to the fluid root (baseline ≈ original px).
    const drop = remPx(6.875); // ~110px entrance lift
    const idleBob = remPx(0.45); // ~7px idle bob

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(cards, {
        opacity: 0,
        y: drop,
        scale: 0.8,
        rotate: (i) => restTilt(i) * 4,
        transformOrigin: "50% 100%",
      });

      const idleTweens: gsap.core.Tween[] = [];

      const trigger = ScrollTrigger.create({
        trigger: row,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap
            .timeline({ defaults: { ease: "back.out(1.35)" } })
            .to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: (i) => restTilt(i),
              duration: 1.1,
              stagger: { each: 0.11, from: "start" },
            })
            .add(() => {
              cards.forEach((c, i) => {
                idleTweens.push(
                  gsap.to(c, {
                    y: "+=" + idleBob,
                    duration: 3.2 + (i % 3) * 0.35,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    delay: i * 0.12,
                  }),
                );
              });
            });
        },
      });

      return () => {
        idleTweens.forEach((t) => t.kill());
        trigger.kill();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: (i) => restTilt(i),
      });
    });
  }, []);

  return (
    <ul
      ref={rowRef}
      className="relative shell-wide flex items-end justify-center gap-1 md:gap-0"
      aria-label="Kaeru Ryugaku brochure"
    >
      {KAERU_PANELS.map((panel, i) => (
        <li
          key={panel.src}
          data-big-card
          className="relative -mx-[0.35rem] flex-1"
          style={{
            aspectRatio: "148 / 262",
            maxWidth: "16rem",
            willChange: "transform",
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              filter:
                "drop-shadow(0 26px 42px rgba(32,35,58,0.22)) drop-shadow(0 8px 14px rgba(32,35,58,0.14))",
            }}
          >
            {/* Source SVGs embed base64 PNGs; skip Next's image
                optimizer and go straight to the browser. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={panel.src}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className="block h-full w-full select-none"
            />
          </div>
          {/* Destination pill under each card, colour-matched and
              locale-swapped — same pattern as the marquee caption
              so the two rows share a voice. */}
          <span
            className="pointer-events-none absolute left-1/2 top-[101%] -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-[3px] text-[10px] font-medium leading-none shadow-sm md:text-[11px]"
            style={{
              color: panel.c,
              border: `1.4px solid ${panel.c}`,
            }}
          >
            {locale === "ja" ? panel.labelJa : panel.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ————————————————————————————————————————————————————————
// StudyAbroad — assembly. Keeps the snap-section id so Lenis'
// directional snap still works, drops the old PanelShell chrome
// in favour of the redesigned two-row composition.
// ————————————————————————————————————————————————————————
export function StudyAbroad() {
  const t = useT();
  const p = t.panels.studyAbroad;

  return (
    <Section
      id="study-abroad"
      background="linear-gradient(165deg, #ffffff 0%, #f4faf1 50%, #d5ecd8 100%)"
      style={{ color: "var(--color-ink)" }}
    >
      <FrameShapeDefs />

      <div className="relative z-[1] flex min-h-screen w-full flex-col">
        {/* ——————————————————————————————————————
            TOP  —  Logo + copy  |  Moving marquee
            —————————————————————————————————————— */}
        <div className="flex w-full flex-col md:flex-row md:min-h-[44vh]">
          {/* LEFT — brand logo, index marker, title, subtitle,
              body copy, age pill + CTA. Widths chosen so the copy
              column stays narrow enough to read like a page
              (≈46ch) while leaving the marquee 55%+ of the
              viewport for scale. */}
          <div className="relative flex flex-col justify-center px-gutter-lg pt-14 pb-8 md:w-[44%] md:py-10 md:pl-[max(3rem,6vw)]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-full font-display text-sm"
                style={{
                  background: "var(--color-leaf)",
                  color: "var(--color-ink)",
                }}
              >
                01
              </span>
              <span style={{ opacity: 0.72 }}>{p.label}</span>
            </motion.div>

            {/* Section logo — uniform size across all sections, on its own
                line beneath the badge. */}
            <SectionLogo
              src="/kaeruryugaku/home-assets/Logo.svg"
              width={184}
              height={217}
              alt="かえる留学"
              className="mt-5"
              sizeClassName="h-[clamp(12.75rem,19.5vw,27rem)]"
            />

            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.9,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display mt-4 whitespace-pre-line text-display-1 tracking-tight"
            >
              {p.title}
            </motion.h2>

            <motion.p
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-xl font-medium"
              style={{ color: "var(--color-leaf)" }}
            >
              {p.subtitle}
            </motion.p>

            <motion.p
              initial={{ y: 14, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 max-w-[46ch] text-base leading-relaxed"
              style={{ opacity: 0.78 }}
            >
              {p.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <span
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-ink) 10%, transparent)",
                  color: "var(--color-ink)",
                }}
              >
                {p.ages}
              </span>
              <button
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--color-leaf)",
                  color: "var(--color-ink)",
                }}
              >
                {t.panels.learnMore}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT — right→left photo-pebble marquee. Five small
              organic frames on a seamless conveyor, each breathing
              on its own timing. Height is intentionally tighter
              than the collage version so the small frames sit
              centred in the band rather than floating in a
              half-empty column. */}
          <div className="relative flex-1 md:w-[56%]">
            <div className="h-[36vh] w-full md:h-full md:min-h-[36vh]">
              <PhotoMarquee />
            </div>
          </div>
        </div>

        {/* ——————————————————————————————————————
            BOTTOM  —  Six big brochure panels
            —————————————————————————————————————— */}
        <div className="relative mt-auto flex w-full flex-1 flex-col justify-end">
          {/* Subtle horizon hairline — separates the top composition
              from the brochure row without drawing a hard edge. */}
          <div
            aria-hidden
            className="mx-auto h-px w-[min(1200px,90%)] opacity-40"
            style={{
              background:
                "linear-gradient(90deg, rgba(88,194,125,0) 0%, rgba(88,194,125,0.8) 50%, rgba(88,194,125,0) 100%)",
            }}
          />
          <div className="pt-10 pb-14 md:pt-14 md:pb-20">
            <BigPanelsRow />
          </div>
        </div>
      </div>

      {/* Decorative passport/globe backdrop — ivory wash, rotating
          meridians, dashed flight arcs, confetti stamps, colour
          blooms, leaf silhouettes, paper grain. */}
      <StudyAbroadBackdrop />
    </Section>
  );
}
