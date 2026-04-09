# SEO Optimization Design Spec — casavargas.app

**Date:** 2026-04-09
**Goal:** Maximum search impressions and brand awareness across all vectors — app discovery, studio branding, developer credibility.
**Site:** https://casavargas.app (Astro 5.x, Tailwind CSS v4, GitHub Pages)

---

## 1. Technical SEO Foundation

### 1.1 robots.txt
New file at `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://casavargas.app/sitemap-index.xml
```

### 1.2 Sitemap
- Install `@astrojs/sitemap` official integration
- Add to `astro.config.mjs` integrations array
- Auto-generates from all Astro pages using existing `site: 'https://casavargas.app'` config
- Updates automatically as new pages (app landing pages, blog posts) are added

### 1.3 Canonical URLs
- Add `<link rel="canonical" href={canonicalURL} />` to `Layout.astro` head
- Derived from `Astro.url` with site base URL
- Present on every page

### 1.4 Enhanced Meta Tags (Layout.astro)
Add/update the following in the `<head>`:
- `<meta name="author" content="Jon Vargas" />`
- `<meta name="theme-color" content="#f97316" />` (orange brand color)
- `<meta property="og:site_name" content="CasaVargas" />`
- `<meta property="og:locale" content="en_US" />`
- Make `og:image` absolute: `https://casavargas.app/casavargas-logo-orange.png`
- Add `twitter:site` and `twitter:creator` meta tags
- Add `twitter:title`, `twitter:description`, `twitter:image` per page

All meta tags are parameterized via Layout.astro props so each page can override them.

### 1.5 JSON-LD Structured Data (Homepage)

**Organization schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CasaVargas LLC",
  "url": "https://casavargas.app",
  "logo": "https://casavargas.app/casavargas-logo-orange.png",
  "founder": {
    "@type": "Person",
    "name": "Jon Vargas"
  },
  "description": "An indie studio shipping native apps, cross-platform tools, and self-hosted infrastructure.",
  "sameAs": [
    "https://github.com/CasaVargas"
  ]
}
```

**WebSite schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "CasaVargas",
  "url": "https://casavargas.app"
}
```

### 1.6 Performance SEO
- Add `<link rel="preconnect" href="https://www.googletagmanager.com" />` before GA script
- Audit all images for `alt` attributes — add descriptive alts where missing
- Verify `loading="lazy"` on below-fold images

---

## 2. App Landing Pages

### 2.1 URL Structure
| App | URL | Status |
|-----|-----|--------|
| Beltr | `/beltr` | New page |
| Streamline | `/streamline` | New page |
| OneScribe | `/onescribe` | New page |
| DebridDownloader | `/debrid-downloader` | New page |

### 2.2 Shared Template: AppLandingLayout.astro
A reusable layout component that accepts:
- `title` — Page title (SEO)
- `description` — Meta description (SEO)
- `ogImage` — OG image path
- `app` — App data object (from `apps.ts`)
- `schema` — JSON-LD SoftwareApplication data
- `keywords` — Target keyword list

Template sections:
1. **Hero** — App icon, name, tagline, platform badges, primary CTA (download/link)
2. **Features** — 3-5 features with icons/illustrations and descriptions
3. **Screenshots** — Gallery/showcase of app screenshots
4. **How It Works** — Technical or usage walkthrough
5. **CTA** — Download links, app store badges, GitHub link (if open source)
6. **Breadcrumbs** — Visual + JSON-LD breadcrumb trail

### 2.3 Keyword Strategy

**Beltr** (`/beltr`)
- Title: `Beltr — AI-Powered Karaoke for Mac, Windows & Linux`
- Description: `Beltr uses AI vocal separation to turn any song into a karaoke track. Runs on Mac, Windows, and Linux with iOS and Android remotes. No subscriptions.`
- Primary keywords: "AI vocal separation app", "karaoke app desktop", "karaoke software Linux Mac Windows"
- Secondary: "AI singing app", "vocal remover karaoke", "cross-platform karaoke", "phone remote karaoke"
- JSON-LD: SoftwareApplication with operatingSystem: macOS, Windows, Linux; applicationCategory: MultimediaApplication

**Streamline** (`/streamline`)
- Title: `Streamline — Native IPTV Player for Apple TV & Mac`
- Description: `A native IPTV player built for Apple TV, Mac, and iPhone. Supports M3U playlists with a fast, beautiful interface. No subscriptions.`
- Primary keywords: "IPTV player Apple TV", "M3U player macOS", "IPTV app tvOS"
- Secondary: "native IPTV player", "Apple TV live TV app"
- JSON-LD: SoftwareApplication with operatingSystem: tvOS, macOS, iOS; applicationCategory: EntertainmentApplication

