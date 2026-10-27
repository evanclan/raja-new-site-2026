"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Section } from "../Section";
import { useSmoothScroll } from "../SmoothScrollProvider";
import { useI18n, useT } from "@/lib/i18n";
import { FAMILY, PHILOSOPHY, linkFor } from "@/lib/raja-world/family";

// The seven brands as full-width colour bands, one per brand, logo and
// pictures alternating sides down the page (after shin-ei-animation.jp's
// works list). Each band borrows its look from the brand's EXISTING hub
// section — the same background, logo and photos — and reads like a brand
// card: the logo as the hero, a short spec (who · where · what makes it
// special) built only from facts already published on the hub and
// rga-ce.com, then two ways on: the section on this page, or the brand's
// own site. Journey order: sky → sea → land.
//
// The picture half is a full-bleed gallery strip: three or four real photos
// in slanted tiles, edge to edge, with a diagonal edge facing the text and
// a straight edge on the page side. Tiles crop a little at the slant.

type Tile = {
  src: string;
  /** object-position, to keep faces in frame */
  pos?: string;
  /** transparent cut-out: stands on the tile's floor over its backdrop */
  cut?: boolean;
  /** what a cut-out stands in front of (image path); defaults to the band colour */
  backdrop?: string;
};

type Spec = [term: string, detail: string];

type Band = {
  key: string;
  /** id of the existing section on this page; none = no section yet */
  to?: string;
  /** brand id in family.ts, for the official-site link */
  brand?: string;
  label: string;
  name: string;
  line: string;
  specs: Spec[];
  /** short tags under the spec table (e.g. +Education's lessons) */
  tags?: string[];
  logo?: { src: string; w: number; h: number };
  tiles: Tile[];
  bg: string;
  ink: string;
  /** primary button colours, from the brand's own palette */
  accent: [bg: string, fg: string];
};

const COPY = {
  ja: {
    title: "RaJA ファミリー",
    lede: "0歳から留学まで。鹿児島で、こどもの成長に寄り添う7つの場所。",
    section: "このページで見る",
    site: "公式サイト",
    t: { who: "対象", where: "場所", what: "特色", hours: "時間", teach: "講師", to: "留学先", status: "状況" },
  },
  en: {
    title: "The RaJA family",
    lede: "From age 0 to study abroad: seven places in Kagoshima that grow with your child.",
    section: "See it here",
    site: "Official site",
    t: { who: "Ages", where: "Where", what: "Known for", hours: "Hours", teach: "Teachers", to: "Destinations", status: "Status" },
  },
};

