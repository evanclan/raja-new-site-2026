"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "../Section";
import { EnglishBackdrop } from "../backdrops/SectionBackdrops";
import { TeacherLineup } from "../visuals/Visuals";
import { useSmoothScroll } from "../SmoothScrollProvider";
import { useT, type Dictionary } from "@/lib/i18n";
import { SectionLogo } from "../SectionLogo";

// ————————————————————————————————————————————————————————
// Section 05 — Let's Go English (RaJA's Kagoshima conversation school)
//
// A bespoke, teacher-led showcase (not the shared PanelShell). The
// four real teachers are the animated centrepiece; a real photo of
// the director handing a student an Eiken certificate anchors the
// header with genuine emotion; a free-trial CTA closes the story.
//
// Palette is pulled straight from letsgoenglish.svg — orange
// #f15a29 + teal-green #3a9984 — over the section's existing warm
// amber→mint gradient so it stays a sibling of the other panels.
// ————————————————————————————————————————————————————————

const ACCENT = "#f15a29"; // letsgoenglish.svg orange
const TEAL = "#1f8270"; // deepened teal-green for legible text on the warm bg
const EASE = [0.22, 1, 0.36, 1] as const;
const POP = [0.175, 0.885, 0.32, 1.275] as const;
const BG = "linear-gradient(155deg, #ffd79a 0%, #fff1c7 45%, #bfe3cf 100%)";

type EnglishCopy = Dictionary["panels"]["english"];

export function English() {
  const t = useT();
  const e = t.panels.english;
  const { scrollTo } = useSmoothScroll();

  return (
    <Section id="english" background={BG} style={{ color: "var(--color-ink)" }}>
      <EnglishBackdrop />

      <div className="relative z-[1] shell flex min-h-screen flex-col justify-center gap-14 py-band">
        {/* ——— Band 1 — header + emotional hero ——— */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-6">
          {/* Copy column */}
          <div className="md:col-span-7">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
              className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase"
            >
              <span
                className="font-display grid h-8 w-8 place-items-center rounded-full text-sm text-white"
                style={{ background: ACCENT }}
              >
                05
              </span>
              <span style={{ opacity: 0.65 }}>{e.label}</span>
            </motion.div>

            {/* Section logo — uniform across all sections, beneath the badge.
                The new light-background logo (dark text) reads on the warm
                gradient with no chip, so English matches the other headers. */}
            <SectionLogo
              src="/lets-go-english/letsgonewlogo.png"
              width={750}
              height={750}
              alt={e.logoAlt}
              className="mt-5"
            />

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display mt-5 text-display-1 tracking-tight text-balance"
            >
              {e.title.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h2>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-4 text-2xl font-medium"
              style={{ color: TEAL }}
            >
              {e.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
              className="mt-5 max-w-xl text-base leading-relaxed"
              style={{ opacity: 0.82 }}
            >
              {e.description}
            </motion.p>

            {/* Age rail — first words → fluency → study abroad */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
              className="mt-7"
            >
              <div
                className="text-xs tracking-[0.2em] uppercase"
                style={{ opacity: 0.55 }}
              >
                {e.agesKicker}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
                {e.ages.map((age, i) => (
                  <span key={age} className="inline-flex items-center gap-1.5">
                    {i > 0 && (
                      <span aria-hidden style={{ color: ACCENT }}>
                        →
                      </span>
                    )}
                    <span className="rounded-full bg-white/70 px-3 py-1 font-medium shadow-sm">
                      {age}
                    </span>
                  </span>
                ))}
                <span aria-hidden style={{ color: ACCENT }}>
                  →
                </span>
                <button
                  type="button"
                  onClick={() => scrollTo("#study-abroad")}
                  className="rounded-full px-3 py-1 text-sm font-medium underline-offset-4 transition hover:underline"
                  style={{
                    background: `color-mix(in srgb, ${TEAL} 15%, transparent)`,
                    color: TEAL,
                  }}
                >
                  {e.studyAbroad}
                </button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.34, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={() => scrollTo("#inquiry")}
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  background: ACCENT,
                  boxShadow: "0 14px 30px -10px rgba(241,90,41,0.6)",
                }}
              >
                {e.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
              <span className="text-sm" style={{ opacity: 0.7 }}>
                {e.ctaNote}
              </span>
            </motion.div>
          </div>

          {/* Emotional hero cutout */}
          <div className="md:col-span-5">
            <HeroCutout e={e} />
          </div>
        </div>

        {/* ——— Band 2 — teachers ——— */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-8 flex flex-wrap items-end justify-between gap-3"
          >
            <h3 className="font-display text-3xl tracking-tight">
              {e.teachersKicker}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {e.points.map((p) => (
                <li
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium shadow-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <TeacherLineup />
        </div>
      </div>
    </Section>
  );
}

// ————————————————————————————————————————————————————————
// HeroCutout — the transparent photo of the director handing an
// Eiken certificate to a delighted student, layered with an Eiken
// "official venue" sticker and a frog-hat director's-word card.
// ————————————————————————————————————————————————————————
function HeroCutout({ e }: { e: EnglishCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.0, ease: EASE }}
      className="relative mx-auto w-full max-w-[clamp(18rem,30vw,30rem)]"
    >
      {/* Celebratory sun-glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 48% at 55% 38%, rgba(255,210,61,0.55) 0%, rgba(255,210,61,0) 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* Soft white "ma" cushion grounds the cutout on the busy backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-[5%] top-[8%] bottom-[3%] -z-10"
        style={{
          background:
            "radial-gradient(48% 52% at 50% 56%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 72%)",
        }}
      />

      {/* Idle bob */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative aspect-[3/5] w-full">
          <Image
            src="/lets-go-english/main-hero-image.avif"
            alt={e.heroAlt}
            fill
            quality={85}
            sizes="(max-width: 768px) 78vw, 420px"
            draggable={false}
            className="object-contain object-bottom select-none"
            style={{ filter: "drop-shadow(0 28px 38px rgba(32,35,58,0.28))" }}
          />
        </div>
      </motion.div>

      {/* Eiken official-venue sticker */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -16 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.5, ease: POP }}
        className="absolute top-[8%] left-0 z-10 max-w-[46%]"
      >
        <div className="rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center gap-1.5">
            <span
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white"
              style={{ background: ACCENT }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M12 2l2.6 7.2H22l-5.8 4.3 2.2 7L12 16.9 5.6 20.5l2.2-7L2 9.2h7.4z" />
              </svg>
            </span>
            <span
              className="font-display text-[0.72rem] leading-tight"
              style={{ color: "var(--color-ink)" }}
            >
              {e.eikenBadge}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Director's word — frog-hat avatar */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.65, ease: POP }}
        className="absolute right-0 -bottom-3 z-10 flex max-w-[80%] items-center gap-2.5 rounded-2xl bg-white/90 px-3 py-2 shadow-xl ring-1 ring-black/5 backdrop-blur"
      >
        <Image
          src="/lets-go-english/principal.png"
          alt={e.directorAlt}
          width={64}
          height={64}
          quality={85}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          style={{ background: "#eef6f2" }}
        />
        <div>
          <p
            className="text-[0.78rem] leading-snug font-medium"
            style={{ color: "var(--color-ink)" }}
          >
            {e.directorWord}
          </p>
          <p className="text-[0.66rem]" style={{ color: TEAL }}>
            — {e.directorName}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
