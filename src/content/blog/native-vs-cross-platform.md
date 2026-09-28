---
title: "Native vs Cross-Platform: When to Use Each"
description: "CasaVargas ships SwiftUI, Electron and Tauri apps, and one product that ended up as both. How we choose, with real examples and what each choice cost us."
date: 2026-04-05
updated: 2026-09-28
tags: [engineering, swiftui, tauri, electron, architecture]
---

The native vs cross-platform argument usually comes down to taste: someone picks a side and defends it. At [CasaVargas](/) we ship both, and the choice depends on the product. Here's how that plays out across four apps, including one that ended up being both.

The short version: go native when the platform *is* the product. Go cross-platform when the job is the same everywhere. And expect the answer to change as a product grows.

## Native: Cathode TV

[Cathode TV](/work/cathode-tv/) is an IPTV player for iPhone, iPad, Mac, Apple TV and Vision Pro, built as one SwiftUI codebase. The shared part is the data: playlists, the program guide, favorites, profiles. The part that can't be shared is input. Touch, a keyboard, the Siri Remote, and eyes and hands on Vision Pro are four different ways of pointing at things, and each platform gets an interface built around its own.

Apple TV is where native pays for itself. On tvOS, the focus engine decides what the remote is pointing at, and a player that fights it feels broken however good it looks. Cathode TV's on-screen player controls used to be governed by four separate flags, which allows sixteen combinations, several of them nonsense. They're now a single five-state machine, and only one element can hold focus at a time, so the focus engine never has to guess. The guide grid never recycles the cell you're focused on, and when it rebuilds, it keeps you at the same time of day rather than the same scroll position.

None of that is reachable through a cross-platform layer. You'd spend the whole project working around it.

## Native: OneScribe

[OneScribe](/work/onescribe/) goes further, because the product is Apple's frameworks. A single Vision request per page returns the text in reading order, with its structure and barcodes, and adopting it let us delete about 1,200 lines of our own layout code. A Core ML classifier decides what kind of document it is. Then Apple's on-device language model fills in typed Swift structs, one per document type, instead of writing free text we'd have to parse. There's no cross-platform equivalent of any of it.

## Cross-platform: DebridDownloader

[DebridDownloader](/work/debrid-downloader/) is a desktop client for debrid services on macOS, Windows and Linux, built with Tauri, Rust and React. A download manager's job is identical on every operating system: queue files, move bytes, put them where your media server looks.

Tauri draws the interface with the system's own web view and runs everything else in Rust, so there's no browser engine to ship and the installers stay small: 5.9 MB on Windows and 8.9 MB on macOS. One GitHub Actions workflow builds five targets. The platform-specific parts are exactly where you'd expect them. Tokens live in the macOS Keychain, Windows Credential Manager or Linux Secret Service, never in a settings file, and it can register as the system's handler for the links it opens.

## Both: Beltr

[Beltr](/work/beltr/) looked like the easiest call of the four. Karaoke runs on the computer plugged into the TV, and that computer could be a Mac, a Windows PC or a Linux box. More to the point, guests join from their phones by scanning a QR code, with nothing to install. That means the phone remote *has* to be a web page. Once it is, the big screen may as well be one too.

So Beltr is a Python server that runs the AI on ONNX Runtime, plus web pages for the TV and the phones. Electron is only the shell on the computer: it starts the server and opens the TV page. That's a narrower job than people assume when they hear "Electron app".

Then Beltr grew native apps anyway: a free Beltr Remote for iPhone and Android, and a free Beltr Client that puts the lyrics on an Apple TV or Android TV. Apple TV has no web browser at all, so a native app was the only way onto it. Now there are six clients, and what keeps them honest is a contract. They all speak the same WebSocket room protocol, and the JSON the server sends is the spec. Pitch scoring is ported to Swift and Kotlin and checked against reference results produced by running the real JavaScript scorer, so a score means the same thing on every screen.

Cross-platform at the core, native at the edges. For Beltr, that's the right answer.

## What cross-platform costs

Cross-platform doesn't mean platform-free. Two Beltr bugs show where the platform leaks through.

**A folder named after a browser file.** The desktop app keeps its data in the same folder Electron uses for Chromium's own files. We kept preferences in a directory called `preferences/`. On first launch, Chromium writes a file called `Preferences` in that same folder, and macOS and Windows filesystems ignore case, so the two names were the same path. Creating our directory failed, and every Settings change in the installed app quietly refused to save. Linux is case-sensitive and never saw it, and neither did development checkouts, which don't use Electron's folder. That's how it shipped. The directory is `prefs/` now, existing installs are renamed once at startup, and there's a standing rule: never name anything in that folder after something Chromium writes.

**Every quit looked like a crash.** On macOS and Linux, the shell asks the server to stop and the server shuts down cleanly. Windows has no gentle equivalent for a child process, so every normal quit ended with the process being terminated outright, and the next launch warned that the previous run hadn't shut down cleanly. The fix was to ask politely first: the shell calls a shutdown endpoint that only answers on the local machine and only with a token generated for that launch, and forces the issue only if the server hasn't exited after eight seconds.

## The decision framework

**Go native when:**
- The input model is the product: a TV remote, a pencil, eyes and hands
- The core feature is a platform framework: Vision, Core ML, Foundation Models, AVKit
- The interface has to differ per device, not just resize

**Go cross-platform when:**
- The job is the same on every operating system
- The interface already has to be a web page for some other reason
- A small studio needs Mac, Windows and Linux from one codebase
- Pick Electron when you need a full browser engine you control; pick Tauri when footprint matters most

**And revisit it.** The wrong answer is picking one approach for everything, but the second-worst is picking once and never looking again. Beltr started as a cross-platform app and grew native companions when the platforms it needed (a TV with no browser) left no other way in.
