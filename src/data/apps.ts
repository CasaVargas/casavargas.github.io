import type { ImageMetadata } from 'astro';

import beltrIcon from '../assets/icons/beltr.png';
import streamlineIcon from '../assets/icons/streamline.png';
import onescribeIcon from '../assets/icons/onescribe.png';
import debridIcon from '../assets/icons/debrid.png';

import beltrProcessing from '../assets/beltr/processing.webp';
import beltrAddMusic from '../assets/beltr/addmusic.webp';

import slHome from '../assets/streamline/home.png';
import slGrid from '../assets/streamline/live-tv-grid.png';
import slVod from '../assets/streamline/vod.png';

import osBoarding from '../assets/onescribe/boarding.png';
import osReceipt from '../assets/onescribe/receipt.png';

import debridShot from '../assets/debrid/screenshot.png';

export interface AppLink {
  label: string;
  url: string;
  primary?: boolean;
}

export interface App {
  slug: string;
  name: string;
  category: string;
  description: string;
  /** Three concrete, verifiable claims. Kept short — these are scanned, not read. */
  specs: string[];
  platforms: string[];
  status: 'live' | 'coming' | 'oss';
  tags: string[];
  links: AppLink[];
  icon: ImageMetadata;
  /**
   * Layout weight. Driven by how much imagery an app can actually show, not by
   * how important it is — a compact band is an honest fit, not a demotion.
   */
  weight: 'large' | 'compact';
  /** 'window' renders desktop chrome; 'phone' renders a bezel. */
  shotKind: 'window' | 'phone';
  shots: ImageMetadata[];
  /** Flip the copy/art columns so consecutive bands alternate. */
  reverse?: boolean;
}

export const apps: App[] = [
  {
    slug: 'beltr',
    name: 'Beltr',
    category: 'Karaoke engine',
    description:
      "Your own music folder becomes a karaoke catalog. On-device AI separates the vocals, pulls the synced lyrics, and maps the pitch — nothing uploads, and there's nothing to prepare in advance.",
    specs: [
      'On-device vocal separation, a minute or two a song',
      'Phones join by QR as wireless mics — no app to install',
      'Plays CDG, MP3+G, .kar and .mid as-is',
    ],
    platforms: ['macOS', 'Windows', 'Linux'],
    status: 'live',
    tags: ['AVFoundation', 'CoreML'],
    links: [{ label: 'beltr.app', url: 'https://beltr.app', primary: true }],
    icon: beltrIcon,
    weight: 'large',
    shotKind: 'window',
    shots: [beltrProcessing, beltrAddMusic],
  },
  {
    slug: 'streamline',
    name: 'Streamline',
    category: 'IPTV player',
    description:
      'The IPTV player Apple would build. Pure SwiftUI on every Apple platform, with TMDB metadata, a full EPG, multi-view PiP, and channel switching faster than cable.',
    specs: [
      'One codebase: iPhone, iPad, Apple TV, Mac, Vision Pro',
      'Live sports and full electronic programme guide',
      'Picture-in-picture multi-view',
    ],
    platforms: ['iPhone', 'iPad', 'Apple TV', 'Mac', 'Vision Pro'],
    status: 'coming',
    tags: ['SwiftUI', 'AVKit', 'TMDB'],
    links: [{ label: 'getstreamline.tv', url: 'https://getstreamline.tv', primary: true }],
    icon: streamlineIcon,
    weight: 'large',
    shotKind: 'phone',
    shots: [slGrid, slHome, slVod],
    reverse: true,
  },
  {
    slug: 'onescribe',
    name: 'OneScribe',
    category: 'AI document scanner',
    description:
      'Scan anything and get structured data back — boarding passes, receipts, prescriptions, wine labels. It links people, places, and businesses across every document you capture.',
    specs: [
      'On-device VisionKit + CoreML extraction',
      'Export to Google Docs, OneNote, Markdown',
      'Entity graph across your whole library',
    ],
    platforms: ['iOS'],
    status: 'live',
    tags: ['VisionKit', 'CoreML', 'SwiftUI'],
    links: [
      {
        label: 'Download on the App Store',
        url: 'https://apps.apple.com/us/app/onescribe-ai-scanner-ocr/id6756506734',
        primary: true,
      },
      { label: 'getonescribe.app', url: 'https://getonescribe.app' },
    ],
    icon: onescribeIcon,
    weight: 'large',
    shotKind: 'phone',
    shots: [osBoarding, osReceipt],
  },
  {
    slug: 'debrid-downloader',
    name: 'DebridDownloader',
    category: 'Download manager',
    description:
      'A blazing-fast native desktop client for Real-Debrid, TorBox, and Premiumize. Multi-threaded, keyboard-first, GPL-3.0. Built with Tauri, React, and Rust.',
    specs: [],
    platforms: ['macOS', 'Windows', 'Linux'],
    status: 'oss',
    tags: ['Tauri', 'Rust', 'React'],
    links: [
      { label: 'GitHub', url: 'https://github.com/CasaVargas/DebridDownloader', primary: true },
      { label: 'Sponsor', url: 'https://github.com/sponsors/prjoni99' },
    ],
    icon: debridIcon,
    weight: 'compact',
    shotKind: 'window',
    shots: [debridShot],
  },
];

export const statusLabel: Record<App['status'], string> = {
  live: 'Live',
  coming: 'Coming soon',
  oss: 'Open source',
};
