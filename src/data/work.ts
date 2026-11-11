import type { ImageMetadata } from 'astro';

import beltrIcon from '../assets/icons/beltr.png';
import cathodeTvIcon from '../assets/icons/cathode-tv.png';
import onescribeIcon from '../assets/icons/onescribe.png';
import debridIcon from '../assets/icons/debrid.png';
import deckleIcon from '../assets/icons/deckle.png';
import nimbusIcon from '../assets/icons/nimbus.png';

import beltrTv from '../assets/beltr/tv-scoring.jpg';
import beltrJoin from '../assets/beltr/phone-join-bezel.webp';

import osBoarding from '../assets/onescribe/boarding-bezel.webp';
import osBriefing from '../assets/onescribe/briefing-bezel.webp';
import osWine from '../assets/onescribe/wine-bezel.webp';

import debridTorrents from '../assets/debrid/torrents.jpg';

import deckleFront from '../assets/deckle/paper/front.jpg';
import deckleWeather from '../assets/deckle/paper/weather.jpg';
import deckleStory from '../assets/deckle/paper/story.jpg';

import nimbusVolume from '../assets/nimbus/volume-files.png';
// The current (Stratosphere) Home window, the same capture /nimbus/ leads with.
import nimbusHome from '../assets/nimbus/home-stratosphere.webp';

import ctvGuide from '../assets/cathode-tv/guide-bezel.webp';
import ctvHome from '../assets/cathode-tv/home-bezel.webp';
import ctvPlayer from '../assets/cathode-tv/player-mini-guide-bezel.webp';

/**
 * Every claim in this file must match the product's own public site or store
 * listing; repos are a source for engineering detail only. This site has
 * shipped stale claims twice; see PLAN.md §8 before editing a fact.
 */

export interface WorkLink {
  label: string;
  url: string;
}

export interface Shot {
  src: ImageMetadata;
  alt: string;
  /** window: macOS titlebar. screen: a bare display (TV). phone: an iPhone screenshot already set in Apple's bezel (scripts/bezel-shots.mjs). reader: an e-reader. */
  kind: 'window' | 'screen' | 'phone' | 'reader';
}

export interface Plate {
  /**
   * feature: one large display with a phone overlapping its corner.
   * phones:  a row of devices, the middle one forward.
   * readers: the same row of e-readers, sized for 3:4 pages.
   * compact: a smaller window beside the text, for thin imagery.
   */
  layout: 'feature' | 'phones' | 'readers' | 'compact';
  shots: Shot[];
  /** Attribution shown under the images (e.g. a CC BY licence credit). */
  credit?: string;
}

export type Group = 'available' | 'open-source' | 'workshop';

export interface Work {
  /** Case-study slug. Companion apps use their parent's slug. */
  slug: string;
  name: string;
  /** Index column. Ten words or fewer, plain. */
  what: string;
  /** One sentence: what it does for the person using it. */
  tagline: string;
  group: Group;
  runsOn: string[];
  builtWith: string[];
  /** Omitted for work in development: no prices promised. */
  price?: string;
  links: WorkLink[];
  icon?: ImageMetadata;
  /** Companion apps fold into their parent's case study. */
  parent?: string;
  /** Featured on the homepage as a plate. */
  plate?: Plate;
  /** Work in development: one engineering fact, shown in the workshop band. */
  highlight?: string;
}

