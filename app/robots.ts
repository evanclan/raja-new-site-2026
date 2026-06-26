import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://raja-international.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal preview routes + API shouldn't be indexed.
      disallow: ["/api/", "/preview-clab", "/preview-english", "/preview-study-abroad"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
