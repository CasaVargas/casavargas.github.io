# CLAUDE.md — casavargas.app

## Project

Astro 5.x static site with Tailwind CSS v4. Deployed to GitHub Pages at casavargas.app.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

## Conventions

### Adding a New App

When a new app is added to `src/data/apps.ts`, always create a matching landing page:

1. Add entry to `src/data/apps.ts` with a `slug` field
2. Create `src/pages/{slug}.astro` following the existing pattern:
   - Layout with SEO props (title, description, ogImage)
   - JsonLd with SoftwareApplication schema
   - Nav, Breadcrumbs, hero section, features grid, CTA, Footer
3. The footer and AppCard links auto-populate from `apps.ts`
4. Consider writing a blog post announcement in `src/content/blog/` for additional SEO surface

### Blog Posts

Markdown files in `src/content/blog/` with frontmatter: title, description, date, tags. Include internal links to relevant app landing pages.

### SEO

Every page must have: canonical URL, OG tags, Twitter card tags, and JSON-LD structured data. The Layout.astro handles most of this via props.
