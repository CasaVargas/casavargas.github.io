# casavargas.app — Editorial Catalogue Redesign

**Status:** built and verified on `redesign/editorial-catalogue`; not yet merged (merging to `main` deploys).
**Date:** 2026-09-24
**Branch:** `redesign/editorial-catalogue`
**Supersedes:** the 2026-08-29 product-forward spec (see git history of this file, `c273085`).

---

## 1. Brief

> "I need casavargas.app to be stellar and show all my work in a serious manner and
> elegantly."

Decisions taken with the owner on 2026-09-24:

| Question | Answer |
|---|---|
| Direction | **Editorial catalogue.** The site reads like a studio monograph, not an app landing page. |
| What goes public | Shipped: Beltr (desktop plus the Remote and Client companion apps), OneScribe, DebridDownloader. **In development:** Streamline, Nimbus, AppPulse. |
| Ground | **Dark, refined.** The owner confirmed dark twice (August and now). |
| App pages | **Studio case studies** at `/work/<slug>/`. The product sites stay the sales pages. |

Kept off the site by decision: open-source infrastructure repos (tap, EPG manifest,
Unraid templates, the lyricsfile proposal), Cappy (unannounced), the IPTV lab
(LineupTV, StreamPolish, probers), forks of other people's work (cabinet, stemdeck),
ytfree / Loafr (terms-of-service risk), and personal or throwaway projects.

## 2. What was wrong with the August site

1. **It showed four apps.** The studio has shipped seven store listings across six
   platforms and has three credible products in development. "Four apps" undersold it.
2. **The claims had gone stale again.**
   - Beltr was tagged `AVFoundation · CoreML` (it is Electron, Python and ONNX Runtime) and listed as macOS/Windows/Linux only (it also has an iPhone Remote, an Apple TV Client, Android apps and Docker images).
   - OneScribe was described as "iOS" with "Google Docs / OneNote export" (it is iPhone and iPad, 83 document types, $9.99 lifetime Pro).
3. **Some of it was broken.**
   - `/beltr` 301s to beltr.app, because the Beltr repo's Pages custom domain claims that path, so the Astro page never served (Tolaria: `casavargas-site-beltr-route-shadowed-by-pages-custom-domain`).
   - The DebridDownloader screenshot was a cropped, near-empty window.
   - Under 700 px the nav dropped every link.
4. **It read as a template.**
   - A near-black ground with one bright accent.
   - Uppercase mono eyebrows over every heading, and a "CASAVARGAS LLC — NORTH CAROLINA" label.
   - A `4 · 7 · 0 · 1` stat strip, pill buttons, green LIVE badges, `→` on every link.
   - One identical band per app.
   Each of those is a default, not a choice.
5. **The SEO basics were thin.** The social card was the logo, and there was no `llms.txt`.

## 3. Art direction — "the house at night"

CasaVargas means the Vargas house. The page is that house after dark: a warm walnut
ground lit by the brand amber like a desk lamp, holding the things the house has
made. Every product ships a near-black UI, so a ground **lighter** than those UIs
makes each screenshot read as a dark screen set into a lit room. That solves the
dark-on-dark problem in the ground itself, instead of mechanically on every image.

### 3.1 Tokens

| Token | Value | Role |
|---|---|---|
| `--ground` | `#231C16` | Page ground, walnut |
| `--ground-deep` | `#1A1511` | Recessed bands: index, footer |
| `--surface` | `#2C231C` | Raised: row hover, facts tables |
| `--ink` | `#F4EDE3` | Primary text, warm paper white (14.3:1 on ground) |
| `--ink-2` | `#C9BDAE` | Secondary text (9.0:1) |
| `--ink-3` | `#A39686` | Tertiary and meta text (5.75:1; AA on every ground) |
| `--line` | `rgba(244,237,227,.13)` | Rules |
| `--amber` | `#EF9F27` | Brand: logo, the lamp glow, link hover, focus ring. Used sparingly. |
| `--screen` | `#0B0A09` | Image wells: the dark "glass" around screenshots |

### 3.2 Type

- **Newsreader** (variable, `opsz` 6–72, weight 200–800, with italics) does display *and*
  body. Display sizes run at the 72 optical size and light weight. Body is 18–19 px at
  a text optical size with 1.6 leading. This is a book face, which is what makes the
  site read as a monograph.
