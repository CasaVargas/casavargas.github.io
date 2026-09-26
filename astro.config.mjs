import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://casavargas.app',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // The app pages moved under /work/ in the 2026-09 redesign. /beltr is not
  // listed: GitHub Pages redirects that path to beltr.app before this site is
  // consulted (the Beltr repo's Pages custom domain claims it). Streamline was
  // renamed Cathode TV on 2026-09-26; both of its old URLs still resolve.
  redirects: {
    '/streamline': '/work/cathode-tv/',
    '/work/streamline': '/work/cathode-tv/',
    '/onescribe': '/work/onescribe/',
    '/debrid-downloader': '/work/debrid-downloader/',
  },
  integrations: [
    sitemap({
      // Keep redirect stubs and the 404 out of the sitemap.
      filter: (page) => !['/streamline/', '/work/streamline/', '/onescribe/', '/debrid-downloader/', '/404/'].includes(new URL(page).pathname),
    }),
  ],
});
