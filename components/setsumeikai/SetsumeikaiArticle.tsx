"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "../Footer";
import {
  EVENT,
  META,
  HERO,
  IMG,
  LEAD,
  OVERVIEW_NOTE,
  QUESTIONS,
  SEC_ENGLISH,
  SEC_GROWTH,
  SEC_PYP,
  SEC_DAY,
  SEC_JOIN,
  SEC_APPLY,
  CLOSING,
  JSON_LD,
} from "./setsumeikai";

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Square article photo (all body shots are 1:1) with optional caption. */
function Figure({
  img,
  eager = false,
}: {
  img: { src: string; alt: string; caption?: string };
  eager?: boolean;
}) {
  return (
    <Reveal>
      <figure className="mx-auto mt-8 max-w-xl">
        <div className="overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-[0_30px_60px_-34px_rgba(8,10,40,0.45)]">
          <Image
            src={img.src}
            alt={img.alt}
            width={1080}
            height={1080}
            sizes="(max-width: 768px) 92vw, 576px"
            loading={eager ? "eager" : "lazy"}
            className="h-auto w-full"
          />
        </div>
        {img.caption && (
          <figcaption className="mt-3 text-center text-sm" style={{ opacity: 0.6 }}>
            {img.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="font-display mt-16 text-display-3 leading-snug tracking-tight">
        {children}
      </h2>
    </Reveal>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="mt-6 text-base leading-loose md:text-lg md:leading-loose">{children}</p>
    </Reveal>
  );
}

export function SetsumeikaiArticle() {
  return (
    <article className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      {/* Event structured data (schema.org EducationEvent) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* ───────────── Cinematic hero — the official flyer (featured image; not repeated in body) ───────────── */}
      <header className="relative flex min-h-[72vh] items-end overflow-hidden">
        <Image
          src={HERO.src}
          alt={HERO.alt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,22,38,0.92)] via-[rgba(20,22,38,0.45)] to-[rgba(20,22,38,0.5)]" />
        <div className="shell relative z-10 pb-[clamp(7rem,12vw,11rem)] max-md:pb-[26vw] pt-[8rem]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl text-[var(--color-cream)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)]/15 px-3 py-1 text-2xs font-medium uppercase tracking-[0.22em] backdrop-blur-sm">
                {META.category}
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-2xs font-semibold tracking-[0.18em] text-[var(--color-ink)]"
                style={{ background: "var(--color-sun)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
                {EVENT.dateLabel}
              </span>
            </div>
            <h1 className="font-display mt-5 text-display-1 leading-[1.05] tracking-tight">
              {HERO.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-snug font-medium text-[var(--color-cream)]/90">
              {HERO.subtitleLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          </motion.div>
        </div>
      </header>

      {/* ───────────── リード文 ───────────── */}
      <section className="pt-band">
        <div className="shell-tight">
          {LEAD.map((s, i) => (
            <P key={i}>{s}</P>
          ))}
          <Figure img={IMG.friends} eager />
        </div>
      </section>

      {/* ───────────── 開催概要 ───────────── */}
      <section id="overview" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>開催概要</H2>
          <Reveal delay={0.05}>
            <dl className="mt-8 divide-y divide-black/10 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
              {[
                { k: "開催日", v: <span>{EVENT.dateLabel}</span> },
                {
                  k: "時間",
                  v: (
                    <span className="grid gap-1">
                      {EVENT.slots.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </span>
                  ),
                },
                { k: "対象", v: <span>{EVENT.audience}</span> },
                { k: "会場", v: <span>{EVENT.venue}</span> },
                { k: "申込方法", v: <span>{EVENT.apply}</span> },
              ].map((row) => (
                <div key={row.k} className="grid gap-1 px-6 py-4 sm:grid-cols-[7rem_1fr] sm:gap-4">
                  <dt className="text-sm sm:py-0.5" style={{ opacity: 0.55 }}>
                    {row.k}
                  </dt>
                  <dd className="font-display text-sm md:text-base">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-sm leading-relaxed" style={{ opacity: 0.65 }}>
              {OVERVIEW_NOTE}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── こんな疑問にお答えします ───────────── */}
      <section id="questions" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>こんな疑問にお答えします</H2>
          <P>{QUESTIONS.intro}</P>
          <Reveal delay={0.05}>
            <ul className="mt-6 grid gap-3">
              {QUESTIONS.items.map((q) => (
                <li
                  key={q}
                  className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-1 h-4 w-4 shrink-0"
                    fill="none"
                    stroke="var(--color-leaf)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-display text-base">{q}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <P>{QUESTIONS.outro}</P>
        </div>
      </section>

      {/* ───────────── 英語で学ぶ環境 ───────────── */}
      <section id="english" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_ENGLISH.heading}</H2>
          <P>{SEC_ENGLISH.p1}</P>
          <P>{SEC_ENGLISH.p2}</P>
          <Figure img={IMG.phonics} />
          <P>{SEC_ENGLISH.p3}</P>
        </div>
      </section>

      {/* ───────────── 子どもたちの成長 ───────────── */}
      <section id="growth" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_GROWTH.heading}</H2>
          <P>{SEC_GROWTH.p1}</P>
          <P>{SEC_GROWTH.p2}</P>
          <Figure img={IMG.harvest} />
          <P>{SEC_GROWTH.p3}</P>
          <Reveal delay={0.05}>
            <p className="mt-4">
              <Link
                href={SEC_GROWTH.programsLink.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "var(--color-sky)" }}
              >
                {SEC_GROWTH.programsLink.label} →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── IB PYP ───────────── */}
      <section id="pyp" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_PYP.heading}</H2>
          <P>{SEC_PYP.p1}</P>
          <Figure img={IMG.pypLogo} />
          <P>{SEC_PYP.p2}</P>
          <Figure img={IMG.bigbook} />
          <P>{SEC_PYP.p3}</P>
          <Reveal delay={0.05}>
            <blockquote
              className="mt-8 rounded-2xl border-l-4 bg-white px-6 py-5 text-sm leading-relaxed ring-1 ring-black/5"
              style={{ borderColor: "var(--color-sky)", opacity: 0.85 }}
            >
              {SEC_PYP.disclaimer}
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ───────────── 説明会当日の流れ ───────────── */}
      <section id="schedule" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_DAY.heading}</H2>
          <P>{SEC_DAY.p1}</P>
          {/* TODO: 学校に当日のタイムテーブルを確認（公表され次第、この節に流れを追記） */}
        </div>
      </section>

      {/* ───────────── ご参加をお考えの方へ ───────────── */}
      <section id="join" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_JOIN.heading}</H2>
          <Reveal delay={0.05}>
            <ul className="mt-8 grid gap-3">
              {SEC_JOIN.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--color-peach)" }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          {/* TODO: 参加費・駐車場・きょうだい同伴・所要時間・お子さま同伴の可否を学校に確認 */}
          <Figure img={IMG.outdoor} />
        </div>
      </section>

      {/* ───────────── お申し込み（CTA） ───────────── */}
      <section id="apply" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <H2>{SEC_APPLY.heading}</H2>
          <Reveal delay={0.05}>
            <div className="mt-8 rounded-3xl bg-white p-7 text-center ring-1 ring-black/5 shadow-[0_30px_70px_-30px_rgba(8,10,40,0.4)] md:p-9">
              <p className="font-display text-base md:text-lg">{SEC_APPLY.recap}</p>
              {/* TODO: QRコード（12-qr-reservation.jpg）のリンク先URL＝予約フォームのURLを学校に確認。
                  確定するまで、ボタンは当サイトのお問い合わせフォーム（/#inquiry）に案内する。 */}
              <Link
                href={SEC_APPLY.ctaHref}
                className="group mt-6 inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base text-[var(--color-ink)] shadow-[0_18px_40px_-16px_rgba(8,10,40,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--color-sun)" }}
              >
                {SEC_APPLY.ctaLabel}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <p className="mt-6 text-sm leading-relaxed" style={{ opacity: 0.75 }}>
                {SEC_APPLY.telNote}
                <a href={`tel:${EVENT.tel}`} className="font-display underline underline-offset-4">
                  {EVENT.tel}
                </a>
                <br />
                {SEC_APPLY.siteNote}
                <a
                  href={EVENT.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  www.rga-ce.com
                </a>
              </p>
              <figure className="mx-auto mt-8 max-w-xs border-t border-black/10 pt-7">
                <figcaption className="text-sm leading-relaxed" style={{ opacity: 0.65 }}>
                  {SEC_APPLY.qrNote}
                </figcaption>
                <div className="mx-auto mt-4 max-w-[14rem] overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <Image
                    src={IMG.qr.src}
                    alt={IMG.qr.alt}
                    width={1170}
                    height={1170}
                    sizes="224px"
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </div>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── むすび ───────────── */}
      <section className="py-band">
        <div className="shell-tight">
          <Figure img={IMG.binoculars} />
          {CLOSING.map((s, i) => (
            <P key={i}>{s}</P>
          ))}
          <Reveal>
            <div className="mt-14 border-t border-[var(--color-ink)]/10 pt-8 text-center">
              <Link
                href="/#news"
                className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                {META.backLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </article>
  );
}
