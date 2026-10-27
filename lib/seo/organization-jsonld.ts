// schema.org Organization for the group hub. This is the node every brand
// site points at with `parentOrganization: { "@id": ORG_ID }`, so the @id
// must never change. Each brand keeps its own address, phone and hours on
// its own site (matching its Google Business Profile); here they appear
// only as a name, a URL and, where the brand site defines one, its @id.

// Canonical production origin (non-www). Override per-environment with
// NEXT_PUBLIC_SITE_URL, the same variable sitemap.ts and robots.ts read.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://raja-international.com";

export const ORG_ID = "https://raja-international.com/#org";

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "株式会社RaJA",
  alternateName: ["RaJA International", "RaJA Co., Ltd."],
  url: "https://raja-international.com/",
  logo: "https://raja-international.com/hero-main/RaJA-Logo.svg",
  slogan: "空より広く、海より深く、太陽よりあたたかい。",
  email: "info@raja-international.com",
  telephone: "+81-99-204-7730",
  faxNumber: "+81-99-204-7762",
  address: {
    "@type": "PostalAddress",
    postalCode: "890-0051",
    addressRegion: "鹿児島県",
    addressLocality: "鹿児島市",
    streetAddress: "高麗町40-39",
    addressCountry: "JP",
  },
  // Journey order: sky (0–2) → sea (3–5, with C-Lab and +Education) → land.
  subOrganization: [
    {
      "@type": "ChildCare",
      name: "ラジャ・インターナショナル保育園",
      url: "https://www.raja-preschool.com/",
    },
    {
      "@type": "Preschool",
      "@id": "https://www.rga-ce.com/#school",
      name: "RaJA Global Academy",
      url: "https://www.rga-ce.com/",
      // Let's Go English! is one of +Education's lessons, run inside the Academy.
      subOrganization: {
        "@type": "EducationalOrganization",
        name: "Let's Go English!（RaJA 英会話スクール）",
        url: "https://www.raja-english.com/",
      },
    },
    {
      "@type": "Organization",
      name: "かえる留学",
      url: "https://www.raja-r.com/",
    },
  ],
} as const;