export function BrandBands() {
  const t = useT();
  const { locale } = useI18n();
  const ja = locale === "ja";
  const c = COPY[locale];
  const L = c.t;
  const { scrollTo } = useSmoothScroll();
  const p = t.panels;
  const bldg = ja ? "鹿児島市高麗町 RaJA BLDG" : "RaJA BLDG, Korai-cho, Kagoshima";

  const bands: Band[] = [
    {
      key: "preschool",
      to: "preschool",
      brand: "preschool",
      label: "RaJA INTERNATIONAL PRESCHOOL",
      name: ja ? "ラジャ・インターナショナル保育園" : "RaJA International Preschool",
      line: p.preschool.title.replace(/\n/g, ""),
      specs: [
        [L.who, ja ? "0〜2歳" : "Ages 0–2"],
        [L.where, ja ? "下荒田・谷山ベース（鹿児島市）" : "Shimoarata · Taniyama, Kagoshima"],
        [L.what, ja ? "企業主導型保育／病児保育（下荒田に併設）" : "Company-led childcare · sick-child care at Shimoarata"],
      ],
      logo: { src: "/preschool/preschool_logoo.png", w: 1600, h: 1600 },
      tiles: [
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_3.jpg", pos: "50% 35%" },
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_7.jpg", pos: "50% 30%" },
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_2.jpg", pos: "50% 40%" },
        { src: "/preschool/gallery/LINE_ALBUM_2026.04_260624_5.jpg", pos: "50% 60%" },
      ],
      // the light top of the Preschool section's sky gradient, so ink text reads
      bg: "linear-gradient(180deg, #b8e8fa 0%, #7fd6f5 100%)",
      ink: "var(--color-ink)",
      accent: ["#005baa", "#ffffff"],
    },
    {
      key: "academy",
      to: "academy",
      brand: "academy",
      label: "RaJA GLOBAL ACADEMY",
      name: "RaJA Global Academy",
      line: p.academy.subtitle.replace(/\n/g, " "),
      specs: [
        [L.who, ja ? "3〜5歳・英語イマージョン" : "Ages 3–5 · English immersion"],
        [L.where, bldg],
        [L.what, ja ? "国際バカロレア PYP 候補校／英検Jr. 全園児受験" : "IB PYP candidate school · every child sits Eiken Jr."],
      ],
      logo: { src: "/academy/newacademysectionlogo.png", w: 1565, h: 1250 },
      tiles: [
        { src: "/brands/academy-life05.webp", pos: "50% 30%" },
        { src: "/academy/gallery/student-6.jpg", pos: "50% 35%" },
        { src: "/brands/academy-life03.webp", pos: "50% 30%" },
        { src: "/academy/gallery/student-5.jpg", pos: "50% 30%" },
      ],
      bg: "linear-gradient(160deg, #3c44a8 0%, #2e3192 50%, #191d5c 100%)",
      ink: "#ffffff",
      accent: ["#F5B83D", "#20233A"],
    },
    {
      key: "clab",
      to: "clab",
      brand: "clab",
      label: "C-LAB",
      name: ja ? "C-Lab（えいご学童）" : "C-Lab (English after-school)",
      line: ja ? "英語で過ごす、小学生の放課後。" : "Afternoons spent in English.",
      specs: [
        [L.who, ja ? "年少児（3〜5歳）／小学1〜6年生" : "Age 3–5 · grades 1–6"],
        [L.hours, ja ? "平日 14:00〜18:00（19:00まで延長可）" : "Weekdays 14:00–18:00 (until 19:00)"],
        [L.what, ja ? "Geography・金融教育・SDGs／こども家庭庁モデル事業 採択" : "Geography, money and SDGs · selected for a national model project"],
      ],
      logo: { src: "/clab/Clab Logo.png", w: 609, h: 453 },
      // RGA's own C-Lab photo, then the C-Lab section's staging: Shawn in front of its backdrop
      tiles: [
        { src: "/brands/clab-wondercode.webp", pos: "50% 55%" },
        { src: "/clab/shawn-cutout.png", cut: true, backdrop: "/clab/Clab background.png" },
      ],
      bg: "linear-gradient(155deg, #ece1f3 0%, #e3f0dc 50%, #fae1ec 100%)",
      ink: "var(--color-ink)",
      accent: ["#2f8a4e", "#ffffff"],
    },
    {
      key: "edu",
      to: "clab",
      brand: "edu",
      label: "+EDUCATION",
      name: ja ? "+Education（習い事）" : "+Education (lessons)",
      line: ja ? "RaJA BLDG の中でできる習い事。送迎の時間を省いて、学びの機会を。" : "Lessons inside RaJA BLDG, with no extra drive between them.",
      specs: [
        [L.who, ja ? "年少児〜大人（教室による）" : "Age 3 to adults (by lesson)"],
        [L.where, bldg],
      ],
      tags: ja
        ? ["英語でプログラミング", "学習塾", "小学校受験対策", "英会話", "ミュージック", "送迎付きスイミング", "RIT", "そろばん"]
        : ["Coding in English", "Tutoring", "Entrance prep", "English", "Music", "Swimming with transport", "RIT", "Abacus"],
      tiles: [
        { src: "/clab/Piano.jpg", pos: "50% 40%" },
        { src: "/clab/Swimming.jpg", pos: "50% 50%" },
        { src: "/clab/RIT.jpg", pos: "60% 50%" },
      ],
      bg: "linear-gradient(155deg, #e3f0dc 0%, #fae1ec 60%, #ece1f3 100%)",
      ink: "var(--color-ink)",
      accent: ["#c2447a", "#ffffff"],
    },
    {
      key: "english",
      to: "english",
      brand: "lge",
      label: ja ? "RaJA 英会話スクール" : "RaJA ENGLISH SCHOOL",
      name: "Let's Go English!",
      line: p.english.tagline,
      specs: [
        [L.who, ja ? "幼児・小学生・中高生・大人" : "Toddlers, primary, teens and adults"],
        [L.teach, ja ? "ネイティブ講師 × バイリンガル講師" : "Native and bilingual teachers together"],
        [L.what, ja ? "少人数制クラス／英検Jr. 公式会場／無料体験レッスン" : "Small classes · official Eiken Jr. venue · free trial lesson"],
      ],
      logo: { src: "/lets-go-english/letsgonewlogo.png", w: 750, h: 750 },
      tiles: [
        { src: "/brands/lets-go-english-class.webp", pos: "50% 40%" },
        { src: "/lets-go-english/main-hero-image.avif", cut: true },
        { src: "/lets-go-english/chris.png", cut: true },
        { src: "/lets-go-english/erika.png", cut: true },
      ],
      bg: "linear-gradient(155deg, #ffd79a 0%, #fff1c7 45%, #bfe3cf 100%)",
      ink: "var(--color-ink)",
      accent: ["#2f8a4e", "#ffffff"],
    },
    {
      key: "kaeru",
      to: "study-abroad",
      brand: "kaeru",
      label: "KAERU RYUGAKU",
      name: ja ? "かえる留学" : "Kaeru Ryugaku",
      line: p.studyAbroad.subtitle,
      specs: [
        [L.who, ja ? "全世代（中高生・大学生・社会人）" : "Every generation, teens to adults"],
        [L.where, ja ? "鹿児島市荒田" : "Arata, Kagoshima"],
        [L.to, ja ? "ニュージーランド・イギリス・カナダ・オーストラリア・フィリピン・マルタ ほか" : "New Zealand, UK, Canada, Australia, Philippines, Malta and more"],
      ],
      logo: { src: "/kaeruryugaku/home-assets/Logo.svg", w: 400, h: 400 },
      tiles: [
        { src: "/brands/kaeru-certificate.webp", pos: "50% 40%" },
        { src: "/kaeruryugaku/destinations/new-zealand.webp" },
        { src: "/kaeruryugaku/destinations/canada.webp" },
        { src: "/kaeruryugaku/destinations/malta.webp" },
      ],
      bg: "linear-gradient(165deg, #ffffff 0%, #f4faf1 50%, #d5ecd8 100%)",
      ink: "var(--color-ink)",
      accent: ["#107F4B", "#ffffff"],
    },
    {
      key: "advance",
      label: "RaJA ADVANCE",
      name: "RaJA Advance",
      line: ja ? "新しい会社が、まもなく RaJA ファミリーの仲間に。" : "A new company is joining the RaJA family soon.",
      specs: [[L.status, ja ? "ただいま準備中" : "Coming soon"]],
      tiles: [],
      bg: "linear-gradient(160deg, #fbe7ee 0%, #f8dce6 100%)",
      ink: "var(--color-ink)",
      accent: ["#E07A9A", "#ffffff"],
    },
  ];

  return (
    <>
      <Section id="family" background="var(--color-cream)" compact noFade>
        <div className="shell-tight py-[clamp(2.5rem,6vw,4.5rem)] text-center">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold text-[var(--color-ink)]">{c.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[clamp(0.95rem,1.2vw,1.1rem)] text-[var(--color-ink-soft)]">{c.lede}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]/80">{PHILOSOPHY[locale]}</p>
        </div>
      </Section>

      {bands.map((b, i) => {
        const flip = i % 2 === 1;
        const fam = b.brand ? FAMILY.find((f) => f.id === b.brand) : undefined;
        const site = fam ? linkFor(fam) : null;
        const goSection = () => {
          if (b.to) scrollTo(`#${b.to}`);
        };

        return (
          <Section key={b.key} id={`brand-${b.key}`} background={b.bg} compact noFade>
            <div className={`group grid md:grid-cols-2 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
              {/* brand card: logo as the hero, then the spec table and two ways on */}
              <div className="flex flex-col justify-center px-[clamp(1.5rem,5vw,5rem)] pb-5 pt-8 md:py-9" style={{ color: b.ink }}>
                <div className="flex items-center gap-[clamp(1rem,2vw,1.75rem)]">
                  {b.logo && (
                    <Image
                      src={b.logo.src}
                      alt={b.name}
                      width={b.logo.w}
                      height={b.logo.h}
                      sizes="(max-width: 767px) 120px, 180px"
                      className="h-[clamp(6rem,10vw,9.5rem)] w-auto max-w-[45%] shrink-0 object-contain"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.2em] opacity-75">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-sun)] text-[10px] text-[var(--color-ink)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {b.label}
                    </p>
                    <h3 className={`mt-2 font-semibold leading-snug [overflow-wrap:anywhere] [word-break:keep-all] ${b.logo ? "text-[clamp(1.05rem,1.45vw,1.35rem)]" : "font-display text-[clamp(1.9rem,3vw,2.6rem)]"}`}>
                      {b.name}
                    </h3>
                    <p className="mt-1.5 text-[clamp(0.9rem,1.05vw,1rem)] leading-relaxed opacity-90 [overflow-wrap:anywhere] [word-break:keep-all]">{b.line}</p>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 text-[14px] leading-relaxed">
                  {b.specs.map(([term, detail]) => (
                    <div key={term} className="col-span-2 grid grid-cols-subgrid border-t py-1.5" style={{ borderColor: "color-mix(in srgb, currentColor 18%, transparent)" }}>
                      <dt className="font-medium opacity-65">{term}</dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
                </dl>

                {b.tags && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {b.tags.map((tag) => (
                      <li key={tag} className="rounded-full px-3 py-1 text-[12.5px]" style={{ background: "color-mix(in srgb, currentColor 10%, transparent)" }}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {(b.to || site) && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {b.to && (
                      <a
                        href={`#${b.to}`}
                        onClick={(e) => {
                          e.preventDefault();
                          goSection();
                        }}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 max-md:min-h-11"
                        style={{ background: b.accent[0], color: b.accent[1] }}
                      >
                        {c.section} <span aria-hidden>↓</span>
                      </a>
                    )}
                    {site && (
                      <a href={site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium max-md:min-h-11">
                        <span className="border-b border-current pb-0.5">{c.site}</span> <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* picture half: a full-bleed strip of slanted photo tiles */}
              <div
                aria-hidden
                onClick={goSection}
                className={`relative flex h-[clamp(200px,48vw,260px)] overflow-hidden md:h-auto ${b.to ? "cursor-pointer" : ""}`}
                style={{ "--slant": "clamp(26px, 3.6vw, 54px)" } as CSSProperties}
              >
                {b.tiles.map((tile, k) => {
                  const n = b.tiles.length;
                  // inner edges slant; the page-side edge stays straight. On phones
                  // the strip spans the full width, so both outer edges are straight.
                  const leftD = flip ? k === 0 : false;
                  const rightD = flip ? false : k === n - 1;
                  const clip = (straightL: boolean, straightR: boolean) =>
                    `polygon(${straightL ? "0 0" : "var(--slant) 0"}, 100% 0, ${straightR ? "100% 100%" : "calc(100% - var(--slant)) 100%"}, 0 100%)`;
                  return (
                    <div
                      key={tile.src}
                      className="relative min-w-0 flex-1 overflow-hidden [clip-path:var(--clip-m)] md:[clip-path:var(--clip-d)]"
                      style={
                        {
                          "--clip-m": clip(k === 0, k === n - 1),
                          "--clip-d": clip(leftD, rightD),
                          marginLeft: k === 0 ? 0 : "calc(var(--slant) * -1 + 6px)",
                          background: tile.cut && !tile.backdrop ? "color-mix(in srgb, #ffffff 35%, transparent)" : undefined,
                        } as CSSProperties
                      }
                    >
                      {tile.backdrop && <Image src={tile.backdrop} alt="" fill sizes="25vw" className="object-cover" />}
                      <Image
                        src={tile.src}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 40vw, 18vw"
                        className={`transition-transform duration-700 ease-out group-hover:scale-[1.05] ${tile.cut ? "object-contain object-bottom pt-4" : "object-cover"}`}
                        style={tile.pos ? { objectPosition: tile.pos } : undefined}
                      />
                    </div>
                  );
                })}
                {b.tiles.length === 0 && (
                  <p className="m-auto whitespace-nowrap py-6 font-display text-[clamp(2.2rem,4.5vw,4rem)] font-semibold text-[#E07A9A]/40">Coming soon</p>
                )}
              </div>
            </div>
          </Section>
        );
      })}
    </>
  );
}
