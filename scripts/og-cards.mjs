// Renders the Open Graph cards in public/og/ with headless Chrome, typeset in the
// site's own fonts and colours. Run after changing a name or tagline in
// src/data/work.ts:  node scripts/og-cards.mjs
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const chrome =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const b64 = (p) => readFileSync(join(root, p)).toString('base64');
const serif = b64('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2');
const sans = b64('node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2');
const icon = (p) => `data:image/png;base64,${b64(p)}`;

// Kept in step with src/data/work.ts by hand — six cards don't justify a TS loader.
const cards = [
  {
    file: 'casavargas',
    title: 'CasaVargas makes software you own.',
    sub: 'Apps for the Mac, iPhone, iPad, Apple TV, Windows and Linux — paid for once, if at all.',
    kicker: 'casavargas.app',
    big: false,
  },
  { file: 'beltr', title: 'Beltr', sub: 'Karaoke from the music you already own.', kicker: 'A CasaVargas case study', icon: 'src/assets/icons/beltr.png', big: true },
  { file: 'onescribe', title: 'OneScribe', sub: 'A document scanner that reads what it scans.', kicker: 'A CasaVargas case study', icon: 'src/assets/icons/onescribe.png', big: true },
  { file: 'debrid-downloader', title: 'DebridDownloader', sub: 'An open-source desktop client for debrid services.', kicker: 'A CasaVargas case study', big: true },
  { file: 'streamline', title: 'Streamline', sub: 'A native IPTV player for every Apple screen.', kicker: 'A CasaVargas case study', icon: 'src/assets/icons/streamline.png', big: true },
  { file: 'nimbus', title: 'Nimbus', sub: 'Every cloud you use, in Finder.', kicker: 'A CasaVargas case study', big: true },
  { file: 'apppulse', title: 'AppPulse', sub: 'A Mac app updater that checks who made the update.', kicker: 'A CasaVargas case study', big: true },
];

const mark = `<svg width="44" height="44" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#EF9F27"/><stop offset="100%" stop-color="#D85A30"/></linearGradient></defs><g transform="translate(256,240)"><path d="M0,-160 L-122,-51 L-98,-51 L0,-139 L98,-51 L122,-51 Z" fill="url(#g)"/><rect x="-88" y="-51" width="176" height="152" rx="7" fill="url(#g)" opacity="0.9"/><path d="M-30,-8 L-54,25 L-30,59" fill="none" stroke="#231c16" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,-8 L54,25 L30,59" fill="none" stroke="#231c16" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><line x1="14" y1="-8" x2="-14" y2="59" stroke="#231c16" stroke-width="7.5" stroke-linecap="round" opacity="0.8"/></g></svg>`;

const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(data:font/woff2;base64,${serif}) format('woff2');font-weight:200 800}
@font-face{font-family:H;src:url(data:font/woff2;base64,${sans}) format('woff2');font-weight:100 900}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#231c16;color:#f4ede3;font-family:S;font-optical-sizing:auto;position:relative;padding:64px 72px}
.lamp{position:absolute;top:-380px;left:-220px;width:1100px;height:820px;background:radial-gradient(closest-side,rgba(239,159,39,.24),rgba(239,159,39,.08) 55%,transparent)}
.top{position:relative;display:flex;align-items:center;gap:14px;font-size:28px;font-weight:480;letter-spacing:-.01em}
.body{position:absolute;left:72px;right:72px;bottom:64px}
.row{display:flex;align-items:center;gap:28px}
.icon{width:120px;height:120px;border-radius:27px;box-shadow:0 0 0 1px rgba(244,237,227,.14)}
h1{margin:0;font-weight:300;letter-spacing:-.03em;line-height:.95;font-size:${c.big ? 128 : 76}px;${c.big ? '' : 'max-width:900px;line-height:1.02;letter-spacing:-.022em;'}}
p{margin:26px 0 0;font-size:${c.big ? 38 : 32}px;line-height:1.3;color:#c9bdae;max-width:960px;font-weight:330}
.k{position:absolute;right:72px;top:74px;font-family:H;font-size:22px;color:#a39686}
</style></head><body><div class="lamp"></div>
<div class="top">${mark}<span>CasaVargas</span></div><div class="k">${c.kicker}</div>
<div class="body"><div class="row">${c.icon ? `<img class="icon" src="${icon(c.icon)}">` : ''}<h1>${c.title}</h1></div><p>${c.sub}</p></div>
</body></html>`;

const out = join(root, 'public/og');
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));

for (const c of cards) {
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
