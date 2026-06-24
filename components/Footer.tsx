"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useSmoothScroll } from "./SmoothScrollProvider";

type Brand = { name: string; desc: string; href: string; color: string };

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  const { t, locale, toggleLocale } = useI18n();
  const { scrollTo } = useSmoothScroll();
  const f = t.footer;
  // Both locales share this shape; widen the readonly tuple for mapping.
  const brands = f.brands as readonly Brand[];

  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]">
      {/* Ambient glow — echoes the Inquiry section's breathing backdrop */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[440px] w-[720px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,61,0.14) 0%, transparent 65%)",
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="shell-tight relative py-band">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="md:col-span-5"
          >
            <Image
              src="/hero-main/RaJA-Logo.svg"
              alt="RaJA International"
              width={80}
              height={80}
              className="h-[clamp(4rem,5vw,5rem)] w-[clamp(4rem,5vw,5rem)]"
            />
            <p className="mt-6 max-w-sm font-display text-lg leading-snug text-[var(--color-cream)]/90">
              {f.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-cream)]/55">
              {f.blurb}
            </p>
          </motion.div>

          {/* Family of brands */}
          <motion.nav
            aria-label={f.brandsTitle}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.06, ease: EASE }}
            className="md:col-span-4"
          >
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-cream)]/45">
              {f.brandsTitle}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {brands.map((b) => (
                <li key={b.href}>
                  <a
                    href={b.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-150"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="text-[var(--color-cream)]/90 transition-colors group-hover:text-[var(--color-cream)]">
                      {b.name}
                    </span>
                    <span className="text-xs text-[var(--color-cream)]/40">
                      {b.desc}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto text-[var(--color-cream)]/30 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Contact — the real footer details */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            className="md:col-span-3"
          >
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-cream)]/45">
              {f.contactTitle}
            </h2>
            <address className="mt-5 space-y-3 text-sm not-italic leading-relaxed text-[var(--color-cream)]/90">
              <p className="whitespace-pre-line">{f.address}</p>
              <div>
                <a
                  href={`tel:${f.tel.replace(/[^+\d]/g, "")}`}
                  className="block transition-colors hover:text-[var(--color-sun)]"
                >
                  TEL {f.tel}
                </a>
                <span className="block text-[var(--color-cream)]/55">
                  FAX {f.fax}
                </span>
              </div>
              <a
                href={`mailto:${f.email}`}
                className="block break-all transition-colors hover:text-[var(--color-sun)]"
              >
                {f.email}
              </a>
              <a
                href={f.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-sky)] transition-opacity hover:opacity-80"
              >
                {f.mapLabel}
                <span aria-hidden>→</span>
              </a>
            </address>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 h-px w-full bg-[var(--color-cream)]/10" />

        {/* Legal / utility row */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a
              href={f.aboutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-cream)]/70 transition-colors hover:text-[var(--color-cream)]"
            >
              {f.about}
            </a>
            <a
              href={f.recruitHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-cream)]/70 transition-colors hover:text-[var(--color-cream)]"
            >
              {f.recruit}
            </a>
            <button
              type="button"
              onClick={toggleLocale}
              className="text-[var(--color-cream)]/70 transition-colors hover:text-[var(--color-cream)]"
            >
              {locale === "en" ? "日本語" : "English"}
            </button>
          </div>

          <div className="flex items-center gap-5">
            <p className="text-xs text-[var(--color-cream)]/50">{f.copyright}</p>
            <motion.button
              type="button"
              onClick={() => scrollTo(0)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-cream)]/20 px-4 py-2 text-xs text-[var(--color-cream)]/80 transition-colors hover:border-[var(--color-sun)] hover:text-[var(--color-sun)]"
            >
              {f.backToTop}
              <span aria-hidden>↑</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
