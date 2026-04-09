---
title: "Building Beltr: AI Vocal Separation for Cross-Platform Karaoke"
description: "A deep dive into how Beltr uses AI to separate vocals from any song in real time, and why we built it as a cross-platform desktop app with mobile remotes."
date: 2026-04-09
tags: [beltr, ai, cross-platform, engineering]
---

Every karaoke app has the same problem: you need karaoke versions of songs. Instrumental tracks, CDG files, or a streaming catalog that's always missing the one song you want to sing. We built [Beltr](/beltr) to kill that problem entirely.

## The Core Idea

What if every song was a karaoke song? Not through a catalog — through AI. Beltr takes any audio file from your music library and separates the vocals from the instrumental in real time. No pre-processing, no waiting, no special files. Hit play and the vocals drop out.

This is possible because of modern source separation models that have gotten remarkably good at isolating individual stems from mixed audio. The AI doesn't just lower the center channel (the old karaoke trick that killed everything panned center, including snare drums and bass). It actually understands what a human voice sounds like and surgically removes it while preserving the full instrumental.

## Why Desktop?

Karaoke is a living room activity. It happens on a TV or a big screen with speakers, not hunched over a phone. That means the app needs to run on the machine connected to your display — your Mac, Windows PC, or Linux box.

We built Beltr for all three platforms. The audio processing pipeline is performance-critical, so it needs native access to the hardware. A web app would introduce latency that makes singing along feel wrong. Even 100ms of audio delay is noticeable when you're trying to stay on beat.

## Phone as Remote

But nobody wants to walk to the computer to pick the next song. That's why Beltr uses your phone as a wireless remote. iOS and Android both work. You browse your library, queue songs, and control playback from the couch — while the audio plays through your desktop setup.

This architecture — desktop as the engine, phone as the controller — gives you the best of both worlds. The heavy lifting happens on hardware with real processing power, and the interface is in your hand where it's convenient.

## Multi-Microphone Support

Solo karaoke is fun. Group karaoke is a party. Beltr supports multiple microphones simultaneously with independent volume controls per mic. You can balance a quiet singer and a loud one without touching the computer. The mixing happens in real time alongside the vocal separation.

## No Subscriptions

Beltr is a one-time purchase. We don't rent you karaoke — you own it. There's no monthly fee to use your own music library, no premium tier for "better" vocal separation, no feature unlocks. You buy it once and it's yours.

This is a core principle at [CasaVargas](/) — software should be owned, not rented. We think the subscription model for standalone apps is disrespectful to users, and we refuse to participate in it.

## What's Next

Beltr is live now on macOS, Windows, and Linux. We're continuing to improve the vocal separation quality, adding more customization options for the singing experience, and refining the mobile remote apps. If you've ever wished you could sing along to any song without hunting for a karaoke version, [give Beltr a try](https://beltr.app).
