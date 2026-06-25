"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Footer } from "./Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

type ArticleSlug = keyof ReturnType<typeof useT>["articles"];

export function ArticleView({ slug }: { slug: ArticleSlug }) {
  const t = useT();
  const a = t.articles[slug];

  return (
    <article className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      {/* Hero — dark-overlaid image so the (cream) nav stays legible at the
          top of the page, mirroring the homepage hero. */}
      <header className="relative flex min-h-[68vh] items-end overflow-hidden">
        <Image
          src={a.hero.src}
          alt={a.hero.alt}
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,22,38,0.88)] via-[rgba(20,22,38,0.35)] to-[rgba(20,22,38,0.45)]" />
        <div className="shell-tight relative z-10 pb-band pt-[8rem]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-[var(--color-cream)]"
          >
            <span className="inline-flex items-center rounded-full bg-[var(--color-cream)]/15 px-3 py-1 text-2xs font-medium uppercase tracking-[0.22em] backdrop-blur-sm">
              {a.category}
            </span>
            <h1 className="font-display mt-5 max-w-[20ch] text-display-2 leading-[1.05] tracking-tight">
              {a.title}
            </h1>
            <p className="mt-4 text-sm tracking-widest text-[var(--color-cream)]/80">
              {a.publishedLabel} · {a.date} · raja-international.com
            </p>
          </motion.div>
        </div>
      </header>

      {/* Body */}
      <div className="shell-tight py-band">
        <div className="measure mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-lg leading-relaxed text-[var(--color-ink)]"
          >
            {a.intro}
          </motion.p>

          {a.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mt-6 text-base leading-relaxed text-[var(--color-ink-soft)]"
            >
              {para}
            </motion.p>
          ))}

          {/* The four IB programmes */}
          <h2 className="font-display mt-12 text-2xl tracking-tight">
            {a.programmesTitle}
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {a.programmes.map((pr) => (
              <li
                key={pr.code}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_10px_30px_-18px_rgba(32,35,58,0.25)]"
              >
                <span className="font-display grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--color-sun)] text-sm font-bold text-[var(--color-ink)]">
                  {pr.code}
                </span>
                <span className="text-sm leading-tight text-[var(--color-ink)]">
                  {pr.name}
                </span>
              </li>
            ))}
          </ul>

          {/* Candidate-status caveat */}
          <p className="mt-8 rounded-2xl border-l-4 border-[var(--color-sun)] bg-white/60 px-5 py-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {a.note}
          </p>

          {/* More info */}
          <p className="mt-10 text-base leading-relaxed text-[var(--color-ink-soft)]">
            {a.moreText}{" "}
            <a
              href={a.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-peach)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-peach)]"
            >
              {a.link.label}
            </a>
          </p>

          <div className="mt-14 border-t border-[var(--color-ink)]/10 pt-8">
            <Link
              href="/#news"
              className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              {a.backLabel}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </article>
  );
}
