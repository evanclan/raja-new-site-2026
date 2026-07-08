// ─────────────────────────────────────────────────────────────
// For Good crowdfunding campaign — content model
//
// Single source of truth for the RaJA Global Academy IB PYP campaign
// (For Good project #1003662). Every string carries both scripts so the
// page can mirror the rest of the site's EN/JA locale switch. Figures are
// kept as plain numbers so the funding card can format + compute from them.
// ─────────────────────────────────────────────────────────────

export type Bi = { ja: string; en: string };

export const PROJECT = {
  id: "1003662",
  url: "https://for-good.net/project/1003662",
  profileUrl: "https://for-good.net/profile/226937",
  instagram: "https://www.instagram.com/raja.globalacademy",
  website: "https://raja-international.com",
  goal: 5_000_000,
  raised: 0,
  supporters: 0,
  launch: "2026-06-25",
  deliver: "2026-11-01",
  platform: { ja: "For Good（掲載手数料0%／ボーダレス・ジャパン）", en: "For Good (0% listing fee · Borderless Japan)" },
  feeNote: {
    ja: "支援者負担：220円＋決済手数料5%",
    en: "Supporter fee: ¥220 + 5% payment processing",
  },
} as const;

export const ARTICLE_META = {
  slug: "forgood-ib-campaign",
  category: { ja: "クラウドファンディング", en: "Crowdfunding" },
  date: { ja: "2026年6月25日", en: "June 25, 2026" },
  publishedLabel: { ja: "公開日", en: "Published" },
  hero: {
    src: "/forgood/hero-classroom-group.png",
    alt: {
      ja: "ラジャグローバルアカデミーの先生と子どもたち。",
      en: "RaJA Global Academy teachers and children together.",
    },
  },
  // The official campaign key visual (the For Good banner) — featured as a
  // standalone poster so the project's own creative leads the page.
  keyVisual: {
    src: "/forgood/key-visual.png",
    alt: {
      ja: "「鹿児島から世界へ！ 国際バカロレア認定校への挑戦」キービジュアル。",
      en: "Campaign key visual — “From Kagoshima to the World: a challenge to become an IB certified school.”",
    },
  },
  backLabel: { ja: "ニュース一覧へ戻る", en: "Back to all news" },
} as const;

export type GalleryShot = { src: string; alt: Bi };

export const GALLERY: ReadonlyArray<GalleryShot> = [
  {
    src: "/forgood/gallery-learning-moment.png",
    alt: { ja: "先生と一緒に学ぶ子どもたち。", en: "Children learning alongside their teachers." },
  },
  {
    src: "/forgood/gallery-presentation.png",
    alt: { ja: "自分の作品を発表する園児。", en: "A child presenting their work to the class." },
  },
  {
    src: "/forgood/gallery-counting-cubes.png",
    alt: { ja: "教具を使って学ぶ子どもたち。", en: "Children learning with hands-on manipulatives." },
  },
];

export const HERO = {
  status: { ja: "公開前", en: "Pre-launch" },
  kicker: { ja: "クラウドファンディング実施中", en: "Crowdfunding campaign" },
  title: { ja: "鹿児島から、世界へ。", en: "From Kagoshima, to the world." },
  subtitle: {
    ja: "ラジャグローバルアカデミー「国際バカロレア」認定校への挑戦",
    en: "RaJA Global Academy's challenge to become an International Baccalaureate certified school",
  },
  lead: {
    ja: "鹿児島初となる国際バカロレア（IB）PYP認定校へ。世界基準の教育を、この街の子どもたちに。未来の選択肢を広げるこの挑戦を、あなたの力で支えてください。",
    en: "A bid to become Kagoshima's first International Baccalaureate (IB) PYP certified school — bringing a world-standard education to the children of this city. Help us widen what their future can hold.",
  },
} as const;

export const POINTS: ReadonlyArray<{ icon: string; t: Bi; d: Bi; color: string; img: string; imgAlt: Bi }> = [
  {
    icon: "globe",
    color: "var(--color-sky)",
    img: "/forgood/point-inquiry-lesson.png",
    imgAlt: { ja: "「サツマイモはどう育つ？」探究の授業。", en: "An inquiry lesson — “How do sweet potatoes grow?”" },
    t: { ja: "国際バカロレア（IB）PYPへの挑戦", en: "A bid for IB PYP certification" },
    d: {
      ja: "鹿児島初となるPYP国際バカロレア認定校をめざし、世界基準の探究型カリキュラムを導入します。",
      en: "Aiming to be Kagoshima's first PYP-certified school, introducing a world-standard inquiry-based curriculum.",
    },
  },
  {
    icon: "spark",
    color: "var(--color-sun)",
    img: "/forgood/point-math-blocks.png",
    imgAlt: { ja: "教具を手に学ぶ子どもたち。", en: "Children learning hands-on with manipulatives." },
    t: { ja: "「自ら考え、行動する力」を育む", en: "Nurturing children who think and act for themselves" },
    d: {
      ja: "認定校に向けて、子どもたち一人ひとりが自ら問いを立て、考え、行動できる教育環境を整備します。",
      en: "Building an environment where every child learns to raise their own questions, think them through, and act.",
    },
  },
  {
    icon: "wings",
    color: "var(--color-peach)",
    img: "/forgood/point-child-writing.png",
    imgAlt: { ja: "机に向かって集中して取り組む園児。", en: "A child focused on their work at the desk." },
    t: { ja: "鹿児島から世界へ羽ばたく子どもたちへ", en: "For children ready to take flight" },
    d: {
      ja: "10年後、20年後の未来の選択肢を広げる、真の国際教育。可能性を広げるチャレンジです。",
      en: "True international education that widens their options 10, 20 years from now — a challenge to expand what's possible.",
    },
  },
];