export const work: Work[] = [
  {
    slug: 'beltr',
    name: 'Beltr',
    what: 'Karaoke from the music you already own',
    tagline:
      'Beltr turns the songs already on your computer into karaoke on your TV, and every phone in the room becomes a remote and a mic.',
    group: 'available',
    runsOn: ['macOS', 'Windows', 'Linux', 'Docker'],
    builtWith: ['Python', 'Electron', 'ONNX Runtime'],
    price: '$19.99 once, five songs free to try',
    links: [{ label: 'beltr.app', url: 'https://beltr.app' }],
    icon: beltrIcon,
    plate: {
      layout: 'feature',
      shots: [
        {
          src: beltrTv,
          kind: 'screen',
          alt: 'Beltr on a TV: word-timed lyrics with a pitch guide above them',
        },
        {
          src: beltrJoin,
          kind: 'phone',
          alt: 'A phone joining a Beltr room by name, with no app account',
        },
      ],
    },
  },
  {
    slug: 'beltr',
    parent: 'beltr',
    name: 'Beltr Remote',
    what: 'A phone as Beltr’s microphone and remote',
    tagline: 'A free companion app that makes a phone a wireless mic and remote for Beltr.',
    group: 'available',
    runsOn: ['iPhone', 'Android'],
    builtWith: ['SwiftUI', 'Kotlin Multiplatform'],
    price: 'Free',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/beltr-remote-karaoke-mic/id6777520345' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=app.casavargas.beltr.remote' },
    ],
  },
  {
    slug: 'beltr',
    parent: 'beltr',
    name: 'Beltr Client',
    what: 'Beltr’s lyric stage, as a TV app',
    tagline: 'A free TV app that puts Beltr’s lyrics on the big screen.',
    group: 'available',
    runsOn: ['Apple TV', 'Android TV'],
    builtWith: ['SwiftUI', 'Kotlin Multiplatform'],
    price: 'Free',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/beltr-client/id6782151784' },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=app.casavargas.beltr.client' },
    ],
  },
  {
    slug: 'onescribe',
    name: 'OneScribe',
    what: 'A document scanner that reads what it scans',
    tagline:
      'OneScribe reads what you scan and turns it into organized, searchable details, with the AI running on your iPhone or iPad.',
    group: 'available',
    runsOn: ['iPhone', 'iPad'],
    builtWith: ['SwiftUI', 'Foundation Models', 'Vision', 'SwiftData'],
    price: 'Free to scan; Pro is $9.99 once',
    links: [
      { label: 'Download on the App Store', url: 'https://apps.apple.com/us/app/onescribe-ai-note-scanner/id6756506734' },
      { label: 'getonescribe.app', url: 'https://getonescribe.app' },
    ],
    icon: onescribeIcon,
    plate: {
      layout: 'phones',
      shots: [
        { src: osBoarding, kind: 'phone', alt: 'A boarding pass read into flight, gate, seat and boarding time' },
        { src: osBriefing, kind: 'phone', alt: 'The evening briefing: three documents with deadlines coming up' },
        { src: osWine, kind: 'phone', alt: 'A wine label read into vintage, tasting notes and price' },
      ],
    },
  },
  {
    slug: 'debrid-downloader',
    name: 'DebridDownloader',
    what: 'A desktop client for debrid services',
    tagline:
      'DebridDownloader runs your debrid account from the desktop and saves finished files to your disk, your media library or a cloud drive.',
    group: 'open-source',
    runsOn: ['macOS', 'Windows', 'Linux'],
    builtWith: ['Tauri', 'Rust', 'React'],
    price: 'Free and open source (GPL-3.0)',
    links: [
      { label: 'Source on GitHub', url: 'https://github.com/CasaVargas/DebridDownloader' },
      { label: 'Download the latest release', url: 'https://github.com/CasaVargas/DebridDownloader/releases/latest' },
    ],
    icon: debridIcon,
    plate: {
      layout: 'compact',
      shots: [
        { src: debridTorrents, kind: 'window', alt: 'DebridDownloader’s torrent list, shown with sample data: Linux installers ready to download' },
      ],
    },
  },
  {
    slug: 'deckle',
    name: 'Deckle',
    what: 'A morning paper for your e-reader, and better books',
    tagline:
      'Deckle prints a real morning newspaper on your Kindle, Kobo, PocketBook or reMarkable, built on your own computer from your town’s news and weather and the reading you saved; makes puzzle books about what you love, clued by an AI on your own Mac, to solve in ink; and finishes the books you own like the store’s: typesetting, covers, X-Ray, comics fitted to the screen, recaps without spoilers.',
    group: 'open-source',
    runsOn: ['macOS', 'Windows', 'Linux'],
    builtWith: ['Tauri', 'Rust', 'React'],
    price: 'Free and open source (GPL-3.0)',
    links: [
      { label: 'Visit the Deckle page', url: '/deckle/' },
      { label: 'Source on GitHub', url: 'https://github.com/CasaVargas/deckle' },
    ],
    icon: deckleIcon,
    // A demo edition built by Deckle's own digest code: the town and its stories
    // are fictional (PLAN.md §14.3). Never invented news about a real place.
    plate: {
      layout: 'readers',
      shots: [
        { src: deckleWeather, kind: 'reader', alt: 'The weather and almanac page of The Morning Deckle on an e-reader: five days ahead, sunrise, sunset and the moon' },
        { src: deckleFront, kind: 'reader', alt: 'The front page of The Morning Deckle on an e-reader: masthead, date, weather and the lead headlines' },
        { src: deckleStory, kind: 'reader', alt: 'A local story from The Morning Deckle on an e-reader, with a grayscale photo' },
      ],
      credit: 'A demo edition: Linden Falls and its stories are fictional. Photos are public domain.',
    },
  },
  {
    slug: 'cathode-tv',
    name: 'Cathode TV',
    what: 'A native IPTV player for every Apple screen',
    tagline:
      'Cathode TV plays your own M3U or Xtream playlist, with its XMLTV guide, on iPhone, iPad, Mac, Apple TV and Vision Pro.',
    group: 'workshop',
    runsOn: ['iPhone', 'iPad', 'Mac', 'Apple TV', 'Vision Pro'],
    builtWith: ['SwiftUI', 'AVFoundation', 'SQLite'],
    links: [{ label: 'cathodetv.app', url: 'https://cathodetv.app' }],
    icon: cathodeTvIcon,
    // Captured 2026-09-24 against a fictional demo lineup (runbook in Tolaria:
    // cathodetv-marketing-screenshots-runbook). Never use
    // captures of a real provider's channels: logos and shows read as piracy.
    plate: {
      layout: 'phones',
      shots: [
        { src: ctvGuide, kind: 'phone', alt: 'Cathode TV’s guide: fictional channels with tonight’s programs' },
        { src: ctvHome, kind: 'phone', alt: 'Cathode TV’s home screen with a live soccer match and tonight’s highlights' },
        { src: ctvPlayer, kind: 'phone', alt: 'Cathode TV playing video with the On Now mini guide open' },
      ],
      credit: 'Shown with a demo lineup: channels, programs and artwork are fictional. Video: Big Buck Bunny © Blender Foundation, CC BY 3.0.',
    },
    highlight:
      'Channel changes run on a time budget: a small pool of warm players pre-buffers the channels you are likely to switch to next.',
  },
  {
    slug: 'nimbus',
    name: 'Nimbus',
    what: 'Every cloud you use, as a volume on your Mac',
    tagline:
      'Nimbus turns S3, Google Drive, OneDrive, SFTP and fifty more storage services into volumes on your Mac: browse them like Finder, show them in Finder, copy and sync between them, with rclone as the engine.',
    group: 'open-source',
    runsOn: ['macOS'],
    builtWith: ['Swift 6', 'SwiftUI', 'File Provider', 'rclone'],
    // Free outright since 2026-11-08: source and signed builds. Beltr and OneScribe fund it.
    price: 'Free, GPL-3.0, signed builds included',
    links: [
      { label: 'Visit the Nimbus page', url: '/nimbus/' },
      { label: 'Download for Mac', url: 'https://github.com/CasaVargas/Nimbus/releases/latest' },
      { label: 'Source on GitHub', url: 'https://github.com/CasaVargas/Nimbus' },
    ],
    icon: nimbusIcon,
    // A real window against a throwaway rclone config: two local folders stand in
    // for clouds and every file in the listing was made up for the shot.
    plate: {
      layout: 'feature',
      shots: [
        { src: nimbusVolume, kind: 'screen', alt: 'Nimbus with a volume selected: capacity bars in the sidebar, a storage gauge, Open in Finder, Sync and Edit, and a Finder-style file list with system icons. Shown with made-up files.' },
      ],
    },
  },
];

