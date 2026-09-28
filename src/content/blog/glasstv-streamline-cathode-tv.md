---
title: "GlassTV, Streamline, Cathode TV: Building an IPTV Player the Long Way"
description: "Three names, five navigation designs on Apple TV, a guide redesigned five times and a player rewritten to a third of its size. What eight months of building Cathode TV looked like."
date: 2026-09-28
tags: [cathode-tv, tvos, apple-tv, engineering, journey]
---

[Cathode TV](/work/cathode-tv/) started in January 2026 as an Xcode template called GlassTV. By the end of September it had been renamed twice, rebuilt from the interface up more than once, and grown to about 106,000 lines of Swift across 382 files and 1,638 commits. It still hasn't shipped.

This is the story of why, told through the parts that took longest to get right.

## Five platforms in the first week

The first commit targeted iPhone, iPad, Mac and Vision Pro. Two days later there was an Apple TV target as well, with a Top Shelf extension, a playlist parser, a guide store and a player. Xtream Codes support followed in early February.

Starting everywhere at once was deliberate. The plan was always one SwiftUI codebase with an interface built for each platform's own input. It also meant that every mistake from then on was made on five platforms at once.

## The first rewrite, and the first new name

The first interface didn't survive February. At the end of the month it was rebuilt in one pass: 86 files and 23,500 lines became 52 files and 16,600. The player was rebuilt the same day, and two days later every platform got its own root view, a change that touched 165 files.

The name went that month too. GlassTV became Streamline because, as the rename plan put it, the project "has outgrown its legacy name."

## A database, not an array

IPTV playlists can be enormous. The first versions held every channel in memory as an array of structs, which is fine for a few hundred channels and not fine for 30,000 to 80,000. In early March the channel list moved into SQLite, with a full-text index for search, and lists started loading in pages. The Apple TV interface is now tested against a synthetic catalog of about 80,000 channels.

## The guide, five times over

Between early and late March the program guide was redesigned about five times, including a port to iPad and Mac and a separate timeline for iPhone. Then it spent the summer finding new ways to break.

**It wandered.** The grid's time origin was recomputed every time the guide rebuilt, so a rebuild that happened to cross the hour or the half hour shifted every cell by 220 points, which is exactly thirty minutes of guide. Everything you were looking at slid half an hour sideways. The fix anchors the origin so it only moves when it should.

**It stopped at 500.** The guide read only the first page of channel results, while the count above it showed the real total. So a playlist of 1,214 channels said "All 1,214" above 500 rows. The playlist it had been tested with had fewer than 500 channels, so it had never shown. The guide now reads every page, and it's stress-tested at 1,500 and 30,000 channels.

**It ran out of memory.** One guide carried about half a million programs for a playlist of just over a hundred channels. It was merged in full before being filtered down to the channels actually in the playlist, so the channels you had kept only twelve hours of listings, and the disk cache silently overflowed. Later, a 180 MB uncompressed guide loaded twice at the same moment pushed the app past a memory limit of roughly 2 GB, and the system killed it. That's what led to streaming the guide to disk and parsing it as it's read.

## A player a third of the size

In May the player was rewritten from 2,088 lines to 654, and one player was reused across channel changes instead of a fresh one for each channel. Along the way, blind prefetching of neighbouring channels was deleted as wasted bandwidth.

It came back in June, narrower: a small standby pool that only warms channels once the way you're switching shows where you're headed. The player also started remembering, per channel, which stream format had worked, and started measuring every change from the tap to the first frame. In July a crossfade went in to hide the black flash when a guess missed.

One lesson came from a separate test app built in May just to study stream compatibility. A tuning change that made streams ready to play faster also made playback choppy. It was reverted. Faster to start is not the same as better to watch.

## Five navigation bars

Navigation on Apple TV changed five times:

1. A custom tab bar, in February.
2. Apple's adaptable sidebar, in July.
3. The native top tab bar, also in July.
4. A persistent custom sidebar rail, in early September.
5. The native top tab bar again, late in September.

The rail went because it clipped the search keyboard and a left press on the remote couldn't always reach it. Going back meant a re-layout that had been estimated at around 1,500 lines, and when it came to it, it cost almost nothing. The iPad had already made the same trip a few weeks earlier, dropping its custom rail for the system tab view.

The lesson we keep relearning: on Apple TV, the system component has usually already solved the problem you're about to spend a month on.

## Controls that knew what state they were in

The player's on-screen controls were once governed by four booleans, which allows sixteen combinations, plus three timers racing each other for focus. Moving between tabs resized the panel under your thumb. Apple's own player view was ruled out on Apple TV, because swapping channels underneath it flashed black. In August the four flags became a single five-state machine, and only one element can hold focus at a time.

## Things that broke quietly

- **Vision Pro stopped compiling for weeks.** The Liquid Glass APIs used on the other platforms aren't available on visionOS, and nothing flagged it until someone built for it.
- **The Mac app had empty entitlements.** A sandboxed build would have had no network access at all, which for a streaming app is everything.
- **A September review of the whole interface** found screens that were unreachable or wired to nothing. It turned into visual audits and fixes on every platform in the last week of the month.

## The third name

At the end of September, Streamline became Cathode TV. It's a brand rename, not a code rename. Renaming every symbol would have touched about 4,400 lines across five branches in flight, so the code keeps its old name on the inside and the app wears the new one on the outside. The mark carried over: a play triangle with converging stream lines, amber on warm black, now with bloom and scanlines.

## Where it stands

Cathode TV is still in development and due in 2026, as a single purchase. Eight months in, the parts that took longest (the guide, the channel change and focus on Apple TV) are the parts we're proudest of. You can follow it at [cathodetv.app](https://cathodetv.app), and read how the finished pieces work in [Introducing Cathode TV](/blog/introducing-streamline-iptv-player/).
