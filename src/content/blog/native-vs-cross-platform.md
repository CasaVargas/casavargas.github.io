---
title: "Native vs Cross-Platform: When to Use Each"
description: "CasaVargas ships SwiftUI, Electron, and Tauri apps. Here's how we decide which approach to use for each product, with real examples."
date: 2026-04-05
tags: [engineering, swiftui, tauri, electron, architecture]
---

The native vs cross-platform debate usually goes like this: someone picks a side, defends it religiously, and dismisses everyone who disagrees. At [CasaVargas](/), we use both — and the choice depends entirely on the product, not a philosophical position.

## Our Stack

For Apple platforms, we build with **SwiftUI and Swift 6**. For cross-platform desktop apps, we use **Electron** or **Tauri with Rust and React**, depending on the project. These are very different tools, and they're each best at different things.

## When We Go Native: SwiftUI

[Streamline](/streamline) is our IPTV player for Apple TV, Mac, iPhone, iPad, and Vision Pro. It's built entirely in SwiftUI. Here's why:

**Platform integration is the product.** An IPTV player on Apple TV needs to work with the tvOS focus engine, the Siri Remote's touch surface, and Apple's video playback APIs (AVKit). On Vision Pro, it needs spatial windows. On iPhone, it needs to feel like a first-party app. None of this works well through an abstraction layer.

**Performance is non-negotiable for video.** Streaming live TV requires tight integration with AVFoundation, hardware-accelerated decoding, and low-latency rendering. A cross-platform wrapper would add overhead in exactly the place where you can't afford it.

**The platforms diverge.** What works on a 65-inch TV operated by a remote is fundamentally different from what works on a phone you hold in your hand. SwiftUI lets us share business logic while building completely different UIs per platform with `NavigationSplitView` on iPad, `TabView` on iPhone, and focus-driven layouts on tvOS.

[OneScribe](/onescribe) is similar — it relies on VisionKit and CoreML for document scanning and OCR. These are Apple frameworks with no cross-platform equivalent. Going native isn't a preference, it's a requirement.

## When We Go Cross-Platform: Electron & Tauri

[Beltr](/beltr) is our karaoke engine for Mac, Windows, and Linux — built with Electron. [DebridDownloader](/debrid-downloader) is our download manager for the same platforms — built with Tauri, Rust, and React. Two cross-platform apps, two different frameworks, each chosen for a reason.

**The platform doesn't matter as much as the function.** A download manager needs to download files. A karaoke app needs to play audio and separate vocals. These operations aren't tied to any OS's unique capabilities — they work the same on Mac, Windows, and Linux.

**Electron for Beltr.** Beltr's AI vocal separation pipeline and real-time audio mixing benefit from Electron's mature ecosystem for media handling. The Chromium runtime provides robust audio APIs and a rich UI layer for the karaoke experience — lyrics display, visualizations, and the queue system all benefit from the web platform's strengths.

**Tauri for DebridDownloader.** A download manager doesn't need a full browser runtime. Tauri uses the OS's native webview for the UI and pure Rust for the backend. The result is a tiny binary, low memory usage, and maximum download throughput. For a utility that sits in the background moving files, Tauri's lightweight footprint is the right call.

**Three platforms, one codebase.** Writing DebridDownloader three times — once in SwiftUI, once in WPF, once in GTK — would be insane for a solo developer. Cross-platform frameworks let us ship on all three platforms with a single codebase.

## The Decision Framework

Here's the mental model we use:

**Go native (SwiftUI) when:**
- The app lives on Apple platforms only
- Platform-specific APIs are core to the product (AVKit, VisionKit, CoreML, HealthKit)
- The UI needs to adapt deeply per platform (TV vs phone vs spatial)
- Performance requires direct hardware access

**Go cross-platform (Electron or Tauri) when:**
- The app needs to run on Mac, Windows, and Linux
- The core functionality is OS-agnostic
- Shipping on three platforms as a solo dev needs to be practical
- Pick Electron when you need rich media/UI capabilities; pick Tauri when you want a minimal footprint

## The Wrong Answer

The wrong answer is picking one approach for everything. Building an Apple TV app in Tauri would be absurd — you'd fight the platform the entire time. Building a download manager three times in three native frameworks would be a waste of months.

The right tool for each job. That's it. No ideology required.
