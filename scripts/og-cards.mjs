// Renders the Open Graph cards in public/og/ with headless Chrome, in the site's
// own colours and the system face (run it on a Mac, so that face is San Francisco). Run after changing a name or tagline in
// src/data/work.ts:  node scripts/og-cards.mjs            (all cards)
//                     node scripts/og-cards.mjs nimbus     (just those files)
// A card with `shot` sets a screenshot in a window well on the right, bleeding
// off the card, with the type in a column on the left.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const chrome =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const b64 = (p) => readFileSync(join(root, p)).toString('base64');
const icon = (p) => `data:image/${p.endsWith('.webp') ? 'webp' : 'png'};base64,${b64(p)}`;

// Kept in step with src/data/work.ts by hand; a handful of cards don't justify a TS loader.
const cards = [
  {
    file: 'casavargas',
    title: 'Mac, iPhone and desktop apps.',
    sub: 'No subscriptions. Each app is paid for once, and several are free and open source.',
    kicker: 'casavargas.app',
    big: false,
  },
  { file: 'beltr', title: 'Beltr', sub: 'Karaoke from the music you already own.', kicker: 'casavargas.app', icon: 'src/assets/icons/beltr.png', big: true },
  { file: 'onescribe', title: 'OneScribe', sub: 'A document scanner that reads what it scans.', kicker: 'casavargas.app', icon: 'src/assets/icons/onescribe.png', big: true },
  { file: 'debrid-downloader', title: 'DebridDownloader', sub: 'An open-source desktop client for debrid services.', kicker: 'casavargas.app', icon: 'src/assets/icons/debrid.png', big: true },
  { file: 'deckle', title: 'Deckle', sub: 'Your morning paper, printed on e-ink. Open source.', kicker: 'casavargas.app/deckle', icon: 'src/assets/icons/deckle.png', big: true },
  { file: 'work-deckle', title: 'Deckle', sub: 'A morning paper, and better books, for every e-ink reader.', kicker: 'casavargas.app', icon: 'src/assets/icons/deckle.png', big: true },
  { file: 'cathode-tv', title: 'Cathode TV', sub: 'A native IPTV player for every Apple screen.', kicker: 'casavargas.app', icon: 'src/assets/icons/cathode-tv.png', big: true },
  { file: 'nimbus', title: 'Nimbus', sub: 'Every cloud you use. One Mac app. Free and open source.', kicker: 'casavargas.app/nimbus', icon: 'src/assets/icons/nimbus.png', big: true, shot: 'src/assets/nimbus/home-stratosphere.webp' },
  { file: 'work-nimbus', title: 'Nimbus', sub: 'Cloud storage as Mac volumes, built on rclone.', kicker: 'casavargas.app', icon: 'src/assets/icons/nimbus.png', big: true },
];

const mark = `<svg width="44" height="44" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#EF9F27"/><stop offset="100%" stop-color="#D85A30"/></linearGradient></defs><g transform="translate(256,240)"><path d="M0,-160 L-122,-51 L-98,-51 L0,-139 L98,-51 L122,-51 Z" fill="url(#g)"/><rect x="-88" y="-51" width="176" height="152" rx="7" fill="url(#g)" opacity="0.9"/><path d="M-30,-8 L-54,25 L-30,59" fill="none" stroke="#1d1d1f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,-8 L54,25 L30,59" fill="none" stroke="#1d1d1f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="-8" x2="-14" y2="59" stroke="#1d1d1f" stroke-width="7.5" stroke-linecap="round" opacity="0.8"/></g></svg>`;

const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#fff;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;position:relative;padding:64px 72px}
.top{position:relative;display:flex;align-items:center;gap:12px;font-size:28px;font-weight:650;letter-spacing:-.015em}
.body{position:absolute;left:72px;right:72px;bottom:64px}
.row{display:flex;align-items:center;gap:28px}
.icon{width:112px;height:112px;border-radius:25px}
h1{margin:0;font-weight:650;letter-spacing:-.04em;line-height:1;font-size:${c.big ? 112 : 84}px;${c.big ? '' : 'max-width:900px;line-height:1.02;'}}
p{margin:24px 0 0;font-size:${c.big ? 36 : 32}px;line-height:1.3;color:#48484d;max-width:960px}
.k{position:absolute;right:72px;top:72px;font-size:22px;color:#636366}
.shot{position:absolute;left:560px;top:150px;width:900px;border-radius:14px;overflow:hidden;background:#0b0b0c;box-shadow:0 0 0 1px rgba(0,0,0,.14),0 30px 70px -30px rgba(0,0,0,.5)}
.shot img{display:block;width:100%}
${c.shot ? `.body{right:auto;width:450px;bottom:72px}.row{gap:20px}.icon{width:84px;height:84px;border-radius:19px}h1{font-size:84px}p{font-size:28px;margin-top:20px}` : ''}
</style></head><body>
<div class="top">${mark}<span>CasaVargas</span></div><div class="k">${c.kicker}</div>
${c.shot ? `<div class="shot"><img src="${icon(c.shot)}"></div>` : ''}
<div class="body"><div class="row">${c.icon ? `<img class="icon" src="${icon(c.icon)}">` : ''}<h1>${c.title}</h1></div><p>${c.sub}</p></div>
</body></html>`;

const out = join(root, 'public/og');
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));

const only = process.argv.slice(2);
for (const c of cards) {
  if (only.length && !only.includes(c.file)) continue;
  const page = join(tmp, `${c.file}.html`);
  writeFileSync(page, html(c));
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1200,630',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=2000',
    `--screenshot=${join(out, `${c.file}.png`)}`,
    `file://${page}`,
  ], { stdio: 'ignore' });
  console.log(`public/og/${c.file}.png`);
}
