"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Section } from "../Section";
import { useT } from "@/lib/i18n";

const TINTS = [
  "var(--color-sky)",
  "var(--color-sun)",
  "var(--color-leaf)",
  "var(--color-berry)",
];

export function News() {
  const t = useT();
  const posts = t.news.posts.map((p, i) => ({ ...p, tint: TINTS[i % TINTS.length] }));

  return (
    <Section id="news" background="var(--color-cream)">
      <div className="shell flex min-h-screen flex-col justify-center gap-band py-band max-md:min-h-0 max-md:justify-start">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs uppercase tracking-[0.25em] text-[var(--color-ink-soft)]"
            >
              {t.news.kicker}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display mt-3 text-display-2 leading-[0.95] tracking-tight"
            >
              {t.news.titleA} <br className="hidden md:block" />
              <span className="text-[var(--color-peach)]">{t.news.titleB}</span>
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)]/15 px-5 py-2.5 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] max-md:py-3"
          >
            {t.news.allArticles}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {posts.map((p) => {
            const article =
              p.slug && p.slug in t.articles
                ? t.articles[p.slug as keyof typeof t.articles]
                : undefined;
            const inner = (
              <article className="group relative h-full overflow-hidden rounded-3xl bg-white p-6 shadow-[0_10px_30px_-15px_rgba(32,35,58,0.15)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(32,35,58,0.25)]">
                <div
                  className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl"
                  style={{ background: p.tint }}
                >
                  {article?.hero ? (
                    <Image
                      src={article.hero.src}
                      alt={article.hero.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 22vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <motion.div
                      className="absolute inset-0 grid place-items-center text-white/50 font-display text-4xl"
                      animate={{ scale: [1, 1.04, 1], rotate: [0, 2, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {p.category[0]}
                    </motion.div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-2xs font-medium uppercase tracking-wider text-[var(--color-ink)]">
                    {p.category}
                  </div>
                </div>
                <time className="text-xs tracking-widest uppercase text-[var(--color-ink-soft)]">
                  {p.date}
                </time>
                <h3 className="font-display mt-2 text-xl leading-tight text-[var(--color-ink)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {p.excerpt}
                </p>
                <span
                  className="absolute bottom-0 left-0 h-1 w-0 origin-left transition-all duration-500 ease-out group-hover:w-full"
                  style={{ background: p.tint }}
                />
              </article>
            );
            return (
              <motion.li
                key={p.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="h-full"
              >
                {p.slug ? (
                  <Link href={`/news/${p.slug}`} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </Section>
  );
}
