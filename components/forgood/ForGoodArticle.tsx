"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n, type Locale } from "@/lib/i18n";
import { Footer } from "../Footer";
import {
  PROJECT,
  ARTICLE_META,
  HERO,
  POINTS,
  MESSAGE,
  OVERVIEW,
  FOUNDER,
  REWARDS,
  type Bi,
} from "./campaign";

const EASE = [0.22, 1, 0.36, 1] as const;
const yen = (n: number) => "¥" + n.toLocaleString("en-US");

/** Pick the locale's text, keeping the other script available as a sub-line. */
const pick = (b: Bi, l: Locale) => (l === "ja" ? b.ja : b.en);
const sub = (b: Bi, l: Locale) => (l === "ja" ? b.en : b.ja);

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

function PointIcon({ name, color }: { name: string; color: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-7 w-7",
    "aria-hidden": true,
  };
  if (name === "globe")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
      </svg>
    );
  if (name === "spark")
    return (
      <svg {...common}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M3 13c4-1 7-4 9-9 2 5 5 8 9 9-4 1-7 4-9 9-2-5-5-8-9-9Z" />
    </svg>
  );
}

export function ForGoodArticle() {
  const { locale: l } = useI18n();
  const pct = Math.min(100, Math.round((PROJECT.raised / PROJECT.goal) * 100));

  return (
    <article className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      {/* ───────────── Cinematic image hero (article style) ───────────── */}
      <header className="relative flex min-h-[72vh] items-end overflow-hidden">
        <Image
          src={ARTICLE_META.hero.src}
          alt={pick(ARTICLE_META.hero.alt, l)}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,22,38,0.92)] via-[rgba(20,22,38,0.45)] to-[rgba(20,22,38,0.5)]" />
        <div className="shell relative z-10 pb-band pt-[8rem]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl text-[var(--color-cream)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-cream)]/15 px-3 py-1 text-2xs font-medium uppercase tracking-[0.22em] backdrop-blur-sm">
                {pick(ARTICLE_META.category, l)}
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]"
                style={{ background: "var(--color-sun)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
                {pick(HERO.status, l)}
              </span>
            </div>
            <h1 className="font-display mt-5 text-display-1 leading-[0.98] tracking-tight">
              {pick(HERO.title, l)}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-[var(--color-cream)]/90">
              {pick(HERO.subtitle, l)}
            </p>
            <p className="mt-5 text-sm tracking-widest text-[var(--color-cream)]/70">
              {pick(ARTICLE_META.publishedLabel, l)} · {pick(ARTICLE_META.date, l)} · raja-international.com
            </p>
          </motion.div>
        </div>
      </header>

      {/* ───────────── Campaign dashboard: lead + funding card + points ───────────── */}
      <section className="relative overflow-hidden py-band">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(111,195,232,0.4), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,210,61,0.45), transparent 65%)" }}
        />

        <div className="shell relative grid items-start gap-12 md:grid-cols-12">
          {/* Narrative column */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.22em]" style={{ color: "var(--color-sky)" }}>
                {pick(HERO.kicker, l)}
              </p>
              <p className="mt-5 text-xl leading-relaxed font-medium">{pick(HERO.lead, l)}</p>
            </Reveal>

            {/* Project points — the crowdfunding "why" */}
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {POINTS.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <div className="h-full rounded-3xl bg-white p-5 shadow-[0_18px_40px_-26px_rgba(8,10,40,0.4)] ring-1 ring-black/5">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl"
                      style={{ background: `color-mix(in srgb, ${p.color} 18%, white)` }}
                    >
                      <PointIcon name={p.icon} color={p.color} />
                    </span>
                    <p className="font-display mt-4 text-base leading-snug">{pick(p.t, l)}</p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ opacity: 0.7 }}>
                      {pick(p.d, l)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Funding card — sticky on desktop */}
          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <div className="md:sticky md:top-28">
                <div className="rounded-3xl bg-white p-7 shadow-[0_30px_70px_-30px_rgba(8,10,40,0.4)] ring-1 ring-black/5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em]" style={{ opacity: 0.55 }}>
                        {l === "ja" ? "現在の支援総額" : "Raised so far"}
                      </p>
                      <p className="font-display mt-1 text-display-3 leading-none">{yen(PROJECT.raised)}</p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: "color-mix(in srgb, var(--color-peach) 20%, transparent)", color: "var(--color-ink)" }}
                    >
                      {pick(HERO.status, l)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-black/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(pct, 2)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--color-sky), var(--color-sun))" }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span style={{ opacity: 0.7 }}>
                      {l === "ja" ? "目標 " : "of "} <strong className="font-display">{yen(PROJECT.goal)}</strong>
                    </span>
                    <span className="font-display">{pct}%</span>
                  </div>

                  {/* Stats row */}
                  <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-[var(--color-cream)] py-3">
                      <p className="font-display text-2xl leading-none">{PROJECT.supporters}</p>
                      <p className="mt-1 text-xs" style={{ opacity: 0.6 }}>{l === "ja" ? "支援者" : "Supporters"}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-cream)] py-3">
                      <p className="font-display text-2xl leading-none">2026.6.25</p>
                      <p className="mt-1 text-xs" style={{ opacity: 0.6 }}>{l === "ja" ? "公開日" : "Launch"}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={PROJECT.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-base text-[var(--color-ink)] shadow-[0_14px_30px_-12px_rgba(8,10,40,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ background: "var(--color-sun)" }}
                  >
                    {l === "ja" ? "For Good で支援する" : "Support on For Good"}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                  <p className="mt-3 text-center text-xs leading-relaxed" style={{ opacity: 0.55 }}>
                    {pick(PROJECT.platform, l)}
                    <br />
                    {pick(PROJECT.feeNote, l)}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────────────── MESSAGE ──────────────────── */}
      <section className="relative py-band" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[44rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,210,61,0.4), transparent 65%)" }}
        />
        <div className="shell-tight relative">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em]" style={{ opacity: 0.6 }}>
              {pick(MESSAGE.label, l)}
            </p>
            <p className="font-display mt-6 text-display-3 leading-snug">{pick(MESSAGE.body, l)}</p>
            <p className="mt-5 text-sm leading-relaxed" style={{ opacity: 0.55 }}>
              {sub(MESSAGE.body, l)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── OVERVIEW + FOUNDER ──────────────────── */}
      <section className="py-band">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-display-3">{l === "ja" ? "プロジェクト概要" : "Project overview"}</h2>
              <dl className="mt-7 divide-y divide-black/10 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
                {OVERVIEW.map((row, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4 px-5 py-4">
                    <dt className="text-sm" style={{ opacity: 0.55 }}>{pick(row.k, l)}</dt>
                    <dd className="font-display text-right text-sm md:text-base">{pick(row.v, l)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a href={PROJECT.url} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 ring-1 ring-black/10 transition-colors hover:bg-black/[0.04]">
                  {l === "ja" ? "For Good プロジェクト ↗" : "For Good project ↗"}
                </a>
                <a href={PROJECT.profileUrl} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 ring-1 ring-black/10 transition-colors hover:bg-black/[0.04]">
                  {l === "ja" ? "実行者プロフィール ↗" : "Organizer profile ↗"}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-white p-7 ring-1 ring-black/5 md:p-9">
                <p className="text-xs uppercase tracking-[0.25em]" style={{ opacity: 0.5 }}>
                  {pick(FOUNDER.label, l)}
                </p>
                <h3 className="font-display mt-3 text-2xl md:text-3xl">{pick(FOUNDER.name, l)}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--color-sky)" }}>{pick(FOUNDER.role, l)}</p>
                <p className="mt-5 text-base leading-relaxed" style={{ opacity: 0.82 }}>{pick(FOUNDER.bio, l)}</p>

                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {FOUNDER.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="var(--color-leaf)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{pick(h, l)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-black/10 pt-5 text-sm">
                  <span style={{ opacity: 0.6 }}>{pick(FOUNDER.hq, l)}</span>
                  <a href={PROJECT.website} target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: "var(--color-sky)" }}>Website ↗</a>
                  <a href={PROJECT.instagram} target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: "var(--color-berry)" }}>Instagram ↗</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────────────── REWARDS ──────────────────── */}
      <section className="py-band" style={{ background: "color-mix(in srgb, var(--color-sky) 12%, var(--color-cream))" }}>
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em]" style={{ opacity: 0.55 }}>
                  {l === "ja" ? "リターン一覧" : "Reward tiers"}
                </p>
                <h2 className="font-display mt-3 text-display-2">{l === "ja" ? "あなたの応援が、未来をつくる" : "Your support builds the future"}</h2>
              </div>
              <p className="text-sm" style={{ opacity: 0.6 }}>
                {l === "ja" ? "全リターン共通：お届け予定 2026年11月" : "All tiers ship from November 2026"}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REWARDS.map((r, i) => (
              <Reveal key={r.amount} delay={(i % 3) * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl bg-white p-6 transition-transform duration-300 hover:-translate-y-1 ${
                    r.featured
                      ? "ring-2 ring-[var(--color-sun)] shadow-[0_30px_60px_-28px_rgba(255,160,40,0.6)]"
                      : "ring-1 ring-black/5 shadow-[0_18px_40px_-26px_rgba(8,10,40,0.4)]"
                  }`}
                >
                  {r.featured && (
                    <span
                      className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-ink)]"
                      style={{ background: "var(--color-sun)" }}
                    >
                      {l === "ja" ? "人気" : "Popular"}
                    </span>
                  )}
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-2xl">{yen(r.amount)}</span>
                    <span className="text-xs" style={{ opacity: 0.5 }}>{pick(r.tag, l)}</span>
                  </div>
                  <h3 className="font-display mt-3 text-lg leading-snug">{pick(r.title, l)}</h3>

                  <ul className="mt-4 grid gap-2">
                    {r.contents.map((c, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ opacity: 0.85 }}>
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="var(--color-leaf)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{pick(c, l)}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-sm leading-relaxed" style={{ opacity: 0.62 }}>{pick(r.blurb, l)}</p>

                  <a
                    href={PROJECT.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-1.5 self-start rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ background: r.featured ? "var(--color-sun)" : "color-mix(in srgb, var(--color-sky) 24%, transparent)" }}
                  >
                    {l === "ja" ? "このリターンで支援" : "Back this tier"}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ──────────────────── */}
      <section className="py-band-lg">
        <div className="shell-tight text-center">
          <Reveal>
            <h2 className="font-display text-display-2">
              {l === "ja" ? "鹿児島から、世界へ。" : "From Kagoshima, to the world."}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed" style={{ opacity: 0.78 }}>
              {l === "ja"
                ? "子どもたちが世界基準の教育を受け、未来の選択肢を広げる——その第一歩を、あなたと一緒に。"
                : "Giving children a world-standard education and a wider future — let's take the first step together."}
            </p>
            <a
              href={PROJECT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-base text-[var(--color-ink)] shadow-[0_18px_40px_-16px_rgba(8,10,40,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--color-sun)" }}
            >
              {l === "ja" ? "For Good で支援する" : "Support on For Good"}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <p className="mt-6 text-xs leading-relaxed" style={{ opacity: 0.5 }}>
              {l === "ja"
                ? "運営：For Good（株式会社ボーダレス・ジャパン）。支援者さまのシステム利用料（220円＋決済手数料5%）により、実行者が支援金を全額受け取れる仕組みです。"
                : "Operated by For Good (Borderless Japan). A supporter fee (¥220 + 5%) lets the organizer receive 100% of the funds raised."}
              <br />
              {l === "ja" ? "出典：" : "Source: "}
              <a href={PROJECT.url} target="_blank" rel="noopener noreferrer" className="underline">
                for-good.net/project/{PROJECT.id}
              </a>
            </p>

            <div className="mt-12 border-t border-[var(--color-ink)]/10 pt-8">
              <Link
                href="/#news"
                className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                {pick(ARTICLE_META.backLabel, l)}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </article>
  );
}
