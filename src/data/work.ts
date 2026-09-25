import type { ImageMetadata } from 'astro';

import beltrIcon from '../assets/icons/beltr.png';
import streamlineIcon from '../assets/icons/streamline.png';
import onescribeIcon from '../assets/icons/onescribe.png';
import debridIcon from '../assets/icons/debrid.png';

import beltrTv from '../assets/beltr/tv-scoring.jpg';
import beltrJoin from '../assets/beltr/phone-join.jpg';

import osBoarding from '../assets/onescribe/boarding.jpg';
import osBriefing from '../assets/onescribe/briefing.jpg';
import osWine from '../assets/onescribe/wine.jpg';

import debridTorrents from '../assets/debrid/torrents.jpg';

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
  /** window: macOS titlebar. screen: a bare display (TV). phone: a lit bezel. */
  kind: 'window' | 'screen' | 'phone';
}

export interface Plate {
  /**
   * feature: one large display with a phone overlapping its corner.
   * phones:  a row of devices, the middle one forward.
   * compact: a smaller window beside the text, for thin imagery.
   */
  layout: 'feature' | 'phones' | 'compact';
  shots: Shot[];
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
    slug: 'streamline',
    name: 'Streamline',
    what: 'A native IPTV player for every Apple screen',
    tagline:
      'Streamline plays your own M3U or Xtream playlist, with its XMLTV guide, on iPhone, iPad, Mac, Apple TV and Vision Pro.',
    group: 'workshop',
    runsOn: ['iPhone', 'iPad', 'Mac', 'Apple TV', 'Vision Pro'],
    builtWith: ['SwiftUI', 'AVFoundation', 'SQLite'],
    links: [{ label: 'getstreamline.tv', url: 'https://getstreamline.tv' }],
    icon: streamlineIcon,
    highlight:
      'Channel changes run on a time budget: a small pool of warm players pre-buffers the channels you are likely to switch to next.',
  },
  {
    slug: 'nimbus',
    name: 'Nimbus',
    what: 'Every cloud you use, in Finder',
    tagline:
      'Nimbus puts S3, Google Drive, OneDrive, SFTP and dozens of other storage services into Finder and one native Mac app, driven by rclone.',
    group: 'workshop',
    runsOn: ['macOS'],
    builtWith: ['Swift 6', 'SwiftUI', 'File Provider', 'rclone'],
    links: [],
    highlight:
      'The app and its Finder extension share one local rclone engine, and the rclone contract is tested against the real thing, not a mock.',
  },
  {
    slug: 'apppulse',
    name: 'AppPulse',
    what: 'A Mac app updater that checks who made the update',
    tagline:
      'AppPulse updates the apps on your Mac, but only when it can prove the update comes from the same developer.',
    group: 'workshop',
    runsOn: ['macOS'],
    builtWith: ['Swift 6', 'SwiftUI', 'Security framework'],
    links: [],
    highlight:
      'A valid signature is not proof of identity, so every install ends with a Team ID match against the copy already on your Mac.',
  },
];

/** One entry per case study (companions excluded), in site order. */
export const caseStudies = work.filter((w) => !w.parent);

export const featured = work.filter((w) => w.plate);

export const groups: { id: Group; label: string }[] = [
  { id: 'available', label: 'Available now' },
  { id: 'open-source', label: 'Open source' },
  { id: 'workshop', label: 'In the workshop' },
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
