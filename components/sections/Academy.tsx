"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "../Section";
import { AcademyBackdrop } from "../backdrops/SectionBackdrops";
import { DiveSeam } from "../transitions/DiveSeam";
import { AcademyKeepsake } from "../visuals/AcademyKeepsake";
import { useI18n, useT } from "@/lib/i18n";
import { remPx } from "@/lib/useViewportPx";
import { SectionLogo } from "../SectionLogo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// Academy — 「星に手をのばす」Reaching for the Stars (卒園式 keepsake)
//
// A bespoke panel (no longer the shared PanelShell) that makes the
// real graduation photograph the emotional hero. The celestial
// AcademyBackdrop the client loves is kept verbatim; its *meaning*
// is reframed from "night library" to "a constellation of futures
// the child steps into" (巣立ち).
//
// "Pick only the important": the giant "02" watermark, the abstract
// playground shapes, the standalone age pill and the loud button are
// all CUT. What remains — badge, a quiet kicker, a small proud
// headline, one subtitle, one sentence, a text-link, and a date
// stamp — orbits the photo with generous ma.
// ————————————————————————————————————————————————————————

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tate-gaki (vertical) headline is the most authentically Japanese
 * gesture here, but also the one real fragility — it needs real
 * height. Render it ONLY on a tall desktop viewport; everywhere else
 * the headline falls back to horizontal. SSR-safe: default false so
 * the server and first client paint agree, then upgrade on mount.
 */
function useTategaki() {
  const [vertical, setVertical] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 720px)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return vertical;
}

