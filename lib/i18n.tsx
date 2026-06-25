"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "ja";

// ---------------------------------------------------------------
// Dictionary
// Every piece of user-facing copy lives here, once per locale.
// ---------------------------------------------------------------
const DICTIONARY = {
  en: {
    meta: {
      title: "RaJA International — Global Education for Every Child",
      description:
        "RaJA International — study abroad programs, preschool, academy, creative lab, and English for every age.",
    },
    nav: {
      home: "Home",
      studyAbroad: "Study Abroad",
      academy: "Academy",
      preschool: "Preschool",
      clab: "Clab",
      english: "English",
      news: "News",
      contact: "Contact",
      cta: "Get in touch",
      homeAria: "RaJA International home",
    },
    preloader: {
      mark: "Ra·JA",
    },
    hero: {
      overline: "A global family of learning · Since 2004",
      title: ["RaJA", "International"],
      tagline: "Connecting Japan and the world with radiance.",
      description:
        "Five learning environments. One borderless community. Curiosity, care, and global confidence — from infancy through study abroad.",
      contactCta: "Contact us",
      scroll: "Scroll",
      panels: {
        studyAbroad: "Kaeru Ryugaku",
        academy: "RaJA Academy",
        preschool: "RaJA Preschool",
        clab: "Clab + Education",
        english: "Let's Go English",
      },
    },
    intro: {
      eyebrow: "An introduction",
      // The Japanese ink phrase (SVG) is the hero; this renders as a
      // small caption beneath it so EN readers get the meaning.
      lead: "When we say “international school” …",
      srLead: "When we say international school…",
      answer: "… we mean RaJA.",
      caption: "Press play — see what we mean",
    },
    panels: {
      studyAbroad: {
        label: "Kaeru Ryugaku",
        title: "See the world. Come home changed.",
        subtitle: "Study abroad, re-imagined.",
        ages: "Teens & Young Adults",
        description:
          "A curated global exchange program pairing students with host communities across four continents. Language immersion, mentored projects, and the courage to belong anywhere.",
      },
      academy: {
        label: "RaJA Academy",
        kicker: "Commencement · Class of 2026",
        // Authored line breaks — the headline is set in three short
        // lines so the ma (negative space) reads, never browser-wrapped.
        title: ["A Gift", "from Nature."],
        // Age folded into the subtitle (no standalone pill).
        subtitle: "An English-immersion academy · ages 3–6.",
        body: "A real cap-and-gown milestone that says: you can belong anywhere.",
        cta: "Visit the Academy",
        // Shared EN/JA — the engraved seal caption reads the same in both.
        dateStamp: "2026.3 · RaJA 卒園式",
        photoAlt:
          "Two RaJA Academy graduates in navy cap and gown, laughing together at their 卒園式 commencement.",
        ibLabel: "IB PYP Candidate School",
        ibAlt:
          "RaJA Co., Ltd. — a candidate school for the International Baccalaureate Primary Years Programme.",
      },
      preschool: {
        label: "RaJA International Preschool",
        title: "To a Wider,\nBrighter Future",
        subtitle: "Gentle care for ages 0 – 2.",
        ages: "Ages 0 – 2",
        description:
          "What makes RaJA International Preschool special is its richly international, wonderfully diverse environment. Learning joyfully through play, children build the foundation to grow as individuals with a true international spirit.",
        imageAlt:
          "A smiling preschool child resting their chin on their hands.",
        pillars: [
          { t: "Predictable routines", d: "Days that feel safe and known." },
          { t: "Loving caregivers", d: "Warm, consistent grown-ups." },
          { t: "Sensory-rich spaces", d: "Made for little hands, big wonder." },
        ],
        // The two physical preschool campuses, surfaced as photo rows
        // in place of the trust pillars. `sub` carries the name in the
        // *other* script (kanji here, romaji in JA) so each locale shows
        // its primary reading with the secondary underneath.
        campusesLabel: "Our two campuses",
        branches: [
          {
            name: "Taniyama Campus",
            sub: "谷山キャンパス",
            line: "A bright, welcoming first home.",
            alt: "RaJA Preschool Taniyama Base — 〒891-0141 Taniyama-chuo 7-27-3, Kagoshima City. TEL 099-204-9851. Standard childcare.",
          },
          {
            name: "Shimo Arata Campus",
            sub: "下荒田キャンパス",
            line: "Where the littlest days begin.",
            alt: "RaJA Preschool Shimoarata — 〒890-0056 Shimo Arata 1-38-32-1, Kagoshima City. TEL 099-204-9149. Standard & sick-child childcare.",
          },
        ],
      },
      clab: {
        label: "Clab + Education",
        kicker: "Carat — a gem's brilliance",
        // Authored line breaks so the headline keeps its "ma" and never
        // browser-wraps mid-phrase. Rendered as stacked lines, like academy.
        title: ["Curiosity,", "cut into brilliance."],
        lede: "Money literacy, SDGs, geography and the world — many lessons, completed in one place. C-Lab turns a child's restless curiosity into real skill.",
        ages: "Preschool – Lower Elementary · Kagoshima",
        instructorLabel: "Instructor",
        cta: "Learn more",
        programs: [
          {
            key: "swimming",
            name: "Swimming",
            desc:
              "English lesson included! Learn English and sport together, the fun way. A private bus runs from the Koraimachi school to Jells Sports Club, where children first warm up with the English teacher through songs, conversation and games, then get gentle swim coaching. Weaving in simple English builds their focus, comprehension and confidence.",
            instructor: "Michael",
            chip: "English included",
            photoAlt: "Children swimming in the indoor pool at Jells Sports Club.",
          },
          {
            key: "music",
            name: "Music · Piano",
            desc:
              "We use the hugely popular American piano method “Piano Adventure” to make learning music fun. Group lessons spark a friendly synergy among the children that sharpens their expression — and, in time, we hope to nurture real artistry on top of that.",
            instructor: "Yoko Obara",
            chip: "Piano Adventure",
            photoAlt: "A child learning the piano beside their teacher.",
          },
          {
            key: "rit",
            name: "RIT",
            desc:
              "RaJA's right-brain method for Japanese (国語) — rare for a preschool international school to teach. By stimulating the five senses and combining two or more at once (“multisensory learning”), the brain processes information more efficiently and memory takes hold, building the Japanese children need before they start elementary school.",
            instructor: "Tomo",
            chip: "Right-brain · 国語",
            photoAlt:
              "A teacher showing picture cards to children in the RIT classroom.",
          },
          {
            key: "programming",
            name: "Programming",
            desc:
              "Learn alongside Dash the robot! Because code is “English,” we teach it in English — and with a beginner course, you can start from zero. Using a tablet, the robot moves right in front of you, linking each word to its motion (sound paired with sight) so it all clicks, easily and joyfully.",
            instructor: "Shawn",
            chip: "English × Code",
            photoAlt: "The WonderCode Dash robot used in the programming class.",
          },
          {
            key: "abacus",
            name: "Abacus & more",
            desc: "Abacus and more — many lessons, all completed in one place.",
            instructor: "",
            chip: "and more",
            photoAlt: "",
          },
        ],
      },
      english: {
        label: "Let's Go English",
        title: ["English you'll", "actually use."],
        tagline: "From “studying” English — to living it.",
        description:
          "RaJA's English conversation school in Kagoshima. Native and bilingual teachers, lessons that are genuinely fun and easy to follow — from a child's first words to grown-up fluency.",
        heroAlt:
          "The Let's Go English director hands an Eiken certificate to a delighted young student.",
        logoAlt: "Let's Go English — RaJA English conversation school",
        teachersKicker: "The people who make it click",
        teachers: [
          { name: "Chris", role: "Native teacher", bubble: "Hello!" },
          { name: "Erika", role: "Bilingual teacher", bubble: "一緒にね！" },
          { name: "Miwa", role: "Bilingual teacher", bubble: "Let's go!" },
          { name: "Maita", role: "Native teacher", bubble: "Nice to meet you!" },
        ],
        agesKicker: "Every age, every level",
        ages: ["Toddlers", "Elementary", "Jr & High", "Adults"],
        studyAbroad: "then study abroad",
        points: [
          "Native + bilingual teachers",
          "Small, lively classes",
          "Official Eiken Jr. venue",
        ],
        eikenBadge: "Official Eiken Jr. Test Venue",
        cta: "Book a free trial",
        ctaNote: "Kagoshima · first lesson free",
        directorWord: "“I want every child to discover that English is fun.”",
        directorName: "School Director",
        directorAlt: "The Let's Go English director wearing a green frog hat.",
      },
      learnMore: "Learn more",
    },
    news: {
      kicker: "Latest News",
      titleA: "Stories from",
      titleB: "our global family.",
      allArticles: "All articles",
      posts: [
        {
          date: "Apr 18 2026",
          category: "Kaeru Ryugaku",
          title: "Spring cohort arrives in Auckland",
          excerpt:
            "Our newest study-abroad group begins their 12-week immersion with host families across the North Island.",
        },
        {
          date: "Apr 04 2026",
          category: "RaJA Academy",
          title: "Gardens-to-table week starts Monday",
          excerpt:
            "Children will harvest, cook, and share from our rooftop vegetable beds in a five-day sensory program.",
        },
        {
          date: "Mar 22 2026",
          category: "Clab + Education",
          title: "Young inventors showcase their robots",
          excerpt:
            "Ten weeks of tinkering turned into thirty prototypes at this season's Clab Fair. Replay coming soon.",
        },
        {
          date: "Mar 09 2026",
          category: "RaJA English",
          title: "New conversation tables in Osaka",
          excerpt:
            "Weekly drop-in sessions for parents and caregivers launch this April — registration is open now.",
        },
      ],
    },
    inquiry: {
      kicker: "Inquiry & Admissions",
      titleA: "Let's begin",
      titleB: "something kind.",
      fields: {
        name: "Parent / Guardian name",
        namePh: "Your full name",
        email: "Email",
        emailPh: "you@family.com",
        program: "Interested program",
        message: "Message",
        messagePh: "Tell us about your child or what you're looking for…",
      },
      submit: "Send inquiry",
      programs: [
        "Kaeru Ryugaku",
        "RaJA Academy",
        "RaJA Preschool",
        "Clab + Education",
        "RaJA English",
      ],
      info: {
        hq: {
          title: "Headquarters",
          body: "40-39 Korai-cho\nKagoshima City, Kagoshima\nJAPAN 890-0051",
        },
        phone: {
          title: "Telephone",
          body: "TEL +81 99-204-7730\nFAX +81 99-204-7762",
        },
        email: {
          title: "Email",
          body: "info@raja-international.com",
        },
        company: {
          title: "Company",
          body: "RaJA Co., Ltd.\n株式会社RaJA\nRadiant Japan Association",
        },
      },
      copyright: "© 2026 株式会社RaJA (RaJA Co., Ltd.)\nAll rights reserved",
    },
    footer: {
      tagline: "Connecting Japan and the world with radiance.",
      blurb:
        "RaJA — Radiant Japan Association. World-standard education and childcare in Kagoshima, from infancy through study abroad.",
      brandsTitle: "Our family of brands",
      contactTitle: "Contact",
      brands: [
        {
          name: "Kaeru Ryugaku",
          desc: "Study abroad",
          href: "https://kaeruryugaku.com",
          color: "var(--color-sky)",
        },
        {
          name: "RaJA Preschool",
          desc: "Ages 0–6",
          href: "https://www.raja-preschool.com/",
          color: "var(--color-peach)",
        },
        {
          name: "RaJA Global Academy",
          desc: "RGACE",
          href: "https://www.rga-ce.com/",
          color: "var(--color-sun)",
        },
        {
          name: "C-Lab + Education",
          desc: "Skills lab",
          href: "https://raja-international.com/clab",
          color: "var(--color-leaf)",
        },
        {
          name: "RaJA English",
          desc: "Let's Go English",
          href: "https://www.raja-english.com/",
          color: "var(--color-berry)",
        },
      ],
      address: "40-39 Korai-cho, Kagoshima City,\nKagoshima, JAPAN 890-0051",
      tel: "+81 99-204-7730",
      fax: "+81 99-204-7762",
      email: "info@raja-international.com",
      mapLabel: "View on Google Maps",
      mapHref:
        "https://www.google.com/maps/search/?api=1&query=40-39+Korai-cho+Kagoshima-shi+Kagoshima",
      about: "About",
      aboutHref: "https://raja-international.com/home/about/",
      recruit: "Recruit",
      recruitHref: "https://raja-international.com/home/recruit/",
      backToTop: "Back to top",
      copyright: "© 2026 株式会社RaJA (RaJA Co., Ltd.) · All rights reserved.",
    },
  },
  ja: {
    meta: {
      title: "RaJA International — すべての子どもに世界への扉を",
      description:
        "RaJA International 留学プログラム、プリスクール、アカデミー、クリエイティブラボ、英語教室。あらゆる年齢のために。",
    },
    nav: {
      home: "ホーム",
      studyAbroad: "留学",
      academy: "アカデミー",
      preschool: "プリスクール",
      clab: "Clab",
      english: "英語",
      news: "ニュース",
      contact: "お問い合わせ",
      cta: "お問い合わせ",
      homeAria: "RaJA International ホーム",
    },
    preloader: {
      mark: "Ra·JA",
    },
    hero: {
      overline: "世界とつながる学びの家族 · 2004年より",
      title: ["RaJA", "インターナショナル"],
      tagline: "日本と世界を輝きで繋ぐ企業",
      description:
        "5つの学びの場。ひとつの、境界のないコミュニティ。乳児期から留学まで — 好奇心、あたたかさ、そして世界で生きる自信を。",
      contactCta: "お問い合わせ",
      scroll: "スクロール",
      panels: {
        studyAbroad: "かえる留学",
        academy: "RaJA アカデミー",
        preschool: "RaJA プリスクール",
        clab: "Clab ＋ 教育",
        english: "Let's Go English",
      },
    },
    intro: {
      eyebrow: "はじめに",
      lead: "「インターナショナルスクール」と言えば …",
      srLead: "「インターナショナルスクール」と言えば…",
      answer: "… そう、RaJA。",
      caption: "再生して、その答えを",
    },
    panels: {
      studyAbroad: {
        label: "かえる留学",
        title: "世界を見て、\n変わって帰ろう。",
        subtitle: "あたらしいカタチの留学。",
        ages: "ティーン ＆ 若者",
        description:
          "4大陸のホストコミュニティと学生をつなぐ、厳選されたグローバル交換プログラム。語学漬けの毎日、メンターと取り組むプロジェクト、そして「どこでも自分の居場所にできる」勇気を。",
      },
      academy: {
        label: "RaJA アカデミー",
        kicker: "卒園おめでとう · 2026年度",
        // 「環境の / プレゼント」— broken before the key noun so CJK never
        // wraps mid-word. Set tate-gaki (vertical) on desktop, or these two
        // lines stacked on mobile / short panels.
        title: ["環境の", "プレゼント"],
        subtitle: "英語でまなぶ、こども国際教養施設。3〜6歳。",
        // RaJA の実際のタグライン。
        body: "愛するこどもたちへ、言語環境のプレゼントを。",
        cta: "アカデミーを見る",
        dateStamp: "2026.3 · RaJA 卒園式",
        photoAlt:
          "紺色のキャップとガウンに身を包み、卒園式で笑い合う RaJA アカデミーの卒園児ふたり。",
        ibLabel: "国際バカロレア PYP 候補校",
        ibAlt:
          "RaJA Co., Ltd. ／ 国際バカロレア（IB）PYP 候補校のロゴ。",
      },
      preschool: {
        label: "RaJA International Preschool",
        title: "より広く、\nより輝ける未来へ。",
        subtitle: "0〜2歳の、やさしく寄りそう保育。",
        ages: "0 〜 2 歳",
        description:
          "ラジャ・インターナショナル保育園は、国際色豊かで多様性に富む環境が魅力です。遊びの中で楽しく学び、こどもたちが ひとりの人として、真の国際性を築いていくための土台作りをしています。",
        imageAlt: "頬づえをついて笑う、プリスクールの子ども。",
        pillars: [
          { t: "安心のリズム", d: "毎日が、見通せて心地よい。" },
          { t: "温かい保育者", d: "いつも、そばにいる大人。" },
          { t: "五感を育む空間", d: "小さな手と、大きな好奇心のために。" },
        ],
        campusesLabel: "ふたつの園",
        branches: [
          {
            name: "谷山キャンパス",
            sub: "Taniyama",
            line: "明るく、あたたかい、はじめのおうち。",
            alt: "RaJA プリスクール 谷山キャンパス。〒891-0141 鹿児島市谷山中央7丁目27-3、TEL 099-204-9851、通常保育。",
          },
          {
            name: "下荒田キャンパス",
            sub: "Shimo Arata",
            line: "いちばん小さな毎日が、ここから。",
            alt: "RaJA プリスクール 下荒田キャンパス。〒890-0056 鹿児島市下荒田1-38-32-1、TEL 099-204-9149、通常保育・病児保育。",
          },
        ],
      },
      clab: {
        label: "Clab ＋ 教育",
        kicker: "カラット — 宝石のかがやき",
        title: ["好奇心を、", "かがやきへ。"],
        lede: "金融教育・SDGs・地理・世界。数々の習い事が、ひとつの場所で完結。飽くなき探究心を、たしかなスキルへ変えていきます。",
        ages: "未就学児 〜 小学校低学年 · 鹿児島",
        instructorLabel: "講師",
        cta: "詳しく見る",
        programs: [
          {
            key: "swimming",
            name: "水泳",
            desc:
              "＼えいごレッスン付き！／ 英語とスポーツを楽しく一度に。高麗町のスクールから専用バスでジェルスポーツクラブへ移動し、まずは英語の先生と歌・会話・ゲームで自然に英語にふれたあと、水泳の先生がやさしく指導します。英語での簡単なやりとりを交えたレッスンが、子どもたちの集中力・理解力・自信を育てるきっかけになります。",
            instructor: "Michael",
            chip: "英語つき",
            photoAlt: "ジェルスポーツクラブの室内プールで泳ぐ子どもたち。",
          },
          {
            key: "music",
            name: "ミュージック",
            desc:
              "アメリカで大人気のピアノメソッド「Piano Adventure」を採用し、楽しく音楽を学んでいきます。グループレッスンではお友達との相乗効果が生まれ、表現力に磨きがかかります。その延長線上で、芸術性も高めていければと考えています。",
            instructor: "Yoko Obara",
            chip: "ピアノ・アドベンチャー",
            photoAlt: "先生と一緒にピアノを学ぶ子ども。",
          },
          {
            key: "rit",
            name: "能力開発「RIT」",
            desc:
              "RaJA式 右脳教育による「国語（日本語）」教育。未就学児のインターでは珍しく国語の時間を設けています。「覚える」と書くように五感を効果的に刺激し、2つ以上の感覚を組み合わせる『多感覚学習』で、脳が情報を効率よく処理し記憶に定着。小学生に進級するまでに身につけたい日本語を育みます。",
            instructor: "Tomo",
            chip: "右脳 · 国語",
            photoAlt: "RIT のクラスで子どもたちにカードを見せる先生。",
          },
          {
            key: "programming",
            name: "プログラミング",
            desc:
              "ROBOTのダッシュと一緒に学ぼう！ コーディングは「英語」なので、えいごで指導します。初級コースがあるので、英語ゼロからでも安心です。タブレットを使うと目の前でロボットが動き、使う単語とロボットの動きがリンク（聴覚と視覚がセット）するから、分かりやすく楽しく身につきます。",
            instructor: "Shawn",
            chip: "英語×プログラミング",
            photoAlt: "プログラミング教室で使う WonderCode の Dash ロボット。",
          },
          {
            key: "abacus",
            name: "そろばん ほか",
            desc: "そろばん、ほか。数々の習い事が、ひとつの場所で完結します。",
            instructor: "",
            chip: "ほか",
            photoAlt: "",
          },
        ],
      },
      english: {
        label: "Let's Go English",
        title: ["楽しく、", "使える英語。"],
        tagline: "「勉強する」から「使える自分」へ。",
        description:
          "鹿児島の RaJA 英会話スクール。ネイティブとバイリンガルの講師が、はじめての一語から大人の流暢さまで、楽しく分かりやすいレッスンをお届けします。",
        heroAlt: "英検の合格証を手渡された生徒が、校長先生と喜び合う様子。",
        logoAlt: "Let's Go English ／ RaJA 英会話スクール",
        teachersKicker: "「楽しい」をつくる先生たち",
        teachers: [
          { name: "Chris", role: "ネイティブ講師", bubble: "Hello!" },
          { name: "Erika", role: "バイリンガル講師", bubble: "一緒にね！" },
          { name: "Miwa", role: "バイリンガル講師", bubble: "Let's go!" },
          { name: "Maita", role: "ネイティブ講師", bubble: "Nice to meet you!" },
        ],
        agesKicker: "幼児から大人まで",
        ages: ["幼児", "小学生", "中・高生", "大人"],
        studyAbroad: "そして、留学へ",
        points: ["ネイティブ＋バイリンガル", "少人数制クラス", "英検 Jr. 公式会場"],
        eikenBadge: "英検 Jr. 公式会場",
        cta: "無料体験レッスン",
        ctaNote: "鹿児島市 ・ 体験レッスン無料",
        directorWord: "「英語って楽しい、をすべての子へ。」",
        directorName: "校長",
        directorAlt: "緑のカエルの帽子をかぶった Let's Go English の校長先生。",
      },
      learnMore: "詳しく見る",
    },
    news: {
      kicker: "最新ニュース",
      titleA: "世界中の",
      titleB: "RaJAファミリーから。",
      allArticles: "すべての記事",
      posts: [
        {
          date: "2026年4月18日",
          category: "かえる留学",
          title: "春期コーホート、オークランドに到着",
          excerpt:
            "最新の留学グループが北島各地のホストファミリー宅で12週間のイマージョンをスタートします。",
        },
        {
          date: "2026年4月4日",
          category: "RaJA アカデミー",
          title: "「畑から食卓へ」ウィーク、月曜開始",
          excerpt:
            "子どもたちは屋上の菜園で収穫・調理・共有を行う5日間の五感プログラムに参加します。",
        },
        {
          date: "2026年3月22日",
          category: "Clab ＋ 教育",
          title: "若き発明家たちがロボットを発表",
          excerpt:
            "10週間のものづくりが30のプロトタイプに。今季の Clab フェア、リプレイは近日公開。",
        },
        {
          date: "2026年3月9日",
          category: "RaJA 英語",
          title: "大阪で新しい会話テーブルがスタート",
          excerpt:
            "保護者・保育者向けの週次ドロップインセッションを4月に開講。ご登録を受付中です。",
        },
      ],
    },
    inquiry: {
      kicker: "お問い合わせ ・ 入学案内",
      titleA: "やさしい",
      titleB: "はじまりを、ご一緒に。",
      fields: {
        name: "保護者のお名前",
        namePh: "お名前をご記入ください",
        email: "メールアドレス",
        emailPh: "you@family.com",
        program: "ご関心のあるプログラム",
        message: "メッセージ",
        messagePh: "お子さまのこと、ご希望など、お気軽にお書きください…",
      },
      submit: "送信する",
      programs: [
        "かえる留学",
        "RaJA アカデミー",
        "RaJA プリスクール",
        "Clab ＋ 教育",
        "RaJA 英語",
      ],
      info: {
        hq: {
          title: "本社",
          body: "〒890-0051\n鹿児島県鹿児島市高麗町40-39",
        },
        phone: {
          title: "お電話",
          body: "TEL 099-204-7730\nFAX 099-204-7762",
        },
        email: {
          title: "メール",
          body: "info@raja-international.com",
        },
        company: {
          title: "会社",
          body: "株式会社RaJA\nRaJA Co., Ltd.",
        },
      },
      copyright: "© 2026 株式会社RaJA（RaJA Co., Ltd.）\nAll rights reserved",
    },
    footer: {
      tagline: "日本と世界を輝きで繋ぐ企業",
      blurb:
        "RaJA（Radiant Japan Association）。鹿児島から、乳幼児期から留学まで、世界基準の教育と保育を。",
      brandsTitle: "RaJA ファミリー",
      contactTitle: "お問い合わせ先",
      brands: [
        {
          name: "かえる留学",
          desc: "留学サポート",
          href: "https://kaeruryugaku.com",
          color: "var(--color-sky)",
        },
        {
          name: "RaJA プリスクール",
          desc: "0〜6歳",
          href: "https://www.raja-preschool.com/",
          color: "var(--color-peach)",
        },
        {
          name: "RaJA グローバルアカデミー",
          desc: "RGACE",
          href: "https://www.rga-ce.com/",
          color: "var(--color-sun)",
        },
        {
          name: "C-Lab ＋ 教育",
          desc: "習い事ラボ",
          href: "https://raja-international.com/clab",
          color: "var(--color-leaf)",
        },
        {
          name: "RaJA 英語",
          desc: "Let's Go English",
          href: "https://www.raja-english.com/",
          color: "var(--color-berry)",
        },
      ],
      address: "〒890-0051\n鹿児島県鹿児島市高麗町40-39",
      tel: "099-204-7730",
      fax: "099-204-7762",
      email: "info@raja-international.com",
      mapLabel: "Google マップで見る",
      mapHref:
        "https://www.google.com/maps/search/?api=1&query=40-39+Korai-cho+Kagoshima-shi+Kagoshima",
      about: "会社案内",
      aboutHref: "https://raja-international.com/home/about/",
      recruit: "採用情報",
      recruitHref: "https://raja-international.com/home/recruit/",
      backToTop: "トップへ戻る",
      copyright: "© 2026 株式会社RaJA（RaJA Co., Ltd.）· All rights reserved.",
    },
  },
} as const;

export type Dictionary = (typeof DICTIONARY)[Locale];

// ---------------------------------------------------------------
// Context
// ---------------------------------------------------------------
type I18nContext = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
};

const Ctx = createContext<I18nContext | null>(null);

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Convenience hook: just the dictionary. */
export function useT(): Dictionary {
  return useI18n().t;
}

// ---------------------------------------------------------------
// Provider
// ---------------------------------------------------------------
const STORAGE_KEY = "raja.locale";

export function LanguageProvider({
  children,
  defaultLocale = "en",
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Hydrate from localStorage / browser preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "en" || stored === "ja") {
        setLocaleState(stored);
        return;
      }
      const browser = navigator.language.toLowerCase();
      if (browser.startsWith("ja")) setLocaleState("ja");
    } catch {
      // ignore
    }
  }, []);

  // Reflect in <html lang>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => setLocale(locale === "en" ? "ja" : "en");

  const value = useMemo<I18nContext>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: DICTIONARY[locale],
    }),
    [locale]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
