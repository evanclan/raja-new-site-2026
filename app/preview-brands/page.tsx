import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StudyAbroad } from "@/components/sections/StudyAbroad";
import { Intro } from "@/components/sections/Intro";
import { Academy } from "@/components/sections/Academy";
import { Preschool } from "@/components/sections/Preschool";
import { Clab } from "@/components/sections/Clab";
import { English } from "@/components/sections/English";
import { News } from "@/components/sections/News";
import { Inquiry } from "@/components/sections/Inquiry";
import { Footer } from "@/components/Footer";
import { BrandBands } from "@/components/brands/BrandBands";
import { OverHero, PinnedHero } from "@/components/brands/PinnedHero";

// PROTOTYPE — the homepage exactly as it is, plus the seven brands as
// colour bands right after the hero (after shin-ei-animation.jp's works
// list). The hero is pinned and the bands slide up over it. noindex, disallowed in robots.ts, allowed through proxy.ts.
export const metadata: Metadata = {
  title: "RaJA ファミリー（プレビュー）— RaJA International",
  robots: { index: false, follow: false },
};

export default function PreviewBrandsPage() {
  return (
    <>
      {/* the hero stays put; the family bands slide up over it */}
      <PinnedHero>
        <Hero />
      </PinnedHero>
      <OverHero>
        <BrandBands />
      </OverHero>
      <div className="relative z-10">
        <StudyAbroad />
        <Intro />
        <Preschool />
        <Academy />
        <Clab />
        <English />
        <News />
        <Inquiry />
        <Footer />
      </div>
    </>
  );
}
