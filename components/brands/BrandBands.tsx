"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Section } from "../Section";
import { useSmoothScroll } from "../SmoothScrollProvider";
import { useI18n, useT } from "@/lib/i18n";
import { PHILOSOPHY } from "@/lib/raja-world/family";

// The seven brands as full-width colour bands, one per brand, logo and
// pictures alternating sides down the page (after shin-ei-animation.jp's
// works list). Each band borrows its look from the brand's EXISTING hub
// section — the same background, logo and photos — and jumps to that
// section further down the page. Journey order: sky → sea → land.
//
// Pictures are never cropped: each one keeps its own shape at a height of
// min(px, vw). The vw factor is set per band so the whole row fits its half
// of the band at any width (it scales down instead of being cut off).

type Pic = {
  src: string;
  w: number;
  h: number;
  /** transparent cut-out: stands on the band's bottom edge, no card */
  cut?: boolean;
};

type Band = {
  key: string;
  /** id of the existing section this band jumps to; none = no link yet */
  to?: string;
  label: string;
  name: string;
  line: string;
  ages: string;
  logo?: { src: string; w: number; h: number };
  pics: Pic[];
  /** picture height: [px cap, vw on desktop, vw on phones] */
  size: [number, number, number];
  /** decorative backdrop behind the pictures (the section's own) */
  backdrop?: string;
  bg: string;
  ink: string;
};

const COPY = {
  ja: {
    title: "RaJA ファミリー",
    more: "詳しく見る",
    clab: { line: "放課後を、英語で過ごす学童", ages: "年少〜小6" },
    edu: { ages: "年少〜大人" },
    advance: { line: "新しい会社が、まもなく仲間に。", ages: "ただいま準備中" },
  },
  en: {
    title: "The RaJA family",
    more: "Learn more",
    clab: { line: "An after-school club that happens in English", ages: "Age 3 to grade 6" },
    edu: { ages: "Age 3 to adults" },
    advance: { line: "A new company is joining the family soon.", ages: "Coming soon" },
  },
};

