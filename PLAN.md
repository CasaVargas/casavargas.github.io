# casavargas.app — Product-Forward Redesign

**Status:** complete and deployed (2026-08-29). Homepage, all four app landing pages and the blog are on the new design system.
**Date:** 2026-08-29
**Branch:** `redesign/product-forward`

---

## 1. Problem

The current site reads as empty and generic. Three causes, in order of severity:

1. **Dark-on-dark.** All four apps ship dark UIs. On a `#07070a` page ground their
   screenshots have no edge — they dissolve into the page. This is the actual
   cause of the flatness. It reads as "too much whitespace," but adding or
   removing space cannot fix it; only a value step between page and screenshot can.
2. **The products are below the fold.** The hero is `min-h-screen` holding a badge,
   a headline, one line of copy, and platform pills. The apps — the entire pitch —
   start a full screen down.
3. **Uniform grid, non-uniform assets.** A flagship card plus a 2-up grid forces
   four apps into equal cells when only two have imagery to fill one. Result:
   a card-shaped hole next to DebridDownloader.

Secondary: reveal animations (0.7s + 0.35s stagger) that scrolling outruns, the
grain overlay, the pulsing "since 2024" dot, emoji as section icons, and an
`∞ Backlog Ideas` stat that undercuts credibility.

## 2. Decisions

| Decision | Choice | Note |
|---|---|---|
| Scope | Full redesign, new art direction | Homepage first, then app pages + blog |
| Direction | Product-forward | Screenshots carry the page |
| Page ground | **Dark** | Chosen over light. Light tested better for screenshot contrast; dark chosen deliberately and the contrast problem is solved structurally instead (§3.2) |
| Layout | Weighted bands, not a uniform grid | Space allocated by what each app can actually show |
| Stack | Unchanged — Astro 5 + Tailwind v4 | No framework change |

### 2.1 Rejected

- **Light ground.** Highest contrast for dark app screenshots and the strongest
  differentiator. Rejected by owner preference; brand stays dark.
- **Uniform 4-up app grid.** Cannot be filled honestly with current assets.
- **Keeping the current bones.** Would leave cause #1 unaddressed.

## 3. Art direction

### 3.1 Tokens

```
--bg          #0A0A0E    page ground
--bg-alt      #101017    alternating band ground
--surface     #17171F    cards
--ink         #F4F3F7
--ink-soft    #ABA9B6
--ink-faint   #74727F
--rule        rgba(255,255,255,0.13)
--rule-soft   rgba(255,255,255,0.07)
--accent      #EF9F27    unchanged brand orange
--chrome-bg   #1C1C24    window titlebar
```

Type unchanged: Instrument Serif (display), DM Sans (body), JetBrains Mono
(labels/tags). Serif gets used more confidently and at larger sizes.

### 3.2 Making dark screenshots read on a dark ground

This is the core technique of the redesign. Four mechanisms, all required:

1. **Window chrome.** Desktop app shots (Beltr ×3, DebridDownloader) get a 28px
   titlebar with traffic lights. A bright horizontal edge at the top of the image
   is what makes a dark UI stop merging with a dark page.
2. **Specular top edge.** Every framed shot gets `inset 0 1px 0 rgba(255,255,255,0.14)`.
3. **Physical phone bezels.** Phone shots get a 5px light-to-dark gradient bezel
   (`#35353F → #1A1A21`) plus a 20%-white ring, so a black screen has something
   lighter around it.
4. **Banded grounds.** Sections alternate `--bg` / `--bg-alt` so consecutive
   screenshots don't sit on identical values.

Plus a soft `rgba(239,159,39,0.13)` accent bloom behind the hero shot.

### 3.3 Removed

Grain overlay, pulse dot, scroll indicator, `.reveal` scroll animations, emoji
pillars, `∞ Backlog Ideas`.

## 4. Page structure

