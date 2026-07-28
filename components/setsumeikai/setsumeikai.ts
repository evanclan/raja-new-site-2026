// ─────────────────────────────────────────────────────────────
// 2027年度 入園説明会 — article content model
//
// Single source of truth for the AY2027 admissions information session
// announcement (/news/nyuen-setsumeikai-2027). The article body is
// intentionally Japanese-only — the audience is Japanese-speaking
// parents in Kagoshima — so strings here are plain, not Bi.
// Facts (date, times, address, TEL) come from the school's official
// flyer/Instagram announcement. Anything not confirmed by the school
// is marked with a TODO in the component, never invented.
// ─────────────────────────────────────────────────────────────

export const EVENT = {
  slug: "nyuen-setsumeikai-2027",
  name: "RaJA Global Academy 2027年度 入園説明会",
  dateLabel: "2026年8月29日（土）",
  slots: ["① 10:30〜11:30", "② 13:30〜14:30"],
  audience: "2027年度 新年少・年中・年長のお子さまと保護者さま",
  venue: "RaJA Global Academy（〒890-0051 鹿児島県鹿児島市高麗町40-39）",
  apply: "公式サイトのフォーム、または案内チラシのQRコードから",
  tel: "099-204-7730",
  officialSite: "https://www.rga-ce.com/",
  searchHint: "「かごしま ラジャ」で検索",
} as const;

export const META = {
  category: "お知らせ",
  publishedLabel: "公開日",
  date: "2026年7月28日",
  backLabel: "ニュース一覧へ戻る",
} as const;

export const HERO = {
  // 01-hero-flyer doubles as the OG image + News card; per the image
  // manifest it appears here only, never again in the body.
  src: "/setsumeikai-2027/01-hero-flyer.jpg",
  alt: "RaJA Global Academy 2027年度入園説明会の告知バナー。2026年8月29日（土）10:30-11:30／13:30-14:30開催。卒園ガウンと角帽を身につけて笑い合う園児2名",
  title: "2027年度 入園説明会",
  subtitleLines: [
    "鹿児島のインターナショナルスクール",
    "RaJA Global Academy",
    "2026年8月29日（土）",
  ],
} as const;

// Body images — alt text is copied verbatim from the school's manifest.
// All are 1:1 squares; width/height are set in the component for CLS.
export const IMG = {
  friends: {
    src: "/setsumeikai-2027/10-friends-uniform.jpg",
    alt: "紺色のポロシャツの制服姿で肩を寄せ合い、笑顔でピースサインをする園児2名",
  },
  phonics: {
    src: "/setsumeikai-2027/04-phonics-support.jpg",
    alt: "フォニックスのワークシートで「Ss」の文字を書く園児を、そばで見守り支える先生たち",
  },
  harvest: {
    src: "/setsumeikai-2027/09-outdoor-harvest.jpg",
    alt: "帽子と軍手を身につけ、畑で野菜の収穫に取り組む園児。園外での体験から学ぶRaJA Global Academyの活動",
    caption: "畑での収穫体験。実際の世界にふれることから、学びが始まります。",
  },
  pypLogo: {
    src: "/setsumeikai-2027/02-ib-pyp-logo-cubes.jpg",
    alt: "国際バカロレア（IB）プライマリー・イヤーズ・プログラムのロゴと、色とりどりのブロックを手に取って観察するRaJA Global Academyの園児3名",
    caption: "PYPの学びの中心にあるのは、子ども自身の「知りたい」という気持ちです。",
  },
  bigbook: {
    src: "/setsumeikai-2027/03-group-inquiry-bigbook.jpg",
    alt: "大型絵本を囲んで指をさしながら話し合う園児たちと先生。問いから学びが広がるRaJA Global Academyの探究の時間",
    caption: "絵本のページを囲んで、「どう思う？」と問いが行き交う時間。",
  },
  outdoor: {
    src: "/setsumeikai-2027/08-outdoor-play.jpg",
    alt: "人工芝の園庭でボールを手に笑顔を見せる園児と、思い思いに外遊びを楽しむ子どもたち",
  },
  binoculars: {
    src: "/setsumeikai-2027/11-joyful-curiosity.jpg",
    alt: "両手で双眼鏡をつくって遊ぶ園児。日々の何気ない瞬間にも好奇心があふれる園の様子",
  },
  qr: {
    src: "/setsumeikai-2027/12-qr-reservation.jpg",
    alt: "入園説明会のご予約用QRコード。「ご予約はこちらから」と書かれた案内画像",
  },
} as const;

export const LEAD = [
  "「わが子に、どんな環境を用意してあげられるだろう」——園選びは、親にとって最初の大きな選択のひとつです。",
  "鹿児島のインターナショナルスクール「RaJA Global Academy」では、2027年度の入園をご検討中のご家庭を対象に、入園説明会を2026年8月29日（土）に開催します。",
  "時間は ① 10:30〜11:30 ／ ② 13:30〜14:30 の2部制で、どちらの回も内容は同じです。",
  "この記事では、開催概要にくわえて、説明会でお答えする「3つの疑問」を少しだけ先取りしてご紹介します。",
] as const;

