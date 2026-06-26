import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import { ForGoodArticle } from "@/components/forgood/ForGoodArticle";

// Server-safe registry. The full localized copy lives in the i18n
// dictionary (client); this mirrors only what the server needs for
// routing + SEO metadata.
const ARTICLES = {
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
      "Back RaJA Global Academy's For Good crowdfunding campaign — a bid to become Kagoshima's first International Baccalaureate (IB) PYP certified school. Goal ¥5,000,000.",
    image: "/forgood/key-visual.png",
  },
} as const;

// Slugs that render a bespoke article component instead of the generic
// ArticleView (which is shaped around the IB candidate article).
const CUSTOM_ARTICLES: Partial<Record<keyof typeof ARTICLES, () => React.ReactNode>> = {
  "forgood-ib-campaign": () => <ForGoodArticle />,
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