```
Nav            sticky, hairline, logo · Apps · Studio · Notes · Get in touch
Hero           2-col — headline + lede + 2 CTAs | Beltr library shot (windowed)
Proof          4 · 7 · 0 · 1  (apps / platforms / subscriptions / developers)
Apps
  Beltr        large band, copy left, processing shot + floating add-music inset
  Streamline   large band, copy right, 3 staggered phones
  OneScribe    medium band, copy left, 2 phones
  Debrid       compact row — deliberately lighter weight
Studio         bio + stack table
Footer         brand + app links + contact
```

Every app band carries: icon, category kicker, name, status pill, description,
three concrete spec bullets, platform tags, and an outbound link.

## 5. Files

**New**
- `src/components/home/Hero.astro`
- `src/components/home/Proof.astro`
- `src/components/home/AppBand.astro` — takes an `App` + `variant: 'large' | 'compact'`
- `src/components/home/Studio.astro`
- `src/components/ui/Frame.astro` — window chrome + specular edge
- `src/components/ui/Phone.astro` — bezel treatment

**Modified**
- `src/styles/global.css` — new tokens, delete grain + reveal machinery
- `src/data/apps.ts` — add `screenshots`, `specs[]`, `heroShot` per app
- `src/pages/index.astro` — recomposed
- `src/components/Nav.astro`, `Footer.astro` — restyled
- `astro.config.mjs` — `devToolbar: { enabled: false }`

**Deleted**
- `src/components/Hero.astro`, `Philosophy.astro`, `Stats.astro`, `About.astro`, `AppCard.astro`
- `src/pages/preview-light.astro`, `preview-dark.astro`, `src/components/preview/` (after approval)

## 6. Assets

Downloaded to `public/` on this branch:

| App | Files | Source |
|---|---|---|
| Beltr | `library.webp`, `processing.webp`, `addmusic.webp`, `icon.png` | beltr.app |
| OneScribe | `boarding.png`, `receipt.png`, `health.png`, `wine.png` | getonescribe.app `/Screenshots/DataCards/` |
| Debrid | `screenshot.png` | GitHub `docs/` |
| Streamline | already present | repo |

**Gap:** DebridDownloader has exactly one sparse screenshot. The compact band is
designed around that, not as a workaround to be undone later. If better shots
appear, it can be promoted to a large band with no structural change.

### 6.1 Screenshots can carry stale product claims

`cinematic-bigscreen.webp` was pulled from beltr.app and has **"Demucs doing
surgery, thirty seconds, clean stem"** rendered into the image. Beltr no longer
uses Demucs, and separation now takes a minute or two, not thirty seconds. The
asset has been deleted from this branch and must not be reused.

This is a standing hazard for a screenshot-driven site: marketing imagery
embeds copy that goes stale independently of the page around it, and nothing
in the build will catch it. **Every screenshot must be read for burned-in text
before it ships**, and re-checked whenever an app's positioning changes.

Audited so far — `library.webp`, `processing.webp`, `addmusic.webp` clean
(`processing.webp` reads "Separating vocals · 20% · <1 min", which matches
current claims). Streamline and OneScribe shots not yet audited.

**Optimization is mandatory, not optional.** Streamline PNGs are 1.7–2.7MB and
OneScribe's are 348–604KB. A screenshot-heavy page cannot ship those. Move all
screenshots to `src/assets/` and render through `astro:assets` `<Image>` /
`<Picture>` with `formats: ['avif','webp']` and explicit `widths`. Target: no
single image over 200KB on the wire, LCP image under 150KB.

### 6.2 Beltr facts of record (source: beltr.app, 2026-08-29)

- On-device AI vocal separation; **no Demucs**, no named model
- A minute or two per song; faster on Apple Silicon, slower on older CPUs
- Nothing uploads — fully local
- $19.99 once, 5 songs free, no card, 14-day refund
- Phones join by QR as mics; no app install, no accounts
- Reads CDG, MP3+G, `.kar`, `.mid`, Thai NCN as-is; exports MP3+G, CDG, `.kar`
- StemDeck is a *separate recommended tool*, not a Beltr feature

## 7. Scope (delivered)

**Pass 1 — homepage.** Hero, proof strip, weighted app bands, studio section.

