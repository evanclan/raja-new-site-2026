"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Section } from "../Section";
import { useT } from "@/lib/i18n";

// Each program wears its own brand accent (order mirrors t.inquiry.programs:
// Kaeru Ryugaku · Academy · Preschool · Clab · English).
const PROGRAM_COLORS = [
  "var(--color-sky)",
  "var(--color-sun)",
  "var(--color-peach)",
  "var(--color-leaf)",
  "var(--color-berry)",
];

const iconCls = "h-[18px] w-[18px]";
const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="8" r="4" />
  </svg>
);
const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);
const ChatIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
  </svg>
);

export function Inquiry() {
  const t = useT();
  const [programIdx, setProgramIdx] = useState(1);

  return (
    <Section
      id="inquiry"
      background="var(--color-ink)"
      style={{ color: "var(--color-cream)" }}
    >
      <div className="relative mx-auto flex min-h-screen max-w-[clamp(34rem,42vw,46rem)] max-md:max-w-full flex-col justify-center px-gutter py-band">
        {/* Floating brand blobs — soft, slow, behind the card */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-16 top-16 h-56 w-56 rounded-full opacity-25 blur-[80px] max-md:opacity-[0.18] max-md:blur-[60px]"
            style={{ background: "var(--color-berry)" }}
            animate={{ y: [0, -22, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-12 bottom-24 h-64 w-64 rounded-full opacity-25 blur-[90px] max-md:opacity-[0.18] max-md:blur-[60px]"
            style={{ background: "var(--color-sky)" }}
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-2xs font-medium uppercase tracking-[0.22em] text-[var(--color-cream)]/75">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-sun)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-sun)]" />
            </span>
            {t.inquiry.kicker}
          </span>
          <h2 className="font-display mt-5 text-display-1 leading-[0.98] tracking-tight">
            {t.inquiry.titleA}
            <br />
            <span className="text-[var(--color-sun)]">{t.inquiry.titleB}</span>
          </h2>
        </motion.div>

        {/* Card */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={(e) => e.preventDefault()}
          className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 max-md:p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.inquiry.fields.name} placeholder={t.inquiry.fields.namePh} icon={UserIcon} />
            <Field label={t.inquiry.fields.email} type="email" placeholder={t.inquiry.fields.emailPh} icon={MailIcon} />
          </div>

          <div className="mt-5">
            <span className="mb-3 block text-2xs font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]/55">
              {t.inquiry.fields.program}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {t.inquiry.programs.map((p, i) => {
                const active = programIdx === i;
                const c = PROGRAM_COLORS[i % PROGRAM_COLORS.length];
                return (
                  <motion.button
                    type="button"
                    key={i}
                    aria-pressed={active}
                    onClick={() => setProgramIdx(i)}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
                    className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5"
                    style={
                      active
                        ? { backgroundColor: c, borderColor: c, color: "var(--color-ink)" }
                        : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,247,230,0.8)" }
                    }
                  >
                    <span
                      className="h-2 w-2 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: active ? "var(--color-ink)" : c }}
                    />
                    {p}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <Field label={t.inquiry.fields.message} placeholder={t.inquiry.fields.messagePh} as="textarea" icon={ChatIcon} />
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            type="submit"
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-sun)] px-6 py-4 text-base font-semibold text-[var(--color-ink)] shadow-[0_18px_45px_-12px_rgba(255,210,61,0.6)] transition-shadow hover:shadow-[0_24px_55px_-10px_rgba(255,210,61,0.85)]"
          >
            {t.inquiry.submit}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.button>
        </motion.form>
      </div>

      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[500px] w-[700px] max-md:h-[360px] max-md:w-[420px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,61,0.18) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </Section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  as = "input",
  icon,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea";
  icon?: ReactNode;
}) {
  const base =
    "w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 text-[var(--color-cream)] placeholder:text-white/35 outline-none transition-all duration-300 focus:border-[var(--color-sun)]/70 focus:bg-white/[0.08] focus:[box-shadow:0_0_0_4px_rgba(255,210,61,0.12)] max-md:text-[16px]";
  const pad = icon ? "pl-12 pr-4" : "px-4";
  return (
    <label className="block">
      <span className="mb-2 block text-2xs font-medium uppercase tracking-[0.18em] text-[var(--color-cream)]/55">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span
            className={`pointer-events-none absolute left-4 text-[var(--color-cream)]/35 ${
              as === "textarea" ? "top-4" : "top-1/2 -translate-y-1/2"
            }`}
          >
            {icon}
          </span>
        )}
        {as === "textarea" ? (
          <textarea rows={4} placeholder={placeholder} className={`${base} ${pad}`} />
        ) : (
          <input type={type} placeholder={placeholder} className={`${base} ${pad}`} />
        )}
      </div>
    </label>
  );
}
