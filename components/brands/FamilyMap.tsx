"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSmoothScroll } from "../SmoothScrollProvider";

// The RaJA family on one age map: ages across the top, one row per brand,
// a bar in the brand's colour over the ages it serves (from the facts the
// bands below already state). A parent finds "which RaJA is for my child"
// at a glance; each row jumps to its band. Bars grow in once on arrival.

export type MapRow = {
  key: string;
  n: number;
  name: string;
  logo?: { src: string; w: number; h: number };
  /** first and last age column (0–5), inclusive */
  span: [number, number];
  label: string;
  color: [bg: string, fg: string];
  /** not launched yet: dashed outline instead of a fill */
  soon?: boolean;
};

const COLS = 6;

export function FamilyMap({ rows, ages }: { rows: MapRow[]; ages: string[] }) {
  const { scrollTo } = useSmoothScroll();
  const [on, setOn] = useState<string | null>(null);
  const go = (key: string) => scrollTo(`#brand-${key}`);
  const template = { gridTemplateColumns: `minmax(0, var(--name-col)) repeat(${COLS}, minmax(0, 1fr))` };

  return (
    <div className="relative [--name-col:6.9rem] md:[--name-col:12.5rem]">
      {/* column guides */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid" style={template}>
        <span />
        {ages.map((a, i) => (
          <span key={a} className={`border-l border-dashed border-[var(--color-ink)]/15 ${i === COLS - 1 ? "border-r" : ""}`} />
        ))}
      </div>

      <div className="relative grid items-center gap-y-[clamp(6px,0.8vw,10px)]" style={template}>
        {/* age header */}
        <span style={{ gridRow: 1, gridColumn: 1 }} />
        {ages.map((a, c) => (
          <span key={a} style={{ gridRow: 1, gridColumn: c + 2 }} className="pb-1 text-center text-[10.5px] font-medium tracking-wide text-[var(--color-ink-soft)] md:text-[12.5px]">
            {a}
          </span>
        ))}

        {rows.map((r, i) => {
          const lit = on === r.key;
          return (
            <div key={r.key} className="contents" onMouseEnter={() => setOn(r.key)} onMouseLeave={() => setOn(null)}>
              <a
                href={`#brand-${r.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(r.key);
                }}
                onFocus={() => setOn(r.key)}
                onBlur={() => setOn(null)}
                style={{ gridRow: i + 2, gridColumn: 1 }}
                className="flex min-w-0 items-center gap-2 py-0.5 pr-2 text-[var(--color-ink)] md:gap-2.5"
              >
                <span className="hidden h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-sun)] text-[10px] font-medium md:grid">
                  {String(r.n).padStart(2, "0")}
                </span>
                {r.logo && (
                  <Image src={r.logo.src} alt="" width={r.logo.w} height={r.logo.h} sizes="40px" className="hidden h-8 w-auto max-w-10 shrink-0 object-contain md:block" />
                )}
                <span className={`text-[11.5px] font-semibold leading-tight transition-colors md:truncate md:text-[14px] ${lit ? "underline decoration-[var(--color-sun)] decoration-2 underline-offset-4" : ""}`}>
                  {r.name}
                </span>
              </a>
              <motion.div
                aria-hidden
                onClick={() => go(r.key)}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`mx-[2px] flex h-[clamp(26px,2.6vw,34px)] origin-left cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-0.5 text-[9.5px] font-medium md:mx-[3px] md:px-2 transition-transform duration-300 md:text-[12.5px] ${
                  lit ? "-translate-y-0.5" : ""
                } ${r.soon ? "border-2 border-dashed" : "shadow-[0_2px_0_rgba(20,25,60,0.12)]"}`}
                style={{
                  gridRow: i + 2,
                  gridColumn: `${r.span[0] + 2} / ${r.span[1] + 3}`,
                  background: r.soon ? "transparent" : r.color[0],
                  color: r.soon ? r.color[0] : r.color[1],
                  borderColor: r.soon ? r.color[0] : undefined,
                }}
              >
                {r.label}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