export function BrandBands() {
  const t = useT();
  const { locale } = useI18n();
  const c = COPY[locale];
  const { scrollTo } = useSmoothScroll();
  const p = t.panels;

  const bands: Band[] = [
    {
      key: "preschool",
      to: "preschool",
      label: "RaJA INTERNATIONAL PRESCHOOL",
      name: p.preschool.label,
      line: p.preschool.subtitle,
      ages: p.preschool.ages,
      logo: { src: "/preschool/preschool_logoo.png", w: 1600, h: 1600 },
      pics: [
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_3.jpg", w: 1108, h: 1477 },
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_6.jpg", w: 1477, h: 1108 },
      ],
      size: [230, 17, 36],
      // the light top of the Preschool section's sky gradient, so ink text reads
      bg: "linear-gradient(180deg, #b8e8fa 0%, #7fd6f5 100%)",
      ink: "var(--color-ink)",
    },
    {
      key: "academy",
      to: "academy",
      label: "RaJA GLOBAL ACADEMY",
      name: p.academy.label,
      line: p.academy.subtitle.replace(/\n/g, " "),
      ages: locale === "ja" ? "3〜5歳" : "Ages 3–5",
      logo: { src: "/academy/newacademysectionlogo.png", w: 1565, h: 1250 },
      pics: [
        { src: "/academy/gallery/student-1.jpg", w: 900, h: 1600 },
        { src: "/academy/academy-hero-main-last.png", w: 1062, h: 1600, cut: true },
        { src: "/academy/gallery/student-3.jpg", w: 1280, h: 1280 },
      ],
      size: [250, 16, 30],
      bg: "linear-gradient(160deg, #3c44a8 0%, #2e3192 50%, #191d5c 100%)",
      ink: "#ffffff",
    },
    {
      key: "clab",
      to: "clab",
      label: "C-LAB",
      name: "C-Lab",
      line: c.clab.line,
      ages: c.clab.ages,
      logo: { src: "/clab/Clab Logo.png", w: 609, h: 453 },
      // the C-Lab section's own staging: Shawn in front of its backdrop
      pics: [{ src: "/clab/shawn-cutout.png", w: 956, h: 903, cut: true }],
      size: [250, 19, 46],
      backdrop: "/clab/Clab background.png",
      bg: "linear-gradient(155deg, #ece1f3 0%, #e3f0dc 50%, #fae1ec 100%)",
      ink: "var(--color-ink)",
    },
    {
      key: "edu",
      to: "clab",
      label: "+EDUCATION",
      name: "+Education",
      line: p.clab.programs.map((x) => x.name).join("・"),
      ages: c.edu.ages,
      pics: [
        { src: "/clab/Piano.jpg", w: 813, h: 813 },
        { src: "/clab/Swimming.jpg", w: 813, h: 813 },
        { src: "/clab/RIT.jpg", w: 1392, h: 1236 },
      ],
      size: [200, 12, 25],
      bg: "linear-gradient(155deg, #e3f0dc 0%, #fae1ec 60%, #ece1f3 100%)",
      ink: "var(--color-ink)",
    },
    {
      key: "english",
      to: "english",
      label: "LET'S GO ENGLISH!",
      name: p.english.label,
      line: p.english.tagline,
      ages: p.english.agesKicker,
      logo: { src: "/lets-go-english/letsgonewlogo.png", w: 750, h: 750 },
      pics: [
        { src: "/lets-go-english/chris.png", w: 1080, h: 1350, cut: true },
        { src: "/lets-go-english/main-hero-image.avif", w: 600, h: 1000, cut: true },
        { src: "/lets-go-english/erika.png", w: 1080, h: 1350, cut: true },
      ],
      size: [250, 18, 36],
      bg: "linear-gradient(155deg, #ffd79a 0%, #fff1c7 45%, #bfe3cf 100%)",
      ink: "var(--color-ink)",
    },
    {
      key: "kaeru",
      to: "study-abroad",
      label: "KAERU RYUGAKU",
      name: p.studyAbroad.label,
      line: p.studyAbroad.subtitle,
      ages: p.studyAbroad.ages,
      logo: { src: "/kaeruryugaku/home-assets/Logo.svg", w: 400, h: 400 },
      pics: [
        { src: "/kaeruryugaku/destinations/new-zealand.webp", w: 720, h: 977 },
        { src: "/kaeruryugaku/destinations/canada.webp", w: 720, h: 977 },
        { src: "/kaeruryugaku/destinations/malta.webp", w: 720, h: 977 },
      ],
      size: [230, 17, 34],
      bg: "linear-gradient(165deg, #ffffff 0%, #f4faf1 50%, #d5ecd8 100%)",
      ink: "var(--color-ink)",
    },
    {
      key: "advance",
      label: "RaJA ADVANCE",
      name: "RaJA Advance",
      line: c.advance.line,
      ages: c.advance.ages,
      pics: [],
      size: [0, 0, 0],
      bg: "linear-gradient(160deg, #fbe7ee 0%, #f8dce6 100%)",
      ink: "var(--color-ink)",
    },
  ];

  return (
    <>
      <Section id="family" background="var(--color-cream)" compact noFade>
        <div className="shell-tight py-[clamp(2.5rem,6vw,4.5rem)] text-center">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold text-[var(--color-ink)]">{c.title}</h2>
          <p className="mt-2 text-[clamp(0.95rem,1.2vw,1.1rem)] text-[var(--color-ink-soft)]">{PHILOSOPHY[locale]}</p>
        </div>
      </Section>

      {bands.map((b, i) => {
        const flip = i % 2 === 1;
        const anyCut = b.pics.some((x) => x.cut);
        const sizeVars = {
          "--pic-d": `min(${b.size[0]}px, ${b.size[1]}vw)`,
          "--pic-p": `min(${b.size[0]}px, ${b.size[2]}vw)`,
        } as CSSProperties;

        const body = (
          <div className={`grid md:grid-cols-2 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
            {/* text half: the section's own number, label and logo */}
            <div className="flex flex-col justify-center gap-2.5 px-[clamp(1.5rem,5vw,5rem)] pb-4 pt-7 md:py-7" style={{ color: b.ink }}>
              <p className="flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] opacity-80">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-sun)] text-[10px] text-[var(--color-ink)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {b.label}
              </p>
              <div className="flex items-center gap-4">
                {b.logo ? (
                  <Image src={b.logo.src} alt={b.name} width={b.logo.w} height={b.logo.h} sizes="160px" className="h-[clamp(3.25rem,5.5vw,4.75rem)] w-auto shrink-0 object-contain" />
                ) : (
                  <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none">{b.name}</p>
                )}
              </div>
              <p className="max-w-md text-[clamp(0.95rem,1.1vw,1.05rem)] leading-relaxed">{b.line}</p>
              <div className="flex flex-wrap items-center gap-4">
                <span className="rounded-full px-3.5 py-1 text-[13px] font-medium" style={{ background: "color-mix(in srgb, currentColor 14%, transparent)" }}>
                  {b.ages}
                </span>
                {b.to && (
                  <span className="inline-flex items-center gap-2 text-[13px] font-medium">
                    <span className="border-b border-current pb-0.5">{c.more}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                )}
              </div>
            </div>

            {/* picture half: every picture whole, cut-outs standing on the bottom edge */}
            <div
              className={`relative flex justify-center gap-[clamp(8px,1vw,14px)] overflow-hidden px-[var(--space-gutter)] pt-5 md:px-6 ${anyCut ? "items-end" : "items-center pb-5"} ${
                flip ? "md:ml-[clamp(0rem,4vw,4rem)]" : "md:mr-[clamp(0rem,4vw,4rem)]"
              }`}
              style={sizeVars}
            >
              {b.backdrop && <Image src={b.backdrop} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover opacity-90" />}
              {b.pics.map((pic) => (
                <Image
                  key={pic.src}
                  src={pic.src}
                  alt=""
                  width={pic.w}
                  height={pic.h}
                  sizes="(max-width: 767px) 40vw, 18vw"
                  className={`relative h-[var(--pic-p)] w-auto max-w-none shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:h-[var(--pic-d)] ${
                    pic.cut ? "" : "rounded-2xl shadow-[0_6px_18px_rgba(20,25,60,0.18)]"
                  } ${anyCut && !pic.cut ? "mb-5" : ""}`}
                />
              ))}
              {b.pics.length === 0 && (
                <p className="whitespace-nowrap py-6 font-display text-[clamp(2.2rem,4.5vw,4rem)] font-semibold text-[#E07A9A]/40 md:self-center">Coming soon</p>
              )}
            </div>
          </div>
        );

        return (
          <Section key={b.key} id={`brand-${b.key}`} background={b.bg} compact noFade>
            {b.to ? (
              <a
                href={`#${b.to}`}
                className="group block"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`#${b.to}`);
                }}
              >
                {body}
              </a>
            ) : (
              body
            )}
          </Section>
        );
      })}
    </>
  );
}
