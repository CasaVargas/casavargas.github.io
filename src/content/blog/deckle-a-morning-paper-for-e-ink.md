---
title: "Deckle: a morning paper, set on your own computer"
description: "Why Deckle exists, what goes into the paper it sets every morning, how it gives the books you load yourself what store books have, and what is still rough."
date: 2026-10-26
tags: [deckle, open-source, e-ink, rust]
image: "/og/deckle.png"
imageAlt: "Deckle, a morning paper for your e-ink reader"
---

[Deckle](/deckle/) is a free, open-source desktop app for Mac and Windows. Every morning it builds a newspaper on your own computer, from your town's news and weather, your feeds and the articles you saved, and has it waiting on your Kindle, Kobo, PocketBook or reMarkable. It also turns the books you own into Kindle books that behave like the ones Amazon sells. Version 0.7.0 is out today. This note is about why it exists and how it works.

## It started with books

A book you load onto a Kindle yourself is a second-class citizen. Amazon's own Send to Kindle drops Enhanced Typesetting, X-Ray and Word Wise. The cover often turns grey. There are no real page numbers.

Every one of those has a fix somewhere: a calibre plugin, a forum recipe, a script on MobileRead. They are good fixes, written by people who reverse-engineered formats Amazon never documented. But each has its own install story, and they fight each other. The trick that turns on X-Ray gives you a grey cover on a 2024 Kindle Scribe.

The reason is a real trade-off inside the Kindle. X-Ray and Word Wise only load for books filed as store books, with an ASIN. A store book whose ASIN the store doesn't recognise gets a grey cover, and once the Kindle goes online Amazon overwrites the cover thumbnail with a placeholder. Personal documents keep their cover but get neither feature. So you can have the cover or the features, and which one you can cheat depends on the Kindle:

- A Kindle that shows up as a USB drive lets Deckle write its own cover thumbnail, and Deckle puts it back on every send. You get both.
- The Kindles that only speak MTP (the 2024 Scribe, the Colorsoft, the 2024 Paperwhite) hide that folder. There, the cover wins, unless you give the book the ASIN of its real Amazon edition, and then the Kindle fetches the store cover and keeps the features.

Deckle reads each Kindle when it connects and makes that choice for you. Then it runs the whole pipeline in one go: typography fixes, pop-up footnotes, Kindle Previewer for Enhanced Typesetting, page numbers, X-Ray, Word Wise, the cover, and the copy onto the device.

## Then the paper

Once a Kindle gets a properly made book every time it is plugged in, a daily edition is the obvious next thing to put on it.

E-ink is the closest a screen gets to paper, and a feed reader is the opposite of a paper: an endless list of links, each one opening a browser. A newspaper has an order, a front page, and a last page you can finish. So that is what Deckle sets:

- **A front page that is also the cover.** The masthead, the date, the weather and the lead headlines, drawn fresh each morning. The library tile on your reader is today's paper.
- **Whole stories.** Each story is pulled from the publisher the way Reader View does it, with its photos turned grayscale for e-ink. Nothing sends you to a browser. A story behind a paywall stays a headline.
- **Your town and what you follow.** Weather from Open-Meteo, local news for your town, each RSS feed as its own section, and interests: a topic searched every morning and kept only when a headline actually names it, so "Rust" doesn't bring you stories about trust.
- **The back pages.** A mini crossword whose theme answers are yesterday's headlines, a word ladder, an almanac with the moon and tonight's meteor shower, and a page drawn from your own Kindle: the books you are in the middle of and the words you looked up this week.
- **The reading you saved.** Save an article during the day with a bookmarklet, a link dropped in a folder, or an iPhone Shortcut, and it prints the next morning, whole.

Every edition is kept as a plain folder, searchable, for a year. A Kobo gets the paper as a KEPUB, a PocketBook as an EPUB, a reMarkable as a PDF laid out for its screen, crossword included, to write on.

## Nothing in the middle

There is no Deckle server. The paper is fetched, set and kept on your machine, and the books never leave it. There is no account, no subscription and no telemetry. Everything that does touch the network is listed, with its default, on [the product page](/deckle/#dk-network) and in the app's settings: the paper's sources, an update check, a one-time dictionary download, and a few lookups that are off until you turn them on.

That is partly principle ([we don't do subscriptions](/blog/why-we-dont-do-subscriptions/)) and partly practical: a paper built on your computer can read your Kindle's reading positions and highlights without sending them anywhere.

## The interesting parts

For anyone who likes formats:

- **KPF to KFX.** Kindle Previewer's command line outputs a KPF: a zip around a SQLite database of Ion fragments, with fingerprint records injected every megabyte. A Kindle wants a monolithic KFX. jhowell's kfxlib, part of the KFX Input calibre plugin, has the complete conversion; Deckle's KFX writer is a Rust port of it, tested byte for byte against kfxlib's output.
- **MTP on a Mac.** macOS has no MTP stack, so Deckle has a small PTP/MTP client over USB. The Kindle has opinions: it wants the 32-bit ObjectInfo layout (libmtp switches layouts on the Kindle's nameless root folders, and then every write fails with `0xA806`), zero-length packets after full data phases, and transaction id 0 for OpenSession.
- **Word Wise holds no text.** The sidecar stores positions and sense ids into a dictionary that is already on the Kindle. Deckle matches the book against its own lexicon, 174,000 senses derived from Wiktionary, and per-book proper-noun detection keeps "Darcy" from being glossed as a unit of permeability.

None of that was discovered here. It stands on years of work by the MobileRead community, credited on [the product page](/deckle/#dk-credits) and in the README.

## How it is built

Deckle is a Rust workspace with a Tauri and React app on top, and a command line that does everything the app does. It is developed with AI assistance, using Claude Code. Every feature starts as a written spec and plan, kept in the repository, and what the AI writes is reviewed and tested, against fixtures and real Kindles, before it merges. The workspace has more than 1,500 tests.

## What is still rough

It is pre-alpha, and I'd rather say so here than in your bug report:

- On real hardware it is verified on a Kindle Scribe (2024) and a Kindle Paperwhite. Kobo, PocketBook and reMarkable are tested only against simulated devices so far.
- Kindle books need Amazon's Kindle Previewer, which is free but has to be installed separately, and only runs on Mac and Windows. That is why there is no Linux build.
- The 2024 Scribe keeps its highlights where they can't be read over USB, so highlight export doesn't work there yet.

If you have an e-reader that isn't on that list, a report with its model and firmware is the most useful thing you can send.

[Download Deckle](https://github.com/CasaVargas/deckle/releases/latest), read [the source](https://github.com/CasaVargas/deckle), or see [what it looks like](/deckle/).