**OneScribe** (`/onescribe`)
- Title: `OneScribe — AI Document Scanner for iPhone`
- Description: `Scan documents with AI-powered OCR on your iPhone. Fast, accurate text recognition with no subscriptions.`
- Primary keywords: "AI document scanner iOS", "OCR app iPhone", "document scanner app"
- Secondary: "AI OCR scanner", "scan documents iPhone", "text recognition app"
- JSON-LD: SoftwareApplication with operatingSystem: iOS; applicationCategory: BusinessApplication

**DebridDownloader** (`/debrid-downloader`)
- Title: `DebridDownloader — Open Source Debrid Download Manager`
- Description: `A free, open-source desktop download manager for Real-Debrid. Available on Mac, Windows, and Linux.`
- Primary keywords: "real-debrid download manager", "debrid client desktop", "open source debrid app"
- Secondary: "debrid downloader Mac Windows Linux", "real-debrid desktop app"
- JSON-LD: SoftwareApplication with operatingSystem: macOS, Windows, Linux; applicationCategory: UtilitiesApplication; offers.price: 0

---

## 3. Blog System

### 3.1 Technical Setup
- Astro Content Collections: `src/content/blog/` directory with Markdown files
- Content collection config in `src/content.config.ts` (or `src/content/config.ts`)
- Frontmatter schema: title, description, date, tags, image, imageAlt
- Blog index: `src/pages/blog/index.astro`
- Blog posts: `src/pages/blog/[slug].astro` (dynamic route from collection)
- JSON-LD `BlogPosting` schema per post
- All posts auto-included in sitemap

### 3.2 Blog Layout: BlogPostLayout.astro
Accepts:
- Post frontmatter (title, description, date, tags, image)
- Renders Markdown content
- Breadcrumb: Home > Blog > Post Title
- JSON-LD BlogPosting schema
- OG tags unique per post
- Internal links to related app pages in content

### 3.3 Blog Index Page (`/blog`)
- Title: `Blog — CasaVargas`
- Description: `Articles on indie app development, native software, AI tools, and building without subscriptions.`
- List of posts: title, date, excerpt, tags
- Sorted by date descending

### 3.4 Initial Blog Posts (4)

**Post 1: "Building Beltr: AI Vocal Separation for Cross-Platform Karaoke"**
- Slug: `building-beltr-ai-vocal-separation`
- Target keywords: "AI vocal separation", "how karaoke apps work", "building cross-platform apps"
- Content: Technical deep-dive on Beltr's architecture — AI vocal separation pipeline, cross-platform approach (desktop app + mobile remotes), why native matters for audio latency
- Internal links: `/beltr`
- Tags: beltr, ai, cross-platform, engineering

**Post 2: "Why We Don't Do Subscriptions"**
- Slug: `why-we-dont-do-subscriptions`
- Target keywords: "apps without subscriptions", "one-time purchase apps", "anti-subscription software"
- Content: Philosophy piece on why CasaVargas apps are buy-once-own-forever. The economics of indie dev, respecting users, sustainable pricing without recurring charges
- Internal links: all app pages
- Tags: philosophy, pricing, indie-dev

**Post 3: "Native vs Cross-Platform: When to Use Each"**
- Slug: `native-vs-cross-platform`
- Target keywords: "SwiftUI vs React Native", "native app development", "Tauri vs Electron"
- Content: CasaVargas uses both — SwiftUI for Apple platforms, Tauri+Rust+React for desktop. When to pick which, real examples from the portfolio
- Internal links: `/beltr`, `/debrid-downloader`
- Tags: engineering, swiftui, tauri, architecture

**Post 4: "Introducing Streamline: A Native IPTV Player for Apple TV"**
- Slug: `introducing-streamline-iptv-player`
- Target keywords: "IPTV player Apple TV", "native tvOS app", "Streamline IPTV"
- Content: Product announcement — what Streamline does, why existing IPTV players suck, focus-engine UI on tvOS, M3U support, roadmap
- Internal links: `/streamline`
- Tags: streamline, tvos, apple-tv, product-launch

---

## 4. Navigation & Internal Linking

### 4.1 Updated Navigation (Nav.astro)
- **Logo** — links to `/`
- **Apps** — links to `/#apps` section on homepage (individual app pages linked from cards)
- **Blog** — links to `/blog`
- **About** — links to `/#about`
- **Get in Touch** — email CTA (keep existing)

### 4.2 Internal Linking Strategy
- Homepage app cards: each card links to its dedicated landing page (`/beltr`, etc.) as primary action, with external links (App Store, GitHub) as secondary
- App landing pages: link back to homepage, link to related blog posts in a "Read more" section
- Blog posts: contextual inline links to app landing pages where relevant
- Blog posts: link to other related blog posts
- Footer: updated with links to all app pages, blog, GitHub, email

