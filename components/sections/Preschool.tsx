"use client";

import { PanelShell } from "./PanelShell";
import { PreschoolPhoto } from "../visuals/Visuals";
import { PreschoolGallery } from "../visuals/PreschoolGallery";
import { PreschoolBackdrop } from "../backdrops/SectionBackdrops";
import { useT } from "@/lib/i18n";

// Static photo paths + intrinsic sizes, paired (by order) with the
// localized branch copy in i18n. Each file is an info-card (building photo +
// address/phone/hours in white text on a transparent half), shown whole on
// a deep-blue card — so the dimensions matter for the correct aspect ratio.
const BRANCH_IMAGES = [
  { src: "/Taniyama_branch.png", w: 1266, h: 503 },
  { src: "/shimoaratabranch.png", w: 1185, h: 503 },
  // RaJA 病児保育園 — sick-child daycare at the Shimoarata location.
  // Interior room photo, center-cropped to the same 1185×503 frame as the
  // other branch cards so all three rows read uniform.
  { src: "/shimoarata_byouji.png", w: 1185, h: 503 },
];

export function Preschool() {
  const t = useT();
  const p = t.panels.preschool;
  const branches = p.branches.map((b, i) => ({
    ...b,
    img: BRANCH_IMAGES[i].src,
    w: BRANCH_IMAGES[i].w,
    h: BRANCH_IMAGES[i].h,
  }));
  return (
    <PanelShell
      id="preschool"
      index={2}
      href={p.href}
      label={p.label}
      title={p.title}
      subtitle={p.subtitle}
      ages={p.ages}
      description={p.description}
      // The RaJA Method crest heads the copy column as the section's mark.
      logo={{ src: "/preschool/preschool_logoo.png", w: 2682, h: 2682 }}
      logoLarge
      // Mobile: enlarge the crest to match the Study Abroad logo height
      // (~12.75rem ≈ 178px) so the section headers read uniform on phones.
      // Desktop clamp is preserved unchanged.
      logoSizeClassName="h-[clamp(8rem,15vw,24rem)] max-md:h-[12.75rem]"
      // The two campuses replace the generic trust pillars — the photos
      // carry the "why" now. Pillar copy stays in i18n for reference.
      campusesLabel={p.campusesLabel}
      branches={branches}
      // Auto-playing photo slideshow embedded below the campus cards.
      extra={<PreschoolGallery />}
      // Image on the left, copy on the right — the redesign brief.
      reverse
      // Let the child photo span the full height of the section.
      bleedVisual
      // Mobile only: the child photo moves BELOW the intro copy (after the
      // description) as a clean boxed photo, instead of bleeding above it.
      mobileVisual={<PreschoolPhoto />}
      // Brand peach (#ff9a6b) — the warm Preschool token. Against
      // the cool ocean it frames the child and complements the
      // teal shirt, where the old sun-yellow read flatter.
      accent="var(--color-peach)"
      // Ocean blue — the exact #00aeef of the preschool.svg card
      // fading through its #3f6eb6 wave tone into the deep #005baa
      // horizon. Clouds, ripples, waves and rising bubbles in
      // <PreschoolBackdrop /> complete the feel of "the classroom
      // by the sea".
      background="linear-gradient(180deg, #b8e8fa 0%, #4bc6ef 45%, #00aeef 75%, #005baa 100%)"
      // Deep navy ink — high contrast against the cyan sky,
      // maintains the children's-book legibility.
      ink="#0e1b3c"
      // Peach reads too faint as text on the cyan, so the subtitle
      // takes the navy ink for legibility; peach stays on the chip,
      // checkmarks and CTA where it has the contrast to pop.
      subtitleColor="#0e1b3c"
      visual={<PreschoolPhoto fullHeight />}
      backdrop={<PreschoolBackdrop />}
    />
  );
}