- **Hanken Grotesk** (variable) is used only for small functional UI: nav, facts-table
  labels, table heads, dates, buttons. It is clearly distinct from the serif.
- **No monospace. No all-caps labels. No letter-spaced eyebrows.**
- Scale, after Bringhurst: 14 · 16 · 18 · 21 · 24 · 36 · 48 · 60 · 72 · 96+.
  Tabular lining figures in tables.

### 3.3 Principles

- **Spend boldness in one place:** the opening statement, set huge, under the lamp
  glow. Everything below it is quiet and disciplined.
- **Structure only where it carries information.**
  - Facts tables (`dl`) replace meta strings joined with middle dots.
  - The index table is real tabular data.
  - No decorative numbering: the work isn't a sequence.
- **Plain words.** Sentence case, active voice, no hype adjectives.
  - Links say what happens ("Read the case study", "Visit beltr.app") and are
    underlined text, not pills with arrows.
- **One motion moment.** On load, the lamp glow warms up and the opening sentence
  settles. Nothing else animates on its own. Hover and focus states answer the
  user's action. `prefers-reduced-motion` turns the moment off.
- **Screens, not cards.**
  - Screenshots sit in `--screen` wells with a thin warm ring and a specular top lip.
  - Desktop shots keep a slim window titlebar.
  - Phones keep a lit bezel.
  - Radius follows hierarchy: 18 px on large wells, 10 px on small, 0 on tables.

## 4. Information architecture

| Route | What |
|---|---|
| `/` | Homepage, §5 |
| `/work/` | The full index as its own page (breadcrumb parent for the case studies) |
| `/work/<slug>/` | Case study: `beltr`, `onescribe`, `streamline`, `debrid-downloader`, `nimbus`, `apppulse` |
| `/blog/`, `/blog/<slug>/` | Notes, restyled to the new system. Post content unchanged. |
| `/404` | Styled 404 (GitHub Pages serves `404.html`) |

- **Redirects.** These use Astro `redirects`, which emits meta refresh plus a canonical:
  - `/streamline/` → `/work/streamline/`
  - `/onescribe/` → `/work/onescribe/`
  - `/debrid-downloader/` → `/work/debrid-downloader/`
  - `src/pages/beltr.astro` is **deleted**, because it can never serve (see §2.3).
- **`/work/` is unclaimed.** No `CasaVargas/work` or `prjoni99/work` repo exists;
  `curl -sI https://casavargas.app/work/` returned 404 on 2026-09-24.
- **Nav:** Work, Notes, Studio, Contact.
  - Contact is a `mailto:hello@casavargas.app` text link, not a pill.
  - On narrow screens the links wrap to a second row under the wordmark instead of
    disappearing.

## 5. Homepage

```
CasaVargas (mark + wordmark)                   Work  Notes  Studio  Contact

  CasaVargas makes software you own: native apps for the Mac,
  iPhone, iPad, Apple TV and the desktop, sold once and kept
  for good.                                   ← Newsreader 72, light, ~15 words/line
  A one-person studio in North Carolina, run by Jon Vargas.

  Available now: Beltr, Beltr Remote, OneScribe.  In the workshop: Streamline, Nimbus, AppPulse.
                                              ← inline linked sentence, not a stat strip

─ Selected work ───────────────────────────────────────────────────────────────
  [plate: large screen composition, full content width]
  Beltr                              Runs on   macOS, Windows, Linux, iPhone…
  Karaoke from the music you own.    Price     $19.99 once, 5 songs free
  2-sentence summary.                Status    Available — v1.68
  Read the case study   beltr.app    Built with Electron, Python, ONNX Runtime…

  [plate] OneScribe          (phones)
  [plate] Streamline         (phones, "In development")
  [plate] DebridDownloader   (compact, open source; honest about thin imagery)

─ Index (ground-deep band) ────────────────────────────────────────────────────
  Available      Beltr · Beltr Remote · Beltr Client · OneScribe
  Open source    DebridDownloader
  In the workshop Streamline · Nimbus · AppPulse
  columns: Name | What it is | Runs on | Built with          (rows link to case study)

─ How the studio works ────────────────────────────────────────────────────────
  One large serif paragraph, not a four-card grid: bought once; runs on your
  machine; native to its platform; written down before it's built.

─ Studio ──────────────────────────────────────────────────────────────────────
  Bio (third person, factual) + the tools and infrastructure, as a short facts table.

─ Notes ───────────────────────────────────────────────────────────────────────
  Latest three posts: date, title, one-line description.

─ Colophon footer (ground-deep) ───────────────────────────────────────────────
  Contact, GitHub, Sponsor. "Set in Newsreader and Hanken Grotesk. Built with Astro."
  © CasaVargas LLC
```

