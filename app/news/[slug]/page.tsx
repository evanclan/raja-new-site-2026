import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { ForGoodArticle } from "@/components/forgood/ForGoodArticle";
import { SetsumeikaiArticleSimple } from "@/components/setsumeikai/SetsumeikaiArticleSimple";

// Server-safe registry. The full localized copy lives in the i18n
// dictionary (client); this mirrors only what the server needs for
// routing + SEO metadata.
const ARTICLES = {
  // Japanese-only announcement — title/description stay Japanese for SEO
  // (the audience is Japanese-speaking parents in Kagoshima).
  "nyuen-setsumeikai-2027": {
    title:
      "【2027年度】入園説明会を開催します｜8月29日（土）｜鹿児島のインターナショナルスクール RaJA Global Academy",
    description:
      "鹿児島のインターナショナルプリスクールRaJA Global Academyが2027年度入園説明会を開催。2026年8月29日（土）10:30／13:30の2部制。IB PYP候補校の探究型の学びと園での一日をご紹介します。",
    image: "/setsumeikai-2027/01-hero-flyer.jpg",
  },
  "ib-pyp-candidate": {
    title:
      "RaJA Global Academy is an IB Primary Years Programme candidate school",
    description:
      "RaJA Global Academy is a candidate school for the IB Primary Years Programme (PYP), working toward authorization as an IB World School.",
    image: "/academy/raja_ib_article.jpg",
  },
  "forgood-ib-campaign": {
    title:
      "From Kagoshima to the World — RaJA Global Academy's IB crowdfunding campaign",
    description:
      "RaJA Global Academy's For Good crowdfunding campaign to become an International Baccalaureate (IB) PYP certified school has ended — thank you to everyone who supported us.",
    image: "/forgood/thank-you.jpg",
  },
} as const;

// Slugs that render a bespoke article component instead of the generic
// ArticleView (which is shaped around the IB candidate article).
const CUSTOM_ARTICLES: Partial<Record<keyof typeof ARTICLES, () => React.ReactNode>> = {
  "forgood-ib-campaign": () => <ForGoodArticle />,
  // Simple announcement version (boss's request — details are presented
  // live at the event). The full guide is SetsumeikaiArticle.tsx; to
  // switch back, swap the import + this line.
  "nyuen-setsumeikai-2027": () => <SetsumeikaiArticleSimple />,
};

type Slug = keyof typeof ARTICLES;

// Exposed so app/sitemap.ts stays in sync with the article registry above —
// add an article to ARTICLES and it appears in the sitemap automatically.
export const NEWS_SLUGS = Object.keys(ARTICLES) as Slug[];

export function generateStaticParams() {
  return NEWS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLES[slug as Slug];
  if (!meta) return {};
  return {
    title: `${meta.title} — RaJA International`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [meta.image],
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in ARTICLES)) notFound();
  const custom = CUSTOM_ARTICLES[slug as Slug];
  // `article-frame` opts every article page (current + future) into the
  // 1440-capped reading layout: it freezes the fluid root scaler at its
  // 1440 value (so type/spacing stop growing on widescreen) and caps the
  // content shells at 1440px. See app/globals.css → "ARTICLE FRAME".
  return (
    <div className="article-frame">
      {custom ? custom() : <ArticleView slug={slug as Slug} />}
    </div>
  );
}
