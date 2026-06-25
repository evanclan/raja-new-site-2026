"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Section } from "../Section";
import { useSmoothScroll } from "../SmoothScrollProvider";
import { useLoading } from "../LoadingProvider";
import { useI18n } from "@/lib/i18n";
import { remPx } from "@/lib/useViewportPx";

gsap.registerPlugin(useGSAP);

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;

// ————————————————————————————————————————————————
// HeroHeadline — the RaJA word-mark SVG, restaged for legibility
// on the dark photo backdrop.
//
// The SVG asset itself is untouched (flat white fill). The
// visibility fix is pure CSS: a warm ambient aura behind the mark
// and stacked drop-shadows in front. This way the brand file
// stays the single source of truth, and any future edit to
// RaJA.svg propagates here automatically.
// ————————————————————————————————————————————————
function HeroHeadline({ entered }: { entered: boolean }) {
  return (
    <div className="relative">
      {/* Soft ambient aura — gives the mark a halo of warm light
          so the white glyphs read clearly even against bright
          areas of the photo. Matches the preloader palette. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[8%] -inset-y-[22%] -z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
        }
        transition={{ delay: 0.7, duration: 1.4, ease: EASE_OUT_EXPO }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0.28) 45%, rgba(0,0,0,0) 75%)",
          filter: "blur(18px)",
        }}
      />

      {/* Clip-path reveal — the mark rises from within the frame.
          Stacked drop-shadows (tight + medium + wide) give the
          glyphs a deep-set feel on any backdrop. */}
      <div className="overflow-hidden" aria-label="RaJA" role="img">
        <motion.img
          key="raja-mark"
          src="/hero-main/RaJA.svg"
          alt=""
          draggable={false}
          className="block h-auto w-[clamp(15rem,40vw,34rem)] select-none"
          style={{
            filter:
              "drop-shadow(0 1px 0 rgba(0,0,0,0.85)) drop-shadow(0 10px 26px rgba(0,0,0,0.6)) drop-shadow(0 22px 52px rgba(0,0,0,0.5))",
            willChange: "transform, clip-path",
          }}
          initial={{ y: "14%", clipPath: "inset(0 0 100% 0)" }}
          animate={
            entered
              ? { y: "0%", clipPath: "inset(0 0 0% 0)" }
              : { y: "14%", clipPath: "inset(0 0 100% 0)" }
          }
          transition={{ delay: 0.65, duration: 1.25, ease: EASE_OUT_EXPO }}
        />
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// HeroTagline — types a short line in, one character at a
// time, with a blinking caret that self-dismisses once the
// full line is on screen.
//
// Why a dedicated component:
// - Per-character <span> animations are expensive when the
//   locale toggles; isolating the logic lets us key this
//   whole block on `localeKey` and let React replace the DOM
//   cleanly. No manual cleanup, no stale chars.
// - The caret's blink + terminal fade is expressed as a
//   single keyframed `animate` on opacity, which keeps the
//   timeline honest (blinks live *inside* the typing window,
//   fade-out lives *after* the last character lands).
//
// Typing feel:
// - Per-char delay defaults to 55ms — fast enough to feel
//   intentional, slow enough to read as "being typed" rather
//   than "being revealed". Japanese kanji/kana are visually
//   dense, so a slightly slower rhythm lets each glyph
//   register.
// - Each char also lifts 4px with a tiny opacity ramp so it
//   lands, rather than popping. Ease-out-quart keeps the
//   motion clean on slow devices.
// ————————————————————————————————————————————————
function HeroTagline({
  text,
  localeKey,
  active,
  startDelay,
  perChar,
}: {
  text: string;
  localeKey: string;
  active: boolean;
  startDelay: number;
  perChar: number;
}) {
  const chars = Array.from(text);
  const typingDuration = chars.length * perChar;
  const afterTypingBuffer = 0.25;
  // Caret keyframes: visible → (4 blink pulses during typing)
  // → visible through the typing window → fade out shortly
  // after the last character lands.
  const caretDuration = typingDuration + afterTypingBuffer + 0.45;
  // 9 keyframes = 4 blink cycles + final off state. `times`
  // are normalised (0..1) across caretDuration.
  const typingEnd = typingDuration / caretDuration;
  const caretKeyframes = [1, 1, 0.2, 1, 0.2, 1, 0.2, 1, 0] as const;
  const caretTimes = [
    0,
    typingEnd * 0.2,
    typingEnd * 0.35,
    typingEnd * 0.5,
    typingEnd * 0.65,
    typingEnd * 0.8,
    typingEnd * 0.92,
    (typingDuration + afterTypingBuffer) / caretDuration,
    1,
  ];

  return (
    <motion.div
      key={`tagline-${localeKey}`}
      className="mt-1 flex items-center gap-3 md:gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ delay: startDelay - 0.1, duration: 0.4 }}
      aria-label={text}
    >
      {/* Short lead-in hairline — same visual family as the
          overline's accent rule, so the block feels part of
          the same typographic system. */}
      <motion.span
        aria-hidden
        className="h-px w-6 origin-left bg-white/50 md:w-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{
          delay: startDelay - 0.05,
          duration: 0.6,
          ease: EASE_OUT_EXPO,
        }}
      />
      <p
        className="relative text-lg font-light tracking-[0.12em] text-white/85"
        style={{
          textShadow: "0 2px 14px rgba(0,0,0,0.55)",
        }}
        aria-hidden
      >
        {chars.map((ch, i) => (
          <motion.span
            key={`${localeKey}-${i}`}
            initial={{ opacity: 0, y: 4 }}
            animate={
              active ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
            }
            transition={{
              delay: startDelay + i * perChar,
              duration: 0.22,
              ease: EASE_OUT_QUART,
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
        <motion.span
          aria-hidden
          className="ml-[3px] inline-block h-[1em] w-[2px] translate-y-[2px] bg-white/80 align-middle"
          initial={{ opacity: 0, scaleY: 0.7 }}
          animate={
            active
              ? { opacity: caretKeyframes as unknown as number[], scaleY: 1 }
              : { opacity: 0, scaleY: 0.7 }
          }
          transition={
            active
              ? {
                  delay: startDelay,
                  duration: caretDuration,
                  times: caretTimes,
                  ease: "linear",
                }
              : { duration: 0.2 }
          }
        />
      </p>
    </motion.div>
  );
}

export function Hero() {
  const { scrollTo } = useSmoothScroll();
  const { t, locale } = useI18n();
  const { loaded, phase } = useLoading();

  const panels = [
    {
      id: "study-abroad",
      label: t.hero.panels.studyAbroad,
      color: "var(--color-sky)",
      src: "/hero-main/navigation-svg/kaeruryugaku.svg",
      sizeClass: "h-[clamp(7rem,18.5vw,15rem)] max-md:h-[7.5rem]",
    },
    {
      id: "academy",
      label: t.hero.panels.academy,
      color: "var(--color-sun)",
      src: "/hero-main/navigation-svg/academy.svg",
      sizeClass: "h-[clamp(7rem,18.5vw,15rem)] max-md:h-[7.5rem]",
    },
    {
      // Preschool SVG has extra vertical padding in its viewBox, so
      // matching on the default height reads visually smaller than its
      // siblings. We bump its height class by ~15% so the illustrated
      // content lines up in weight with the rest of the row. The
      // `items-end` row aligns bottoms, so the extra height just extends
      // upward — no layout disruption.
      id: "preschool",
      label: t.hero.panels.preschool,
      color: "var(--color-peach)",
      src: "/hero-main/navigation-svg/preschool.svg",
      sizeClass: "h-[clamp(8rem,21vw,17.25rem)] max-md:h-[8.5rem]",
    },
    {
      id: "clab",
      label: t.hero.panels.clab,
      color: "var(--color-leaf)",
      src: "/hero-main/navigation-svg/clab.svg",
      sizeClass: "h-[clamp(7rem,18.5vw,15rem)] max-md:h-[7.5rem]",
    },
    {
      id: "english",
      label: t.hero.panels.english,
      color: "var(--color-berry)",
      src: "/hero-main/navigation-svg/letsgoenglish.svg",
      sizeClass: "h-[clamp(7rem,18.5vw,15rem)] max-md:h-[7.5rem]",
    },
  ];

  // Refs for GSAP — scope everything under panelsRef so selectors can't
  // leak outside this component.
  const panelsRef = useRef<HTMLUListElement | null>(null);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);
  // Hero's circular brand mark — also the FLIP landing rect for the
  // preloader's logo. Exposed via `data-flip-target="raja-logo"`.
  const heroLogoRef = useRef<HTMLDivElement | null>(null);

  // Hero body content waits for the preloader reveal so the animations
  // feel connected rather than racing each other.
  const entered = loaded;

  // ————————————————————————————————————————
  // GSAP choreography for the navigation cards
  // ————————————————————————————————————————
  // Entrance: each card rises from below with a soft overshoot + micro-tilt.
  // Ambient: a gentle idle float keeps the row "alive" between interactions.
  // Hover: button lifts, scales, straightens, glow halo blooms, siblings
  // dim slightly so the hovered card takes the stage.
  useGSAP(
    (_context, contextSafe) => {
      if (!entered || !panelsRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        panelsRef.current.querySelectorAll("[data-panel]"),
      );
      if (cards.length === 0) return;

      // Respect prefers-reduced-motion: set cards to their resting state
      // immediately and skip the entrance / idle choreography entirely.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const rmRestRotation = (i: number) => (i % 2 === 0 ? -1.5 : 1.5);
        gsap.set(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: (i: number) => rmRestRotation(i),
          filter: "none",
        });
        return;
      }

      const buttons = cards.map(
        (card) => card.querySelector("[data-panel-btn]") as HTMLElement,
      );
      const halos = cards.map(
        (card) => card.querySelector("[data-panel-halo]") as HTMLElement,
      );
      const imgs = cards.map(
        (card) => card.querySelector("[data-panel-img]") as HTMLElement,
      );

      // Per-card rest tilt — matches the playful original composition.
      const restRotation = (i: number) => (i % 2 === 0 ? -1.5 : 1.5);

      // Motion distances in px, resolved against the live (fluid) root
      // font-size so the choreography scales with the viewport. Baseline
      // (root 16px) matches the original hand-tuned px values.
      const bob = remPx(0.4); // ~6px idle float
      const lift = remPx(1.125); // ~18px hover lift
      const drop = remPx(5); // ~80px entrance rise
      const press = remPx(0.625); // ~10px press dip

      // Entrance timeline — staggered, with a secondary "image settle"
      // that lands a beat after the card to add Disney-style follow-through.
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Start ambient idle floats once the entrance has fully resolved.
          idleTweensRef.current.forEach((tw) => tw.kill());
          idleTweensRef.current = cards.map((card, i) =>
            gsap.to(card, {
              y: "+=" + bob,
              rotate: restRotation(i) + (i % 2 === 0 ? 0.6 : -0.6),
              duration: 2.4 + (i % 3) * 0.35,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 0.12,
            }),
          );
        },
      });

      // Waits for the RaJA mark + subtitle + description to settle
      // (matches the original framer choreography) before the cards arrive.
      const ENTRANCE_DELAY = 1.35;

      tl.set(cards, { transformOrigin: "50% 85%" })
        .set(imgs, { transformOrigin: "50% 100%" })
        .fromTo(
          cards,
          {
            opacity: 0,
            y: drop,
            scale: 0.72,
            rotate: (i) => restRotation(i) * 4,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: (i) => restRotation(i),
            filter: "blur(0px)",
            duration: 1.05,
            ease: "back.out(1.5)",
            stagger: { each: 0.11, from: "start" },
          },
          ENTRANCE_DELAY,
        )
        .fromTo(
          imgs,
          { yPercent: 8, scaleY: 0.94 },
          {
            yPercent: 0,
            scaleY: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.55)",
            stagger: { each: 0.11, from: "start" },
          },
          ENTRANCE_DELAY + 0.12,
        )
        .fromTo(
          halos,
          { opacity: 0, scale: 0.6 },
          {
            opacity: 0.55,
            scale: 1.1,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.11,
          },
          ENTRANCE_DELAY + 0.08,
        )
        .to(
          halos,
          {
            opacity: 0,
            scale: 1,
            duration: 0.9,
            ease: "power2.inOut",
            stagger: 0.11,
          },
          ENTRANCE_DELAY + 0.55,
        );

      // ——— Hover micro-interactions ———
      // quickTo = allocate once, fire on every pointer move, cheap.
      const hoverTweens = buttons.map((btn, i) => {
        const img = imgs[i];
        const halo = halos[i];
        return {
          y: gsap.quickTo(btn, "y", { duration: 0.45, ease: "power3.out" }),
          scale: gsap.quickTo(btn, "scale", {
            duration: 0.55,
            ease: "power3.out",
          }),
          rotate: gsap.quickTo(btn, "rotate", {
            duration: 0.55,
            ease: "power3.out",
          }),
          imgScale: gsap.quickTo(img, "scale", {
            duration: 0.55,
            ease: "power3.out",
          }),
          haloOpacity: gsap.quickTo(halo, "opacity", {
            duration: 0.5,
            ease: "power2.out",
          }),
          haloScale: gsap.quickTo(halo, "scale", {
            duration: 0.7,
            ease: "power3.out",
          }),
        };
      });

      const onEnter = contextSafe!((i: number) => {
        // Pause this card's idle tween so the hover transform reads cleanly.
        idleTweensRef.current[i]?.pause();

        hoverTweens[i].y(-lift);
        hoverTweens[i].scale(1.08);
        hoverTweens[i].rotate(0);
        hoverTweens[i].imgScale(1.04);
        hoverTweens[i].haloOpacity(0.85);
        hoverTweens[i].haloScale(1.25);

        // Stage the hovered card — dim siblings to 55% to direct focus.
        cards.forEach((c, j) => {
          if (j === i) return;
          gsap.to(c, {
            opacity: 0.55,
            scale: 0.97,
            duration: 0.45,
            ease: "power2.out",
          });
        });
      });

      const onLeave = contextSafe!((i: number) => {
        hoverTweens[i].y(0);
        hoverTweens[i].scale(1);
        hoverTweens[i].rotate(restRotation(i));
        hoverTweens[i].imgScale(1);
        hoverTweens[i].haloOpacity(0);
        hoverTweens[i].haloScale(1);

        // Resume the ambient float, realigned to the current value so it
        // doesn't snap.
        const prev = idleTweensRef.current[i];
        prev?.kill();
        idleTweensRef.current[i] = gsap.to(cards[i], {
          y: "+=" + bob,
          rotate: restRotation(i) + (i % 2 === 0 ? 0.6 : -0.6),
          duration: 2.4 + (i % 3) * 0.35,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.4,
        });

        // Restore siblings.
        cards.forEach((c, j) => {
          if (j === i) return;
          gsap.to(c, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });

      const onPress = contextSafe!((i: number) => {
        gsap.to(buttons[i], {
          scale: 0.96,
          y: -press,
          duration: 0.12,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      });

      // Wire up listeners and track for cleanup.
      const handlers: Array<() => void> = [];
      buttons.forEach((btn, i) => {
        const enter = () => onEnter(i);
        const leave = () => onLeave(i);
        const press = () => onPress(i);
        btn.addEventListener("mouseenter", enter);
        btn.addEventListener("mouseleave", leave);
        btn.addEventListener("focus", enter);
        btn.addEventListener("blur", leave);
        btn.addEventListener("pointerdown", press);
        handlers.push(() => {
          btn.removeEventListener("mouseenter", enter);
          btn.removeEventListener("mouseleave", leave);
          btn.removeEventListener("focus", enter);
          btn.removeEventListener("blur", leave);
          btn.removeEventListener("pointerdown", press);
        });
      });

      return () => {
        handlers.forEach((fn) => fn());
        idleTweensRef.current.forEach((tw) => tw.kill());
        idleTweensRef.current = [];
      };
    },
    { scope: panelsRef, dependencies: [entered, locale] },
  );

  return (
    <Section id="hero" background="#0b0c10" noFade>
      {/* ————————————————————————————————————————
          Photographic backdrop
          Slow ken-burns scale adds quiet life so the frame never feels
          static. Layered gradients preserve cinematic contrast while
          keeping foreground text legible top-to-bottom.
         ———————————————————————————————————————— */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
      >
        <motion.div
          className="absolute inset-0 h-full w-full"
          initial={{ scale: 1.12 }}
          animate={{ scale: entered ? 1.0 : 1.12 }}
          transition={{ duration: 12, ease: "easeOut" }}
        >
          <Image
            src="/hero-main/hero-bg/hero-homepage-new.jpg"
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            draggable={false}
            className="select-none object-cover object-center max-md:object-[55%_center]"
          />
        </motion.div>

        {/* Warm top-to-bottom shadow — lets the overline + hero mark
            breathe while keeping the photo's texture. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0.20) 38%, rgba(8,10,14,0.35) 62%, rgba(8,10,14,0.80) 100%)",
          }}
        />

        {/* Subtle left vignette — grounds the title column without
            crushing the image detail on the right. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0.10) 45%, rgba(8,10,14,0.0) 100%)",
          }}
        />

        {/* Cream brand tint at the very top edge — ties the dark photo
            back to the RaJA palette so the hero doesn't feel off-brand. */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,247,230,0.10) 0%, rgba(255,247,230,0) 100%)",
          }}
        />

        {/* Fine film grain — adds editorial texture without noise. */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </motion.div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-gutter-lg pt-32 pb-10 md:pt-40 md:pb-16 max-md:px-gutter max-md:pt-44 max-md:pb-8 max-md:justify-center">
        {/* Top-middle logo — absolutely positioned so it sits in the
            hero's visual "eyebrow" without disturbing the left-aligned
            title column below. This is the FLIP target rect that the
            preloader's center mark lands on. The hero's own copy stays
            invisible during `reveal` and fades in on `ready`, so the
            handoff from preloader → hero is invisible. */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 flex justify-center md:top-28 max-md:top-20">
          <div
            ref={heroLogoRef}
            data-flip-target="raja-logo"
            className="relative pointer-events-auto"
            style={{
              width: "clamp(5.5rem, 10vw, 8.25rem)",
              aspectRatio: "1",
            }}
          >
            {/* Crimson aura — warm bloom behind the red badge so it
                reads as "lit from behind" on the dark canvas. */}
            <span
              aria-hidden
              className="absolute -inset-[55%] -z-10 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(238,58,63,0.45) 0%, rgba(238,58,63,0.18) 38%, rgba(0,0,0,0) 68%)",
                filter: "blur(2px)",
              }}
            />
            {/* Cream halo — subtle warm wash tying the badge to the
                RaJA palette. */}
            <span
              aria-hidden
              className="absolute -inset-[22%] -z-10 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,247,230,0.35) 0%, rgba(255,247,230,0) 60%)",
              }}
            />

            <motion.div
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={
                phase === "ready"
                  ? { opacity: 1, scale: 1, y: 0 }
                  : phase === "reveal"
                  ? { opacity: 0, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.96, y: -6 }
              }
              transition={
                phase === "ready"
                  ? { duration: 0.5, ease: EASE_OUT_EXPO }
                  : { duration: 0 }
              }
              whileHover={{ rotate: 8, scale: 1.05 }}
              style={{
                filter:
                  "drop-shadow(0 20px 48px rgba(238,58,63,0.4)) drop-shadow(0 6px 16px rgba(0,0,0,0.45))",
              }}
            >
              <Image
                src="/hero-main/RaJA-Logo.svg"
                alt="RaJA International"
                fill
                priority
                sizes="132px"
                draggable={false}
                className="select-none"
              />
            </motion.div>

            {/* Ambient breathing ring — a thin cream ring that gently
                pulses once the hero is fully present. */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-[-10%] rounded-full border border-white/15"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                phase === "ready"
                  ? { opacity: [0, 0.5, 0], scale: [0.9, 1.15, 1.25] }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{
                delay: 0.6,
                duration: 2.8,
                ease: "easeOut",
                repeat: phase === "ready" ? Infinity : 0,
                repeatDelay: 1.2,
              }}
            />
          </div>
        </div>

        <motion.div
          key={`overline-${locale}`}
          initial={{ opacity: 0, y: 20 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE_OUT_QUART }}
          className="flex items-center gap-4 text-sm tracking-widest uppercase text-white/70 max-md:justify-center"
        >
          <motion.span
            className="h-px bg-white/60 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: entered ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: EASE_OUT_EXPO }}
            style={{ width: "2.5rem" }}
          />
          {t.hero.overline}
        </motion.div>

        <div className="flex-1 flex items-center">
          {/* Column gaps are owned per-element (not via `gap-*`) so the
              RaJA headline and the Association subtitle can lock up
              tight — matching the brand composition — while the
              tagline and CTA below keep their generous breathing room. */}
          <div className="flex flex-col max-md:items-center max-md:text-center">
            {/* RaJA headline — redesigned typographic mark. Replaces
                the old flat-white SVG wordmark, which fought for
                contrast against bright regions of the photo. The new
                mark layers an ink ghost, a gradient porcelain fill,
                a specular highlight, and a warm aura so the letters
                stay luminous on any backdrop. */}
            <HeroHeadline entered={entered} />

            {/* Subtitle — "Radiant Japan Association". Tight lockup
                under the headline (negative margin) to match the
                brand composition.
                Dual-phase:
                - During `reveal`: renders at its final layout position
                  but fully transparent, giving the preloader's manual
                  FLIP a stable target rect to land on.
                - During `ready`: gently fades up to resting opacity.
                  The preloader's traveling copy lands here at the same
                  instant, so the swap is invisible. */}
            <div
              className="overflow-hidden -mt-3 md:-mt-5 lg:-mt-7"
              data-subtitle-wrap
            >
              <motion.img
                data-flip-target="raja-subtitle"
                src="/hero-main/RaJA-subtitle.svg"
                alt="Radiant Japan Association"
                draggable={false}
                className="block h-auto w-[clamp(22rem,58vw,48rem)] select-none max-md:w-[clamp(15rem,80vw,22rem)]"
                style={{
                  filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))",
                }}
                initial={{ y: "120%", opacity: 0 }}
                animate={
                  phase === "ready"
                    ? { y: "0%", opacity: 0.98 }
                    : phase === "reveal"
                    ? { y: "0%", opacity: 0 }
                    : { y: "120%", opacity: 0 }
                }
                transition={
                  phase === "ready"
                    ? { duration: 0.45, ease: EASE_OUT_EXPO }
                    : { duration: 0 }
                }
              />
            </div>

            {/* Japanese tagline — typed character-by-character with a
                blinking caret that fades after the line completes. */}
            <div className="mt-5 md:mt-7">
              <HeroTagline
                text={t.hero.tagline}
                localeKey={locale}
                active={entered}
                startDelay={1.55}
                perChar={0.055}
              />
            </div>

            {/* Red CTA — the single most decisive element on the page.
                Full opaqe red plate, generous padding, long letter-
                spacing. Hover triggers a subtle lift, a light shine
                sweep across the surface, and the arrow slides forward. */}
            <motion.button
              type="button"
              onClick={() => scrollTo("#inquiry")}
              aria-label={t.hero.contactCta}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={
                entered
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 24, scale: 0.94 }
              }
              transition={{
                delay: 2.45,
                duration: 0.75,
                ease: EASE_OUT_EXPO,
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97, y: 0 }}
              className="group relative mt-6 md:mt-8 inline-flex w-fit items-center gap-3 overflow-hidden rounded-full px-9 py-[0.95rem] text-xs font-medium uppercase tracking-[0.26em] text-white select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10] md:px-11 md:py-4 md:tracking-[0.3em] max-md:mx-auto"
              style={{
                background:
                  "linear-gradient(180deg, #EE3A3F 0%, #D91F24 100%)",
                boxShadow:
                  "0 16px 38px -10px rgba(217,31,36,0.55), 0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
                willChange: "transform",
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 140% at 50% -20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[transform,opacity] duration-[900ms] ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
              />
              <span className="relative">{t.hero.contactCta}</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative translate-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
              >
                <path d="M3 8h9" />
                <path d="M8.5 3.5L13 8l-4.5 4.5" />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            key={`desc-${locale}`}
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.25, duration: 0.8, ease: EASE_OUT_QUART }}
            className="max-w-md text-lg leading-relaxed text-white/75 max-md:text-center max-md:mx-auto"
          >
            {t.hero.description}
          </motion.p>

          <ul
            key={`panels-${locale}`}
            ref={panelsRef}
            className="flex flex-wrap items-end gap-3 md:flex-nowrap md:gap-6 max-md:justify-center max-md:gap-x-5 max-md:gap-y-4"
            aria-label={t.hero.overline}
          >
            {panels.map((p) => (
              <li
                key={p.id}
                data-panel
                className="relative"
                style={{
                  opacity: 0,
                  willChange: "transform, opacity, filter",
                }}
              >
                <button
                  data-panel-btn
                  onClick={() => scrollTo(`#${p.id}`)}
                  aria-label={p.label}
                  className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40 rounded-xl"
                  style={{ willChange: "transform" }}
                >
                  {/* Soft color halo — GSAP blooms this on hover and on
                      entrance so the brand color reads against the dark
                      plate without being loud at rest. */}
                  <span
                    aria-hidden
                    data-panel-halo
                    className="pointer-events-none absolute inset-0 -z-10 rounded-[28px] blur-2xl"
                    style={{
                      background: p.color,
                      opacity: 0,
                      willChange: "transform, opacity",
                    }}
                  />
                  <img
                    data-panel-img
                    src={p.src}
                    alt=""
                    draggable={false}
                    className={`relative w-auto select-none ${p.sizeClass}`}
                    style={{
                      filter:
                        "drop-shadow(0 10px 24px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                      transformOrigin: "50% 100%",
                      willChange: "transform",
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entered ? 1 : 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/65 max-md:hidden"
        >
          <span>{t.hero.scroll}</span>
          <motion.span
            className="h-8 w-[1px] bg-white/60"
            animate={{ scaleY: [0.3, 1, 0.3], originY: [0, 0, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </Section>
  );
}