## 6. Case study template (`src/layouts/CaseStudy.astro`)

1. Breadcrumb (Work / Name), app icon, name (display), tagline.
2. Facts table: runs on, price, status, built with, links. Structured, never a
   middle-dot string.
3. Lead image composition (same well treatment as the homepage plate).
4. **Intro:** 2–3 sentences.
5. **The problem:** one paragraph.
6. **What it does:** 4–6 features, as a two-column definition list.
7. **How it's built:** 3–5 engineering highlights. This is the section that makes the
   site serious. It holds real decisions a working engineer would respect, cited from
   each repo's own docs.
8. Additional screenshots where they add something, never as filler.
9. Primary call to action to the product site or store (shipped), or a note that the
   product is in development with no date promised.
10. Next case study link.

Every shipped product page carries `SoftwareApplication` JSON-LD with a real `offers`
block. In-development pages carry no `offers`.

## 7. Data model

`src/data/apps.ts` → **`src/data/work.ts`**, the single source of truth for the
homepage plates, the index, the case studies, the footer, and the JSON-LD.

```ts
interface Work {
  slug: string;              // case-study slug; companions point at a parent
  name: string;
  what: string;              // ≤10 words, index column
  tagline: string;           // one sentence, plain
  group: 'available' | 'open-source' | 'workshop';
  runsOn: string[];
  builtWith: string[];
  price?: string;            // omitted for in-development
  status: string;            // "Available — v1.68" / "In development"
  links: { label: string; url: string }[];
  icon?: ImageMetadata;
  parent?: string;           // Beltr Remote / Client → 'beltr'
  plate?: { kind: 'window' | 'phones'; shots: ImageMetadata[]; size: 'full' | 'compact' };
}
```

Case-study prose (intro, problem, features, engineering) lives in the page file, so
each `src/pages/work/<slug>.astro` stays a thin, readable content file around the
layout.

## 8. Facts of record and content rules

- **The product's own public site or store listing is the source of truth for every
  claim.** The repos are the source for engineering detail only. Research notes from
  2026-09-24 are summarised per product in the page files.
- **Beltr:**
  - $19.99 once, 5 songs free, 14-day refund.
  - On-device separation, a minute or two per song.
  - Phones join by QR with nothing to install, *and* optional native Remote apps exist.
  - **Never** mention Demucs, "real time", "thirty seconds", YouTube or yt-dlp features.
- **OneScribe:** iPhone and iPad, iOS 26+; free scanning; Pro is $9.99 one-time;
  83 document types; on-device.
- **Streamline:** a native IPTV player for the user's own M3U / Xtream playlists and
  XMLTV guides; coming 2026. **No mention of Stremio, add-ons, debrid, or content
  sourcing.**
- **DebridDownloader:**
  - GPL-3.0; Real-Debrid, TorBox, Premiumize.
  - Stated factually; no piracy framing.
  - Search sources are user-configured, and the app ships none.
- **Nimbus:** no licence stated (unresolved in its repo).
- **AppPulse:** a working title; don't name competitor products.
- **Screenshots carry claims.** Open every image before shipping it.
  - Banned: `cinematic-bigscreen.webp` and `phone-native-sing.webp` (both have a stale
    Demucs lyric), and `ui-tv-lobby.webp` uncropped (shows a LAN IP).
  - Nothing with personal data or third-party artwork dominating the frame.

## 9. Assets

- All screenshots are imported from `src/assets/<slug>/` and rendered through
  `astro:assets` as AVIF/WebP at explicit widths.
- No image over 200 KB on the wire; the LCP image under 150 KB (the LCP is text now,
  which is better still).
- `public/` holds only files that need stable URLs: favicons, logo, OG cards.
- New OG card: `public/og/casavargas.png` (1200×630), typeset in the site's own system.

## 10. Changes made during the build

Where the build departed from §5–§9, and why:

- **Streamline lost its homepage plate.** Every existing Streamline screenshot
  is dominated by network logos and copyrighted artwork. On an IPTV player that
  reads as redistributed channels, which contradicts "your own playlists".
  Streamline, Nimbus and AppPulse share an **"In the workshop" band** instead:
  words plus one engineering fact each, no pictures.
