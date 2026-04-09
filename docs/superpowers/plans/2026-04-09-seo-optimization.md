# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full SEO optimization for casavargas.app — technical foundation, 4 app landing pages, blog system with 4 posts, navigation updates, and off-site SEO docs.

**Architecture:** Astro 5.x static site with Tailwind CSS v4. All new pages use the existing `Layout.astro` (enhanced with SEO props). App landing pages are individual `.astro` files in `src/pages/`. Blog uses Astro Content Collections with Markdown in `src/content/blog/`. Reusable `JsonLd.astro` and `Breadcrumbs.astro` components handle structured data and navigation across all sub-pages.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, `@astrojs/sitemap`, Astro Content Collections, JSON-LD/Schema.org

---

### Task 1: Install @astrojs/sitemap and create robots.txt

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `public/robots.txt`

- [ ] **Step 1: Install @astrojs/sitemap**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm install @astrojs/sitemap
```

- [ ] **Step 2: Add sitemap integration to astro.config.mjs**

Replace the full contents of `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://casavargas.app',
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://casavargas.app/sitemap-index.xml
```

- [ ] **Step 4: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build
```

Expected: Build succeeds. Check that `dist/sitemap-index.xml` exists:

```bash
cat dist/sitemap-index.xml
```

Expected: XML file referencing `sitemap-0.xml` with `https://casavargas.app` entries.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs public/robots.txt
git commit -m "feat: add sitemap integration and robots.txt"
```

---

### Task 2: Create JsonLd and Breadcrumbs components

**Files:**
- Create: `src/components/JsonLd.astro`
- Create: `src/components/Breadcrumbs.astro`

- [ ] **Step 1: Create JsonLd.astro**

Create `src/components/JsonLd.astro`:

```astro
---
interface Props {
  data: Record<string, unknown> | Record<string, unknown>[];
}

const { data } = Astro.props;
---

<script type="application/ld+json" set:html={JSON.stringify(data)} />
```

- [ ] **Step 2: Create Breadcrumbs.astro**

Create `src/components/Breadcrumbs.astro`:

```astro
---
import JsonLd from './JsonLd.astro';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;

const jsonLdItems = items.map((item, index) => ({
  '@type': 'ListItem',
  position: index + 1,
  name: item.label,
  ...(item.href ? { item: `https://casavargas.app${item.href}` } : {}),
}));

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: jsonLdItems,
};
---

<nav aria-label="Breadcrumb" class="mb-8">
  <ol class="flex items-center gap-2 text-sm" style="color: var(--color-text-tertiary);">
    {items.map((item, index) => (
      <li class="flex items-center gap-2">
        {index > 0 && <span>/</span>}
        {item.href ? (
          <a
            href={item.href}
            class="no-underline transition-colors duration-200 hover:text-white"
            style="color: var(--color-text-secondary);"
          >
            {item.label}
          </a>
        ) : (
          <span style="color: var(--color-text-primary);">{item.label}</span>
        )}
      </li>
    ))}
  </ol>
</nav>

<JsonLd data={breadcrumbSchema} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/JsonLd.astro src/components/Breadcrumbs.astro
git commit -m "feat: add JsonLd and Breadcrumbs components"
```

---

### Task 3: Enhance Layout.astro with full SEO meta tags

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Update Layout.astro**

Replace the full contents of `src/layouts/Layout.astro` with:

```astro
---
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
}

const {
  title = 'CasaVargas — Indie Software Studio',
  description = 'An indie studio shipping native apps, cross-platform tools, and self-hosted infrastructure. No subscriptions. No compromises.',
  ogImage = '/casavargas-logo-orange.png',
  ogType = 'website',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const absoluteOgImage = new URL(ogImage, Astro.site).href;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="author" content="Jon Vargas" />
    <meta name="theme-color" content="#f97316" />
    <meta name="generator" content={Astro.generator} />

    <!-- Canonical -->
    <link rel="canonical" href={canonicalURL.href} />

    <!-- OG Tags -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonicalURL.href} />
    <meta property="og:image" content={absoluteOgImage} />
    <meta property="og:site_name" content="CasaVargas" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={absoluteOgImage} />

    <link rel="icon" type="image/svg+xml" href="/casavargas-logo-orange.svg" />
    <title>{title}</title>

    <!-- Preconnect -->
    <link rel="preconnect" href="https://www.googletagmanager.com" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1RK2545QZF"></script>
    <script is:inline>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1RK2545QZF');
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build
```

Expected: Build succeeds. Verify the homepage HTML includes canonical URL, og:site_name, twitter tags, and preconnect:

```bash
grep -E "canonical|og:site_name|twitter:title|preconnect|theme-color|author" dist/index.html
```

Expected: All new meta tags present.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add canonical URLs, twitter cards, and enhanced meta tags to Layout"
```

---

### Task 4: Add JSON-LD structured data to homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update index.astro to include JSON-LD**

Replace the full contents of `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import AppGrid from '../components/AppGrid.astro';
import Philosophy from '../components/Philosophy.astro';
import Stats from '../components/Stats.astro';
import About from '../components/About.astro';
import Footer from '../components/Footer.astro';
import JsonLd from '../components/JsonLd.astro';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CasaVargas LLC',
  url: 'https://casavargas.app',
  logo: 'https://casavargas.app/casavargas-logo-orange.png',
  founder: {
    '@type': 'Person',
    name: 'Jon Vargas',
  },
  description: 'An indie studio shipping native apps, cross-platform tools, and self-hosted infrastructure.',
  sameAs: ['https://github.com/CasaVargas'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CasaVargas',
  url: 'https://casavargas.app',
};
---

<Layout>
  <JsonLd data={organizationSchema} />
  <JsonLd data={websiteSchema} />
  <Nav />
  <Hero />
  <AppGrid />
  <Philosophy />
  <Stats />
  <About />
  <Footer />
</Layout>

<script>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
</script>
```

- [ ] **Step 2: Build and verify JSON-LD**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && grep -o 'application/ld+json[^<]*' dist/index.html | head -5
```

Expected: Two `application/ld+json` script tags present in the built HTML.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add Organization and WebSite JSON-LD to homepage"
```

---

### Task 5: Update apps.ts slug for DebridDownloader and add landing page data

**Files:**
- Modify: `src/data/apps.ts`

The current `apps.ts` already has slugs but DebridDownloader's slug is `debriddownloader` — we need it to be `debrid-downloader` so the URL matches `/debrid-downloader`. We also need to add a `landingPage` field so app cards can link to landing pages.

- [ ] **Step 1: Update the DebridDownloader slug**

In `src/data/apps.ts`, change the slug from `debriddownloader` to `debrid-downloader`:

```typescript
// old
slug: 'debriddownloader',

// new
slug: 'debrid-downloader',
```

