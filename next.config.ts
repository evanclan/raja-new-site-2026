import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 requires a quality allowlist; 85 is used for the
    // Academy graduation portrait, 75 is the default elsewhere.
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
