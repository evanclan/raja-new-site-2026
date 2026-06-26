import type { Metadata } from "next";
import { Fredoka, Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { CampaignBadge } from "@/components/CampaignBadge";
import { LoadingProvider } from "@/components/LoadingProvider";
import { LanguageProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RaJA International — すべての子どもに世界への扉を",
  description:
    "RaJA International 留学プログラム、プリスクール、アカデミー、クリエイティブラボ、英語教室。あらゆる年齢のために。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${fredoka.variable} ${notoJp.variable} h-full`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-ink)]">
        <LanguageProvider defaultLocale="ja">
          <LoadingProvider>
            <Preloader />
            <SmoothScrollProvider>
              <Nav />
              <main>{children}</main>
              <CampaignBadge />
            </SmoothScrollProvider>
          </LoadingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