- [ ] **Step 2: Verify no other code references the old slug**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && grep -r "debriddownloader" src/
```

Expected: Only `src/data/apps.ts` (which we just changed). If nothing else references it, we're clean.

- [ ] **Step 3: Commit**

```bash
git add src/data/apps.ts
git commit -m "fix: update DebridDownloader slug to debrid-downloader for URL consistency"
```

---

### Task 6: Update AppCard to link to landing pages

**Files:**
- Modify: `src/components/AppCard.astro`

Each app card's name/title should link to its landing page (`/beltr`, `/streamline`, etc.) as the primary action.

- [ ] **Step 1: Update AppCard.astro flagship card heading**

In `src/components/AppCard.astro`, find the flagship card's `<h3>` (line 62):

```astro
<!-- old -->
<h3 class="text-2xl md:text-3xl font-semibold">{app.name}</h3>

<!-- new -->
<h3 class="text-2xl md:text-3xl font-semibold">
  <a href={`/${app.slug}`} class="no-underline text-inherit hover:text-[var(--color-accent)] transition-colors duration-200">{app.name}</a>
</h3>
```

- [ ] **Step 2: Update AppCard.astro standard card heading**

Find the standard card's `<h3>` (line 144):

```astro
<!-- old -->
<h3 class="text-lg font-semibold mb-2">{app.name}</h3>

<!-- new -->
<h3 class="text-lg font-semibold mb-2">
  <a href={`/${app.slug}`} class="no-underline text-inherit hover:text-[var(--color-accent)] transition-colors duration-200">{app.name}</a>
</h3>
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && grep -o 'href="/beltr"' dist/index.html
```

Expected: At least one match showing the link to `/beltr`.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppCard.astro
git commit -m "feat: link app card titles to their landing pages"
```

---

### Task 7: Update Nav.astro to include Blog link

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Add Blog link to desktop nav**

In `src/components/Nav.astro`, find the desktop nav `<div>` (line 26-39). Add a Blog link after the About link:

```astro
<!-- old -->
    <a href="#about" class="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200 no-underline">About</a>
    <a

<!-- new -->
    <a href="#about" class="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200 no-underline">About</a>
    <a href="/blog" class="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors duration-200 no-underline">Blog</a>
    <a
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Blog link to navigation"
```

---

### Task 8: Update Footer.astro with app page and blog links

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update Footer.astro**

Replace the full contents of `src/components/Footer.astro` with:

```astro
---
import { apps } from '../data/apps';
---

<footer class="max-w-6xl mx-auto px-6 py-10 border-t" style="border-color: var(--color-border);">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <!-- Apps column -->
    <div>
      <h4 class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-text-tertiary);">Apps</h4>
      <ul class="space-y-2">
        {apps.map((app) => (
          <li>
            <a
              href={`/${app.slug}`}
              class="text-sm no-underline transition-colors duration-200 hover:text-white"
              style="color: var(--color-text-secondary);"
            >
              {app.name}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <!-- Resources column -->
    <div>
      <h4 class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-text-tertiary);">Resources</h4>
      <ul class="space-y-2">
        <li>
          <a href="/blog" class="text-sm no-underline transition-colors duration-200 hover:text-white" style="color: var(--color-text-secondary);">Blog</a>
        </li>
        <li>
          <a href="https://github.com/CasaVargas" target="_blank" rel="noopener" class="text-sm no-underline transition-colors duration-200 hover:text-white" style="color: var(--color-text-secondary);">GitHub</a>
        </li>
        <li>
          <a href="mailto:hello@casavargas.app" class="text-sm no-underline transition-colors duration-200 hover:text-white" style="color: var(--color-text-secondary);">Contact</a>
        </li>
      </ul>
    </div>

    <!-- Support column -->
    <div>
      <h4 class="text-xs font-semibold tracking-widest uppercase mb-3" style="color: var(--color-text-tertiary);">Support</h4>
      <ul class="space-y-2">
        <li>
          <a
            href="https://github.com/sponsors/prjoni99"
            target="_blank"
            rel="noopener"
            class="text-sm no-underline transition-colors duration-200 inline-flex items-center gap-1.5"
            style="color: var(--color-accent-pink);"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5z"/>
            </svg>
            Sponsor
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t" style="border-color: var(--color-border);">
    <p class="text-sm font-light" style="color: var(--color-text-tertiary);">
      &copy; 2025 CasaVargas LLC
    </p>
    <a
      href="https://github.com/CasaVargas"
      target="_blank"
      rel="noopener"
      class="transition-colors duration-200"
      style="color: var(--color-text-tertiary);"
      onmouseenter="this.style.color='var(--color-text-primary)'"
      onmouseleave="this.style.color='var(--color-text-tertiary)'"
      aria-label="GitHub"
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </a>
  </div>
</footer>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && grep -o 'href="/blog"' dist/index.html
```

Expected: Blog link present in footer.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add app pages and blog links to footer"
```

---

### Task 9: Create Beltr landing page

**Files:**
- Create: `src/pages/beltr.astro`

- [ ] **Step 1: Create beltr.astro**

Create `src/pages/beltr.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import JsonLd from '../components/JsonLd.astro';

const title = 'Beltr — AI-Powered Karaoke for Mac, Windows & Linux';
const description = 'Beltr uses AI vocal separation to turn any song into a karaoke track. Runs on Mac, Windows, and Linux with iOS and Android remotes. No subscriptions.';

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Beltr',
  description,
  url: 'https://beltr.app',
  operatingSystem: 'macOS, Windows, Linux',
  applicationCategory: 'MultimediaApplication',
  author: {
    '@type': 'Organization',
    name: 'CasaVargas LLC',
    url: 'https://casavargas.app',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};
---

