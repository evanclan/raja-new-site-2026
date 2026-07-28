"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "../Footer";
import { EVENT, META, HERO, IMG, SEC_PYP, SIMPLE, JSON_LD, GALLERY_STRIP } from "./setsumeikai";

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

function P({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="mt-6 text-base leading-loose md:text-lg md:leading-loose">{children}</p>
    </Reveal>
  );
}

/**
 * Announcement-only version of the 入園説明会 article — the school
 * presents the details live at the event, so the page carries just the
 * official caption copy. The full guide remains in
 * SetsumeikaiArticle.tsx; swap the slug's entry in CUSTOM_ARTICLES to
 * switch versions.
 */
export function SetsumeikaiArticleSimple() {
  return (
    <article className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      {/* Event structured data (schema.org EducationEvent) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* ───────────── Cinematic hero — unchanged from the full version ───────────── */}
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
            <p className="mt-4 max-w-2xl text-lg font-medium text-[var(--color-cream)]/90">
              {HERO.subtitle}
            </p>
            <p className="mt-5 text-sm tracking-widest text-[var(--color-cream)]/70">
              {META.publishedLabel} · {META.date} · raja-international.com
            </p>
          </motion.div>
        </div>
      </header>

      {/* ───────────── 本文（お知らせ） ───────────── */}
      <section className="pt-band">
        <div className="shell-tight">
          <P>{SIMPLE.intro}</P>

          <Reveal delay={0.05}>
            <ul className="mt-8 grid gap-3">
              {SIMPLE.questions.map((q) => (
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

          <P>{SIMPLE.p1}</P>
          <P>{SIMPLE.p2}</P>
        </div>
      </section>

      {/* ───────────── 園のようす — photo marquee ─────────────
          All 10 school photos in one slow, full-bleed filmstrip. Pure
          CSS transform loop (GPU-cheap, no JS): the track holds two
          identical halves, each with pr-[1rem] matching the gap, so
          translateX(-50%) lands exactly one set over — a seamless loop.
          Pauses on hover; prefers-reduced-motion gets a static
          hand-scrollable strip instead. */}
      <section className="pt-band pb-8 md:pb-12" aria-label="園のようす">
        <style>{`
          .setsumeikai-track { animation: setsumeikai-marquee 60s linear infinite; }
          .setsumeikai-track:hover { animation-play-state: paused; }
          @keyframes setsumeikai-marquee { to { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) {
            .setsumeikai-track { animation: none; }
            .setsumeikai-mask { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          }
        `}</style>
        <Reveal>
          <div
            className="setsumeikai-mask overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)",
            }}
          >
            <div className="setsumeikai-track flex w-max will-change-transform">
              {[false, true].map((dup) => (
                <div
                  key={dup ? "dup" : "main"}
                  aria-hidden={dup || undefined}
                  className="flex shrink-0 gap-4 pr-4"
                >
                  {GALLERY_STRIP.map((img) => (
                    <div
                      key={img.src}
                      className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 md:h-56 md:w-56"
                    >
                      <Image
                        src={img.src}
                        alt={dup ? "" : img.alt}
                        fill
                        sizes="(max-width: 768px) 160px, 224px"
                        loading="lazy"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── 開催日・時間・対象 ───────────── */}
      <section className="pt-band">
        <div className="shell-tight">
          <Reveal>
            <dl className="divide-y divide-black/10 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
              {SIMPLE.rows.map((row) => (
                <div
                  key={row.k}
                  className="grid gap-1 px-6 py-4 sm:grid-cols-[7rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm sm:py-0.5" style={{ opacity: 0.55 }}>
                    {row.k}
                  </dt>
                  <dd className="font-display grid gap-1 text-sm md:text-base">
                    {row.v.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ───────────── お申し込み（QR＋フォーム） ───────────── */}
      <section id="apply" className="scroll-mt-24 pt-band">
        <div className="shell-tight">
          <P>{SIMPLE.applyNote}</P>
          <Reveal delay={0.05}>
            <div className="mt-8 rounded-3xl bg-white p-7 text-center ring-1 ring-black/5 shadow-[0_30px_70px_-30px_rgba(8,10,40,0.4)] md:p-9">
              {/* TODO: QRコード（12-qr-reservation.jpg）のリンク先URL＝予約フォームのURLを学校に確認。
                  確定するまで、ボタンは当サイトのお問い合わせフォーム（/#inquiry）に案内する。 */}
              <div className="mx-auto max-w-[14rem] overflow-hidden rounded-2xl ring-1 ring-black/5">
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
              <Link
                href="/#inquiry"
                className="group mt-7 inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base text-[var(--color-ink)] shadow-[0_18px_40px_-16px_rgba(8,10,40,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--color-sun)" }}
              >
                {SIMPLE.ctaLabel}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* ホームページ「かごしま ラジャ」で検索 — flyer-style search pill */}
              <p className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm leading-relaxed">
                <span>{SIMPLE.searchLead}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)] px-4 py-1.5 ring-1 ring-black/10">
                  <span className="font-display">{SIMPLE.searchTerm}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </span>
                <span>{SIMPLE.searchTail}</span>
              </p>
              <p className="mt-2 text-sm">
                <a
                  href={EVENT.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  www.rga-ce.com
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── むすび ───────────── */}
      <section className="py-band">
        <div className="shell-tight text-center">
          <P>{SIMPLE.closing}</P>

          {/* IB候補校ディスクレーマー — PYPに言及するページの必須表記 */}
          <Reveal delay={0.05}>
            <p className="mx-auto mt-10 max-w-2xl text-left text-xs leading-relaxed" style={{ opacity: 0.55 }}>
              {SEC_PYP.disclaimer}
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 border-t border-[var(--color-ink)]/10 pt-8">
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