export const MESSAGE = {
  label: { ja: "実行者からのメッセージ", en: "Message from the organizer" },
  body: {
    ja: "株式会社RaJAは、留学支援やインターナショナルスクールを軸に、世界水準のグローバル教育を展開する企業です。「考える力・伝える力・生きる力」を培う独自のメソッド RaJA STREAM で、10年後・20年後の未来の選択肢を広げる、真の国際教育を提供しています。",
    en: "RaJA Co., Ltd. delivers world-standard global education built around study-abroad support and international schooling. Through RaJA STREAM — our original method for cultivating the power to think, to express, and to live — we offer a true international education that widens children's options 10 and 20 years into the future.",
  },
} as const;

export const OVERVIEW: ReadonlyArray<{ k: Bi; v: Bi }> = [
  { k: { ja: "実行者", en: "Organizer" }, v: { ja: "RaJA Global Academy（株式会社RaJA）", en: "RaJA Global Academy (RaJA Co., Ltd.)" } },
  { k: { ja: "カテゴリー", en: "Category" }, v: { ja: "子ども・教育", en: "Children / Education" } },
  { k: { ja: "地域", en: "Region" }, v: { ja: "鹿児島県", en: "Kagoshima, Japan" } },
  { k: { ja: "目標金額", en: "Goal" }, v: { ja: "¥5,000,000", en: "¥5,000,000" } },
  { k: { ja: "公開日", en: "Launch date" }, v: { ja: "2026年6月25日", en: "June 25, 2026" } },
  { k: { ja: "プロジェクトID", en: "Project ID" }, v: { ja: "1003662", en: "1003662" } },
];

export const FOUNDER = {
  label: { ja: "代表プロフィール", en: "About the founder" },
  photo: {
    src: "/forgood/founder-salliee.png",
    alt: {
      ja: "株式会社RaJA 代表取締役CEO 福島 紗矢香（Salliee）。",
      en: "Sayaka “Salliee” Fukushima, Founder & CEO of RaJA Co., Ltd.",
    },
  },
  name: { ja: "福島 紗矢香 Salliee", en: "Sayaka “Salliee” Fukushima" },
  role: { ja: "株式会社RaJA 代表取締役CEO ／ 熊本県人吉市出身", en: "Founder & CEO, RaJA Co., Ltd. · from Hitoyoshi, Kumamoto" },
  bio: {
    ja: "14歳で単身渡米。ハーバード大学教育学部大学院にて、幼保教育に関するコースを修了。企業主導型保育園２園、インターナショナルスクール、英語学童、カルチャースクール、留学支援事業を展開し、３法人を経営。子どもから大人まで一貫した学びを提供する複合型教育モデルを構築しています。",
    en: "Moved to the U.S. alone at 14 and completed a graduate program at the Harvard Graduate School of Education. She runs three companies spanning two corporate-led nurseries, an international school, an after-school English program, a culture school, and study-abroad services — an integrated model of learning from childhood through adulthood.",
  },
  highlights: [
    { ja: "ハーバード大学教育学部大学院　幼保教育に関するコース　修了", en: "Harvard Graduate School of Education" },
    { ja: "0歳児からのインターナショナル教育", en: "International education from age 0" },
    { ja: "第1回かごしまキラリ大賞 優秀賞（2025）", en: "Kagoshima Kirari Award, Excellence Prize (2025)" },
  ] as ReadonlyArray<Bi>,
  hq: { ja: "本社：鹿児島市高麗町40-39", en: "HQ: 40-39 Kōraichō, Kagoshima City" },
} as const;

export type Reward = {
  amount: number;
  title: Bi;
  tag: Bi;
  contents: ReadonlyArray<Bi>;
  blurb: Bi;
  featured?: boolean;
};

