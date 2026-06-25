"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useSmoothScroll } from "../SmoothScrollProvider";

// ————————————————————————————————————————————————————————
// Academy gallery — the Class of 2026 keepsake photos as a small
// CONSTELLATION floating in the night sky around the graduates. Each
// node is a star/photo; clicking one opens a full-screen celestial
// lightbox at that photo.
//
// Placement note: rendered as an `absolute inset-0` overlay INSIDE the
// photo box (AcademyKeepsake), so the nodes sit around the graduation
// photo. The lightbox is portaled to <body> so the section's scroll-
// fade transform can't trap its position:fixed, and the page is locked
// via Lenis stop()/start() while it's open.
// ————————————————————————————————————————————————————————

const PHOTOS = Array.from(
  { length: 6 },
  (_, i) => `/academy/gallery/student-${i + 1}.jpg`
);
const EASE = [0.22, 1, 0.36, 1] as const;
const POP = [0.34, 1.56, 0.64, 1] as const;

// Node positions (% of the photo box). Kept to the open water — top
// band and side edges — to clear the graduates (bottom-centre) and the
// gold seal (lower-left). Each photo floats inside a glassy bubble.
const NODES = [
  { x: 10, y: 23 },
  { x: 31, y: 9 },
  { x: 55, y: 6 },
  { x: 92, y: 33 },
  { x: 7, y: 53 },
  { x: 93, y: 60 },
];

export function AcademyGallery() {
  const { locale } = useI18n();
  const reduce = useReducedMotion();
  const { stop, start } = useSmoothScroll();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  const tx =
    locale === "ja"
      ? { label: "2026年度 卒園生", of: "／", close: "閉じる", prev: "前へ", next: "次へ" }
      : { label: "Class of 2026", of: "of", close: "Close", prev: "Previous", next: "Next" };

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + PHOTOS.length) % PHOTOS.length),
    []
  );

  useEffect(() => {
    if (!open) return;
    stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      start();
    };
  }, [open, stop, start, close, go]);

  const lightbox = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={tx.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div
            className="absolute inset-0 bg-[rgba(8,10,40,0.88)] backdrop-blur-md"
            onClick={close}
          />

          <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-xs tracking-[0.25em] text-[#fff7e6]/70">
            {index + 1} {tx.of} {PHOTOS.length}
          </div>

          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            aria-label={tx.close}
            className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#fff7e6]/25 text-[#fff7e6] transition hover:border-[#ffd23d] hover:text-[#ffd23d]"
          >
            <span className="text-lg leading-none">✕</span>
          </button>

          <div
            className="relative z-[5] flex h-[68vh] w-full max-w-5xl items-center justify-center px-14 md:px-20"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={tx.prev}
              className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-[#fff7e6]/20 text-2xl text-[#fff7e6] transition hover:border-[#ffd23d] hover:text-[#ffd23d] md:left-3"
            >
              ‹
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                className="relative h-full w-full"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <Image
                  src={PHOTOS[index]}
                  alt={`${tx.label} — ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 92vw, 900px"
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.5))" }}
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={tx.next}
              className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-[#fff7e6]/20 text-2xl text-[#fff7e6] transition hover:border-[#ffd23d] hover:text-[#ffd23d] md:right-3"
            >
              ›
            </button>
          </div>

          <div
            data-lenis-prevent
            className="relative z-[5] mt-5 flex max-w-[92vw] gap-2 overflow-x-auto px-2 pb-1"
          >
            {PHOTOS.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${tx.label} — ${i + 1}`}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition ${
                  i === index ? "ring-2 ring-[#ffd23d]" : "opacity-55 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Constellation overlay — fills the photo box; nodes float in the
          surrounding sky. pointer-events-none so it never blocks the
          photo, with each node re-enabling pointer events. */}
      <div className="pointer-events-none absolute inset-0 z-[7]">
        {NODES.map((n, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`${tx.label} — ${i + 1}`}
            className="group pointer-events-auto absolute block aspect-square w-[clamp(56px,14vw,120px)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            {/* entrance pop (own transform layer) */}
            <motion.span
              className="block h-full w-full"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: POP }}
            >
              {/* idle drift (own transform layer) */}
              <motion.span
                className="block h-full w-full"
                animate={reduce ? undefined : { y: [0, i % 2 ? -6 : -4, 0] }}
                transition={{
                  duration: 5.5 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                {/* hover scale (CSS, own transform layer). drop-shadow on the
                    wrapper gives the bubble its depth shadow + a soft cyan
                    underwater glow that brightens on hover. */}
                <span
                  className="relative block h-full w-full transition-transform duration-300 group-hover:scale-[1.12] [filter:drop-shadow(0_5px_12px_rgba(8,16,48,0.5))_drop-shadow(0_0_7px_rgba(120,200,255,0.35))] group-hover:[filter:drop-shadow(0_0_16px_rgba(140,215,255,0.9))]"
                >
                  {/* the bubble — a glossy sphere holding the photo */}
                  <span className="relative block h-full w-full overflow-hidden rounded-full bg-[#0b1240]">
                    <Image src={PHOTOS[i]} alt="" fill sizes="120px" className="object-cover" />
                    {/* sphere shading — bright top rim, deep bottom */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        boxShadow:
                          "inset 0 3px 8px rgba(255,255,255,0.5), inset 0 -12px 22px rgba(0,42,92,0.55)",
                      }}
                    />
                    {/* thin glass rim */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/40"
                    />
                    {/* specular highlight — the light catching the bubble */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-[14%] top-[10%] h-[34%] w-[42%] rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 45%, transparent 72%)",
                        filter: "blur(0.5px)",
                      }}
                    />
                  </span>
                </span>
              </motion.span>
            </motion.span>
          </button>
        ))}
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}