<Layout title={title} description={description} ogImage="/beltr-logo-text.svg">
  <JsonLd data={softwareSchema} />
  <Nav />

  <main class="max-w-4xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Beltr' }]} />

    <!-- Hero -->
    <div class="flex items-start gap-5 mb-8">
      <img src="/beltr-logo-text.svg" alt="Beltr logo" width="80" height="80" class="rounded-2xl flex-shrink-0" />
      <div>
        <p class="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-1" style="color: var(--color-accent-green);">Live</p>
        <h1 class="text-4xl md:text-5xl font-normal leading-tight mb-2" style="font-family: var(--font-display);">Beltr</h1>
        <p class="text-lg font-light" style="color: var(--color-text-secondary);">AI-Powered Karaoke Engine</p>
      </div>
    </div>

    <p class="text-lg font-light leading-relaxed mb-8" style="color: var(--color-text-secondary); max-width: 640px;">
      Beltr is the karaoke app that doesn't exist yet — until now. It uses AI vocal separation to strip vocals from any song in real time, turning your music library into an infinite karaoke catalog. No need to find karaoke versions. No need for special files. Just play any song and sing.
    </p>

    <!-- Platforms -->
    <div class="flex flex-wrap gap-2 mb-12">
      {['macOS', 'Windows', 'Linux', 'iOS Remote', 'Android Remote'].map((p) => (
        <span class="text-xs px-3 py-1.5 rounded-full border" style="font-family: var(--font-mono); color: var(--color-text-secondary); border-color: var(--color-border); background: rgba(255,255,255,0.02);">
          {p}
        </span>
      ))}
    </div>

    <!-- Features -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-8" style="font-family: var(--font-display);">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'AI Vocal Separation',
            desc: 'State-of-the-art AI isolates vocals from any audio track in real time. No pre-processed karaoke files needed — your entire music library becomes singable.',
          },
          {
            title: 'Cross-Platform Desktop',
            desc: 'Runs natively on macOS, Windows, and Linux. Built with performance-first architecture so vocal separation happens without lag, even on modest hardware.',
          },
          {
            title: 'Phone as Remote',
            desc: 'Use your iPhone or Android phone as a wireless remote. Browse songs, queue tracks, and control playback without touching the computer.',
          },
          {
            title: 'Multi-Microphone Support',
            desc: 'Connect multiple microphones for duets and group sessions. Independent volume controls per mic so everyone sounds balanced.',
          },
          {
            title: 'Live Lyrics Sync',
            desc: 'Synchronized lyrics display that follows along with the music. Never lose your place, even in fast sections.',
          },
          {
            title: 'No Subscriptions',
            desc: 'Buy it once, own it forever. No monthly fees, no feature gates, no recurring charges. Your karaoke machine, permanently.',
          },
        ].map((feature) => (
          <div class="rounded-2xl p-6 border" style="background: var(--color-bg-card); border-color: var(--color-border);">
            <h3 class="text-base font-semibold mb-2">{feature.title}</h3>
            <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <!-- How It Works -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-6" style="font-family: var(--font-display);">How It Works</h2>
      <div class="space-y-6">
        {[
          { step: '1', title: 'Load Your Music', desc: 'Point Beltr at your local music library or drag in individual files. MP3, FLAC, WAV, AAC — it handles everything.' },
          { step: '2', title: 'AI Separates Vocals', desc: 'Beltr\'s AI model processes the audio and separates the vocal track from the instrumental. This happens in real time as the song plays.' },
          { step: '3', title: 'Sing Along', desc: 'The instrumental plays through your speakers while lyrics scroll on screen. Grab a mic and go — or use your phone as a remote to control the session from the couch.' },
        ].map((item) => (
          <div class="flex gap-4 items-start">
            <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style="background: rgba(239, 159, 39, 0.1); color: var(--color-accent);">
              {item.step}
            </span>
            <div>
              <h3 class="text-base font-semibold mb-1">{item.title}</h3>
              <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <!-- CTA -->
    <section class="rounded-2xl p-8 border text-center" style="background: var(--color-bg-card); border-color: var(--color-border);">
      <h2 class="text-2xl font-normal mb-3" style="font-family: var(--font-display);">Ready to sing?</h2>
      <p class="text-sm font-light mb-6" style="color: var(--color-text-secondary);">Visit beltr.app to download Beltr for your platform.</p>
      <a
        href="https://beltr.app"
        target="_blank"
        rel="noopener"
        class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80"
        style="background: var(--color-accent); color: #07070a;"
      >
        Get Beltr &rarr;
      </a>
    </section>
  </main>

  <Footer />
</Layout>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/beltr/index.html
```

Expected: File exists (Astro generates `beltr/index.html` for the `/beltr` route).

- [ ] **Step 3: Commit**

```bash
git add src/pages/beltr.astro
git commit -m "feat: add Beltr landing page with SEO and JSON-LD"
```

---

### Task 10: Create Streamline landing page

**Files:**
- Create: `src/pages/streamline.astro`

- [ ] **Step 1: Create streamline.astro**

Create `src/pages/streamline.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import JsonLd from '../components/JsonLd.astro';

const title = 'Streamline — Native IPTV Player for Apple TV & Mac';
const description = 'A native IPTV player built for Apple TV, Mac, and iPhone. Supports M3U playlists with a fast, beautiful interface. No subscriptions.';

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Streamline',
  description,
  url: 'https://getstreamline.tv',
  operatingSystem: 'tvOS, macOS, iOS',
  applicationCategory: 'EntertainmentApplication',
  author: {
    '@type': 'Organization',
    name: 'CasaVargas LLC',
    url: 'https://casavargas.app',
  },
};
---

<Layout title={title} description={description} ogImage="/streamline/icon.png">
  <JsonLd data={softwareSchema} />
  <Nav />

  <main class="max-w-4xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Streamline' }]} />

    <!-- Hero -->
    <div class="flex items-start gap-5 mb-8">
      <img src="/streamline/icon.png" alt="Streamline logo" width="80" height="80" class="rounded-2xl flex-shrink-0" />
      <div>
        <p class="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-1" style="color: var(--color-accent);">Coming Soon</p>
        <h1 class="text-4xl md:text-5xl font-normal leading-tight mb-2" style="font-family: var(--font-display);">Streamline</h1>
        <p class="text-lg font-light" style="color: var(--color-text-secondary);">Premium IPTV Player</p>
      </div>
    </div>

    <p class="text-lg font-light leading-relaxed mb-8" style="color: var(--color-text-secondary); max-width: 640px;">
      Streamline is the IPTV player Apple would build. Pure SwiftUI across every Apple platform — Apple TV, Mac, iPhone, iPad, and Vision Pro. Fast channel switching, full EPG, TMDB metadata enrichment, and a 10-foot UI designed for the big screen.
    </p>

    <!-- Platforms -->
    <div class="flex flex-wrap gap-2 mb-12">
      {['Apple TV', 'Mac', 'iPhone', 'iPad', 'Vision Pro'].map((p) => (
        <span class="text-xs px-3 py-1.5 rounded-full border" style="font-family: var(--font-mono); color: var(--color-text-secondary); border-color: var(--color-border); background: rgba(255,255,255,0.02);">
          {p}
        </span>
      ))}
    </div>

    <!-- Screenshots -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-6" style="font-family: var(--font-display);">Screenshots</h2>
      <div class="screenshots-scroll flex gap-3 overflow-x-auto pb-3" style="scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;">
        {['/streamline/home.png', '/streamline/live-tv-grid.png', '/streamline/live-tv-list.png', '/streamline/program-detail.png', '/streamline/player-info.png', '/streamline/vod.png'].map((src, i) => (
          <img
            src={src}
            alt={`Streamline screenshot ${i + 1}`}
            class="h-56 md:h-72 rounded-xl flex-shrink-0 border"
            style="scroll-snap-align: start; border-color: var(--color-border);"
            loading="lazy"
          />
        ))}
      </div>
    </section>

    <!-- Features -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-8" style="font-family: var(--font-display);">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Native on Every Apple Platform',
            desc: 'Built entirely in SwiftUI — not a web view, not a port. Streamline feels like it belongs on Apple TV, Mac, iPhone, iPad, and Vision Pro.',
          },
          {
            title: 'M3U Playlist Support',
            desc: 'Load any M3U or M3U8 playlist. Streamline parses channels, groups, and EPG data automatically so you can start watching in seconds.',
          },
          {
            title: 'Full Electronic Program Guide',
            desc: 'Browse what\'s on now and what\'s coming up. The EPG is fast, scrollable, and displays rich metadata pulled from TMDB.',
          },
          {
            title: 'TMDB Metadata Enrichment',
            desc: 'Movie and show artwork, descriptions, ratings, and cast info pulled from The Movie Database. Your channel list looks like a streaming service.',
          },
          {
            title: 'Focus-Engine UI for tvOS',
            desc: 'Designed for the Apple TV remote from day one. Every interaction works with the Siri Remote\'s touch surface and the tvOS focus engine.',
          },
          {
            title: 'No Subscriptions',
            desc: 'One-time purchase. No monthly fees to watch your own content. Your streams, your player, your rules.',
          },
        ].map((feature) => (
          <div class="rounded-2xl p-6 border" style="background: var(--color-bg-card); border-color: var(--color-border);">
            <h3 class="text-base font-semibold mb-2">{feature.title}</h3>
            <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <!-- CTA -->
    <section class="rounded-2xl p-8 border text-center" style="background: var(--color-bg-card); border-color: var(--color-border);">
      <h2 class="text-2xl font-normal mb-3" style="font-family: var(--font-display);">Coming soon</h2>
      <p class="text-sm font-light mb-6" style="color: var(--color-text-secondary);">Streamline is in active development. Visit getstreamline.tv for updates.</p>
      <a
        href="https://getstreamline.tv"
        target="_blank"
        rel="noopener"
        class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80"
        style="background: var(--color-accent); color: #07070a;"
      >
        Visit Streamline &rarr;
      </a>
    </section>
  </main>

  <Footer />
</Layout>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/streamline/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/streamline.astro
git commit -m "feat: add Streamline landing page with SEO and JSON-LD"
```

---

### Task 11: Create OneScribe landing page

**Files:**
- Create: `src/pages/onescribe.astro`

- [ ] **Step 1: Create onescribe.astro**

Create `src/pages/onescribe.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import JsonLd from '../components/JsonLd.astro';

const title = 'OneScribe — AI Document Scanner for iPhone';
const description = 'Scan documents with AI-powered OCR on your iPhone. Fast, accurate text recognition with no subscriptions.';

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OneScribe',
  description,
  url: 'https://getonescribe.app',
  operatingSystem: 'iOS',
  applicationCategory: 'BusinessApplication',
  author: {
    '@type': 'Organization',
    name: 'CasaVargas LLC',
    url: 'https://casavargas.app',
  },
};
---

<Layout title={title} description={description} ogImage="/OneScribe.png">
  <JsonLd data={softwareSchema} />
  <Nav />

  <main class="max-w-4xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'OneScribe' }]} />

    <!-- Hero -->
    <div class="flex items-start gap-5 mb-8">
      <img src="/OneScribe.png" alt="OneScribe logo" width="80" height="80" class="rounded-2xl flex-shrink-0" />
      <div>
        <p class="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-1" style="color: var(--color-accent-green);">Live on the App Store</p>
        <h1 class="text-4xl md:text-5xl font-normal leading-tight mb-2" style="font-family: var(--font-display);">OneScribe</h1>
        <p class="text-lg font-light" style="color: var(--color-text-secondary);">AI Document Scanner</p>
      </div>
    </div>

    <p class="text-lg font-light leading-relaxed mb-8" style="color: var(--color-text-secondary); max-width: 640px;">
      OneScribe turns your iPhone into an intelligent document scanner. Powered by Apple's VisionKit and CoreML, it doesn't just scan — it understands. Extract text, recognize handwriting, and export to Google Docs, OneNote, Markdown, and more. All processing happens on-device. Your documents never leave your phone.
    </p>

    <!-- Platforms -->
    <div class="flex flex-wrap gap-2 mb-12">
      <span class="text-xs px-3 py-1.5 rounded-full border" style="font-family: var(--font-mono); color: var(--color-text-secondary); border-color: var(--color-border); background: rgba(255,255,255,0.02);">
        iOS
      </span>
    </div>

    <!-- Features -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-8" style="font-family: var(--font-display);">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'AI-Powered OCR',
            desc: 'Uses Apple\'s VisionKit and CoreML for best-in-class text recognition. Handles printed text, handwriting, receipts, and complex layouts.',
          },
          {
            title: 'On-Device Processing',
            desc: 'All scanning and text recognition happens locally on your iPhone. No cloud uploads, no data collection, no privacy concerns.',
          },
          {
            title: 'Multi-Format Export',
            desc: 'Export scanned documents to Google Docs, OneNote, Markdown, PDF, and plain text. Share directly from the app to any destination.',
          },
          {
            title: 'Smart Document Detection',
            desc: 'Automatically detects document edges, corrects perspective, and enhances contrast. Just point your camera and OneScribe handles the rest.',
          },
          {
            title: 'Built with SwiftUI',
            desc: 'Native iOS app built entirely in SwiftUI and Swift 6. Fast, fluid, and designed to feel like it belongs on your iPhone.',
          },
          {
            title: 'No Subscriptions',
            desc: 'One-time purchase on the App Store. No monthly fees, no premium tiers, no feature gates. Every feature is included.',
          },
        ].map((feature) => (
          <div class="rounded-2xl p-6 border" style="background: var(--color-bg-card); border-color: var(--color-border);">
            <h3 class="text-base font-semibold mb-2">{feature.title}</h3>
            <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <!-- CTA -->
    <section class="rounded-2xl p-8 border text-center" style="background: var(--color-bg-card); border-color: var(--color-border);">
      <h2 class="text-2xl font-normal mb-3" style="font-family: var(--font-display);">Scan smarter</h2>
      <p class="text-sm font-light mb-6" style="color: var(--color-text-secondary);">Download OneScribe from the App Store.</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a
          href="https://apps.apple.com/us/app/onescribe-ai-scanner-ocr/id6756506734"
          target="_blank"
          rel="noopener"
          class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80"
          style="background: var(--color-accent); color: #07070a;"
        >
          App Store &rarr;
        </a>
        <a
          href="https://getonescribe.app"
          target="_blank"
          rel="noopener"
          class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80 border"
          style="color: var(--color-accent); border-color: rgba(239, 159, 39, 0.3);"
        >
          Website &rarr;
        </a>
      </div>
    </section>
  </main>

  <Footer />
</Layout>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/onescribe/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/onescribe.astro
git commit -m "feat: add OneScribe landing page with SEO and JSON-LD"
```

---

### Task 12: Create DebridDownloader landing page

**Files:**
- Create: `src/pages/debrid-downloader.astro`

- [ ] **Step 1: Create debrid-downloader.astro**

Create `src/pages/debrid-downloader.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Breadcrumbs from '../components/Breadcrumbs.astro';
import JsonLd from '../components/JsonLd.astro';

const title = 'DebridDownloader — Open Source Debrid Download Manager';
const description = 'A free, open-source desktop download manager for Real-Debrid. Available on Mac, Windows, and Linux.';

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DebridDownloader',
  description,
  url: 'https://github.com/CasaVargas/DebridDownloader',
  operatingSystem: 'macOS, Windows, Linux',
  applicationCategory: 'UtilitiesApplication',
  author: {
    '@type': 'Organization',
    name: 'CasaVargas LLC',
    url: 'https://casavargas.app',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};
---

<Layout title={title} description={description} ogImage="/DebridDownloader.png">
  <JsonLd data={softwareSchema} />
  <Nav />

  <main class="max-w-4xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'DebridDownloader' }]} />

    <!-- Hero -->
    <div class="flex items-start gap-5 mb-8">
      <img src="/DebridDownloader.png" alt="DebridDownloader logo" width="80" height="80" class="rounded-2xl flex-shrink-0" />
      <div>
        <p class="text-[0.65rem] font-semibold tracking-[0.2em] uppercase mb-1" style="color: var(--color-accent-dark);">Open Source</p>
        <h1 class="text-4xl md:text-5xl font-normal leading-tight mb-2" style="font-family: var(--font-display);">DebridDownloader</h1>
        <p class="text-lg font-light" style="color: var(--color-text-secondary);">Desktop Download Manager</p>
      </div>
    </div>

    <p class="text-lg font-light leading-relaxed mb-8" style="color: var(--color-text-secondary); max-width: 640px;">
      A blazing-fast, open-source desktop client for Real-Debrid. Built with Tauri, Rust, and React for a native experience on every platform. Multi-threaded downloads, keyboard-first interface, configurable trackers, and full theme support. Free and open source — no catches.
    </p>

    <!-- Platforms -->
    <div class="flex flex-wrap gap-2 mb-12">
      {['macOS', 'Windows', 'Linux'].map((p) => (
        <span class="text-xs px-3 py-1.5 rounded-full border" style="font-family: var(--font-mono); color: var(--color-text-secondary); border-color: var(--color-border); background: rgba(255,255,255,0.02);">
          {p}
        </span>
      ))}
    </div>

    <!-- Features -->
    <section class="mb-16">
      <h2 class="text-2xl font-normal mb-8" style="font-family: var(--font-display);">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'Multi-Threaded Downloads',
            desc: 'Saturate your connection with parallel download chunks. DebridDownloader maximizes throughput from Real-Debrid\'s servers.',
          },
          {
            title: 'Keyboard-First Interface',
            desc: 'Navigate entirely with keyboard shortcuts. Add links, manage downloads, and configure settings without touching the mouse.',
          },
          {
            title: 'Built with Tauri & Rust',
            desc: 'Native performance with a tiny footprint. Tauri gives you a real desktop app — not an Electron memory hog. The download engine is pure Rust.',
          },
          {
            title: 'Configurable Trackers',
            desc: 'Add and manage custom trackers. DebridDownloader handles magnet links, torrents, and direct URLs with full Real-Debrid API integration.',
          },
          {
            title: 'Full Theme Support',
            desc: 'Light and dark themes out of the box, with full customization support. Make it look how you want.',
          },
          {
            title: 'Free & Open Source',
            desc: 'MIT licensed. Read the code, fork it, contribute to it. No telemetry, no ads, no premium tier. Just a download manager that works.',
          },
        ].map((feature) => (
          <div class="rounded-2xl p-6 border" style="background: var(--color-bg-card); border-color: var(--color-border);">
            <h3 class="text-base font-semibold mb-2">{feature.title}</h3>
            <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <!-- CTA -->
    <section class="rounded-2xl p-8 border text-center" style="background: var(--color-bg-card); border-color: var(--color-border);">
      <h2 class="text-2xl font-normal mb-3" style="font-family: var(--font-display);">Download for free</h2>
      <p class="text-sm font-light mb-6" style="color: var(--color-text-secondary);">Grab the latest release from GitHub.</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a
          href="https://github.com/CasaVargas/DebridDownloader"
          target="_blank"
          rel="noopener"
          class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80"
          style="background: var(--color-accent); color: #07070a;"
        >
          GitHub &rarr;
        </a>
        <a
          href="https://github.com/sponsors/prjoni99"
          target="_blank"
          rel="noopener"
          class="inline-block text-sm font-semibold px-6 py-3 rounded-full no-underline transition-opacity duration-200 hover:opacity-80 border"
          style="color: var(--color-accent-pink); border-color: rgba(212, 83, 126, 0.3);"
        >
          Sponsor &rarr;
        </a>
      </div>
    </section>
  </main>

  <Footer />
</Layout>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/debrid-downloader/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/debrid-downloader.astro
git commit -m "feat: add DebridDownloader landing page with SEO and JSON-LD"
```

---

### Task 13: Set up blog content collection

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/` (directory)

- [ ] **Step 1: Create content collection config**

Create `src/content.config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create blog content directory**

```bash
mkdir -p /Users/jonathan/Desktop/casavargas.github.io/src/content/blog
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build
```

Expected: Build succeeds (empty collection is fine).

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add blog content collection config"
```

---

### Task 14: Create blog index and post layout pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create blog index page**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const title = 'Blog — CasaVargas';
const description = 'Articles on indie app development, native software, AI tools, and building without subscriptions.';
---

<Layout title={title} description={description}>
  <Nav />

  <main class="max-w-4xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />

    <h1 class="text-4xl md:text-5xl font-normal leading-tight mb-3" style="font-family: var(--font-display);">Blog</h1>
    <p class="text-lg font-light mb-12" style="color: var(--color-text-secondary);">
      Thoughts on building native software, AI tools, and running an indie studio.
    </p>

    {posts.length === 0 ? (
      <p class="text-sm font-light" style="color: var(--color-text-tertiary);">No posts yet. Check back soon.</p>
    ) : (
      <div class="space-y-6">
        {posts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class="block rounded-2xl p-6 border no-underline transition-all duration-300 hover:-translate-y-0.5"
            style="background: var(--color-bg-card); border-color: var(--color-border);"
            onmouseenter="this.style.borderColor='rgba(255,255,255,0.12)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.3)'"
            onmouseleave="this.style.borderColor='rgba(255,255,255,0.06)';this.style.boxShadow='none'"
          >
            <div class="flex items-center gap-3 mb-2">
              <time class="text-xs font-light" style="font-family: var(--font-mono); color: var(--color-text-tertiary);">
                {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
              <div class="flex gap-2">
                {post.data.tags.slice(0, 3).map((tag) => (
                  <span class="text-[0.6rem] font-medium px-2 py-0.5 rounded-full" style="background: rgba(239, 159, 39, 0.1); color: var(--color-accent);">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h2 class="text-xl font-semibold mb-2" style="color: var(--color-text-primary);">{post.data.title}</h2>
            <p class="text-sm font-light leading-relaxed" style="color: var(--color-text-secondary);">{post.data.description}</p>
          </a>
        ))}
      </div>
    )}
  </main>

  <Footer />
</Layout>
```

- [ ] **Step 2: Create blog post dynamic route**

Create `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import JsonLd from '../../components/JsonLd.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const blogPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.date.toISOString(),
  author: {
    '@type': 'Person',
    name: 'Jon Vargas',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CasaVargas LLC',
    logo: {
      '@type': 'ImageObject',
      url: 'https://casavargas.app/casavargas-logo-orange.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://casavargas.app/blog/${post.id}`,
  },
};
---

<Layout
  title={`${post.data.title} — CasaVargas`}
  description={post.data.description}
  ogImage={post.data.image ?? '/casavargas-logo-orange.png'}
  ogType="article"
>
  <JsonLd data={blogPostingSchema} />
  <Nav />

  <main class="max-w-3xl mx-auto px-6 pt-32 pb-24">
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.data.title }]} />

    <article>
      <header class="mb-10">
        <div class="flex items-center gap-3 mb-4">
          <time class="text-xs font-light" style="font-family: var(--font-mono); color: var(--color-text-tertiary);">
            {post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <div class="flex gap-2">
            {post.data.tags.map((tag) => (
              <span class="text-[0.6rem] font-medium px-2 py-0.5 rounded-full" style="background: rgba(239, 159, 39, 0.1); color: var(--color-accent);">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h1 class="text-3xl md:text-4xl font-normal leading-tight" style="font-family: var(--font-display);">{post.data.title}</h1>
      </header>

      <div class="prose">
        <Content />
      </div>
    </article>
  </main>

  <Footer />
</Layout>

<style is:global>
  .prose {
    color: var(--color-text-secondary);
    font-weight: 300;
    line-height: 1.8;
  }
  .prose h2 {
    color: var(--color-text-primary);
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.5rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }
  .prose h3 {
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.125rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }
  .prose p {
    margin-bottom: 1.25rem;
  }
  .prose a {
    color: var(--color-accent);
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .prose a:hover {
    opacity: 0.7;
  }
  .prose strong {
    color: var(--color-text-primary);
    font-weight: 600;
  }
  .prose ul, .prose ol {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }
  .prose li {
    margin-bottom: 0.5rem;
  }
  .prose code {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
  }
  .prose blockquote {
    border-left: 2px solid var(--color-accent);
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 1.25rem;
    font-style: italic;
    color: var(--color-text-tertiary);
  }
</style>
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/blog/index.html
```

Expected: Blog index page exists. No blog post pages yet (no content).

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro src/pages/blog/\\[slug\\].astro
git commit -m "feat: add blog index and dynamic post route pages"
```

---

### Task 15: Write blog post 1 — Building Beltr

**Files:**
- Create: `src/content/blog/building-beltr-ai-vocal-separation.md`

- [ ] **Step 1: Create the blog post**

Create `src/content/blog/building-beltr-ai-vocal-separation.md`:

```markdown
---
title: "Building Beltr: AI Vocal Separation for Cross-Platform Karaoke"
description: "A deep dive into how Beltr uses AI to separate vocals from any song in real time, and why we built it as a cross-platform desktop app with mobile remotes."
date: 2026-04-09
tags: [beltr, ai, cross-platform, engineering]
---

Every karaoke app has the same problem: you need karaoke versions of songs. Instrumental tracks, CDG files, or a streaming catalog that's always missing the one song you want to sing. We built [Beltr](/beltr) to kill that problem entirely.

## The Core Idea

What if every song was a karaoke song? Not through a catalog — through AI. Beltr takes any audio file from your music library and separates the vocals from the instrumental in real time. No pre-processing, no waiting, no special files. Hit play and the vocals drop out.

This is possible because of modern source separation models that have gotten remarkably good at isolating individual stems from mixed audio. The AI doesn't just lower the center channel (the old karaoke trick that killed everything panned center, including snare drums and bass). It actually understands what a human voice sounds like and surgically removes it while preserving the full instrumental.

## Why Desktop?

Karaoke is a living room activity. It happens on a TV or a big screen with speakers, not hunched over a phone. That means the app needs to run on the machine connected to your display — your Mac, Windows PC, or Linux box.

We built Beltr for all three platforms. The audio processing pipeline is performance-critical, so it needs native access to the hardware. A web app would introduce latency that makes singing along feel wrong. Even 100ms of audio delay is noticeable when you're trying to stay on beat.

## Phone as Remote

But nobody wants to walk to the computer to pick the next song. That's why Beltr uses your phone as a wireless remote. iOS and Android both work. You browse your library, queue songs, and control playback from the couch — while the audio plays through your desktop setup.

This architecture — desktop as the engine, phone as the controller — gives you the best of both worlds. The heavy lifting happens on hardware with real processing power, and the interface is in your hand where it's convenient.

## Multi-Microphone Support

Solo karaoke is fun. Group karaoke is a party. Beltr supports multiple microphones simultaneously with independent volume controls per mic. You can balance a quiet singer and a loud one without touching the computer. The mixing happens in real time alongside the vocal separation.

## No Subscriptions

Beltr is a one-time purchase. We don't rent you karaoke — you own it. There's no monthly fee to use your own music library, no premium tier for "better" vocal separation, no feature unlocks. You buy it once and it's yours.

This is a core principle at [CasaVargas](/) — software should be owned, not rented. We think the subscription model for standalone apps is disrespectful to users, and we refuse to participate in it.

## What's Next

Beltr is live now on macOS, Windows, and Linux. We're continuing to improve the vocal separation quality, adding more customization options for the singing experience, and refining the mobile remote apps. If you've ever wished you could sing along to any song without hunting for a karaoke version, [give Beltr a try](https://beltr.app).
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/blog/building-beltr-ai-vocal-separation/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/building-beltr-ai-vocal-separation.md
git commit -m "feat: add blog post — Building Beltr: AI Vocal Separation"
```

---

### Task 16: Write blog post 2 — Why We Don't Do Subscriptions

**Files:**
- Create: `src/content/blog/why-we-dont-do-subscriptions.md`

- [ ] **Step 1: Create the blog post**

Create `src/content/blog/why-we-dont-do-subscriptions.md`:

```markdown
---
title: "Why We Don't Do Subscriptions"
description: "CasaVargas apps are buy-once-own-forever. Here's why we reject the subscription model and how we make it work as an indie studio."
date: 2026-04-07
tags: [philosophy, pricing, indie-dev]
---

Every week another app switches to subscriptions. A weather app wants $5/month. A calculator needs an annual plan. A flashlight app — yes, a flashlight app — has a "Pro" tier. Something broke in the software industry and we're not going to fix it by joining in.

At [CasaVargas](/), every app is either a one-time purchase or free. No subscriptions, no recurring charges, no "premium" tiers that gate features you already paid for. Here's why.

## The Problem With Subscriptions

Subscriptions made sense for services that have ongoing costs — streaming music, cloud storage, server-side computation. Your Spotify subscription pays for bandwidth, licensing deals, and infrastructure that costs money every month you use it.

But most apps aren't services. A document scanner runs on your phone's hardware. A download manager uses your internet connection. A karaoke app processes audio on your computer. The ongoing costs to the developer are close to zero per user. So what exactly is the monthly fee paying for?

Usually, it's paying for the developer's lifestyle. Which is fine — developers deserve to make money. But there are better models than holding your tools hostage month after month.

## The One-Time Purchase Model

When you buy [OneScribe](/onescribe), [Beltr](/beltr), or any CasaVargas app, you own it. Updates are included. New features are included. There's no moment where you stop paying and lose access to your own workflows.

This creates the right incentive structure. We make money by building something good enough that new people want to buy it — not by trapping existing users into perpetual payments.

## How This Works Financially

The honest answer: it's harder. Subscription revenue is predictable and compounds. One-time purchases require you to keep finding new customers or keep building new products that existing customers want to buy.

But CasaVargas is a solo indie studio, not a VC-funded startup chasing recurring revenue metrics. The overhead is low. There's no board demanding MRR growth. If an app sells well enough to justify the time spent building it, that's a win.

We also use [GitHub Sponsors](https://github.com/sponsors/prjoni99) for open-source projects like [DebridDownloader](/debrid-downloader). If people find the software valuable and want to support continued development, they can — voluntarily, not because a paywall forces them to.

## The User Relationship

Subscriptions create an adversarial relationship between developer and user. The developer is incentivized to add just enough to keep you subscribing, but not so much that you'd be satisfied with a single purchase. Features get artificially gated. Free tiers get deliberately crippled.

One-time purchases align incentives. We want you to love the app enough to tell your friends about it. We want reviews that say "this is worth every penny" because that's how new customers find us. The only way to grow is to build something genuinely good.

## Our Promise

Every app we ship at CasaVargas will respect this principle. Buy it once, own it forever. If we can't make a product work financially as a one-time purchase, we'll make it free and open-source instead. You'll never open one of our apps and see a "your trial has expired" modal.

Software should be owned, not rented.
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/blog/why-we-dont-do-subscriptions/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/why-we-dont-do-subscriptions.md
git commit -m "feat: add blog post — Why We Don't Do Subscriptions"
```

---

### Task 17: Write blog post 3 — Native vs Cross-Platform

**Files:**
- Create: `src/content/blog/native-vs-cross-platform.md`

- [ ] **Step 1: Create the blog post**

Create `src/content/blog/native-vs-cross-platform.md`:

```markdown
---
title: "Native vs Cross-Platform: When to Use Each"
description: "CasaVargas ships both SwiftUI and Tauri apps. Here's how we decide which approach to use for each product, with real examples."
date: 2026-04-05
tags: [engineering, swiftui, tauri, architecture]
---

The native vs cross-platform debate usually goes like this: someone picks a side, defends it religiously, and dismisses everyone who disagrees. At [CasaVargas](/), we use both — and the choice depends entirely on the product, not a philosophical position.

## Our Stack

For Apple platforms, we build with **SwiftUI and Swift 6**. For cross-platform desktop apps, we use **Tauri with Rust and React**. These are two very different tools, and they're each best at different things.

## When We Go Native: SwiftUI

[Streamline](/streamline) is our IPTV player for Apple TV, Mac, iPhone, iPad, and Vision Pro. It's built entirely in SwiftUI. Here's why:

**Platform integration is the product.** An IPTV player on Apple TV needs to work with the tvOS focus engine, the Siri Remote's touch surface, and Apple's video playback APIs (AVKit). On Vision Pro, it needs spatial windows. On iPhone, it needs to feel like a first-party app. None of this works well through an abstraction layer.

**Performance is non-negotiable for video.** Streaming live TV requires tight integration with AVFoundation, hardware-accelerated decoding, and low-latency rendering. A cross-platform wrapper would add overhead in exactly the place where you can't afford it.

**The platforms diverge.** What works on a 65-inch TV operated by a remote is fundamentally different from what works on a phone you hold in your hand. SwiftUI lets us share business logic while building completely different UIs per platform with `NavigationSplitView` on iPad, `TabView` on iPhone, and focus-driven layouts on tvOS.

[OneScribe](/onescribe) is similar — it relies on VisionKit and CoreML for document scanning and OCR. These are Apple frameworks with no cross-platform equivalent. Going native isn't a preference, it's a requirement.

## When We Go Cross-Platform: Tauri

[Beltr](/beltr) is our karaoke engine for Mac, Windows, and Linux. [DebridDownloader](/debrid-downloader) is our download manager for the same platforms. Both are built with Tauri.

**The platform doesn't matter as much as the function.** A download manager needs to download files. A karaoke app needs to play audio and separate vocals. These operations aren't tied to any OS's unique capabilities — they work the same on Mac, Windows, and Linux.

**Tauri gives us native performance with cross-platform reach.** Unlike Electron, Tauri doesn't bundle a full Chromium instance. It uses the OS's native webview for the UI layer, and the backend is pure Rust. The result is a small binary, low memory usage, and real native performance for the heavy lifting (like Beltr's AI vocal separation pipeline, which runs in Rust).

**Three platforms, one codebase.** Writing DebridDownloader three times — once in SwiftUI, once in WPF, once in GTK — would be insane for a solo developer. Tauri lets us ship on all three platforms with a single codebase while still feeling native on each.

## The Decision Framework

Here's the mental model we use:

**Go native (SwiftUI) when:**
- The app lives on Apple platforms only
- Platform-specific APIs are core to the product (AVKit, VisionKit, CoreML, HealthKit)
- The UI needs to adapt deeply per platform (TV vs phone vs spatial)
- Performance requires direct hardware access

**Go cross-platform (Tauri) when:**
- The app needs to run on Mac, Windows, and Linux
- The core functionality is OS-agnostic
- Shipping on three platforms as a solo dev needs to be practical
- Native performance matters but native UI framework integration doesn't

## The Wrong Answer

The wrong answer is picking one approach for everything. Building an Apple TV app in Tauri would be absurd — you'd fight the platform the entire time. Building a download manager three times in three native frameworks would be a waste of months.

The right tool for each job. That's it. No ideology required.
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/blog/native-vs-cross-platform/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/native-vs-cross-platform.md
git commit -m "feat: add blog post — Native vs Cross-Platform: When to Use Each"
```

---

### Task 18: Write blog post 4 — Introducing Streamline

**Files:**
- Create: `src/content/blog/introducing-streamline-iptv-player.md`

- [ ] **Step 1: Create the blog post**

Create `src/content/blog/introducing-streamline-iptv-player.md`:

```markdown
---
title: "Introducing Streamline: A Native IPTV Player for Apple TV"
description: "Why we're building a native IPTV player from scratch for Apple TV, and what makes Streamline different from everything else out there."
date: 2026-04-03
tags: [streamline, tvos, apple-tv, product-launch]
---

If you've ever tried to watch IPTV on an Apple TV, you know the pain. The existing apps are either web views wrapped in a native shell, ports from Android with touch-based interfaces crammed onto a remote-driven platform, or abandoned projects that haven't been updated in years.

We're building [Streamline](/streamline) to fix this.

## What's Wrong With Current IPTV Apps

Most IPTV players on Apple TV share the same fundamental problem: they weren't built for Apple TV. They were built for phones or tablets, then stretched to fit a TV screen. The result is:

- **Broken navigation.** Buttons that expect touch input instead of focus-based navigation. You find yourself clicking the remote 30 times to reach something that should take 2 clicks.
- **Ugly interfaces.** Generic lists with tiny text designed for a phone held 12 inches from your face, now displayed on a 65-inch screen viewed from 10 feet away.
- **No metadata.** Channel lists with just names and numbers. No artwork, no descriptions, no information about what's currently playing.
- **Slow channel switching.** Buffering spinners every time you change the channel. On cable, switching channels is instant. IPTV apps make it feel like loading a web page.

## How Streamline Is Different

Streamline is built from scratch in SwiftUI for tvOS. Not ported, not adapted — designed for the Apple TV remote and the 10-foot viewing experience from day one.

### Focus-Engine Native

Every screen in Streamline works with the tvOS focus engine. The Siri Remote's touch surface moves focus smoothly between elements. Clicking feels instant. The UI responds to your input the way Apple's own apps do, because it uses the same underlying system.

### TMDB Metadata Enrichment

Streamline automatically enriches your channel list with metadata from The Movie Database. Movie channels show poster art, descriptions, ratings, and cast information. The channel guide looks like a streaming service, not a spreadsheet.

### Full Electronic Program Guide

Browse what's on now and what's coming up across all your channels. The EPG is horizontally scrollable, shows time blocks, and pulls in rich metadata. Finding something to watch is browsing, not searching.

### M3U Playlist Support

Load any M3U or M3U8 playlist. Streamline parses channels, groups, logos, and EPG data automatically. Point it at your playlist URL and you're watching in seconds.

### Built for Every Apple Platform

Streamline isn't just an Apple TV app. It runs on Mac, iPhone, iPad, and Vision Pro too. SwiftUI lets us share the data layer while building platform-appropriate UIs. The Apple TV version uses the focus engine. The iPhone version uses standard iOS navigation. The Vision Pro version uses spatial windows.

## No Subscriptions

Like every CasaVargas app, Streamline will be a one-time purchase. No monthly fee to watch your own content. Your M3U playlist, your streams, your player — permanently.

## Timeline

Streamline is in active development. We're shipping the tvOS and macOS versions first, with iOS, iPadOS, and visionOS following shortly after. Visit [getstreamline.tv](https://getstreamline.tv) for updates, or check back on the [Streamline page](/streamline) here.

We're building the IPTV player Apple would build — if Apple made IPTV players.
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build && ls dist/blog/introducing-streamline-iptv-player/index.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/introducing-streamline-iptv-player.md
git commit -m "feat: add blog post — Introducing Streamline: A Native IPTV Player"
```

---

### Task 19: Create off-site SEO documentation

**Files:**
- Create: `docs/off-site-seo-checklist.md`

- [ ] **Step 1: Create the checklist**

Create `docs/off-site-seo-checklist.md`:

```markdown
# Off-Site SEO Checklist — casavargas.app

Manual steps to maximize search visibility beyond the website itself.

## Search Engine Submission

- [ ] **Google Search Console** (already verified)
  - Go to [Google Search Console](https://search.google.com/search-console)
  - Navigate to Sitemaps
  - Submit: `https://casavargas.app/sitemap-index.xml`

- [ ] **Bing Webmaster Tools**
  - Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
  - Sign in with Microsoft account
  - Add site: `casavargas.app`
  - Verify via DNS TXT record or meta tag
  - Submit sitemap: `https://casavargas.app/sitemap-index.xml`
  - Note: Bing's index powers Bing, Yahoo, and DuckDuckGo

## GitHub Backlinks

- [ ] **GitHub Profile**
  - Go to [GitHub Settings > Profile](https://github.com/settings/profile)
  - Set Website field to: `https://casavargas.app`

- [ ] **Repository About Sections**
  - For each repo under CasaVargas org:
  - Click the gear icon on the repo's About section
  - Set Website to: `https://casavargas.app`

- [ ] **DebridDownloader README**
  - Add to the top of the README:
  - `**[casavargas.app/debrid-downloader](https://casavargas.app/debrid-downloader)** — Official homepage`

## App Store Backlinks

- [ ] **App Store Connect**
  - For each app (OneScribe, Beltr when listed, Streamline when listed):
  - Go to App Store Connect > App Information
  - Set Marketing URL to: `https://casavargas.app/{app-slug}`
  - Set Support URL to: `https://casavargas.app/{app-slug}` or your support email

## Social Profiles

- [ ] **Twitter/X**
  - Create @CasaVargas account (or personal brand account)
  - Set bio to include: `casavargas.app`
  - Pin tweet about the studio/latest app
  - Add handle to site's twitter:site meta tag

- [ ] **LinkedIn**
  - Create CasaVargas LLC company page
  - Set website to: `https://casavargas.app`
  - Add description matching site meta description

- [ ] **Bluesky**
  - Create account
  - Set website in profile
  - Cross-post content from blog

## Ongoing Content Strategy

- [ ] **Blog cadence**: Aim for 1-2 posts per month
  - App update announcements
  - Technical deep-dives
  - Indie dev philosophy / business
  - Keyword-targeted how-to articles

- [ ] **Social sharing**: Share each blog post on all social profiles

- [ ] **Monitor Google Search Console**: Check weekly for:
  - Indexing issues
  - Search queries bringing traffic
  - Pages with impressions but low clicks (optimize titles/descriptions)
```

- [ ] **Step 2: Commit**

```bash
git add docs/off-site-seo-checklist.md
git commit -m "docs: add off-site SEO checklist"
```

---

### Task 20: Final build verification and sitemap check

**Files:** None (verification only)

- [ ] **Step 1: Full build**

```bash
cd /Users/jonathan/Desktop/casavargas.github.io && npm run build
```

Expected: Build succeeds with zero errors.

- [ ] **Step 2: Verify all pages exist**

```bash
ls dist/index.html dist/beltr/index.html dist/streamline/index.html dist/onescribe/index.html dist/debrid-downloader/index.html dist/blog/index.html dist/blog/building-beltr-ai-vocal-separation/index.html dist/blog/why-we-dont-do-subscriptions/index.html dist/blog/native-vs-cross-platform/index.html dist/blog/introducing-streamline-iptv-player/index.html dist/robots.txt dist/sitemap-index.xml
```

Expected: All 12 files exist.

- [ ] **Step 3: Verify sitemap contains all URLs**

```bash
cat dist/sitemap-0.xml
```

Expected: XML containing URLs for all pages:
- `https://casavargas.app/`
- `https://casavargas.app/beltr/`
- `https://casavargas.app/streamline/`
- `https://casavargas.app/onescribe/`
- `https://casavargas.app/debrid-downloader/`
- `https://casavargas.app/blog/`
- `https://casavargas.app/blog/building-beltr-ai-vocal-separation/`
- `https://casavargas.app/blog/why-we-dont-do-subscriptions/`
- `https://casavargas.app/blog/native-vs-cross-platform/`
- `https://casavargas.app/blog/introducing-streamline-iptv-player/`

- [ ] **Step 4: Verify JSON-LD on homepage**

```bash
grep -c "application/ld+json" dist/index.html
```

Expected: `2` (Organization + WebSite schemas).

- [ ] **Step 5: Verify JSON-LD on an app page**

```bash
grep -c "application/ld+json" dist/beltr/index.html
```

Expected: `2` (SoftwareApplication + BreadcrumbList schemas).

- [ ] **Step 6: Verify JSON-LD on a blog post**

```bash
grep -c "application/ld+json" dist/blog/building-beltr-ai-vocal-separation/index.html
```

Expected: `2` (BlogPosting + BreadcrumbList schemas).

- [ ] **Step 7: Verify canonical URLs**

```bash
grep 'rel="canonical"' dist/beltr/index.html
```

Expected: `<link rel="canonical" href="https://casavargas.app/beltr">` or similar.

- [ ] **Step 8: Verify robots.txt**

```bash
cat dist/robots.txt
```

Expected: Contains `Sitemap: https://casavargas.app/sitemap-index.xml`.
