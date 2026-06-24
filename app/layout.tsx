import type { Metadata } from "next";
import { Fredoka, Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
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
  title: "RaJA International — Global Education for Every Child",
  description:
    "RaJA International — study abroad programs, preschool, academy, creative lab, and English for every age. A global family of learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fredoka.variable} ${notoJp.variable} h-full`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-ink)]">
        <LanguageProvider>
          <LoadingProvider>
            <Preloader />
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