**Pass 2 — everything else.** The four app landing pages now share an
`AppPage` layout and are thin data files; the blog index and post template were
restyled to match. Screenshots everywhere go through `Frame` / `Phone`.

Corrected along the way, all of it the same class of defect as §6.1 — claims
that went stale independently of the page around them:

| Claim | Was | Now |
|---|---|---|
| Beltr separation | "in real time", "no pre-processing, no waiting" | on-device, a minute or two per song |
| Beltr remotes | "iOS Remote" / "Android Remote" platforms and apps | phones join by QR, nothing to install |
| Beltr `offers.price` | `'0'` in JSON-LD | `'19.99'` |
| DebridDownloader licence | "MIT licensed" | GPL-3.0 |
| DebridDownloader providers | Real-Debrid only | Real-Debrid, TorBox, Premiumize |

Still out of scope: no new photography or screenshot capture.

## 8. Verification (results)

Measured against the production build (`astro preview`), not the dev server —
Astro's dev server generates image transforms on demand, which makes lazy images
read as broken when they are not.

- [x] Renders correctly at 1440, 1280, and 500 px. **390 px not tested** — the
      browser window would not go below ~500 px wide; the 500 px pass exercised
      every mobile breakpoint (`max-width: 900px`), so coverage is good but not
      literally phone-width.
- [x] `npm run build` clean — 10 pages
- [x] No image over 200 KB on the wire — largest is 172 KB (`vod.webp`);
      sources were 1.7–2.7 MB PNGs
- [x] Lighthouse desktop: **Accessibility 100, Best Practices 100, SEO 100**, 0 failed audits
- [x] Contrast: `--color-text-tertiary` was **#74727f at 4.19:1 — failing WCAG AA**.
      Raised to `#8a8895` (5.12–5.68:1 across all three grounds).
- [x] SEO preserved — canonical, OG, and JSON-LD verified present on all 7 pages
- [x] All internal links resolve; 0 broken images across all 7 pages
- [x] No horizontal document overflow (`.hero::before` bloom was pushing
      scrollWidth 32 px past the viewport, hidden by `body{overflow-x:hidden}`)

### 8.2 Pass 2 results

- [x] Lighthouse desktop 100/100/100 with 0 failures on `/beltr/` **and** the
      blog post, as well as `/`
- [x] No horizontal overflow on any of the 7 pages at a mobile viewport
- [x] Largest image on the wire 192 KB
- [x] Two further a11y defects found and fixed, both sitewide:
      footer column labels were `<h4>` after an `<h2>` (heading-order), and
      inline prose links were colour-only at 1.06:1 against body text — now
      underlined.

### 8.3 Known gaps

- **390 px viewport untested.** The browser window would not size below ~500 px.
  Every mobile breakpoint (`max-width: 900px`) is exercised at 500 px, so
  coverage is good but not literally phone-width.
- Performance score not measured (the Lighthouse tool covers a11y/BP/SEO only).
- **`cinematic-bigscreen.webp` is still live on beltr.app** advertising Demucs
  and "thirty seconds". Out of this repo's reach; tracked in Tolaria.
- `Setting-the-Stage.mp4` remains unaudited for burned-in claims.

## 9. Build sequence

1. Tokens + `global.css` cleanup
2. `Frame` / `Phone` primitives
3. `astro:assets` migration + image optimization
4. `apps.ts` schema extension
5. `Hero`, `Proof`, `AppBand`, `Studio`
6. Recompose `index.astro`, delete dead components
7. Responsive pass + verification checklist
8. Delete preview routes

## 10. Open questions

1. Headline: "Software you own." is a draft. Keep, or write against the existing
   "Software built to feel right"?
2. Proof strip — are `4 / 7 / 0 / 1` the numbers worth showing, or drop the strip?
3. Should the Beltr `Setting-the-Stage.mp4` (172KB) become an autoplaying muted
   hero loop instead of a static shot? **Must be audited frame-by-frame for
   burned-in claims first** — it comes from the same beltr.app batch as the
   Demucs shot (§6.1), and its name suggests it shows the same lyric stage.
