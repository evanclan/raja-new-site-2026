"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { Section } from "../Section";
import { useT } from "@/lib/i18n";
import { useParallaxPx } from "@/lib/useViewportPx";
import { SectionLogo } from "../SectionLogo";

type PanelShellProps = {
  id: string;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  ages: string;
  accent: string;
  background: string;
  ink?: string;
  /**
   * Colour for the subtitle line. Defaults to `accent`. Override
   * when the accent reads too low-contrast against the section
   * background (e.g. peach on cyan) — Preschool passes its ink.
   */
  subtitleColor?: string;
  visual: ReactNode;
  /**
   * Optional mobile-only visual rendered INSIDE the copy column, right after
   * the description, instead of the stacked/bleed visual at the top. Used by
   * Preschool to move the child photo below the intro copy on phones. It is
   * shown only <768px (md:hidden); the bleed/stacked visual is hidden there.
   */
  mobileVisual?: ReactNode;
  /**
   * Place the visual on the LEFT and the copy on the RIGHT
   * (default is copy-left / visual-right). On mobile the visual
   * always stacks on top when reversed.
   */
  reverse?: boolean;
  /**
   * Optional trust pillars — three short points rendered between
   * the description and the CTA row. Used by Preschool to surface
   * its "why" without bloating the panel.
   */
  pillars?: ReadonlyArray<{ t: string; d: string }>;
  /**
   * Optional small label that heads the `branches` block
   * (e.g. "Our two campuses" / 「ふたつの園」).
   */
  campusesLabel?: string;
  /**
   * Optional branch/campus showcase — photo rows rendered in the copy
   * column (in place of, or below, the pillars). Each row pairs a real
   * exterior photo with the campus name, its reading in the other
   * script (`sub`), and one warm line. Used by Preschool to surface its
   * two physical campuses inside the existing panel.
   */
  branches?: ReadonlyArray<{
    name: string;
    sub: string;
    line: string;
    /** Postal code + street address (one line). */
    addr: string;
    /** Phone number (rendered after a "TEL" prefix). */
    tel: string;
    /** Care-type / hours line. */
    hours: string;
    img: string;
    alt: string;
    /** Intrinsic pixel size of the source image, for correct aspect ratio. */
    w: number;
    h: number;
  }>;
  /**
   * Optional brand crest that heads the copy column (matching the Academy
   * and English sections). Rendered above the index label with a gentle
   * idle bob. Used by Preschool for the RaJA Method emblem.
   */
  logo?: { src: string; w: number; h: number };
  logoLarge?: boolean;
  /**
   * Override the logo size classes entirely (height clamp + any max-md
   * mobile override). Used by Preschool to enlarge its crest on mobile to
   * match the Study Abroad logo height. Keep the desktop clamp in here so
   * the approved desktop size is preserved.
   */
  logoSizeClassName?: string;
  /**
   * Optional content rendered in the copy column between the branches block
   * and the CTA row — e.g. Preschool's embedded photo slideshow.
   */
  extra?: ReactNode;
  /**
   * Destination for the "Learn more" CTA. An external sister-company
   * site (https://…) opens in a new tab; an in-page anchor (#…) stays
   * in the same tab.
   */
  href: string;
  /**
   * Render the visual as a full-height, full-bleed layer on one half
   * of the section (left when `reverse`, else right) instead of inside
   * the padded, centred content grid. The copy then occupies the other
   * half. On mobile the visual falls back to stacking above the copy.
   * Used by Preschool so the child photo spans the whole section.
   */
  bleedVisual?: boolean;
  /**
   * Full-bleed decorative layer that sits *behind* the content column
   * but *in front* of the base gradient. Each panel passes a themed
   * backdrop keyed to its navigation SVG so the section feels like an
   * extension of the card the user clicked from the hero row.
   *
   * Expected to be an absolutely-positioned, `inset-0`, `-z-0` layer
   * with `pointer-events-none`. The `SectionBackdrops` module provides
   * ready-made components that follow that contract.
   */
  backdrop?: ReactNode;
};