export const REWARDS: ReadonlyArray<Reward> = [
  {
    amount: 15_000,
    title: { ja: "応援サポーター", en: "Cheering Supporter" },
    tag: { ja: "Cheering Supporter", en: "応援サポーター" },
    contents: [
      { ja: "子どもたちからのお礼のメッセージカード", en: "Thank-you message card from the children" },
      { ja: "公式ホームページへのお名前・社名掲載", en: "Your name / company on the official website" },
      { ja: "校内サポーターボードへの掲載", en: "Your name on the in-school supporter board" },
    ],
    blurb: {
      ja: "アカデミーに通う子どもたちが一人ひとり心を込めて作る、世界に一つだけのメッセージカードをお届けします。",
      en: "A one-of-a-kind message card, handmade with care by each child at the academy.",
    },
  },
  {
    amount: 30_000,
    title: { ja: "世界への架け橋サポーター", en: "Bridge to the World Supporter" },
    tag: { ja: "Bridge to the World", en: "架け橋" },
    contents: [
      { ja: "子どもたちからのお礼のメッセージカード", en: "Thank-you message card from the children" },
      { ja: "公式ホームページへのお名前・社名掲載", en: "Your name / company on the official website" },
      { ja: "校内サポーターボードへの掲載", en: "Your name on the in-school supporter board" },
    ],
    blurb: {
      ja: "未来の教育づくりに賛同してくださった証として、ホームページと校内ボードにお名前を掲載します。",
      en: "Your name on the website and the in-school board, as proof you backed the education of the future.",
    },
  },
  {
    amount: 50_000,
    featured: true,
    title: { ja: "グローバルドリームサポーター", en: "Global Dream Supporter" },
    tag: { ja: "人気 · Original goods", en: "人気 · オリジナルグッズ付き" },
    contents: [
      { ja: "お礼のメッセージカード／お名前掲載", en: "Thank-you card · name on website + board" },
      { ja: "オリジナルトートバッグ（IBデザイン）", en: "Original tote bag (IB-framework design)" },
    ],
    blurb: {
      ja: "子どもたちがIBのフレームワークで生み出した、世界に一つのオリジナルデザインのトートバッグをお届け。「鹿児島から世界へ」を共に支えた証です。",
      en: "A one-of-a-kind tote bag designed by the children through the IB framework — your proof of backing 'from Kagoshima to the world.'",
    },
  },
  {
    amount: 100_000,
    title: { ja: "次世代リーダー育成パートナー", en: "Next-Generation Leader Partner" },
    tag: { ja: "+ IB特別懇談会", en: "+ IB roundtable" },
    contents: [
      { ja: "お礼のカード／お名前掲載／オリジナルグッズ", en: "Card · name listing · original goods" },
      { ja: "IB特別懇談会 参加券（12月予定・本社）", en: "IB special roundtable ticket (Dec · HQ)" },
    ],
    blurb: {
      ja: "IBが重視する「自ら問いを立て、考え、行動する学び」がどう実践されているかを体感いただける貴重な機会です。",
      en: "A rare chance to experience first-hand how IB's 'raise your own questions, think, and act' learning comes to life.",
    },
  },
  {
    amount: 300_000,
    title: { ja: "鹿児島から世界へパートナー", en: "Kagoshima to the World Partner" },
    tag: { ja: "創設期パートナー", en: "Founding-era partner" },
    contents: [
      { ja: "お礼のカード／お名前掲載／オリジナルグッズ", en: "Card · name listing · original goods" },
      { ja: "校内サポーターボード掲載／IB特別懇談会 参加券", en: "Supporter board · IB roundtable ticket" },
    ],
    blurb: {
      ja: "創設期の挑戦を支えた特別なパートナーとして、子どもたちが日々目にする校内ボードにお名前を残します。",
      en: "As a special founding-era partner, your name lives on the board the children see every day.",
    },
  },
  {
    amount: 500_000,
    title: { ja: "創設メンバーパートナー", en: "Founding Member Partner" },
    tag: { ja: "創設メンバー", en: "Founding member" },
    contents: [
      { ja: "お礼のカード／お名前掲載／オリジナルグッズ", en: "Card · name listing · original goods" },
      { ja: "校内サポーターボード掲載／IB特別懇談会 参加券", en: "Supporter board · IB roundtable ticket" },
    ],
    blurb: {
      ja: "「多くの方々の支えによって学びの環境がつくられている」——そのメッセージを未来へ伝え続ける創設メンバー枠です。",
      en: "A founding-member tier that keeps telling the future: this place was built by the support of many.",
    },
  },
  {
    amount: 1_000_000,
    title: { ja: "プレミアムパートナー", en: "Premium Partner" },
    tag: { ja: "最高位 · Top tier", en: "最高位コース" },
    contents: [
      { ja: "RaJAオリジナルグッズ／オリジナルグッズ", en: "RaJA original goods · campaign goods" },
      { ja: "校内への特別お名前プレート設置", en: "Dedicated name plate installed in-school" },
      { ja: "特別懇談会ご招待券（お車代をご用意）", en: "Roundtable invitation (travel covered)" },
    ],
    blurb: {
      ja: "本プロジェクト最高位の支援コース。鹿児島初のPYP国際バカロレア認定校への挑戦を、創設メンバーとして共に支えていただく特別な枠です。",
      en: "The project's highest tier — a special place to back Kagoshima's first PYP IB school as a true founding member.",
    },
  },
];
