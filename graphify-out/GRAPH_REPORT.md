# Graph Report - .  (2026-06-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 152 nodes · 242 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2174c7b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `useT()` - 18 edges
2. `compilerOptions` - 16 edges
3. `useI18n()` - 12 edges
4. `useLoading()` - 7 edges
5. `Section()` - 6 edges
6. `PanelShell()` - 6 edges
7. `Nav()` - 5 edges
8. `useSmoothScroll()` - 5 edges
9. `Hero()` - 5 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Nav()` --calls--> `useI18n()`  [EXTRACTED]
  components/Nav.tsx → lib/i18n.tsx
- `Hero()` --calls--> `useI18n()`  [EXTRACTED]
  components/sections/Hero.tsx → lib/i18n.tsx
- `PhotoMarquee()` --calls--> `useI18n()`  [EXTRACTED]
  components/sections/StudyAbroad.tsx → lib/i18n.tsx
- `BigPanelsRow()` --calls--> `useI18n()`  [EXTRACTED]
  components/sections/StudyAbroad.tsx → lib/i18n.tsx
- `KaeruRyugakuVisual()` --calls--> `useI18n()`  [EXTRACTED]
  components/visuals/Visuals.tsx → lib/i18n.tsx

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (21): ClabBackdrop(), EnglishBackdrop(), PreschoolBackdrop(), Section(), SectionProps, useT(), Academy(), Clab() (+13 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (20): fredoka, inter, metadata, notoJp, Ctx, LoadingProvider(), LoadingState, Phase (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): dependencies, clsx, framer-motion, gsap, @gsap/react, lenis, next, react (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (9): useI18n(), BigPanelsRow(), IlloAnchor, IlloKind, KAERU_PANELS, MARQUEE_FRAMES, MarqueeFrame, PhotoMarquee() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (7): ACADEMY_STARS, AcademyBackdrop(), CLAB_TRI, ENGLISH_LETTERS, KAERU_STAMPS, PRESCHOOL_BUBBLES, StudyAbroadBackdrop()

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (5): Ctx, DICTIONARY, I18nContext, LanguageProvider(), Locale

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (3): BLOB_PATHS, BlobPath, Props

## Knowledge Gaps
- **77 isolated node(s):** `inter`, `fredoka`, `notoJp`, `metadata`, `BlobPath` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useI18n()` connect `Community 4` to `Community 0`, `Community 1`, `Community 7`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `useT()` connect `Community 0` to `Community 4`, `Community 7`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `inter`, `fredoka`, `notoJp` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._