export const OVERVIEW_NOTE =
  "①②とも内容は同じです。ご都合のよい回をお選びください。参加費などの詳細は、園までお問い合わせください。";

export const QUESTIONS = {
  intro:
    "はじめてインターナショナルスクールを検討するとき、多くの保護者さまが同じ疑問をお持ちになります。説明会では、次の3つの問いに、園の様子とあわせて丁寧にお答えします。",
  items: [
    "英語で学ぶ環境って、どんなところ？",
    "子どもたちは、どのように成長するの？",
    "IB Primary Years Programme（PYP）の教育とは？",
  ],
  outro: "ここからは、それぞれの内容を記事でも少しだけご紹介します。",
} as const;

export const SEC_ENGLISH = {
  heading: "英語で学ぶ環境って、どんなところ？",
  p1: "RaJA Global Academy（RGA・3〜5歳対象）の一日は、英語の「授業」で区切られているわけではありません。朝のあいさつも、遊びも、おやつの時間も、一日の生活そのものが英語で流れていく、オールイングリッシュのイマージョン（英語で生活する環境）のスクールです。",
  p2: "海外に行かなくても、毎日の暮らしの中で自然に英語にふれて育つ——私たちはこの環境を「国内留学」と呼んでいます。",
  p3: "「日本語の発達に影響はない？」「英語がはじめてでも大丈夫？」というご心配は、説明会でも多くいただく質問です。ご家庭では日本語で豊かに過ごしながら、園では英語で生活する。入園時に英語の経験がないお子さまも、一人ひとりのペースで環境に慣れていけるよう、先生たちがそばで見守り、支えることを大切にしています。気になることは、当日どうぞ率直にお尋ねください。",
} as const;

export const SEC_GROWTH = {
  heading: "子どもたちは、どのように成長していくの？",
  p1: "RaJAにとって、英語は目的ではなく、世界とつながるための手段です。その先で育てたいのは、自分で考える力、伝えようとする姿勢、多様な文化へのしなやかなまなざし、そして「じぶんでできた」という小さな自信の積み重ねです。",
  p2: "学びの場は教室の中だけではありません。園庭での外遊びや、畑での野菜の収穫など、からだ全体を使った実体験も大切にしています。",
  p3: "タグライン「NURTURING FUTURE LEADERS, CREATING A BETTER WORLD.」のもと、0〜2歳のプリスクール、3〜5歳のRGA、小学生のためのアフタースクール C-Lab、プログラミング・音楽・スイミングなどの +Edu へと、成長に合わせて続いていく学びの道すじをご用意しています。",
  programsLink: { label: "プログラムの紹介はこちら", href: "/#academy" },
} as const;

export const SEC_PYP = {
  heading: "IB Primary Years Programme（PYP）の教育とは？",
  p1: "RaJA Global Academyは、国際バカロレア（IB）PYP候補校として、認定に向けた探究型の学びを実践しています。PYP（Primary Years Programme）は3〜12歳を対象とするIBの初等教育プログラムで、教科の枠を越えた「インクワイアリー（探究）」を学びの中心に置いています。",
  p2: "探究といっても、むずかしいことではありません。たとえば「なぜ雨はふるの？」という子どものひとことから、空を眺め、絵に描き、友だちや先生と話し合ってみる——そんな、問いから始まる学びの積み重ねです（※特定のカリキュラムの内容ではなく、幼児期の探究のイメージです）。",
  p3: "IBが掲げる「学習者像（Learner Profile）」には、探究する人・考える人・挑戦する人といった姿が並びます。RaJAは、その土台となる「自ら学び続ける力」を、幼児期から育てることを目指しています。",
  // IB candidate-school disclaimer — required verbatim by the school.
  disclaimer:
    "※RaJA Global Academyは国際バカロレア（IB）プライマリー・イヤーズ・プログラム（PYP）の候補校です。候補校とは、IB認定に向けた手続きを進めている学校であり、IBワールドスクールとして認定されることを保証するものではありません。",
} as const;

export const SEC_DAY = {
  heading: "説明会当日の流れ",
  p1: "当日は、アカデミーの教育方針やカリキュラム、園での一日の様子をご紹介し、保護者さまからのご質問にもお答えします。くわしいタイムテーブルについては、園までお気軽にお問い合わせください。",
} as const;

export const SEC_JOIN = {
  heading: "ご参加をお考えの方へ",
  items: [
    "事前申込制です。公式サイトのフォーム、または案内チラシのQRコードからお申し込みください。",
    "① 10:30〜11:30 と ② 13:30〜14:30 は同じ内容です。ご都合のよい回をお選びください。",
    "参加費・駐車場・きょうだいやお子さまとのご参加・所要時間については、園までお問い合わせください。",
  ],
} as const;

