import type { Metadata } from "next";
import { Fredoka, Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { RoutePreloader } from "@/components/RoutePreloader";
import { Nav } from "@/components/Nav";
import { LoadingProvider } from "@/components/LoadingProvider";
import { LanguageProvider } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo/organization-jsonld";

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

const TITLE = "RaJA International（株式会社RaJA）｜鹿児島 0歳から留学まで";
const DESCRIPTION =
  "空より広く、海より深く、太陽よりあたたかい。鹿児島の株式会社RaJAは、0〜2歳の保育園、3〜5歳のインターナショナルスクール RaJA Global Academy（C-Lab・+Education）、そしてかえる留学まで、子どもの成長に寄り添います。";

// metadataBase lets each page declare its canonical as a path. Pages set
// their own `alternates.canonical`; the layout sets none, so a page that
// forgets can't inherit the homepage's.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "RaJA International",
    locale: "ja_JP",
    type: "website",
  },
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
            <RoutePreloader />
            <SmoothScrollProvider>
              <Nav />
              <main>{children}</main>
            </SmoothScrollProvider>
          </LoadingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
