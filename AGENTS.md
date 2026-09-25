# AGENTS.md — casavargas.app

## Project

Astro 5 static site, plain CSS (no framework). Deployed to GitHub Pages at
casavargas.app on every push to `main` (`.github/workflows/deploy.yml`) —
**merging to `main` is a production deploy**. `origin` is GitHub and is what
deploys; `gitea` is a mirror.

`PLAN.md` holds the design spec for the current look (the editorial catalogue,
2026-09). Read it before changing layout, art direction or product claims.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build
- `node scripts/og-cards.mjs` — re-render the Open Graph cards in `public/og/`
  (needs Google Chrome). Run it after changing a product name or tagline.

**Verify against `npm run preview`, not `npm run dev`.** The dev server
generates image transforms on demand, so lazy images below the fold read as
broken when they are fine.

## Architecture

```
src/
  data/work.ts              single source of truth: every product, its facts,
                            homepage plate, index row, footer link, JSON-LD
  layouts/
    Layout.astro            <head>, SEO tags, fonts (+ LCP font preloads)
    CaseStudy.astro         the whole /work/<slug>/ page, driven by props + slots
  pages/
    index.astro             homepage
    work/index.astro        the full index
    work/<slug>.astro       one thin content file per case study
    blog/                   notes (Markdown in src/content/blog/)
    404.astro
  components/
    home/                   Opening, Plate, Workshop, Method, Studio, LatestNotes
    WorkIndex.astro         the index table (homepage and /work/)
    figures/                typographic diagrams for products without screenshots
    ui/Frame, Phone, Shot   screenshot wells; Composition lays out a plate
    ui/Facts                the spec table used everywhere instead of "a · b · c"
  assets/<slug>/            ALL screenshots — imported, never referenced by URL
public/og/                  Open Graph cards (generated), llms.txt, favicons
```

Redirects for the old app URLs (`/streamline`, `/onescribe`,
`/debrid-downloader` → `/work/…/`) live in `astro.config.mjs`.

**`/beltr` cannot be a route on this site.** GitHub Pages redirects it to
beltr.app because the Beltr repo's Pages custom domain claims that path. Before
adding any top-level route, check that `curl -sI https://casavargas.app/<route>`
does not 301 off-site.

## Art direction (PLAN.md §3)

- Warm walnut ground (`--color-ground`), lit by the brand amber like a lamp. The
  ground is *lighter* than the apps' near-black UIs, so screenshots read as
  screens set into the page.
- Newsreader (serif, variable `opsz`) for display and body; Hanken Grotesk only
  for small functional UI (`.ui`). No monospace, no all-caps labels, no eyebrows.
- Tokens are CSS custom properties in `src/styles/global.css`. Use them; don't
  hardcode colours. `--color-ink-3` is the lightest value that clears WCAG AA on
  every ground — don't darken it.
- Structure only where it carries information: facts tables, the index table,
  numbered steps only for real sequences. Links are underlined text, not pills.
- One motion moment (the opening), off under `prefers-reduced-motion`.

## Adding a product

1. Add an entry to `src/data/work.ts`: `slug`, `name`, `what` (≤10 words),
   `tagline`, `group` (`available` / `open-source` / `workshop`), `runsOn`,
   `builtWith`, `price` (omit while in development), `links`, optional `icon`,
   optional `plate` (only if it has honest, publishable screenshots), optional
   `highlight` (workshop band), `parent` for companion apps.
2. Put screenshots in `src/assets/<slug>/` and import them.
3. Create `src/pages/work/<slug>.astro` with the `CaseStudy` layout: `intro`,
   `problem`, `features`, `engineering`, optional `record` (verifiable numbers
   only), `closing`, `schema`, and a `lead` or `figure` slot.
4. Add a card to `scripts/og-cards.mjs` and run it. Update `public/llms.txt`.
5. The homepage, index, footer and sitemap pick it up automatically.

## Claims go stale — check them against the product's own site

This site has shipped stale claims three times. The product's public site or
store listing is the source of truth for every claim; repos are a source for
engineering detail only. Each case-study file opens with a comment listing what
it must never say — keep those lists current.

## Screenshots carry claims — open every one before shipping it

Marketing imagery embeds text that goes stale independently of the page, and it
is invisible to grep, diffing and CI. Rejected so far, and why:

- Beltr `cinematic-bigscreen`, `phone-native-sing`, `practice-mode`,
  `ui-word-timing`, `phone-native-playing`: a stale "Demucs… thirty seconds" lyric.
- Beltr `ui-library`, `ui-processing` (the old site's `processing.webp`),
  `Beltr-Dash`: a LAN join URL; `processing` also said "about 5 min left".
- OneScribe shots with real brands (United, H-E-B, CVS/BCBS, Opus One) — use
  the fictional-data captures in the OneScribe repo's `AppStoreAssets/captures/`.
- Streamline: never use captures of a real provider's lineup; network logos and
  copyrighted shows read as redistributed channels. The shots here come from a
  fictional demo lineup with Big Buck Bunny (CC BY 3.0, credited on the plate).
  Runbook and generator scripts: Tolaria `CasaVargas/Streamline/`
  (`streamline-marketing-screenshots-fictional-lineup-runbook`).
- AppPulse: the existing shots show a real personal app library.
- DebridDownloader: the screenshots here are the real UI rendered with mocked
  IPC and neutral data (Linux installers), captured with headless Chrome. Its
  icon is the emerald chevron mark from the DebridDownloader repo
  (`assets/brand/`, 2026-09), not the stock Tauri logo it used to ship.

## SEO

Every page has a canonical URL, OG and Twitter tags, and JSON-LD (Organization,
ItemList, SoftwareApplication/MobileApplication per shipped product,
BreadcrumbList, BlogPosting). `public/llms.txt` summarises the site for AI
crawlers — keep it in step with `work.ts`.

## Before saying it works

- `npm run build` clean
- No image over 200 KB on the wire
- No horizontal document overflow at 390 px (`scrollWidth === clientWidth`,
  measured — not hidden)
- Lighthouse accessibility, best practices and SEO 100
- Every screenshot opened and read
