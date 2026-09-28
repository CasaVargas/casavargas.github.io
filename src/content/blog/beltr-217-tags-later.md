---
title: "217 Tags Later: Seven Months of Building Beltr"
description: "From a first commit on a Sunday in February to a karaoke app on three desktop platforms, four companion apps, two app stores and a Docker image. The turns Beltr took, and what each one taught us."
date: 2026-09-28
tags: [beltr, engineering, releases, journey]
---

[Beltr](/work/beltr/) had its first commit on Sunday, February 15, 2026. Seven months later it has had 217 version tags, about 5,100 commits and 83 stable public releases between May and September alone. It runs on macOS, Windows and Linux, in a Docker image, and on phones and TVs through four companion apps.

None of that was the plan on day one. Here's the road, including the turns we didn't see coming.

## It didn't start small

The first commit was 72 files and 32,335 lines. By the end of February, Beltr had a pitch guide, synced lyrics and party game modes, and on the same day, phones became remotes. The idea that defines it, that the TV shows the lyrics and everyone else joins from the phone in their pocket, was there within two weeks.

## Picking a shell, twice

In March we wrote the desktop spec: Electron with an embedded Python engine. The reason was simple. The TV screen leans hard on Web Audio, Canvas and service workers, and we wanted them to behave the same on every platform, which meant shipping our own browser engine rather than trusting each system's.

A week later we tried to replace Electron on the Mac with a native SwiftUI shell, planned as the first of six sub-projects. It didn't make it into v1.4.0. The same week, a switch to a different separation model was reverted the day it landed, because it didn't run on the Python version we'd standardised on. March was a month of learning what not to rebuild.

## Becoming something you can buy

At the end of March, Beltr got licensing, a first version of beltr.app and a free trial. The trial was five songs then, and it's five songs now. The first version tag, v1.3.3, went out on March 31.

A week later we started the history over from a clean root commit at v1.4.0, leaving 366 commits of early history behind, and on April 7 the first public releases went up.

## Eight tags in one day

Getting into the Microsoft Store took eight version tags in a single day, April 16, every one of them fighting the Store's package build. Beltr was on the Store six days later.

That day set a pattern. When a release process needs eight attempts, the problem isn't the release, it's the process.

## Out of the computer

Karaoke happens around a TV, and a laptop plugged into one is not everyone's idea of a party. So over the summer Beltr spread out:

- **June 9:** Beltr Remote for iPhone, on the App Store.
- **June 25:** the Android phone remote and an Android TV client, on Google Play.
- **July 2:** Beltr Client for Apple TV, after a public beta on TestFlight.
- **August:** Docker images for home servers, and by mid-August a listing in Unraid's Community Applications. An arm64 image followed on September 1.
- **September 16:** Beltr on Homebrew.

Six clients now speak the same WebSocket protocol, which is its own story. We told it in [Native vs Cross-Platform](/blog/native-vs-cross-platform/).

## The spike that said no

On July 15, a short experiment asked whether moving separation onto ONNX Runtime would speed it up. It answered no: with the model we had, it was slower. The recommendation was to drop the idea.

Five weeks later the whole stack moved to ONNX Runtime anyway, on a different model, and shipped as v1.60.0. The macOS download went from 705 MB to 410 MB, Windows from 674 MB to 395 MB and Linux from 682 MB to 402 MB, and the installed Mac app from 1.6 GB to 813 MB. Separation got about 1.5 times faster on Apple Silicon and about 1.8 times faster on NVIDIA cards.

It also got about 1.7 times slower on machines with no GPU at all, and the release notes said so, in the same list as the good news. The optional high-quality tier went away too, because it depended on the framework that had just left the installer. We'd rather lose a claim than make one that isn't true for someone.

The lesson from the spike: an experiment answers the question you asked it. We'd asked about one model on a new runtime. The better question was which model to run on it.

## Releases that went wrong

Shipping 83 releases in four months means some of them went wrong, and each failure changed how releases work:

- One release shipped with no macOS build at all, so Macs quietly stopped getting updates.
- A tag that only hosted model files was marked as the latest release, and every installed copy's updater looked there and found nothing to install. Tags like that are always marked pre-release now.
- One release was merged but its tag was never pushed, so no installers were ever built.
- One shipped without its GPU pack, so every GPU install that week failed with a 404. It was fixed by re-running the build, without a new version.
- Three releases in a row wouldn't open on older versions of macOS. A Python toolchain on the build machine had been updated for the newest macOS, and the builds still came out green and signed. The fix moved the build to a standalone Python and added a check that fails the build if any binary requires a newer macOS than Beltr supports.
- An upstream library update broke pitch detection for two releases until we pinned it.

Every one of those was a step someone had to remember. So we stopped relying on memory. Today a single version tag builds and signs every installer, submits to the Microsoft Store (since September 8), publishes to Google Play (since September 19) and submits to the App Store (since September 27). A release-health check then verifies every platform, installer and image, and opens an issue if anything is missing. A healthy release makes no noise at all.

## Taking a claim back

In July we removed a speed claim from the Beltr website, because our own benchmarks didn't back it up. It was a good number, and it came down anyway. Every public claim about Beltr now has to match what the app does on real hardware, and the case study on this site is checked against beltr.app, not the other way round.

## By the numbers

- **217** version tags, from v1.3.3 on March 31 to v1.68.6 on September 26.
- **83** stable public releases between May 21 and September 24.
- **105** entries in the public changelog.
- **5,179** backend tests, alongside the JavaScript and browser suites.
- **Five songs** free to try, the same as on day one of the trial.

## Who helped

Beltr exists because people kept telling us what was wrong with it: r/karaoke, where it started as a half-finished idea and got taken seriously anyway, and the Beltr Discord, where bug reports, lyric-timing arguments and living-room party photos keep arriving.

Beltr is $19.99 once, and five songs are free with no card. [Try it at beltr.app](https://beltr.app).