- **Diagrams instead of screenshots** for the three products in development:
  - Streamline: the four platform idioms, from its `docs/platforms.md`.
  - Nimbus: the app → RcloneKit → local rclone architecture.
  - AppPulse: its eight-step install order.

  Numbering is used only on the install order, because that is a real sequence.
- **Beltr imagery replaced.**
  - Out: the old `library`/`processing` shots, which showed a LAN join URL, and
    "about 5 min left", which contradicts "a minute or two".
  - In: the TV lyric stage (`tv-scoring`) with the phone join screen.
- **OneScribe imagery replaced.** The old shots showed real brands. The new
  ones are fictional-data captures: a Pacifica Air boarding pass, the briefing,
  and a Silverbrook Cellars label.
- **DebridDownloader imagery re-captured.** The real React UI was rendered with
  `@tauri-apps/api/mocks` and neutral data (Linux installers), and shot at 2×
  with headless Chrome. Its stock-Tauri "icon" was dropped.
- **Tailwind removed.** A Tailwind utility (`.contents` → `display: contents`)
  collided with a component class, and nothing used Tailwind anymore. The
  tokens are plain custom properties.
- **LCP fonts preloaded.** Homepage Lighthouse performance went from 76 to 94
  once Newsreader and Hanken were preloaded.
- **Blog content was left as written.** Only internal links were repointed to
  `/work/`. Two posts still carry claims worth revisiting:
  - The Streamline post: "tvOS and macOS first", "the IPTV player Apple would
    build".
  - "Why we don't do subscriptions": OneScribe did offer a monthly plan in
    March 2026.

## 11. Verification (results, 2026-09-24, against `astro preview`)

- [x] `npm run build` clean: 17 HTML files, including the three redirect stubs.
- [x] 390 px: `scrollWidth === clientWidth` on all 10 routes checked. The only
      elements wider than the viewport are intended:
      - The lamp is clipped by `overflow-x: clip`.
      - The Streamline table scrolls inside its own container.
- [x] 1440 px visual pass on the homepage, all six case studies, the blog index
      and a post.
- [x] Every internal `href`/`src` in `dist/` resolves (scripted check).
- [x] All 22 JSON-LD blocks parse.
- [x] Lighthouse (mobile, simulated throttling):

      | Page | Perf | A11y | Best practices | SEO |
      |---|---|---|---|---|
      | `/` | 94 | 100 | 100 | 100 |
      | `/work/beltr/` | 98 | 100 | 100 | 100 |
      | `/work/apppulse/` | 92 | 100 | 100 | 100 |
      | A blog post | 96 | 100 | 100 | 100 |

- [x] Largest image on the wire is 70 KB. The oversized originals Astro emits
      are not referenced by any page.
- [x] Every screenshot on the site was opened and read.
- [x] 768 and 1024 px: no document overflow on the same 10 routes, and a
      visual pass on the homepage plates.

## 12. Phases

### Phase 1 — Foundation
- [x] Fonts: add Newsreader and Hanken Grotesk variable; remove Instrument Serif, DM Sans and JetBrains Mono
- [x] Rewrite `global.css` tokens and base typography (§3)
- [x] `src/data/work.ts` (§7) with verified facts
- [x] Nav and footer (colophon) rebuilt; mobile nav keeps its links

### Phase 2 — Homepage
- [x] Opening statement, lamp glow and load moment
- [x] Plates (`Plate.astro` + `Composition.astro`)
- [x] Index (`WorkIndex.astro`)
- [x] Workshop band, How the studio works, Studio, Notes
- [x] Visual review at 1440 and 390; critique pass

### Phase 3 — Case studies
- [x] `CaseStudy.astro` layout
- [x] Six case studies with researched, fact-checked content
- [x] `/work/` index page; redirects; `beltr.astro` deleted
- [x] JSON-LD per page

### Phase 4 — Notes, 404, SEO
- [x] Blog index and post template restyled
- [x] 404 page
- [x] OG cards (`scripts/og-cards.mjs`), `llms.txt`, sitemap filters redirect stubs

### Phase 5 — Verify and ship
- [x] §11 checklist
- [x] `AGENTS.md` updated for the new architecture
- [ ] PR to `main`; the owner merges (merging deploys)
