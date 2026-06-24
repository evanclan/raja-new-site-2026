"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { useLoading } from "./LoadingProvider";
import { useI18n } from "@/lib/i18n";

export function Nav() {
  const { scrollTo } = useSmoothScroll();
  const { t, locale, toggleLocale } = useI18n();
  const { loaded } = useLoading();
  const { scrollY } = useScroll();

  // Dual-tone chrome: the nav sits on the dark hero while scrolled
  // at the top, then settles onto the cream body as the user scrolls
  // down. We interpolate *everything* that needs contrast on this
  // same axis — background, text colour, border — so the transition
  // reads as a single lighting change rather than several elements
  // flipping state independently.
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.9]);
  const blur = useTransform(scrollY, [0, 200], [0, 12]);
  const backdropFilter = useTransform(blur, (b) => `blur(${b}px)`);
  // Wordmark + CTA text shift from cream (against dark hero) → ink
  // (against cream scroll state). 140px is the fade window so the
  // colour change coincides with the background becoming opaque.
  const brandColor = useTransform(
    scrollY,
    [0, 140],
    ["#fff7e6", "#20233a"],
  );
  // Menu link idle colour — softened cream/ink at respective ends.
  const linkColor = useTransform(
    scrollY,
    [0, 140],
    ["rgba(255,247,230,0.82)", "#3c4060"],
  );
  // CTA plate inverts: cream pill on dark hero, dark pill on cream
  // body. Same 140px fade so it stays in lockstep.
  const ctaBg = useTransform(scrollY, [0, 140], ["#fff7e6", "#20233a"]);
  const ctaFg = useTransform(scrollY, [0, 140], ["#20233a", "#fff7e6"]);

  const links = [
    { id: "study-abroad", label: t.nav.studyAbroad },
    { id: "academy", label: t.nav.academy },
    { id: "preschool", label: t.nav.preschool },
    { id: "clab", label: t.nav.clab },
    { id: "english", label: t.nav.english },
    { id: "news", label: t.nav.news },
    { id: "inquiry", label: t.nav.contact },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: loaded ? 0 : -40, opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-[var(--color-cream)]"
        style={{ opacity: bgOpacity, backdropFilter }}
      />
      <nav className="shell relative flex items-center justify-between gap-4 py-5">
        {/* Wordmark only — the circular RaJA logo lives on the hero
            itself (top-middle), so the nav keeps its chrome light and
            lets the hero own the brand mark. */}
        <button
          onClick={() => scrollTo("#hero")}
          className="group flex items-center gap-2"
          aria-label={t.nav.homeAria}
        >
          <motion.span
            className="font-display text-base tracking-tight"
            style={{
              color: brandColor,
              // Subtle ink shadow so the cream glyphs stay legible
              // against bright parts of the hero photo. Fades as the
              // background turns opaque — at that point we don't need
              // the halo anymore.
              textShadow:
                "0 1px 0 rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.45)",
            }}
          >
            RaJA International
          </motion.span>
        </button>

        <ul className="hidden gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <motion.button
                onClick={() => scrollTo(`#${l.id}`)}
                className="relative rounded-full px-3 py-1.5 text-sm transition-[text-shadow] duration-300 hover:[text-shadow:none]"
                style={{
                  color: linkColor,
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.35)",
                }}
                whileHover={{ y: -1 }}
              >
                <span className="relative z-10">{l.label}</span>
              </motion.button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LangToggle locale={locale} onToggle={toggleLocale} />
          <motion.button
            onClick={() => scrollTo("#inquiry")}
            className="hidden sm:inline-flex rounded-full px-5 py-2 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: ctaBg,
              color: ctaFg,
              boxShadow:
                "0 8px 22px -10px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {t.nav.cta}
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
}

function LangToggle({
  locale,
  onToggle,
}: {
  locale: "en" | "ja";
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch language to ${locale === "en" ? "Japanese" : "English"}`}
      className="relative flex h-8 w-[72px] items-center rounded-full border border-white/25 bg-white/15 text-xs font-medium text-white backdrop-blur"
    >
      <motion.span
        className="absolute top-1 h-6 w-[32px] rounded-full bg-[var(--color-cream)]"
        initial={false}
        animate={{ x: locale === "en" ? 4 : 36 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "en" ? "text-[var(--color-ink)]" : "text-white/80"
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "ja" ? "text-[var(--color-ink)]" : "text-white/80"
        }`}
      >
        JA
      </span>
    </button>
  );
}
