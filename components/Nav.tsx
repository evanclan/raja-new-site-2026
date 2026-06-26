"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useSmoothScroll } from "./SmoothScrollProvider";
import { useLoading } from "./LoadingProvider";
import { useI18n } from "@/lib/i18n";

// Brand colour for each link id — matches the approved palette
const BRAND_DOTS: Record<string, string> = {
  "study-abroad": "var(--color-sky)",
  academy: "var(--color-sun)",
  preschool: "var(--color-peach)",
  clab: "var(--color-leaf)",
  english: "var(--color-berry)",
  news: "var(--color-ink)",
  inquiry: "var(--color-ink)",
};

export function Nav() {
  const { scrollTo, stop, start } = useSmoothScroll();
  const { t, locale, toggleLocale } = useI18n();
  const { loaded } = useLoading();
  const { scrollY } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  // ── Dual-tone chrome ────────────────────────────────────────────
  // Unchanged from original — desktop behaviour is byte-identical.
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.9]);
  const blur = useTransform(scrollY, [0, 200], [0, 12]);
  const backdropFilter = useTransform(blur, (b) => `blur(${b}px)`);
  const brandColor = useTransform(scrollY, [0, 140], ["#fff7e6", "#20233a"]);
  const linkColor = useTransform(
    scrollY,
    [0, 140],
    ["rgba(255,247,230,0.82)", "#3c4060"],
  );
  const ctaBg = useTransform(scrollY, [0, 140], ["#fff7e6", "#20233a"]);
  const ctaFg = useTransform(scrollY, [0, 140], ["#20233a", "#fff7e6"]);
  // Hamburger stroke tracks the same window as brandColor
  const burgerColor = useTransform(scrollY, [0, 140], ["#fff7e6", "#20233a"]);

  const links = [
    { id: "study-abroad", label: t.nav.studyAbroad },
    { id: "preschool", label: t.nav.preschool },
    { id: "academy", label: t.nav.academy },
    { id: "clab", label: t.nav.clab },
    { id: "english", label: t.nav.english },
    { id: "news", label: t.nav.news },
    { id: "inquiry", label: t.nav.contact },
  ];

  // ── Scroll-lock while drawer is open ────────────────────────────
  useEffect(() => {
    if (menuOpen) {
      stop();
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      start();
    }
    return () => {
      // Cleanup on unmount — ensure scroll is always restored
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      start();
    };
  }, [menuOpen, stop, start]);

  // ── Esc key closes drawer ────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ── Helpers ──────────────────────────────────────────────────────
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const handleLinkClick = (id: string) => {
    closeMenu();
    // Small delay lets AnimatePresence begin the exit before scrollTo fires,
    // ensuring Lenis start() runs before the smooth scroll begins.
    setTimeout(() => scrollTo(`#${id}`), 80);
  };
  const handleCtaClick = () => {
    closeMenu();
    setTimeout(() => scrollTo("#inquiry"), 80);
  };

  // ── Motion variants ──────────────────────────────────────────────
  const drawerVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReduced ? 0 : 12 },
  };
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const linkVariants = {
    hidden: { opacity: 0, x: prefersReduced ? 0 : -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: prefersReduced ? 0 : i * 0.04,
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
    exit: { opacity: 0, x: prefersReduced ? 0 : -10 },
  };

  return (
    <>
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
          {/* ── Wordmark — unchanged ──────────────────────────────── */}
          <button
            onClick={() => scrollTo("#hero")}
            className="group flex items-center gap-2"
            aria-label={t.nav.homeAria}
          >
            <motion.span
              className="font-display text-base tracking-tight"
              style={{
                color: brandColor,
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.45)",
              }}
            >
              RaJA International
            </motion.span>
          </button>

          {/* ── Desktop link list — unchanged ────────────────────── */}
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

          {/* ── Right cluster ────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <LangToggle locale={locale} onToggle={toggleLocale} />

            {/* Desktop CTA pill — unchanged */}
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

            {/* ── Hamburger button — mobile only (lg:hidden) ──────── */}
            <motion.button
              className="lg:hidden inline-flex h-11 w-11 -mr-1 items-center justify-center rounded-full"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              style={{
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.35)",
              }}
            >
              <motion.svg
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                aria-hidden="true"
              >
                <motion.line
                  x1="0"
                  y1="1"
                  x2="22"
                  y2="1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ stroke: burgerColor }}
                />
                <motion.line
                  x1="0"
                  y1="8"
                  x2="22"
                  y2="8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ stroke: burgerColor }}
                />
                <motion.line
                  x1="0"
                  y1="15"
                  x2="22"
                  y2="15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ stroke: burgerColor }}
                />
              </motion.svg>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile drawer — gated lg:hidden, portal-like fixed layer ── */}
      {/* AnimatePresence handles mount/unmount transitions              */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — tap closes */}
            <motion.div
              key="mobile-backdrop"
              className="fixed inset-0 z-[48] lg:hidden bg-[var(--color-ink)]/30"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.22 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-0 z-[49] lg:hidden flex flex-col bg-[var(--color-cream)] px-gutter overflow-y-auto"
              style={{ paddingTop: "5.5rem", paddingBottom: "3rem" }}
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close button — pinned top-right */}
              <button
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="absolute top-5 right-[var(--space-gutter,1.25rem)] h-11 w-11 inline-flex items-center justify-center rounded-full bg-[var(--color-ink)]/8 text-[var(--color-ink)] hover:bg-[var(--color-ink)]/15 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <line
                    x1="1"
                    y1="1"
                    x2="15"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="15"
                    y1="1"
                    x2="1"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Nav links list */}
              <ul className="flex flex-col w-full mt-2">
                {links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <button
                      onClick={() => handleLinkClick(l.id)}
                      className="flex items-center gap-3 w-full py-4 text-left border-b border-[color:rgba(32,35,58,0.1)] group"
                    >
                      {/* Brand-colour dot */}
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125"
                        style={{ background: BRAND_DOTS[l.id] }}
                        aria-hidden="true"
                      />
                      <span className="font-display text-3xl text-[var(--color-ink)] leading-none tracking-tight">
                        {l.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* CTA pill — full-width ink plate */}
              <motion.button
                onClick={handleCtaClick}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full py-3.5 text-base font-medium bg-[var(--color-ink)] text-[var(--color-cream)] hover:opacity-90 transition-opacity"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: prefersReduced ? 0 : links.length * 0.04 + 0.08,
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={{ opacity: 0 }}
              >
                {t.nav.cta}
              </motion.button>

              {/* EN/JA toggle — second instance in drawer */}
              <motion.div
                className="mt-5 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: prefersReduced ? 0 : links.length * 0.04 + 0.16,
                    duration: 0.24,
                  },
                }}
                exit={{ opacity: 0 }}
              >
                <LangToggleDark locale={locale} onToggle={toggleLocale} />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── LangToggle (header) — unchanged ──────────────────────────────────
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

// ── LangToggleDark — drawer variant, readable on cream background ─────
function LangToggleDark({
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
      className="relative flex h-10 w-[88px] items-center rounded-full border border-[color:rgba(32,35,58,0.2)] bg-[color:rgba(32,35,58,0.06)] text-xs font-medium"
    >
      <motion.span
        className="absolute top-1 h-8 w-[40px] rounded-full bg-[var(--color-ink)]"
        initial={false}
        animate={{ x: locale === "en" ? 4 : 44 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "en"
            ? "text-[var(--color-cream)]"
            : "text-[var(--color-ink)]"
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 flex-1 text-center transition-colors duration-300 ${
          locale === "ja"
            ? "text-[var(--color-cream)]"
            : "text-[var(--color-ink)]"
        }`}
      >
        JA
      </span>
    </button>
  );
}
