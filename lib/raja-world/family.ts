// COPIED from ~/Claude Code/projects/raja-world/family.ts — edit it there, then copy it here again.
// RaJA World family: the one list of brands every RaJA site renders from
// (footers, "where next?", structured data). Copy this file into a site;
// don't import it across repos. Names here are canon — see RAJA-WORLD.md.

export type Element = 'sun' | 'sky' | 'sea' | 'land' | 'octopus'

type Bilingual = { ja: string; en: string }

export type Brand = {
  id: string
  element: Element
  /** Set when the brand lives inside another (C-Lab → Academy). */
  parent?: string
  name: Bilingual
  /** Short line shown under the name, e.g. in a footer. */
  desc: Bilingual
  ages: Bilingual
  /** Canonical URL. `null` = no site yet. */
  url: string | null
  /** Live URL while the target site hasn't switched over (rga-ce.com is still Jimdo). */
  liveUrl?: string
  /** schema.org @id, for brands whose site defines one. */
  jsonLdId?: string
}

export const PHILOSOPHY: Bilingual = {
  ja: '空より広く、海より深く、太陽よりあたたかい。',
  en: 'Wider than the sky, deeper than the sea, warmer than the sun.',
}

/** Endorsement line near each logo (rule 6). Wording not approved yet. */
export const ENDORSEMENT: Bilingual | null = null

export const ORG_ID = 'https://raja-international.com/#org'

// Journey order: sun, then sky → sea (and what lives inside it) → land → octopus.
export const FAMILY: readonly Brand[] = [
  {
    id: 'raja',
    element: 'sun',
    name: { ja: '株式会社RaJA', en: 'RaJA International' },
    desc: { ja: 'RaJA グループ', en: 'The RaJA group' },
    ages: { ja: 'すべての世代', en: 'Every age' },
    url: 'https://raja-international.com/',
    jsonLdId: ORG_ID,
  },
  {
    id: 'preschool',
    element: 'sky',
    name: { ja: 'ラジャ・インターナショナル保育園', en: 'RaJA International Preschool' },
    desc: { ja: '下荒田・谷山', en: 'Shimoarata · Taniyama' },
    ages: { ja: '0〜2歳', en: 'Ages 0–2' },
    url: 'https://www.raja-preschool.com/',
  },
  {
    id: 'academy',
    element: 'sea',
    name: { ja: 'RaJA Global Academy', en: 'RaJA Global Academy' },
    desc: { ja: '英語イマージョンのインターナショナルスクール', en: 'English-immersion international school' },
    ages: { ja: '3〜5歳', en: 'Ages 3–5' },
    url: 'https://www.rga-ce.com/',
    jsonLdId: 'https://www.rga-ce.com/#school',
  },
  {
    id: 'clab',
    element: 'sea',
    parent: 'academy',
    name: { ja: 'C-Lab', en: 'C-Lab' },
    desc: { ja: 'えいご学童', en: 'English after-school club' },
    ages: { ja: '年少〜小6', en: 'Age 3 to grade 6' },
    url: 'https://www.rga-ce.com/clab/',
    liveUrl: 'https://www.rga-ce.com/c-lab-%E3%81%88%E3%81%84%E3%81%94%E5%AD%A6%E7%AB%A5/',
  },
  {
    id: 'edu',
    element: 'sea',
    parent: 'academy',
    name: { ja: '+Education', en: '+Education' },
    desc: { ja: '習い事', en: 'Lessons' },
    ages: { ja: 'レッスンによる', en: 'Varies by lesson' },
    url: 'https://www.rga-ce.com/edu/',
    liveUrl: 'https://www.rga-ce.com/edu-%E5%90%84%E7%A8%AE%E7%BF%92%E3%81%84%E4%BA%8B/',
  },
  {
    // One of +Education's lessons (like WonderCode), with its own domain.
    // Its domain's future is open decision 2.
    id: 'lge',
    element: 'sea',
    parent: 'edu',
    name: { ja: "Let's Go English!", en: "Let's Go English!" },
    desc: { ja: 'RaJA 英会話スクール', en: 'RaJA English school' },
    ages: { ja: '幼児〜大人', en: 'Toddlers to adults' },
    url: 'https://www.raja-english.com/',
  },
  {
    id: 'kaeru',
    element: 'land',
    name: { ja: 'かえる留学', en: 'Kaeru Ryugaku' },
    desc: { ja: '全世代対応 留学サポート', en: 'Study abroad' },
    ages: { ja: 'ティーン〜大人', en: 'Teens to adults' },
    url: 'https://www.raja-r.com/',
  },
  {
    // An eikaiwa (English conversation) for grade 4 and up, not launched yet:
    // show it as "coming soon", never as a link. Its site is open decision 1.
    id: 'advance',
    element: 'octopus',
    name: { ja: 'RaJA Advance', en: 'RaJA Advance' },
    desc: { ja: '英会話（ただいま準備中）', en: 'English conversation (coming soon)' },
    ages: { ja: '小学4年生以上', en: 'Grade 4 and up' },
    url: null,
  },
]

/** The URL a site should link to today: the live one until the switch-over, then the canonical. */
export const linkFor = (b: Brand) => b.liveUrl ?? b.url