### 4.3 Breadcrumbs
- Visual breadcrumb component on all sub-pages
- JSON-LD `BreadcrumbList` schema on every sub-page
- App pages: Home > Beltr (etc.)
- Blog posts: Home > Blog > Post Title

---

## 5. Off-Site SEO & Social Optimization

### 5.1 Per-Page OG Images
- Directory: `public/og/`
- Files: `beltr.png`, `streamline.png`, `onescribe.png`, `debrid-downloader.png`, `blog-default.png`
- Format: 1200x630px, app icon + name + tagline on branded background
- Blog posts can use custom images or fall back to `blog-default.png`
- Referenced via absolute URL in OG meta tags

### 5.2 Twitter/X Card Tags
Every page includes:
- `twitter:card` = `summary_large_image`
- `twitter:site` = CasaVargas handle (TBD — user to provide or create)
- `twitter:creator` = Jon Vargas personal handle (TBD)
- `twitter:title`, `twitter:description`, `twitter:image` unique per page

### 5.3 Manual Off-Site Steps (Documented for User)

| # | Task | Instructions | Effort |
|---|------|-------------|--------|
| 1 | Submit sitemap to Google Search Console | Go to GSC > Sitemaps > Add `https://casavargas.app/sitemap-index.xml` | 2 min |
| 2 | Register Bing Webmaster Tools | Go to bing.com/webmasters, sign in, add casavargas.app, verify via DNS or meta tag | 10 min |
| 3 | Submit sitemap to Bing | Bing Webmaster Tools > Sitemaps > Submit URL | 2 min |
| 4 | Add casavargas.app to GitHub profile | GitHub Settings > Profile > Website field | 1 min |
| 5 | Add casavargas.app to all repo About sections | Each repo > Settings gear on About > Website URL | 5 min |
| 6 | DebridDownloader README backlink | Add prominent link to `https://casavargas.app/debrid-downloader` in README | 5 min |
| 7 | App Store listing URLs | Ensure developer URL / support URL points to casavargas.app in App Store Connect | 5 min/app |
| 8 | Create social profiles | Twitter/X, LinkedIn, Bluesky — link to casavargas.app in bios | 30 min |

---

## 6. File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `public/robots.txt` | Crawler directives + sitemap reference |
| `public/og/beltr.png` | OG image for Beltr page |
| `public/og/streamline.png` | OG image for Streamline page |
| `public/og/onescribe.png` | OG image for OneScribe page |
| `public/og/debrid-downloader.png` | OG image for DebridDownloader page |
| `public/og/blog-default.png` | Default OG image for blog posts |
| `src/components/Breadcrumbs.astro` | Breadcrumb nav + JSON-LD component |
| `src/components/JsonLd.astro` | Reusable JSON-LD script injection component |
| `src/layouts/AppLandingLayout.astro` | Shared app landing page layout |
| `src/layouts/BlogPostLayout.astro` | Blog post layout |
| `src/pages/beltr.astro` | Beltr landing page |
| `src/pages/streamline.astro` | Streamline landing page |
| `src/pages/onescribe.astro` | OneScribe landing page |
| `src/pages/debrid-downloader.astro` | DebridDownloader landing page |
| `src/pages/blog/index.astro` | Blog index |
| `src/pages/blog/[slug].astro` | Dynamic blog post route |
| `src/content.config.ts` | Content collection config (Astro 5.x root-level) |
| `src/content/blog/building-beltr-ai-vocal-separation.md` | Blog post 1 |
| `src/content/blog/why-we-dont-do-subscriptions.md` | Blog post 2 |
| `src/content/blog/native-vs-cross-platform.md` | Blog post 3 |
| `src/content/blog/introducing-streamline-iptv-player.md` | Blog post 4 |

### Modified Files
| File | Changes |
|------|---------|
| `astro.config.mjs` | Add `@astrojs/sitemap` integration |
| `src/layouts/Layout.astro` | Add canonical URL, enhanced meta tags, JSON-LD, preconnect, twitter tags |
| `src/components/Nav.astro` | Add Blog link, update navigation |
| `src/components/AppCard.astro` | Link cards to landing pages |
| `src/components/Footer.astro` | Add links to app pages, blog |
| `src/data/apps.ts` | Add `slug` field to app data for URL generation |
| `package.json` | Add `@astrojs/sitemap` dependency |

---

## Out of Scope
- Paid ads / SEM campaigns
- Email newsletter / mailing list system
- Analytics beyond existing GA4
- Internationalization / multi-language support
- Dynamic OG image generation (using static images instead)
- RSS feed (could add later but not in initial scope)
- Search functionality on blog