/**
 * The homepage leads with one product: the current launch (PLAN.md §P1).
 * `facts` is the line under its buttons; check it against /nimbus/.
 */
export const lead = {
  slug: 'nimbus',
  shot: nimbusHome,
  alt: 'Nimbus’s Home window: 3.25 TB free across five clouds, a ring showing who uses the space, and a card for each cloud with its status. Shown with made-up accounts.',
  facts: 'Free and open source under GPL-3.0. macOS 15 or later, Apple silicon and Intel, signed and notarized.',
  download: { label: 'Download for Mac', url: 'https://github.com/CasaVargas/Nimbus/releases/latest' },
  source: { label: 'Source on GitHub', url: 'https://github.com/CasaVargas/Nimbus' },
  page: { label: 'More about Nimbus', url: '/nimbus/' },
};

/** One entry per case study (companions excluded), in site order. */
export const caseStudies = work.filter((w) => !w.parent);

/** Plates on the homepage; the compact (thin-imagery) plate always goes last. */
export const featured = work
  .filter((w) => w.plate)
  .sort((a, b) => Number(a.plate!.layout === 'compact') - Number(b.plate!.layout === 'compact'));

export const groups: { id: Group; label: string }[] = [
  { id: 'available', label: 'Available now' },
  { id: 'open-source', label: 'Open source' },
  { id: 'workshop', label: 'In development' },
];

export const statusFor = (w: Work): string =>
  w.group === 'available' ? 'Available' : w.group === 'open-source' ? 'Open source' : 'In development';

export const bySlug = (slug: string): Work => {
  const w = caseStudies.find((c) => c.slug === slug);
  if (!w) throw new Error(`No case study for slug "${slug}"`);
  return w;
};

export const companionsOf = (slug: string): Work[] => work.filter((w) => w.parent === slug);

/** The case study after this one, wrapping around. */
export const nextAfter = (slug: string): Work => {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
};
