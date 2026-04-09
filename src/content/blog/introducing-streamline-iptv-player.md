---
title: "Introducing Streamline: A Native IPTV Player for Apple TV"
description: "Why we're building a native IPTV player from scratch for Apple TV, and what makes Streamline different from everything else out there."
date: 2026-04-03
tags: [streamline, tvos, apple-tv, product-launch]
---

If you've ever tried to watch IPTV on an Apple TV, you know the pain. The existing apps are either web views wrapped in a native shell, ports from Android with touch-based interfaces crammed onto a remote-driven platform, or abandoned projects that haven't been updated in years.

We're building [Streamline](/streamline) to fix this.

## What's Wrong With Current IPTV Apps

Most IPTV players on Apple TV share the same fundamental problem: they weren't built for Apple TV. They were built for phones or tablets, then stretched to fit a TV screen. The result is:

- **Broken navigation.** Buttons that expect touch input instead of focus-based navigation. You find yourself clicking the remote 30 times to reach something that should take 2 clicks.
- **Ugly interfaces.** Generic lists with tiny text designed for a phone held 12 inches from your face, now displayed on a 65-inch screen viewed from 10 feet away.
- **No metadata.** Channel lists with just names and numbers. No artwork, no descriptions, no information about what's currently playing.
- **Slow channel switching.** Buffering spinners every time you change the channel. On cable, switching channels is instant. IPTV apps make it feel like loading a web page.

## How Streamline Is Different

Streamline is built from scratch in SwiftUI for tvOS. Not ported, not adapted — designed for the Apple TV remote and the 10-foot viewing experience from day one.

### Focus-Engine Native

Every screen in Streamline works with the tvOS focus engine. The Siri Remote's touch surface moves focus smoothly between elements. Clicking feels instant. The UI responds to your input the way Apple's own apps do, because it uses the same underlying system.

### TMDB Metadata Enrichment

Streamline automatically enriches your channel list with metadata from The Movie Database. Movie channels show poster art, descriptions, ratings, and cast information. The channel guide looks like a streaming service, not a spreadsheet.

### Full Electronic Program Guide

Browse what's on now and what's coming up across all your channels. The EPG is horizontally scrollable, shows time blocks, and pulls in rich metadata. Finding something to watch is browsing, not searching.

### M3U Playlist Support

Load any M3U or M3U8 playlist. Streamline parses channels, groups, logos, and EPG data automatically. Point it at your playlist URL and you're watching in seconds.

### Built for Every Apple Platform

Streamline isn't just an Apple TV app. It runs on Mac, iPhone, iPad, and Vision Pro too. SwiftUI lets us share the data layer while building platform-appropriate UIs. The Apple TV version uses the focus engine. The iPhone version uses standard iOS navigation. The Vision Pro version uses spatial windows.

## No Subscriptions

Like every CasaVargas app, Streamline will be a one-time purchase. No monthly fee to watch your own content. Your M3U playlist, your streams, your player — permanently.

## Timeline

Streamline is in active development. We're shipping the tvOS and macOS versions first, with iOS, iPadOS, and visionOS following shortly after. Visit [getstreamline.tv](https://getstreamline.tv) for updates, or check back on the [Streamline page](/streamline) here.

We're building the IPTV player Apple would build — if Apple made IPTV players.
