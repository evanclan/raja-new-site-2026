# RaJA International — Landing Page

An animated, high-performance landing page skeleton for **RaJA International**, a global education & childcare company. Built with Next.js (App Router), Lenis smooth scrolling, Framer Motion, and Tailwind CSS v4.

---

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

---

## Tech stack

| Layer       | Choice                              | Why                                             |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| Framework   | **Next.js 16 (App Router)**         | Server components + fast DX                     |
| Smooth scroll | **Lenis 1.3+**                    | Virtual-scroll with rAF, best-in-class smoothness |
| Animation   | **Framer Motion 12+**               | Declarative, works perfectly with React 19      |
| Styling     | **Tailwind CSS v4**                 | CSS-first theming via `@theme inline`           |
| Fonts       | `Fredoka` (display), `Inter` (body) | Warm, child-friendly headline pairing           |
| Language    | TypeScript                          | Type-safety across component contracts          |

---

## Project structure

```
app/
  layout.tsx              # Root layout — fonts, Preloader, SmoothScrollProvider
  page.tsx                # Landing page — imports every section
  globals.css             # Design tokens + Lenis base styles

components/
  Preloader.tsx           # Curtain-reveal preloader that blends into Hero
  SmoothScrollProvider.tsx# Lenis wrapper + soft snap-to-section logic
  Nav.tsx                 # Sticky translucent navigation
  Section.tsx             # Full-viewport section wrapper (data-snap-section)

  sections/
    Hero.tsx              # "RaJA International" hero + panel navigator
    PanelShell.tsx        # Shared scroll-parallax layout for panels 1–5
    StudyAbroad.tsx       # Panel 1 — Kaeru Ryugaku
    Academy.tsx           # Panel 2 — RaJA Academy (3–5 y/o)
    Preschool.tsx         # Panel 3 — RaJA Preschool (0–3 y/o)
    Clab.tsx              # Panel 4 — Clab + Education (3–12 y/o)
    English.tsx           # Panel 5 — RaJA English (all ages)
    News.tsx              # Panel 6 — Latest News grid
    Inquiry.tsx           # Panel 7 — Inquiry form + footer

  visuals/
    Visuals.tsx           # Illustrated placeholders for each panel
```

---

## Animation system

**Motion personality: Playful (Corporate-adjacent for UI chrome).**

Three tokens live in `globals.css`:

```css
--ease-signature : cubic-bezier(0.22, 1, 0.36, 1);      /* decelerate */
--ease-pop       : cubic-bezier(0.175, 0.885, 0.32, 1.275); /* overshoot */
--ease-flow      : cubic-bezier(0.65, 0, 0.35, 1);      /* symmetric */
--dur-quick      : 220ms;
--dur-standard   : 480ms;
--dur-slow       : 900ms;
```

Every animation uses:

1. **Primary** — headline/entity arriving (position + opacity)
2. **Secondary** — illustration parallax + accent underline
3. **Ambient** — breathing orbs, subtle looping rotations

### Preloader → Hero blend

Both surfaces share the same `--color-cream` background. The preloader parts as two vertical panels (ease `cubic-bezier(0.76,0,0.24,1)` over 1 s) — at the same moment the Hero's kinetic type and floating orbs begin their staggered entrance. The viewer never sees a seam.

### Smooth snap scrolling

CSS `scroll-snap` fights Lenis' virtualized scroll, and hand-rolled timers fight trackpad inertia. Instead we let GSAP's **ScrollTrigger** own the snap and drive it through Lenis:

1. Lenis drives all scrolling on GSAP's ticker (single rAF for the whole page).
2. `ScrollTrigger.scrollerProxy` routes reads/writes through Lenis, and `lenis.on("scroll", ScrollTrigger.update)` keeps ST in sync.
3. A single page-level `ScrollTrigger` with `snap: { snapTo, directional: true, delay: 0.08 }` snaps to the nearest `[data-snap-section]` offset once the user stops. Direction is honored, so scrolling down always commits forward.
4. `prefers-reduced-motion` disables the snap entirely.

The `Section` wrapper tags every full-screen block with `data-snap-section`, so adding/removing sections requires no further wiring. Registering ScrollTrigger here also unlocks it for any future scroll-linked animation (parallax, pin, scrub) without extra setup.

### Section parallax

Each panel uses `useScroll({ target, offset: ["start end", "end start"] })` to map scroll progress (0→1) onto transforms on its headline and visual. This creates a natural "sliding past" feel as each panel enters and exits.

---

## Design tokens

| Token                 | Value     | Used for                       |
| --------------------- | --------- | ------------------------------ |
| `--color-cream`       | `#fff7e6` | Hero, News, preloader          |
| `--color-ink`         | `#20233a` | Primary text, Inquiry bg       |
| `--color-sky`         | `#6fc3e8` | Study Abroad panel             |
| `--color-sun`         | `#ffd23d` | Academy panel, CTAs            |
| `--color-peach`       | `#ff9a6b` | Preschool panel                |
| `--color-leaf`        | `#58c27d` | Clab panel                     |
| `--color-berry`       | `#e86b9e` | English panel                  |

Replace these in `globals.css` to re-theme the whole site.

---

## Swapping placeholders for real assets

Every illustration lives in `components/visuals/Visuals.tsx`. Each visual is a React composition of `motion.div` and inline SVG. To replace:

1. Drop your illustration (PNG/SVG/Lottie) into `public/illustrations/`.
2. In the relevant visual component (e.g. `GlobeVisual`), replace the SVG body with `<Image>` or a Lottie player.
3. Keep the `motion.div` wrappers so entrance/parallax animations continue to work.

Copy placeholders (headlines, subtitles, descriptions) live inside each panel file (e.g. `components/sections/Academy.tsx`) — simple string edits.

---

## Accessibility

- Navigation and CTAs use real `<button>` + `<a>` elements.
- `prefers-reduced-motion` disables transitions and snap entirely.
- Focus styles inherited from Tailwind defaults — customise in `globals.css` if needed.
- All decorative motion elements carry `aria-hidden`.

---

## Performance notes

- Lenis runs on a single `requestAnimationFrame` loop, not JS scroll listeners.
- Framer Motion uses GPU-accelerated transforms (`x`, `y`, `scale`, `rotate`) exclusively — no layout thrash.
- Fonts are `display: swap` to avoid FOIT.
- Sections are kept lightweight; consider `next/image` + `priority` on the Hero illustration once real art arrives.

---

## What to build next

- [ ] Language switch (JP / EN) with route-level locales.
- [ ] CMS-driven News feed (e.g. MDX, Sanity, or Notion).
- [ ] Inquiry form backend (Resend / Formspree / Supabase).
- [ ] Replace placeholders with final illustrations + photography.
- [ ] Lighthouse pass — aim for 95+ on Performance and Accessibility.