export function PanelShell({
  id,
  index,
  label,
  title,
  subtitle,
  description,
  ages,
  accent,
  background,
  ink = "var(--color-ink)",
  subtitleColor,
  visual,
  backdrop,
  reverse = false,
  pillars,
  campusesLabel,
  branches,
  logo,
  logoLarge = false,
  logoSizeClassName,
  extra,
  href,
  bleedVisual = false,
  mobileVisual,
}: PanelShellProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useT();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax travel scales with viewport height (live on resize) instead of
  // the old fixed ±80/±40 px, so it reads the same on phone and widescreen.
  const p = useParallaxPx(0.09, 40, 100);
  const visualY = useTransform(scrollYProgress, [0, 1], [p, -p]);
  const labelY = useTransform(scrollYProgress, [0, 1], [p * 0.5, -p * 0.5]);

  const textCol = (
    <div
      className={`relative z-10 md:col-span-6 ${
        bleedVisual && reverse ? "md:col-start-7" : ""
      }`}
    >
      <motion.div
        style={{ y: labelY }}
        className="flex items-center gap-3 text-xs uppercase tracking-[0.25em]"
      >
        <span
          className="grid h-8 w-8 place-items-center rounded-full font-display text-sm"
          style={{ background: accent, color: "var(--color-ink)" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span style={{ color: ink, opacity: 0.7 }}>{label}</span>
      </motion.div>

      {/* Section logo — uniform across all sections, beneath the badge. */}
      {logo && (
        <SectionLogo
          src={logo.src}
          width={logo.w}
          height={logo.h}
          className="mt-5"
          large={logoLarge}
          sizeClassName={logoSizeClassName}
        />
      )}

      <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-display mt-5 text-display-1 tracking-tight whitespace-pre-line max-md:whitespace-normal max-md:leading-[1.05]"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-xl font-medium"
        style={{ color: subtitleColor ?? accent }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 max-w-md text-base leading-relaxed"
        style={{ color: ink, opacity: 0.8 }}
      >
        {description}
      </motion.p>

      {/* Mobile-only visual — sits right after the description on phones,
          below the intro copy (the bleed/stacked visual above is hidden
          on mobile when this is provided). Desktop is untouched. */}
      {mobileVisual && (
        <div className="md:hidden mt-8">{mobileVisual}</div>
      )}

      {pillars && pillars.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-7 grid max-w-md gap-3"
        >
          {pillars.map((pl, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
                style={{
                  background: `color-mix(in srgb, ${accent} 22%, transparent)`,
                  color: accent,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>
                <span
                  className="font-display text-base leading-snug"
                  style={{ color: ink }}
                >
                  {pl.t}
                </span>
                <span
                  className="block text-sm leading-relaxed"
                  style={{ color: ink, opacity: 0.7 }}
                >
                  {pl.d}
                </span>
              </span>
            </li>
          ))}
        </motion.ul>
      )}

      {branches && branches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-7 max-w-md"
        >
          {campusesLabel && (
            <p
              className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.22em] uppercase"
              style={{ color: ink, opacity: 0.6 }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: accent }}
                aria-hidden
              />
              {campusesLabel}
            </p>
          )}
          {/* Each source photo packs the building on its LEFT and (now unused)
              baked-in white text on the right. We crop to just the photo with
              `object-left` and re-type the address as real blue text on a white
              card, so the colours are fully controllable. */}
          <div className="grid gap-3">
            {branches.map((b, i) => (
              <figure
                key={i}
                className="group flex items-stretch overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_-18px_rgba(8,10,40,0.35)] ring-1 ring-[#06407a]/10 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[6/5] w-[38%] shrink-0 overflow-hidden bg-white max-sm:w-[44%]">
                  <Image
                    src={b.img}
                    alt=""
                    fill
                    sizes="180px"
                    draggable={false}
                    className="object-cover object-left"
                  />
                </div>
                <figcaption
                  className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-3"
                  style={{ color: "#06407a" }}
                >
                  <p className="font-display text-sm leading-tight md:text-base">{b.name}</p>
                  <p className="mt-1 text-[0.72rem] leading-snug opacity-80">{b.addr}</p>
                  <p className="text-[0.72rem] leading-snug opacity-80">TEL {b.tel}</p>
                  <p className="text-[0.72rem] leading-snug opacity-60">{b.hours}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      )}

      {extra}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-8 flex flex-wrap items-center gap-4"
      >
        <span
          className="rounded-full px-4 py-1.5 text-sm font-medium max-md:py-2.5"
          // `color-mix` derives a subtle translucent chip from
          // whatever ink colour the section uses, so the pill
          // stays legible on both light and dark backdrops.
          style={{
            background: `color-mix(in srgb, ${ink} 12%, transparent)`,
            color: ink,
          }}
        >
          {ages}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 max-md:py-3"
          style={{ background: accent, color: "var(--color-ink)" }}
        >
          {t.panels.learnMore}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </motion.div>
    </div>
  );

  const visualCol = (
    <motion.div style={{ y: visualY }} className="relative z-0 md:col-span-6">
      {visual}
    </motion.div>
  );

  const watermark = (
    <motion.span
      aria-hidden
      style={{ y: labelY, color: ink, opacity: 0.04 }}
      className="pointer-events-none absolute bottom-4 right-4 font-display text-[18vw] leading-none max-md:hidden"
    >
      {String(index).padStart(2, "0")}
    </motion.span>
  );

  // Full-height bleed layout — the visual spans the whole section on
  // one half; the copy occupies the other. On mobile the visual is in
  // flow (stacks above the copy) so nothing overlaps on small screens.
  if (bleedVisual) {
    return (
      <Section id={id} background={background} style={{ color: ink }}>
        {backdrop}
        <div
          className={`pointer-events-none relative z-[1] w-full md:absolute md:inset-y-0 md:w-1/2 ${
            mobileVisual ? "max-md:hidden" : ""
          } ${reverse ? "md:left-0" : "md:right-0"}`}
        >
          {visual}
        </div>
        <div
          ref={ref}
          className="relative z-[1] shell grid grid-cols-1 items-center gap-9 py-band max-md:gap-7 md:min-h-screen md:grid-cols-12"
        >
          {textCol}
          {watermark}
        </div>
      </Section>
    );
  }

  return (
    <Section id={id} background={background} style={{ color: ink }}>
      {backdrop}
      <div
        ref={ref}
        className="relative z-[1] shell grid grid-cols-1 items-center gap-9 py-band max-md:gap-7 md:min-h-screen md:grid-cols-12"
      >
        {reverse ? (
          <>
            {visualCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {visualCol}
          </>
        )}

        {watermark}
      </div>
    </Section>
  );
}
