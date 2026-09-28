---
title: "Why We Don't Do Subscriptions"
description: "CasaVargas apps are paid for once, if at all. Why we reject the subscription model, and how that rule shapes the way the apps are engineered."
date: 2026-04-07
updated: 2026-09-28
tags: [philosophy, pricing, indie-dev]
---

Every week another app switches to subscriptions. A weather app wants $5 a month. A calculator needs an annual plan. A flashlight app (yes, a flashlight app) has a Pro tier.

At [CasaVargas](/), every app is either a one-time purchase or free. No subscriptions, no recurring charges, no premium tier that gates features you already paid for. Here's why, and what that rule does to the way the apps are built.

*A correction, September 2026: when this post went up, OneScribe was still selling a $0.99/month plan alongside its one-time unlock. We dropped the monthly plan on May 19, 2026. OneScribe now sells only a one-time $9.99 Pro upgrade, and existing subscribers are still supported.*

## What a subscription is for

Subscriptions make sense for services with ongoing costs. A music streaming service pays for licensing and bandwidth every month you listen. Cloud storage pays for disks that keep spinning whether you open the app or not.

Most apps aren't services. A document scanner runs on your phone. A download manager uses your internet connection. A karaoke app processes audio on your computer. The cost to the developer of one more month of you using it is close to zero, so a monthly fee isn't paying for a cost. It's paying for a business model.

## No server, nothing to rent

Here's the part that surprised us: "no subscriptions" turned out to be an engineering rule as much as a pricing one. If an app needs our server to do its work for every user, every user costs us money every month, and sooner or later a subscription follows to cover it. So the apps are built not to need one.

- **[Beltr](/work/beltr/) ships its entire AI engine inside the installer.** That's why the download runs to hundreds of megabytes instead of a few. Separating the vocals from a song runs on your computer, so a song you separate costs us nothing, and once Beltr is set up it works offline.
- **[OneScribe](/work/onescribe/) reads documents with Apple's on-device models.** There's no account to create and no OneScribe server to send anything to. Scanning is free; Pro is one $9.99 purchase.
- **[DebridDownloader](/work/debrid-downloader/) talks to the service you already pay for,** directly from your machine. It's free and open source under GPL-3.0.

The trade-off is real. A server can be upgraded for everyone overnight; an installer has to be downloaded again. Local processing is slower on an old PC than it would be on a rented GPU. We think owning the software is worth that, and the apps are designed around it from the first spec.

## Updates are part of the price

Buying once doesn't mean the app stops improving. Beltr shipped 83 public desktop releases between May 21 and September 24, 2026, and every one of them was free to everyone who'd bought it. One Beltr license covers two computers.

That's the right incentive. We make money by building something good enough that new people want to buy it, not by making it painful to stop paying.

## Trials without a clock

This post used to promise you'd never see a "your trial has expired" message in one of our apps. That wasn't quite precise, so here's the real version.

Beltr's trial isn't a clock. It's five full songs, with no card and no time limit. You don't get a nag on day 14 or a countdown in the corner; you get five songs to decide, and if you buy it and change your mind, there's a 14-day full refund. OneScribe's scanning is free for as long as you use it. Nothing we sell locks you out of something you were already using because a date passed.

## How this works financially

The honest answer: it's harder. Subscription revenue is predictable and compounds. One-time purchases mean you keep finding new customers or keep building things existing customers want.

But CasaVargas is an independent studio, not a startup with investors to repay. The overhead is low, and the build machines are ones we own. If an app sells well enough to justify the time spent building it, that's a win. For open-source work like DebridDownloader, [GitHub Sponsors](https://github.com/sponsors/prjoni99) lets people support it voluntarily, not because a paywall makes them.

## Our promise

Every app we ship will follow this rule: buy it once and own it, or get it free. If we can't make a product work as a one-time purchase, we'll make it free and open source instead.

Software should be owned, not rented.
