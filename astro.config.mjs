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
    // AppPulse was taken off the site on 2026-11-11.
    '/work/apppulse': '/work/',
  },
  integrations: [
    sitemap({
      // /nimbus/ is a static page in public/, which the sitemap cannot see.
      customPages: ['https://casavargas.app/nimbus/'],
      // Keep redirect stubs and the 404 out of the sitemap.
      filter: (page) => !['/streamline/', '/work/streamline/', '/onescribe/', '/debrid-downloader/', '/work/apppulse/', '/404/'].includes(new URL(page).pathname),
    }),
  ],
});
