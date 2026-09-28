---
title: "Building Beltr: What It Takes to Turn Any Song into Karaoke"
description: "Taking the singer out on your own computer, dropping PyTorch, timing lyrics word by word, keeping a phone in step with the TV, and two bugs worth remembering."
date: 2026-04-09
updated: 2026-09-28
tags: [beltr, ai, audio, engineering]
---

Every karaoke setup has the same problem: somebody has to make the karaoke version. Catalog services license tracks and rent them back to you by the month. Lyric videos are hit and miss. [Beltr](/work/beltr/) starts from the other end. The music you already own is the catalog, and your own computer does the work of turning each song into something you can sing.

That one sentence hides five hard problems. Here's how each one is solved, and two things that went wrong along the way.

## 1. Taking the singer out

The old karaoke trick was to subtract one stereo channel from the other. Lead vocals are usually mixed dead center, so they cancel out. So does everything else mixed center: the kick, the snare, the bass. What's left sounds like the band is playing in the next room.

Beltr uses a neural network instead. MDX-Net has learned what a voice sounds like, and it splits a song into two stems: the vocal on its own, and everything else. A typical song takes a minute or two on your own machine, quicker on a recent Apple Silicon Mac and longer on an older PC with only a CPU. Nothing is uploaded.

Two decisions shape how that feels in practice. Songs are separated **one at a time**, not in parallel, because separation is memory-hungry and a whole folder should be able to queue up without the machine falling over. And a song is **handed over as soon as it can be sung**, while the rest of the work finishes in the background.

## 2. One runtime, and no PyTorch

The first versions ran their models on PyTorch, which is how most audio research ships. PyTorch is also enormous. We moved every model (separation, lyric alignment, the fallback transcriber and pitch detection) onto ONNX Runtime, and dropping PyTorch took two to three gigabytes out of each installer.

The risky part was alignment, the model that decides exactly when each word is sung. Its word timing had already been measured at a 0 ms median start offset across 3,085 words, and switching to a different aligner would have meant starting that work again. So we kept the model, exported it to ONNX, and rewrote its Viterbi decoding step in NumPy. Word timing stayed compatible with the version we'd already measured.

## 3. Lyrics that land on the word

Line-synced lyrics come from LRCLIB, a free community database, or from your own paste. Line timing isn't enough for karaoke, though: the highlight has to sweep across each word as it's sung. So Beltr aligns the words against the separated vocal track, where the voice is clean.

Alignment gives you word times. The display still has to be honest about them. An early bug: the aligner would sometimes stamp the last words of a line at or after the moment the next line took over. Those words were never reached, so the sweep visibly stopped halfway across the line and jumped. The fix re-seats each line's words inside that line's own window, so the sweep always finishes before the line changes. It only ever compresses, never stretches: a line whose words genuinely end early keeps its pause.

Hand corrections are stored apart from the aligner's output, so re-running alignment never throws away someone's careful fix.

## 4. Keeping a phone in step with the TV

Guests join from their phones by scanning a QR code, with nothing to install. The phone shows the lyrics too, which means it has to know where the TV is in the song, across a Wi-Fi network it knows nothing about.

Beltr borrows the trick network time servers use. When a song loads, the phone fires a quick burst of pings. The TV stamps each one against its own audio clock, and the phone keeps the reply with the shortest round trip, because that's the one the network distorted least. After that, one ping every few seconds keeps the estimate from drifting.

The interesting lesson was which way to be wrong. We tried trusting the very first reply to shave off the start-up delay. But the first ping arrives while the TV is busy starting playback, so its timestamp runs late, and phone lyrics raced ahead of the singer for most of a second. In karaoke, a word that lights up early is much worse than one that lights up late, because you sing the wrong word. Beltr now waits for the burst to settle, and until it has, it errs on the side of behind.

## 5. The discs people already own

Plenty of people have boxes of karaoke discs and folders of MP3+G files. Beltr plays CDG, MP3+G, .kar, .mid and Thai NCN files with the lyrics read straight from the file.

MIDI and .kar files have no recording to separate, so Beltr renders them at import with a software synthesizer, putting the melody in the vocal stem as a guide and everything else in the instrumental. From then on they look exactly like a separated song, so the TV, the mixer and pitch scoring need no special cases. Old files also carry old text encodings (TIS-620 for Thai, Shift-JIS for Japanese, Big5 for Chinese), so those are detected on import instead of turning into garbage characters on the TV.

## Two bugs worth remembering

**A button that ate clicks.** The dashboard's play and pause button redrew itself from a status update the TV sends ten times a second. A mouse click takes roughly a tenth of a second from press to release, so the button a click started on had usually been replaced by the time it ended, and the click landed on nothing. No error, no log line. It looked like network lag, which sent the first round of debugging to entirely the wrong place. The tell was that the buttons next to it, which never redraw, always worked. The fix: never rebuild a clickable element from a stream. Change it only when the state actually changes.

**A slow network share froze everything.** Scanning a music folder on a NAS can take minutes. Those scans originally ran on the server's shared pool of worker threads, and a burst of them against a large share once filled every thread, so every other request waited behind them: the whole app went unresponsive for well over ten minutes. Scans now run on a small pool of their own, one per folder at a time, and the rest of the app never notices.

## Built on your machine, paid for once

Doing all of this locally is also what lets Beltr be a one-time purchase. There's no server separating songs for each user, so there's nothing to rent. Beltr is $19.99 once, and five songs are free to try with no card. [Try it at beltr.app](https://beltr.app).
