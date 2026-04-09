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
  platforms: string[];
  status: 'live' | 'coming' | 'oss';
  tags: string[];
  links: AppLink[];
  icon: string;
  screenshots?: string[];
  flagship?: boolean;
}

export const apps: App[] = [
  {
    slug: 'beltr',
    name: 'Beltr',
    category: 'Karaoke Engine',
    description:
      'The best karaoke app ever built. Real-time AI vocal isolation, multi-microphone support, live lyrics sync, and a stunning full-screen experience. Whether you\'re singing solo or hosting a party — Beltr makes you sound like a star.',
    platforms: ['macOS', 'Windows', 'Linux'],
    status: 'live',
    tags: ['AVFoundation', 'CoreML'],
    links: [
      { label: 'Website', url: 'https://beltr.app', primary: true },
    ],
    icon: '/beltr-logo-text.svg',
    flagship: true,
  },
  {
    slug: 'streamline',
    name: 'Streamline',
    category: 'Premium IPTV Player',
    description:
      'The IPTV player Apple would build. Pure SwiftUI across every Apple platform. TMDB metadata, live sports, full EPG, multi-view PiP, and channel switching faster than cable.',
    platforms: ['iPhone', 'iPad', 'Apple TV', 'Mac', 'Vision Pro'],
    status: 'coming',
    tags: ['SwiftUI', 'AVKit', 'TMDB'],
    links: [
      { label: 'Website', url: 'https://getstreamline.tv', primary: true },
    ],
    icon: '/streamline/icon.png',
    screenshots: [
      '/streamline/home.png',
      '/streamline/live-tv-grid.png',
      '/streamline/live-tv-list.png',
      '/streamline/program-detail.png',
      '/streamline/player-info.png',
      '/streamline/vod.png',
    ],
  },
  {
    slug: 'onescribe',
    name: 'OneScribe',
    category: 'AI Document Scanner',
    description:
      'Scan, extract, and understand your documents with AI-powered intelligence. Export to Google Docs, OneNote, Markdown, and more.',
    platforms: ['iOS'],
    status: 'live',
    tags: ['VisionKit', 'CoreML', 'SwiftUI'],
    links: [
      { label: 'Website', url: 'https://getonescribe.app', primary: true },
      {
        label: 'App Store',
        url: 'https://apps.apple.com/us/app/onescribe-ai-scanner-ocr/id6756506734',
      },
    ],
    icon: '/OneScribe.png',
  },
  {
    slug: 'debrid-downloader',
    name: 'DebridDownloader',
    category: 'Desktop Download Manager',
    description:
      'A blazing-fast native desktop client for Real-Debrid. Multi-threaded downloads, keyboard-first, configurable trackers, full theme support — Tauri, React, and Rust.',
    platforms: ['macOS', 'Windows', 'Linux'],
    status: 'oss',
    tags: ['Tauri', 'Rust', 'React'],
    links: [
      { label: 'Website', url: 'https://casavargas.app/DebridDownloader/', primary: true },
      { label: 'GitHub', url: 'https://github.com/CasaVargas/DebridDownloader' },
      { label: 'Sponsor', url: 'https://github.com/sponsors/prjoni99' },
    ],
    icon: '/DebridDownloader.png',
  },
];
