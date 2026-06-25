"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "../Section";
import { CloudTheater } from "../transitions/CloudTheater";
import { useT } from "@/lib/i18n";

// ————————————————————————————————————————————————————————
// Intro — the mini section between Study Abroad (01) and Preschool.
//
// It hosts the pinned "cloud theatre" (see CloudTheater): leaving Study Abroad
// the section pins and clouds flood the screen → brief whiteout → the clouds
// PART to reveal this pair (the ink phrase + RaJA) in a clearing → the clouds
// thin and the backdrop opens into Preschool's sky. The two assets are passed
// as the theatre's centred stage; this component only owns fetching/inlining
// the ink SVG so its glyphs can be "typed" during the reveal beat.
//
// `noFade` — the theatre owns all opacity; Section's cross-fade must not
// compound with it. Full-height (not `compact`) — the pin needs a viewport-
// tall target.
// ————————————————————————————————————————————————————————

const INK_SRC = "/minin-section/kagoshimatoieba.svg";
const RAJA_SRC = "/minin-section/raja.svg";

export function Intro() {
  const t = useT();
  const p = t.intro;

  const svgHostRef = useRef<HTMLDivElement | null>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Inline the ink SVG so the theatre can "type" its individual glyph paths.
  useEffect(() => {
    let cancelled = false;
    fetch(INK_SRC)
      .then((r) => r.text())
      .then((markup) => {
        const host = svgHostRef.current;
        if (cancelled || !host) return;
        host.innerHTML = markup;
        const svg = host.querySelector("svg");
        if (svg) {
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "auto");
          svg.style.width = "100%";
          svg.style.height = "auto";
          svg.style.overflow = "visible";
          svg.setAttribute("role", "img");
        }
        setSvgLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const svg = svgHostRef.current?.querySelector("svg");
    if (svg) svg.setAttribute("aria-label", p.srLead);
  }, [p.srLead, svgLoaded]);

  return (
    <Section
      id="intro"
      noFade
      background="#eef6ee"
      style={{ color: "var(--color-ink)" }}
    >
      <CloudTheater ready={svgLoaded}>
        {/* Ink phrase — inlined + typed. Bigger of the two. */}
        <div
          ref={svgHostRef}
          className="w-[clamp(17rem,48vw,42rem)]"
          style={{ filter: "drop-shadow(0 10px 22px rgba(35,25,22,0.10))" }}
        />

        {/* RaJA illustration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={RAJA_SRC}
          alt="RaJA"
          draggable={false}
          decoding="async"
          className="block h-auto w-[clamp(15rem,38vw,33rem)] select-none"
          style={{ filter: "drop-shadow(0 22px 44px rgba(32,35,58,0.16))" }}
        />
      </CloudTheater>
    </Section>
  );
}
