// Sets the iPhone screenshots into Apple's official product bezel and flattens
// each into one WebP beside its original: src/assets/<slug>/<name>-bezel.webp.
// Run after replacing an iPhone screenshot:
//
//   BEZELS_DIR=/Volumes/DATA/Apple-Bezels-2026-10 node scripts/bezel-shots.mjs
//
// Pass image paths to frame other portrait iPhone captures the same way (the
// cathodetv.app shots are made like this); the output lands beside each input.
//
// The bezel comes from Apple Design Resources (Bezel-iPhone-18.dmg), unpacked
// as the DMG lays it out. Its license forbids passing the bezels on by
// themselves, so they are never committed: only the flattened shots ship.
// Apple's rules for them (App Store Marketing Guidelines, "Apple Product
// Images"): as is, uncropped, with nothing added on or around them, which is
// why <Phone> draws no ring, shadow or background.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const bezels = process.env.BEZELS_DIR ?? '/Volumes/DATA/Apple-Bezels-2026-10';
const bezel = join(bezels, 'Bezel-iPhone-18/PNG/iPhone 18 Pro Max/iPhone 18 Pro Max - Silver - Portrait.png');
// The bounding box of the bezel PNG's transparent screen opening.
const hole = { x: 75, y: 66, w: 1320, h: 2868 };

const defaults = [
  'beltr/phone-join.jpg',
  'onescribe/boarding.jpg',
  'onescribe/briefing.jpg',
  'onescribe/wine.jpg',
  'cathode-tv/guide.jpg',
  'cathode-tv/home.jpg',
  'cathode-tv/player-mini-guide.jpg',
].map((p) => join(root, 'src/assets', p));
const shots = process.argv.length > 2 ? process.argv.slice(2).map((p) => resolve(p)) : defaults;

const missing = [bezel, ...shots].filter((f) => !existsSync(f));
if (missing.length) {
  for (const f of missing) console.error(`missing ${f}`);
  console.error('Set BEZELS_DIR to the unpacked Apple bezel DMGs (see the header).');
  process.exit(1);
}

// The opening's corners are round and the bezel is transparent outside them, so
// a rectangular capture would show its corners past the frame. Clip it to the
// opening itself: flood-fill the transparent pixels from the middle of the
// screen, then grow the fill a few pixels to run under the frame's inner edge.
const { data: px, info } = await sharp(bezel).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: bw, height: bh } = info;
const inside = new Uint8Array(bw * bh);
const stack = [(hole.y + (hole.h >> 1)) * bw + hole.x + (hole.w >> 1)];
while (stack.length) {
  const i = stack.pop();
  if (inside[i] || px[i * 4 + 3] === 255) continue;
  inside[i] = 1;
  const x = i % bw;
  if (x > 0) stack.push(i - 1);
  if (x < bw - 1) stack.push(i + 1);
  if (i >= bw) stack.push(i - bw);
  if (i < bw * (bh - 1)) stack.push(i + bw);
}
const mask = Buffer.from(inside.map((v) => v * 255));
// sharp's erode grows the white: it erodes the black around it.
const opening = sharp(mask, { raw: { width: bw, height: bh, channels: 1 } }).erode(6);

for (const shot of shots) {
  // Work at the screenshot's own scale, so it is never upscaled.
  const { width: sw } = await sharp(shot).metadata();
  const k = sw / hole.w;
  const size = (n) => Math.round(n * k);
  const frame = await sharp(bezel).resize(size(bw), size(bh), { kernel: 'lanczos3' }).png().toBuffer();
  const w = size(hole.w), h = size(hole.h);
  const rgb = await sharp(shot).resize(w, h, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  const clip = await opening.clone()
    .extract({ left: hole.x, top: hole.y, width: hole.w, height: hole.h })
    .resize(w, h)
    .extractChannel(0)
    .raw()
    .toBuffer();
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = clip[i];
  }
  const screen = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const out = shot.replace(/\.\w+$/, '-bezel.webp');
  const saved = await sharp({ create: { width: size(bw), height: size(bh), channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: screen, left: size(hole.x), top: size(hole.y) },
      { input: frame, left: 0, top: 0 },
    ])
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(out);
  console.log(`${out}: ${saved.width}x${saved.height}, ${(saved.size / 1024).toFixed(0)} KB`);
}
