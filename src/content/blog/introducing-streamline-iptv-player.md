---
title: "Introducing Cathode TV: A Native IPTV Player for Every Apple Screen"
description: "Why we're building an IPTV player from scratch in SwiftUI, and the engineering behind the two things it has to get right: the program guide and the channel change."
date: 2026-04-03
updated: 2026-09-28
tags: [cathode-tv, tvos, apple-tv, engineering]
---

*Update, September 2026: Streamline is now called Cathode TV, and it lives at [cathodetv.app](https://cathodetv.app). This post has been rewritten with what we've learned building it since April.*

If you've ever tried to watch IPTV on an Apple TV, you know the pain. The existing apps tend to be web views wrapped in a native shell, ports from Android with touch interfaces crammed onto a remote-driven platform, or projects that haven't been updated in years.

We're building [Cathode TV](/work/cathode-tv/) to fix that. It plays the playlists and program guides you already have (M3U and M3U8 playlists, the Xtream Codes API and XMLTV guides) on iPhone, iPad, Mac, Apple TV and Vision Pro.

## What's wrong with current IPTV apps

Most IPTV players on Apple TV share one problem: they weren't built for it. They were built for phones or tablets, then stretched to fit a TV. The result:

- **Navigation that fights the remote.** Controls that expect a finger instead of focus, so reaching something takes thirty clicks instead of two.
- **Interfaces sized for a phone.** Tiny text designed to be held a foot from your face, now on a 65-inch screen across the room.
- **Channel lists with nothing in them.** Names and numbers, no artwork, no idea what's on.
- **Slow channel changes.** A spinner every time you switch. On cable, changing channels is instant. Most IPTV apps make it feel like loading a web page.

Two of those are really engineering problems, not design ones: the guide and the channel change. Cathode TV treats them as the core of the product.

## The guide is a big, compressed file

A program guide usually arrives as a gzipped XMLTV file covering every channel for the next week. For a large playlist that's a lot of XML, and plenty of players try to load all of it into memory at once.

Cathode TV decompresses the file to disk and reads it with a streaming parser, so memory stays flat however big the guide is. Before it parses anything, it checks the first bytes of the file, because a broken or expired guide URL often returns an HTML error page instead, and that should fail with a clear message rather than a parse error deep inside. Programs are sorted per channel, so answering "what's on now" is a binary search rather than a scan. The parsed guide is cached, compressed, on disk, so the app opens with a working guide even without a network.

Channels themselves live in SQLite with a full-text index, and lists load in pages. The Apple TV interface was tested against a synthetic catalog of about 80,000 channels.

## Channel changes have a time budget

Changing channels is the moment an IPTV player is judged, so every change is measured from the tap to the first frame of video, and the player is built to spend as little of that time as possible:

- **Swap, don't rebuild.** The player replaces what it's playing instead of tearing down and recreating the video layer.
- **Warm players.** A small pool of players pre-buffers the channels you're likely to switch to next, in the direction you've been switching.
- **Remember what worked.** IPTV streams come in several formats, and a player often has to try a few before one plays. Cathode TV remembers which format worked last time for each channel, so the fallback sequence isn't repeated on every visit.

## Focus you can predict

On Apple TV, the focus engine decides what the remote is pointing at. The player's on-screen controls used to be driven by four separate flags, which allows sixteen combinations, several of them impossible. They're now a single five-state machine, and only one element can hold focus at a time, so the focus engine never has to choose between two.

The guide grid follows the same principle. It never recycles the cell you're focused on, and when it rebuilds, it keeps you at the same time of day, not the same scroll position. You stay on the program you were looking at.

## Everything around the player

- **A seven-day guide.** Every channel gets a timeline that opens at the current time, with now and next, genre filters and the week ahead.
- **Quick switching.** A mini-guide overlay, gesture controls, a sleep timer and picture in picture.
- **A home screen built from your guide.** Rows for what's live now, tonight's highlights, live sports and movies starting soon, plus a PIN-locked kids zone.
- **Program details from TMDB.** Posters, cast and ratings for guide programs and for your provider's on-demand library.
- **Profiles that sync.** Several profiles with parental controls, and favorites synced over iCloud.

## One codebase, four kinds of input

Cathode TV is one SwiftUI codebase. The data layer (playlists, the guide, favorites, profiles) is shared. The interface isn't, because touch, a keyboard, the Siri Remote, and eyes and hands on Vision Pro each need their own. We wrote more about that trade-off in [Native vs Cross-Platform](/blog/native-vs-cross-platform/).

## No subscription

Like every CasaVargas app, Cathode TV will be a single purchase. No monthly fee to watch your own playlists.

It's in active development and due in 2026. Visit [cathodetv.app](https://cathodetv.app) for updates, or read the [case study](/work/cathode-tv/) for more on how it's built.