export const SEC_APPLY = {
  heading: "お申し込み",
  recap: "2027年度 入園説明会｜2026年8月29日（土）① 10:30〜11:30 ／ ② 13:30〜14:30",
  ctaLabel: "お申し込み・お問い合わせフォームへ",
  ctaHref: "/#inquiry",
  telNote: "お電話でのお問い合わせ：",
  siteNote: "公式サイトは「かごしま ラジャ」で検索：",
  qrNote: "印刷された案内をご利用の方は、こちらのQRコードからもお申し込みいただけます。",
} as const;

export const CLOSING = [
  "お子さまの未来につながる学びの入り口を、ぜひ園の空気の中で確かめてみてください。",
  "教職員一同、皆さまにお会いできることを楽しみにお待ちしております。",
] as const;

// schema.org EducationEvent — rendered as JSON-LD by the article component.
export const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: "RaJA Global Academy 2027年度 入園説明会",
  startDate: "2026-08-29T10:30+09:00",
  endDate: "2026-08-29T14:30+09:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "RaJA Global Academy",
    address: {
      "@type": "PostalAddress",
      streetAddress: "高麗町40-39",
      addressLocality: "鹿児島市",
      addressRegion: "鹿児島県",
      postalCode: "890-0051",
      addressCountry: "JP",
    },
  },
  organizer: {
    "@type": "EducationalOrganization",
    name: "RaJA Global Academy",
    url: "https://www.rga-ce.com/",
    telephone: "+81-99-204-7730",
  },
  description:
    "2027年度入園をご検討中のご家庭を対象とした入園説明会。教育方針、カリキュラム、IB PYPの学び、園での生活をご紹介します。",
  audience: { "@type": "Audience", audienceType: "2027年度 新年少・年中・年長の保護者" },
} as const;

// ─────────────────────────────────────────────────────────────
// SIMPLE variant — the announcement-only version requested by the
// school (details are given live at the event). Copy mirrors the
// official Instagram caption; the cinematic hero is shared with the
// full article. Rendered by SetsumeikaiArticleSimple.tsx.
// ─────────────────────────────────────────────────────────────

export const SIMPLE = {
  intro:
    "RaJA Global Academyでは、2027年度入園をご検討中のご家庭を対象に、入園説明会を開催いたします。（対象2027年度　新年少・年中・年長）",
  questions: [
    "英語で学ぶ環境ってどんなところ？",
    "子どもたちはどのように成長するの？",
    "IB Primary Years Programme（PYP）の教育とは？",
  ],
  p1: "アカデミーの教育方針やカリキュラム、園での生活について詳しくご紹介します。",
  p2: "お子さまの未来につながる学びを、ぜひこの機会にご体感ください。",
  rows: [
    { k: "開催日", v: ["2026年8月29日（土）"] },
    { k: "時間", v: ["① 10:30〜11:30", "② 13:30〜14:30"] },
    { k: "対象", v: ["年少・年中・年長"] },
  ],
  applyNote:
    "ご参加をご希望の方は、QRコードのフォームよりお気軽にお問い合わせください。",
  ctaLabel: "お問い合わせフォームへ",
  searchLead: "ホームページは",
  searchTerm: "かごしま ラジャ",
  searchTail: "で検索",
  closing: "皆さまのご参加を心よりお待ちしております",
} as const;

// Photos 05–07 weren't placed in either article body; they join the
// gallery marquee below. Alt text is verbatim from the school's manifest.
export const IMG_EXTRA = {
  portfolio: {
    src: "/setsumeikai-2027/05-portfolio-kindness.jpg",
    alt: "自分たちの活動をまとめたポートフォリオを見ながら、learner profileの「Kindness」について振り返る園児たち",
  },
  crown: {
    src: "/setsumeikai-2027/06-creative-blocks-crown.jpg",
    alt: "ブロックで作った王冠と大きな花を身につけ、得意げな表情を見せる園児",
  },
  blocks: {
    src: "/setsumeikai-2027/07-block-play.jpg",
    alt: "大きなカラーブロックを積み上げて、友だちと一緒に遊びをつくり出す園児たち",
  },
} as const;

// Marquee running order — alternates close-up/group and indoor/outdoor
// so the strip reads with rhythm. All 10 school photos (02–11).
export const GALLERY_STRIP = [
  IMG.friends,      // 10 制服の2人
  IMG.phonics,      // 04 フォニックス
  IMG.outdoor,      // 08 園庭
  IMG.bigbook,      // 03 大型絵本
  IMG_EXTRA.crown,  // 06 ブロックの王冠
  IMG.harvest,      // 09 畑の収穫
  IMG_EXTRA.portfolio, // 05 ポートフォリオ
  IMG_EXTRA.blocks, // 07 大型ブロック
  IMG.binoculars,   // 11 手作り双眼鏡
  IMG.pypLogo,      // 02 IB PYPロゴ
] as const;