export function Academy() {
  const t = useT();
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const p = t.panels.academy;
  const tall = useTategaki();

  // Vertical headline only when Japanese AND the viewport is tall
  // enough — English never goes vertical.
  const verticalHeadline = locale === "ja" && tall;

  const rootRef = useRef<HTMLDivElement | null>(null);

  // ONE GSAP timeline choreographs the whole entrance as a single story:
  //   halo bloom → photo RISES (the hero leads) → copy cascade → seal pop.
  // It replaces the old scatter of independent whileInView triggers, and
  // reaches across into <AcademyKeepsake/> by selecting [data-academy] tags
  // within this section's scope (GSAP ignores component boundaries).
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const halo = root.querySelector('[data-academy="halo"]');
      const photo = root.querySelector('[data-academy="photo"]');
      const copy = root.querySelectorAll('[data-academy="copy"]');
      const seal = root.querySelector('[data-academy="seal"]');

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance rise distances, scaled to the fluid root.
        const photoRise = remPx(3.125); // ~50px
        const copyRise = remPx(1.375); // ~22px
        // Hidden start states (set pre-paint; the section is below the
        // fold so there is no flash on first load).
        if (halo) gsap.set(halo, { opacity: 0 }); // opacity-only — preserves its Tailwind -translate centering
        if (photo) gsap.set(photo, { opacity: 0, y: photoRise, scale: 0.985 });
        gsap.set(copy, { opacity: 0, y: copyRise });
        if (seal) gsap.set(seal, { opacity: 0, scale: 0.4, rotate: -14 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
          defaults: { ease: "power3.out" },
        });
        if (halo) tl.to(halo, { opacity: 1, duration: 0.7, ease: "power2.out" });
        if (photo)
          tl.to(photo, { opacity: 1, y: 0, scale: 1, duration: 1.0 }, "-=0.45");
        tl.to(copy, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.55");
        if (seal)
          tl.to(
            seal,
            { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.6)" },
            "-=0.2"
          );

        // If the section is already past the trigger when this runs
        // (deep-link to #academy, or a refresh mid-page), ScrollTrigger
        // won't fire onEnter — play the reveal now so the content can
        // never get stuck hidden at opacity 0.
        if (root.getBoundingClientRect().top <= window.innerHeight * 0.7) {
          tl.play(0);
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const solo = [halo, photo, seal].filter(Boolean) as Element[];
        if (solo.length) gsap.set(solo, { opacity: 1, y: 0, scale: 1, rotate: 0 });
        gsap.set(copy, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    // Run ONCE on mount. We deliberately do NOT depend on locale: the
    // revealed elements persist across a language switch (their text just
    // re-renders), and the horizontal⇄tate-gaki headline swap owns its
    // own Framer entrance. Re-running here would re-hide everything and,
    // if the section were already in view, strand it at opacity 0.
    { scope: rootRef }
  );

  const HeadlineHorizontal = (
    <h2
      data-academy="copy"
      className="font-display text-display-1 tracking-tight"
      style={
        locale === "ja"
          ? {
              letterSpacing: "0.04em",
              wordBreak: "keep-all",
              lineHeight: 1.4,
              // 「環境のプレゼント」is now ONE line. At the display-1 min size it
              // ran to the screen edge on phones, so lower just the mobile
              // floor (2.1rem vs display-1's 2.6rem); the vw/max terms are
              // unchanged, so desktop is identical and only narrow viewports
              // shrink enough to keep the phrase inside the copy column.
              fontSize: "clamp(2.1rem, 5.4vw, 5.5rem)",
            }
          : undefined
      }
    >
      {p.title.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </h2>
  );

  return (
    <Section
      id="academy"
      background="linear-gradient(160deg, #3c44a8 0%, #2e3192 50%, #191d5c 100%)"
      style={{ color: "#fff7e6" }}
      // The dive seam flashes a crisp waterline + splash at the
      // Preschool→Academy boundary in a non-fading overlay above the
      // backdrop, then gates itself to zero so Academy is unchanged at rest.
      overlay={<DiveSeam />}
    >
      <AcademyBackdrop />

      <div
        ref={rootRef}
        className="relative z-[1] shell grid min-h-screen grid-cols-1 items-center gap-12 py-band md:grid-cols-12"
      >
        {/* COPY — left half, deliberately under-filled with ma. Top-aligned
            with the photo's upper edge so the badge→CTA group reads as one
            composition with the hero (the IB lockup anchors the bottom). */}
        <div className="relative z-10 flex items-start gap-6 self-start md:col-span-5 md:gap-10 md:pt-[var(--space-band)]">
          <div
            className="flex max-w-[46ch] flex-1 flex-col justify-start"
            style={locale === "ja" ? { maxWidth: "26em" } : undefined}
          >
            {/* Number badge + label — the shared section header. */}
            <div
              data-academy="copy"
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
            >
              <span
                className="font-display grid h-8 w-8 place-items-center rounded-full text-sm"
                style={{ background: "#ffd23d", color: "#20233a" }}
              >
                03
              </span>
              <span style={{ opacity: 0.7 }}>{p.label}</span>
            </div>

            {/* Section logo — uniform size across all sections, on its own
                line beneath the badge. */}
            <SectionLogo
              src="/academy/newacademysectionlogo.png"
              width={1565}
              height={1250}
              className="mt-5"
              large
              sizeClassName="h-[clamp(14rem,21vw,30rem)]"
            />

            {/* Headline — horizontal here unless it's the JA vertical
                column (which renders to the right, below). */}
            {!verticalHeadline && <div className="mt-4">{HeadlineHorizontal}</div>}

            {/* Subtitle — one line, sun-amber; age is folded in. */}
            <p
              data-academy="copy"
              className="mt-6 text-2xl font-medium whitespace-pre-line"
              style={{
                color: "#ffd23d",
                ...(locale === "ja" ? { letterSpacing: "0.04em" } : {}),
              }}
            >
              {p.subtitle}
            </p>

            {/* Body — a single sentence. */}
            <p
              data-academy="copy"
              className="mt-5 text-lg leading-relaxed whitespace-pre-line"
              style={{
                opacity: 0.8,
                ...(locale === "ja"
                  ? { lineHeight: 1.85, letterSpacing: "0.04em", wordBreak: "keep-all" as const }
                  : {}),
              }}
            >
              {p.body}
            </p>

            {/* CTA — demoted to a quiet text-link. */}
            <div data-academy="copy" className="mt-7">
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-sm font-medium text-[#fff7e6] transition-colors hover:text-[#ffd23d] max-md:min-h-11">
                <span className="border-b border-[#fff7e6]/30 pb-0.5 transition-colors group-hover:border-[#ffd23d]">
                  {p.cta}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Tate-gaki headline — vertical column on the right edge of
              the copy zone, sharing a sightline with the faces. */}
          {verticalHeadline && (
            <motion.h2
              // Mounts via the tall-guard effect (off-screen on load),
              // so animate-on-mount is more reliable here than
              // whileInView under Lenis smooth-scroll.
              initial={{ opacity: 0, y: reduce ? 0 : 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="font-display shrink-0 self-start text-[4.2rem]"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                fontWeight: 700,
                lineHeight: 1.75,
                letterSpacing: "0.05em",
                wordBreak: "keep-all",
              }}
            >
              {p.title.join("")}
            </motion.h2>
          )}
        </div>

        {/* PHOTO — the hero, given the dominant column and pushed toward
            the right edge so the split reads 5 / 7, not a static 50 / 50. */}
        <div className="md:col-span-7 md:col-start-6">
          <AcademyKeepsake />
        </div>
      </div>
    </Section>
  );
}
