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
import { ORGANIZATION_JSONLD } from "@/lib/seo/organization-jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The hero stays put and the RaJA ファミリー sheet (age map + the seven brand
// bands, after shin-ei-animation.jp) slides up over it; the brands' full
// sections follow.
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_JSONLD).replace(/</g, "\\u003c"),
        }}
      />
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
