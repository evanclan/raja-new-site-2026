import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let proxy.ts handle legacy trailing-slash URLs in ONE 301 hop instead of
  // Next first 308-ing "/foo/" -> "/foo" and then the proxy redirecting again.
  skipTrailingSlashRedirect: true,
  images: {
    // Next.js 16 requires a quality allowlist; 85 is used for the
    // Academy graduation portrait, 75 is the default elsewhere.
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
