import type { MetadataRoute } from "next";
import { NEWS_SLUGS } from "./news/[slug]/page";

// Canonical production origin. Override per-environment with NEXT_PUBLIC_SITE_URL.
const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://raja-international.com";

// Static date keeps this route cacheable and deterministic. Bump on big changes.
const LAST_MODIFIED = "2026-06-26";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...NEWS_SLUGS.map((slug) => ({
      url: `${BASE}/news/${slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
