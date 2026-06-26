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
    campaignBadge: {
      label: "Campaign live",
      aria: "RaJA Global Academy crowdfunding campaign is live — read more",
      dismiss: "Dismiss campaign notice",
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
        href: "https://www.kaeruryugaku.com",
        title: "See the world. Come home changed.",
        subtitle: "Study abroad, re-imagined.",
        ages: "Teens & Young Adults",
        description:
          "At Ryugaku Support Kagoshima, we draw out the study abroad path that fits your goals through conversation, building a plan that's uniquely yours, together. The world is your campus. We support a study abroad experience that shines brighter through a life lived off the beaten track.",
      },
      academy: {
        label: "RaJA Global Academy",
        href: "https://www.rga-ce.com",
        kicker: "Commencement · Class of 2026",
        // Authored line breaks — the headline is set in three short
        // lines so the ma (negative space) reads, never browser-wrapped.
        title: ["A Gift", "from Nature."],
        // Age folded into the subtitle (no standalone pill).
        subtitle: "An English-immersion academy · ages 3–5.",
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
        href: "https://www.raja-preschool.com",
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
        campusesLabel: "Our campuses & facilities",
        branches: [
          {
            name: "Taniyama Campus",
            sub: "谷山キャンパス",
            line: "A bright, welcoming first home.",
            addr: "〒891-0141 Taniyama-chuo 7-27-3, Kagoshima City",
            tel: "099-204-9851",
            hours: "Standard childcare",
            alt: "RaJA Preschool Taniyama Base — 〒891-0141 Taniyama-chuo 7-27-3, Kagoshima City. TEL 099-204-9851. Standard childcare.",
          },
          {
            name: "Shimo Arata Campus",
            sub: "下荒田キャンパス",
            line: "Where the littlest days begin.",
            addr: "〒890-0056 Shimo Arata 1-38-32-1, Kagoshima City",
            tel: "099-204-9149",
            hours: "Standard & sick-child childcare",
            alt: "RaJA Preschool Shimoarata — 〒890-0056 Shimo Arata 1-38-32-1, Kagoshima City. TEL 099-204-9149. Standard & sick-child childcare.",
          },
          {
            name: "RaJA Sick-Child Daycare",
            sub: "病児保育園 · Shimoarata",
            line: "Gentle care for days they can't go to class.",
            addr: "〒890-0056 Shimo Arata 1-38-32-1, Kagoshima City",
            tel: "099-204-9149",
            hours: "Sick-child childcare · reservation required",
            alt: "RaJA Sick-Child Daycare (Byoji Hoiku) at the Shimoarata location — 〒890-0056 Shimo Arata 1-38-32-1, Kagoshima City. TEL 099-204-9149. Sick-child childcare, reservation required.",
          },
        ],
      },
      clab: {
        label: "Clab + Education",
        href: "#inquiry",
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
        href: "https://www.raja-english.com",
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
          slug: "forgood-ib-campaign",
          date: "Jun 25 2026",
          category: "Crowdfunding",
          title: "From Kagoshima to the world — our IB crowdfunding campaign is live",
          excerpt:
            "A bid to become Kagoshima's first International Baccalaureate (IB) PYP certified school. Goal ¥5,000,000, now running on For Good.",
        },
        {
          slug: "ib-pyp-candidate",
          date: "Mar 12 2026",
          category: "International Baccalaureate",
          title: "RaJA Global Academy named an IB PYP candidate school",
          excerpt:
            "RaJA Global Academy is a candidate school for the IB Primary Years Programme, working toward authorization as an IB World School.",
        },
      ],
    },
    articles: {
      "ib-pyp-candidate": {
        date: "March 12, 2026",
        publishedLabel: "Published",
        category: "International Baccalaureate",
        title: "RaJA Global Academy is an IB Primary Years Programme candidate school",
        excerpt:
          "RaJA Global Academy is a candidate school for the IB Primary Years Programme (PYP), working toward authorization as an IB World School.",
        hero: {
          src: "/academy/raja_ib_article.jpg",
          alt: "The IB Primary Years Programme — children learning together with a teacher.",
        },
        intro:
          "RaJA Global Academy is a candidate school for the International Baccalaureate (IB) Primary Years Programme (PYP). The school is pursuing authorization as an IB World School.",
        body: [
          "IB World Schools share a common philosophy — a commitment to high-quality, challenging international education. RaJA believes this kind of education is important for our children.",
          "Only schools authorized by the IB Organization can offer any of its four programmes: the Primary Years Programme (PYP), the Middle Years Programme (MYP), the Diploma Programme (DP), and the Career-related Programme (CP). Candidate status gives no guarantee that authorization will be granted.",
        ],
        programmesTitle: "The four IB programmes",
        programmes: [
          { code: "PYP", name: "Primary Years Programme" },
          { code: "MYP", name: "Middle Years Programme" },
          { code: "DP", name: "Diploma Programme" },
          { code: "CP", name: "Career-related Programme" },
        ],
        note: "* Candidate status is the period during which a school is working toward authorization. This status does not guarantee that authorization will be granted.",
        moreText: "For further information about the IB and its programmes, please visit",
        link: { label: "www.ibo.org", href: "https://www.ibo.org" },
        backLabel: "Back to all news",
      },
      "forgood-ib-campaign": {
        date: "June 25, 2026",
        publishedLabel: "Published",
        category: "Crowdfunding",
        title: "From Kagoshima to the World — our IB certification campaign",
        excerpt:
          "A crowdfunding campaign to become Kagoshima's first International Baccalaureate (IB) PYP certified school. Goal ¥5,000,000, live on For Good.",
        hero: {
          src: "/forgood/key-visual.png",
          alt: "Campaign key visual — From Kagoshima to the World: a challenge to become an IB certified school.",
        },
        intro:
          "A bid to become Kagoshima's first International Baccalaureate (IB) PYP certified school. We're crowdfunding to bring a world-standard education to the children of this city.",
        body: [
          "RaJA Co., Ltd. cultivates the power to think, to express, and to live through RaJA STREAM — our original method — delivering a true international education that widens children's options 10 and 20 years into the future.",
          "Our goal is ¥5,000,000. Through For Good (0% listing fee, operated by Borderless Japan), every yen you give goes toward building the learning environment needed for IB certification.",
        ],
        programmesTitle: "Project highlights",
        programmes: [
          { code: "IB", name: "A bid for PYP IB certification" },
          { code: "Ask", name: "An environment that grows children who think and act" },
          { code: "Fly", name: "For children ready to take flight from Kagoshima" },
        ],
        note: "* Supporter fee: ¥220 + 5% processing, which lets the organizer receive 100% of the funds. Reward delivery is planned for November 2026.",
        moreText: "For full details and to back the project, please visit the For Good project page:",
        link: { label: "for-good.net/project/1003662", href: "https://for-good.net/project/1003662" },
        backLabel: "Back to all news",
      },
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
      sending: "Sending…",
      sent: "Thank you — your inquiry has been sent. We'll be in touch soon.",
      errorMsg: "Sorry, something went wrong. Please try again or email us directly.",
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
          href: "https://www.kaeruryugaku.com",
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
          href: "/#inquiry",
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
    campaignBadge: {
      label: "募集中",
      aria: "RaJA グローバルアカデミーのクラウドファンディング募集中 — 詳しく見る",
      dismiss: "キャンペーン表示を閉じる",
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
        href: "https://www.kaeruryugaku.com",
        title: "世界を見て、\n変わって帰ろう。",
        subtitle: "あたらしいカタチの留学。",
        ages: "ティーン ＆ 若者",
        description:
          "留学サポート鹿児島では、お客様の目的・目標に応じた留学の在り方を対話の中から引き出し、自分だけの留学プランを一緒に作り上げていきます。学びのキャンパスは世界！レールに乗らない人生の選択で、輝きを増す留学をサポートさせていただきます。",
      },
      academy: {
        label: "RaJA Global Academy",
        href: "https://www.rga-ce.com",
        kicker: "卒園おめでとう · 2026年度",
        // 「環境の / プレゼント」— broken before the key noun so CJK never
        // wraps mid-word. Set tate-gaki (vertical) on desktop, or these two
        // lines stacked on mobile / short panels.
        title: ["環境の", "プレゼント"],
        subtitle: "英語でまなぶ、\nこども国際教養施設。\n3〜5歳。",
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
        href: "https://www.raja-preschool.com",
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
        campusesLabel: "園と施設",
        branches: [
          {
            name: "谷山キャンパス",
            sub: "Taniyama",
            line: "明るく、あたたかい、はじめのおうち。",
            addr: "〒891-0141 鹿児島市谷山中央7丁目27-3",
            tel: "099-204-9851",
            hours: "通常保育",
            alt: "RaJA プリスクール 谷山キャンパス。〒891-0141 鹿児島市谷山中央7丁目27-3、TEL 099-204-9851、通常保育。",
          },
          {
            name: "下荒田キャンパス",
            sub: "Shimo Arata",
            line: "いちばん小さな毎日が、ここから。",
            addr: "〒890-0056 鹿児島市下荒田1-38-32-1",
            tel: "099-204-9149",
            hours: "通常保育・病児保育",
            alt: "RaJA プリスクール 下荒田キャンパス。〒890-0056 鹿児島市下荒田1-38-32-1、TEL 099-204-9149、通常保育・病児保育。",
          },
          {
            name: "RaJA病児保育園",
            sub: "下荒田",
            line: "登園できない日も、やさしく見守ります。",
            addr: "〒890-0056 鹿児島市下荒田1-38-32-1",
            tel: "099-204-9149",
            hours: "病児保育・要予約",
            alt: "RaJA病児保育園（下荒田）。〒890-0056 鹿児島市下荒田1-38-32-1、TEL 099-204-9149、病児保育・要予約。",
          },
        ],
      },
      clab: {
        label: "Clab ＋ 教育",
        href: "#inquiry",
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
        href: "https://www.raja-english.com",
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
          slug: "forgood-ib-campaign",
          date: "2026年6月25日",
          category: "クラウドファンディング",
          title: "鹿児島から世界へ — IB 認定校へのクラウドファンディング始動",
          excerpt:
            "鹿児島初の国際バカロレア（IB）PYP 認定校をめざして。目標 ¥5,000,000 のクラウドファンディングを For Good で実施中です。",
        },
        {
          slug: "ib-pyp-candidate",
          date: "2026年3月12日",
          category: "国際バカロレア",
          title: "RaJA GLOBAL ACADEMY、国際バカロレア（IB）PYP 候補校に",
          excerpt:
            "RaJA GLOBAL ACADEMY は国際バカロレア（IB）初等教育プログラム（PYP）の候補校として、IB ワールドスクールの認定取得を目指しています。",
        },
      ],
    },
    articles: {
      "ib-pyp-candidate": {
        date: "2026年3月12日",
        publishedLabel: "公開日",
        category: "国際バカロレア",
        title: "RaJA GLOBAL ACADEMY は国際バカロレア（IB）PYP の候補校です",
        excerpt:
          "RaJA GLOBAL ACADEMY は国際バカロレア（IB）初等教育プログラム（PYP）の候補校として、IB ワールドスクールの認定取得を目指しています。",
        hero: {
          src: "/academy/raja_ib_article.jpg",
          alt: "国際バカロレア 初等教育プログラム（PYP）— 先生とともに学ぶ子どもたち。",
        },
        intro:
          "RaJA GLOBAL ACADEMY は、国際バカロレア（IB）の初等教育プログラム（Primary Years Programme：PYP）の「候補校」です。本校は IB ワールドスクールとしての認定取得を目指しています。",
        body: [
          "IB ワールドスクールには、質の高い挑戦的な国際教育を提供するという共通の理念があります。RaJA は、この教育こそが子どもたちにとって大切だと考えています。",
          "IB の認定を受けた学校だけが、4つの IB プログラム — 初等教育プログラム（PYP）、中等教育プログラム（MYP）、ディプロマプログラム（DP）、キャリア関連プログラム（CP）— を提供することができます。なお、候補校であることは、認定が確約されたものではありません。",
        ],
        programmesTitle: "4つの IB プログラム",
        programmes: [
          { code: "PYP", name: "初等教育プログラム" },
          { code: "MYP", name: "中等教育プログラム" },
          { code: "DP", name: "ディプロマプログラム" },
          { code: "CP", name: "キャリア関連プログラム" },
        ],
        note: "※ 候補校とは、認定取得に向けた手続きを進めている学校を指します。この地位は、認定が確約されたものではありません。",
        moreText: "国際バカロレア（IB）および各プログラムの詳細については、以下をご覧ください。",
        link: { label: "www.ibo.org", href: "https://www.ibo.org" },
        backLabel: "ニュース一覧へ戻る",
      },
      "forgood-ib-campaign": {
        date: "2026年6月25日",
        publishedLabel: "公開日",
        category: "クラウドファンディング",
        title: "鹿児島から世界へ — 国際バカロレア認定校への挑戦",
        excerpt:
          "鹿児島初の国際バカロレア（IB）PYP 認定校をめざすクラウドファンディング。目標 ¥5,000,000、For Good で実施中です。",
        hero: {
          src: "/forgood/key-visual.png",
          alt: "キービジュアル — 鹿児島から世界へ！ 国際バカロレア認定校への挑戦。",
        },
        intro:
          "鹿児島初となる国際バカロレア（IB）PYP 認定校へ。世界基準の教育をこの街の子どもたちに届けるため、クラウドファンディングを実施しています。",
        body: [
          "株式会社RaJA は、独自メソッド RaJA STREAM で「考える力・伝える力・生きる力」を育み、10年後・20年後の未来の選択肢を広げる真の国際教育を提供しています。",
          "目標金額は ¥5,000,000。掲載手数料0%の For Good（株式会社ボーダレス・ジャパン運営）を通じて、いただいたご支援は認定校に向けた教育環境の整備に活用されます。",
        ],
        programmesTitle: "プロジェクトのポイント",
        programmes: [
          { code: "IB", name: "PYP 国際バカロレア認定校への挑戦" },
          { code: "考", name: "自ら考え、行動する力を育む環境づくり" },
          { code: "世", name: "鹿児島から世界へ羽ばたく子どもたちへ" },
        ],
        note: "※ 支援者負担：220円＋決済手数料5%。この仕組みにより、実行者が支援金を全額受け取れます。リターンのお届けは2026年11月予定です。",
        moreText: "プロジェクトの詳細・ご支援は、For Good のプロジェクトページをご覧ください。",
        link: { label: "for-good.net/project/1003662", href: "https://for-good.net/project/1003662" },
        backLabel: "ニュース一覧へ戻る",
      },
    },
    inquiry: {
      kicker: "お問い合わせ ・ 入学案内",
      titleA: "やさしい",
      titleB: "はじまりを、\nご一緒に。",
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
      sending: "送信中…",
      sent: "お問い合わせありがとうございます。担当者より追ってご連絡いたします。",
      errorMsg: "送信に失敗しました。お手数ですが再度お試しいただくか、直接メールをお送りください。",
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
          href: "https://www.kaeruryugaku.com",
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
          href: "/#inquiry",
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
