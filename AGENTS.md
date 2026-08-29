# AGENTS.md — casavargas.app

## Project

Astro 5.x static site with Tailwind CSS v4. Deployed to GitHub Pages at
casavargas.app on every push to `main` (`.github/workflows/deploy.yml`).
`origin` is GitHub and is what deploys; `gitea` is a mirror.

`PLAN.md` holds the design spec for the current look — read it before changing
layout or art direction.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build

**Verify against `npm run preview`, not `npm run dev`.** The dev server
generates image transforms on demand, so lazy images below the fold read as
broken when they are perfectly fine.

## Architecture

```
src/
  data/apps.ts            single source of truth for every app
  layouts/
    Layout.astro          <head>, SEO tags, fonts
    AppPage.astro         the whole app landing page, driven by props
  components/
    ui/Frame.astro        desktop screenshot: window chrome + specular edge
    ui/Phone.astro        phone screenshot: lit bezel
    home/                 Hero, Proof, AppBand, Studio
    Nav / Footer / Breadcrumbs / JsonLd
  assets/                 ALL screenshots — imported, never referenced by URL
```

`public/` holds only files that need a stable public URL: favicons, logos, and
the icons used as `ogImage` (OG scrapers cannot read hashed build output).

## Art direction

Dark ground. The load-bearing constraint: **every app ships a dark UI**, so a
screenshot on a dark page has no edge unless you give it one. Four mechanisms,
all in `global.css` tokens and the `ui/` components — window chrome, a specular
top edge, lighter phone bezels, and alternating band grounds. Don't drop one
without reading §3.2 of `PLAN.md`.

Tokens live in the `@theme` block in `src/styles/global.css`. Use them; don't
hardcode colours in components. `--color-text-tertiary` is the lightest value
that still clears WCAG AA on every ground — don't darken it.

## Adding a new app

1. Add an entry to `src/data/apps.ts`. Required: `slug`, `name`, `category`,
   `description`, `specs[]` (three short scannable claims), `platforms`,
   `status`, `links`, `icon`, `weight`, `shotKind`, `shots`.
   - `weight: 'large' | 'compact'` decides its homepage footprint. Base it on
     how much imagery the app can actually show, not on how much you like it.
   - `shotKind: 'window' | 'phone'` picks the screenshot treatment.
   - `reverse: true` flips the band so consecutive bands alternate.
2. Put screenshots in `src/assets/<slug>/` and import them. Never put a
   screenshot in `public/`.
3. Create `src/pages/<slug>.astro` using the `AppPage` layout — it is a thin
   data file (see `beltr.astro`). Pass `tagline`, `intro`, `features`,
   optional `steps`, `cta`, and a `SoftwareApplication` schema.
4. The homepage grid and the footer pick the app up from `apps.ts` automatically.
5. Consider a blog post announcement for extra SEO surface.

## Screenshots carry claims — audit them

Marketing imagery embeds copy that goes stale independently of the page around
it. It is invisible to grep, diffing and CI, and it survives every rewrite of
the surrounding text.

**Read every screenshot for burned-in text before shipping it**, and re-audit
when an app's positioning changes. A real example: `cinematic-bigscreen.webp`
from beltr.app has "Demucs doing surgery, thirty seconds, clean stem" rendered
into the pixels. Beltr no longer uses Demucs and separation now takes a minute
or two, so that asset is banned from this repo.

Product claims in copy and in JSON-LD go stale the same way. `offers.price` said
`'0'` for Beltr long after it became a $19.99 one-time purchase, and the
DebridDownloader page claimed MIT when the repo is GPL-3.0. Check against the
product's own site before writing a number or a licence.

## Blog posts

Markdown in `src/content/blog/` with frontmatter: `title`, `description`,
`date`, `tags`. Link internally to the relevant app landing pages.

## SEO

Every page needs a canonical URL, OG tags, Twitter card tags, and JSON-LD.
`Layout.astro` handles most of it from props; `JsonLd.astro` takes a schema
object. Don't ship a page without checking those survive.

## Before saying it works

- `npm run build` clean
- No image over 200 KB on the wire
- No horizontal document overflow (`scrollWidth === clientWidth`) —
  `body { overflow-x: hidden }` will hide the symptom, so measure
- Lighthouse accessibility 100 (it was 93 until a contrast token was fixed)
- Check a narrow viewport, not just desktop
