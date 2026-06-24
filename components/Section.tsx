"use client";

import { motion, type MotionProps } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { remPx } from "@/lib/useViewportPx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// Section scroll-scrubbed cross-fade
//
// Every non-hero section wraps its children in a dedicated fade
// layer that's bound 1:1 to scroll progress via ScrollTrigger's
// `scrub`. The section's solid background stays visible at all
// times — only the content crossfades. That gives us three things:
//
//   1. A real cross-fade between adjacent sections. As section A
//      exits the viewport, its content opacity drops to 0; as
//      section B enters, its content opacity lifts to 1. During
//      the handoff both are rendered, so the transition reads as
//      a silky blend rather than a pop.
//   2. A stable backdrop. Because only the inner wrapper fades,
//      the viewport never goes blank or shows a seam — there's
//      always a section background behind the crossfading content.
//   3. No "stuck" states possible. The animation is scroll-
//      position-driven, not timeline-driven. If the user scrolls
//      back the fade reverses; if they scroll fast it tracks; if
//      the snap settles it lands on the correct opacity. The fade
//      simply cannot desync from scroll.
//
// Curve: fade-in uses power3.out (decelerate — content "arrives"),
// fade-out uses power3.in (accelerate — content "leaves"). A short
// hold at full opacity in the middle keeps the section legible
// while it's the primary viewport occupant.
// ————————————————————————————————————————————————————————

type SectionProps = {
  id: string;
  children: ReactNode;
  background?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Disable the scroll-scrubbed cross-fade. Use on the hero,
   * whose entrance is owned by the preloader and which should be
   * fully visible from the start.
   */
  noFade?: boolean;
} & Omit<MotionProps, "children">;

/**
 * Full-viewport section wrapped with `data-snap-section` so the
 * SmoothScrollProvider can soft-snap to it.
 */
export function Section({
  id,
  children,
  background,
  className = "",
  style,
  noFade,
  ...motionProps
}: SectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (noFade) return;
      const el = sectionRef.current;
      if (!el) return;
      const fade = el.querySelector<HTMLElement>("[data-section-fade]");
      if (!fade) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Fade travel in px, resolved against the live (fluid) root
        // font-size so it scales with the viewport instead of being a
        // fixed 36px lurch that's huge on mobile and invisible on 4K.
        const rise = remPx(2.25); // ~36px at the 1440 baseline
        // Scrub window spans the full life of the section — from
        // the moment its top edge touches the bottom of the
        // viewport, to the moment its bottom edge reaches the
        // top. At the midpoint (which is also where the section
        // "snaps" to rest) the content sits at full opacity.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            // A tiny bit of smoothing — the scrub lerps toward the
            // target so wheel flicks don't produce micro-jitter
            // while still tracking snap smoothly.
            scrub: 0.4,
          },
        });

        // Proportions of the scroll range (durations are relative
        // in a scrubbed timeline):
        //   fade-in   : 35%
        //   hold      : 30%   ← snap rest lives here
        //   fade-out  : 35%
        tl.fromTo(
          fade,
          { opacity: 0, y: rise, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.35,
            ease: "power3.out",
          }
        )
          .to(fade, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "none",
          })
          .to(fade, {
            opacity: 0,
            y: -rise * 0.9,
            filter: "blur(6px)",
            duration: 0.35,
            ease: "power3.in",
          });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // No fade — content is always fully visible.
        gsap.set(fade, { opacity: 1, y: 0, filter: "none" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [id, noFade] }
  );

  return (
    <motion.section
      ref={sectionRef as unknown as React.RefObject<HTMLElement>}
      id={id}
      data-snap-section
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ background, ...style }}
      {...motionProps}
    >
      {/* Fade layer — wraps all section content so the background
          (painted on the <section> itself) can stay solid while
          the content crossfades. `display: contents` is avoided
          because it breaks opacity inheritance; a plain block
          with `willChange: transform, opacity` is the right
          trade-off for smooth 60fps on the main thread. */}
      <div
        data-section-fade
        className="relative h-full w-full"
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </div>
    </motion.section>
  );
}
