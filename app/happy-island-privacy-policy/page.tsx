import type { Metadata } from "next";
import { HappyIslandPrivacy } from "@/components/HappyIslandPrivacy";

const TITLE = "Happy Island Privacy Policy — RaJA International";
const DESCRIPTION =
  "Privacy policy for Happy Island, the RaJA school management and communication app for international schools and preschools in Japan. Happy Island（ハッピーアイランド）アプリのプライバシーポリシー。";

// App-store listings link to the absolute URL, so keep it explicit rather
// than relying on a metadataBase the rest of the site doesn't set.
const URL = `${
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://raja-international.com"
}/happy-island-privacy-policy`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "article",
  },
};

export default function HappyIslandPrivacyPolicyPage() {
  // Reuses the article reading frame (1440-capped, frozen root scaler) —
  // see app/globals.css → "ARTICLE FRAME".
  return (
    <div className="article-frame">
      <HappyIslandPrivacy />
    </div>
  );
}
