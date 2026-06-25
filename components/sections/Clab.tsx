"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "../Section";
import { ClabBackdrop } from "../backdrops/SectionBackdrops";
import { ClabCarat } from "../visuals/ClabCarat";
import { useI18n, useT } from "@/lib/i18n";
import { useSmoothScroll } from "../SmoothScrollProvider";
import { useParallaxPx, remPx } from "@/lib/useViewportPx";
import { SectionLogo } from "../SectionLogo";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ————————————————————————————————————————————————————————
// Clab + Education — 「カラット」the Carat gem.
//
// A bespoke panel. CLAB's brand story ("a gem's brilliance; many
// lessons completed in one place") sits beside a large spotlight that
// turns the gem to each program in turn (swimming · music · RIT ·
// programming · …) at a readable size.
//
// Background is layered for depth: the brand "blob" concept art
// (Clab background.png) drifts on a soft parallax, with the animated
// ClabBackdrop (tri-tone arcs + sparkles + glows) woven on top.
//
// One GSAP timeline owns the entrance (copy cascade → gem spotlight
// blooms → gleam → data + selectors). Idle/auto-cycle live in
// <ClabCarat/>.
// ————————————————————————————————————————————————————————

export function Clab() {
  const t = useT();
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const p = t.panels.clab;

  const rootRef = useRef<HTMLDivElement | null>(null);

  // Soft vertical parallax for the blob-art base layer.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });
  const par = useParallaxPx(0.05, 24, 56); // ~±36px, scales with viewport height
  const bgY = useTransform(scrollYProgress, [0, 1], [-par, par]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const copy = root.querySelectorAll('[data-clab="copy"]');
      const spotlight = root.querySelector('[data-clab="spotlight"]');
      const panel = root.querySelectorAll('[data-clab="panel"]');
      const sels = root.querySelectorAll('[data-clab="sel"]');
      const gleam = root.querySelectorAll('[data-clab="gleam"]');

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance rises, scaled to the fluid root.
        const copyRise = remPx(1.5); // ~24px
        const panelRise = remPx(1.125); // ~18px
        const selRise = remPx(1); // ~16px
        gsap.set(copy, { opacity: 0, y: copyRise });
        if (spotlight) gsap.set(spotlight, { opacity: 0, scale: 0.86 });
        gsap.set(panel, { opacity: 0, y: panelRise });
        gsap.set(sels, { opacity: 0, y: selRise, scale: 0.78 });
        if (gleam.length) gsap.set(gleam, { xPercent: -130 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        });

        tl.to(copy, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 });
        if (spotlight)
          tl.to(spotlight, { opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" }, "-=0.35");
        if (gleam.length)
          tl.to(gleam, { xPercent: 130, duration: 0.7, ease: "power2.inOut" }, "-=0.5");
        tl.to(panel, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.5");
        tl.to(
          sels,
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)", stagger: 0.07 },
          "-=0.4"
        );

        if (root.getBoundingClientRect().top <= window.innerHeight * 0.7) tl.play(0);

        return () => {
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(copy, { opacity: 1, y: 0 });
        if (spotlight) gsap.set(spotlight, { opacity: 1, scale: 1 });
        gsap.set(panel, { opacity: 1, y: 0 });
        gsap.set(sels, { opacity: 1, y: 0, scale: 1 });
        if (gleam.length) gsap.set(gleam, { opacity: 0 });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <Section
      id="clab"
      background="linear-gradient(155deg, #ece1f3 0%, #e3f0dc 50%, #fae1ec 100%)"
      style={{ color: "var(--color-ink)" }}
    >
      {/* Layer 1 — brand blob-art base, drifting on a soft parallax. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div style={{ y: reduce ? 0 : bgY }} className="absolute -inset-[7%]">
          <Image
            src="/clab/Clab background.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ opacity: 0.55 }}
          />
        </motion.div>
      </div>

      {/* Layer 2 — animated tri-tone arcs, sparkles, glows on top. */}
      <ClabBackdrop />

      {/* Layer 3 — the lead teacher (Shawn) holding the WonderCode robot,
          large and faint on the right as a human backdrop. The cutout is
          edge-free (transparent) so it needs no frame; its base already
          fades out. Sits above the decorative layers, below the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden max-md:hidden">
        <div className="absolute bottom-0 right-0 h-[clamp(24rem,82%,54rem)] w-[clamp(22rem,46vw,46rem)]">
          <Image
            src="/clab/shawn-cutout.png"
            alt=""
            fill
            sizes="46vw"
            className="object-contain object-bottom"
            style={{ opacity: 0.38 }}
          />
        </div>
      </div>

      <div
        ref={rootRef}
        className="relative z-[1] shell grid min-h-screen grid-cols-1 items-center gap-10 py-band md:grid-cols-12 max-md:min-h-0"
      >
        {/* COPY — brand story (left). */}
        <div className="relative z-10 md:col-span-4">
          <div
            data-clab="copy"
            className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
          >
            <span
              className="font-display grid h-8 w-8 place-items-center rounded-full text-sm"
              style={{ background: "var(--color-leaf)", color: "var(--color-ink)" }}
            >
              04
            </span>
            <span style={{ opacity: 0.7 }}>{p.label}</span>
          </div>

          <SectionLogo
            src="/clab/Clab Logo.png"
            width={609}
            height={453}
            alt="C-Lab + Education"
            className="mt-6"
            large
            // Mobile: match the enlarged logo height of the other sections
            // (~12.75rem ≈ 178px). Desktop clamp preserved unchanged.
            sizeClassName="h-[clamp(8rem,15vw,24rem)] max-md:h-[12.75rem]"
          />

          <p
            data-clab="copy"
            className="mt-6 text-xs uppercase tracking-[0.22em]"
            style={{
              color: "var(--color-leaf)",
              ...(locale === "ja" ? { textTransform: "none" as const, letterSpacing: "0.1em" } : {}),
            }}
          >
            {p.kicker}
          </p>

          <h2
            data-clab="copy"
            className="font-display mt-3 text-display-1 tracking-tight"
            style={
              locale === "ja"
                ? { letterSpacing: "0.02em", wordBreak: "keep-all", lineHeight: 1.3 }
                : undefined
            }
          >
            {p.title.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p
            data-clab="copy"
            className="mt-5 max-w-[42ch] text-base leading-relaxed"
            style={{
              opacity: 0.82,
              ...(locale === "ja"
                ? { lineHeight: 1.85, letterSpacing: "0.02em", wordBreak: "keep-all" as const }
                : {}),
            }}
          >
            {p.lede}
          </p>

          <div data-clab="copy" className="mt-7 flex flex-wrap items-center gap-4">
            <span
              className="rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                background: "color-mix(in srgb, var(--color-ink) 12%, transparent)",
                color: "var(--color-ink)",
              }}
            >
              {p.ages}
            </span>
            <button type="button" onClick={() => scrollTo(p.href)} className="group inline-flex items-center gap-2 text-sm font-medium max-md:min-h-11" style={{ color: "var(--color-ink)" }}>
              <span
                className="border-b pb-0.5 transition-colors group-hover:border-[var(--color-leaf)]"
                style={{ borderColor: "color-mix(in srgb, var(--color-leaf) 55%, transparent)" }}
              >
                {p.cta}
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* STAGE — the Carat spotlight + program selectors. */}
        <ClabCarat />
      </div>
    </Section>
  );
}
