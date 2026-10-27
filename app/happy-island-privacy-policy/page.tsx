import type { Metadata } from "next";
import { HappyIslandPrivacy } from "@/components/HappyIslandPrivacy";

const TITLE = "Happy Island Privacy Policy — RaJA International";
const DESCRIPTION =
  "Privacy policy for Happy Island, the RaJA school management and communication app for international schools and preschools in Japan. Happy Island（ハッピーアイランド）アプリのプライバシーポリシー。";

// App-store listings link to the absolute URL, so keep it spelled out here
// rather than resolved from the layout's metadataBase.
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
