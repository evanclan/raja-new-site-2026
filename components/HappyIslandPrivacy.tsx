"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Footer } from "./Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

// One brand colour per section, cycling through the family palette so the
// numbered markers read as RaJA rather than generic legal boilerplate.
const ACCENTS = [
  "var(--color-sky)",
  "var(--color-peach)",
  "var(--color-sun)",
  "var(--color-leaf)",
  "var(--color-berry)",
  "var(--color-sky)",
  "var(--color-peach)",
] as const;

type Item = { term: string; desc: string; href?: string };
type Group = { title: string; items: readonly Item[] };
type PolicySection = {
  id: string;
  title: string;
  lead?: string;
  items?: readonly Item[];
  groups?: readonly Group[];
  note?: string;
  ordered?: boolean;
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
} as const;

function ItemList({
  items,
  accent,
  sep,
  ordered,
}: {
  items: readonly Item[];
  accent: string;
  sep: string;
  ordered?: boolean;
}) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item, i) => (
        <li
          key={item.term}
          className="flex gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_10px_30px_-22px_rgba(32,35,58,0.35)]"
        >
          {ordered ? (
            <span
              aria-hidden
              className="font-display mt-px grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold text-[var(--color-ink)]"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
          ) : (
            <span
              aria-hidden
              className="mt-2 size-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
          )}
          <p className="text-base leading-relaxed text-[var(--color-ink-soft)]">
            <span className="font-medium text-[var(--color-ink)]">
              {item.term}
            </span>
            <span className="text-[var(--color-ink)]/35">{sep}</span>
            {item.href ? (
              <a
                href={item.href}
                className="break-all font-medium text-[var(--color-ink)] underline decoration-[var(--color-peach)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-peach)]"
              >
                {item.desc}
              </a>
            ) : (
              item.desc
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function HappyIslandPrivacy() {
  const { t, locale } = useI18n();
  const p = t.privacy;
  // Both locales share this shape; widen the readonly literal for mapping.
  const sections = p.sections as readonly PolicySection[];
  const sep = locale === "ja" ? "：" : " — ";

  return (
    <article className="bg-[var(--color-cream)] text-[var(--color-ink)]">
      {/* Hero — ink-dark so the nav (cream at scroll-top) stays legible. */}
      <header className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(111,195,232,0.20) 0%, transparent 65%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="shell-tight relative z-10 pb-band pt-[9rem]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="inline-flex items-center rounded-full bg-[var(--color-cream)]/12 px-3 py-1 text-2xs font-medium uppercase tracking-[0.22em]">
              {p.eyebrow}
            </span>
            <h1 className="font-display mt-5 max-w-[22ch] text-display-2 leading-[1.05] tracking-tight">
              {p.app}
              <span className="block text-[var(--color-sky)]">{p.title}</span>
            </h1>
            <p className="measure mt-5 text-base leading-relaxed text-[var(--color-cream)]/75">
              {p.lede}
            </p>
            <p className="mt-6 text-sm tracking-wide text-[var(--color-cream)]/55">
              {p.updatedLabel}: {p.updated}
            </p>
          </motion.div>
        </div>
      </header>

      <div className="shell-tight py-band">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Contents — sticky rail on desktop */}
          <nav
            aria-label={p.tocLabel}
            className="md:col-span-4 lg:col-span-3"
          >
            <div className="md:sticky md:top-28">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
                {p.tocLabel}
              </h2>
              <ol className="mt-5 space-y-2.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-baseline gap-3 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      <span
                        className="font-display text-xs tabular-nums"
                        style={{ color: ACCENTS[i % ACCENTS.length] }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-[var(--color-sky)]">
                        {s.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* Policy body */}
          <div className="md:col-span-8 lg:col-span-9">
            {sections.map((s, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <motion.section
                  key={s.id}
                  id={s.id}
                  {...fadeUp}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="scroll-mt-28 border-t border-[var(--color-ink)]/10 pt-8 first:border-t-0 first:pt-0 [&+section]:mt-12"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-display text-sm tabular-nums"
                      style={{ color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl tracking-tight">
                      {s.title}
                    </h2>
                  </div>

                  {s.lead && (
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
                      {s.lead}
                    </p>
                  )}

                  {s.items && (
                    <ItemList
                      items={s.items}
                      accent={accent}
                      sep={sep}
                      ordered={s.ordered}
                    />
                  )}

                  {s.groups?.map((g) => (
                    <div key={g.title} className="mt-7">
                      <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink)]/55">
                        {g.title}
                      </h3>
                      <ItemList items={g.items} accent={accent} sep={sep} />
                    </div>
                  ))}

                  {s.note && (
                    <p
                      className="mt-6 rounded-2xl border-l-4 bg-white/70 px-5 py-4 text-sm font-medium leading-relaxed text-[var(--color-ink)]"
                      style={{ borderColor: accent }}
                    >
                      {s.note}
                    </p>
                  )}
                </motion.section>
              );
            })}

            <div className="mt-14 border-t border-[var(--color-ink)]/10 pt-8">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
              >
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                {p.backLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </article>
  );
}
