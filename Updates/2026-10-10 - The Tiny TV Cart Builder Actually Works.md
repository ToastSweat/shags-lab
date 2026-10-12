---
title: The Tiny TV Cart Builder Actually Works!
type: update
date: 2026-10-10
project: My Mini Retro Television Channels
publish: true
git: https://github.com/ToastSweat/my-mini-retro-television-cart-builder
---
Yesterday I wrote that I had built a tiny TV station factory.

Today I can finally say something much more important:

**It actually works.**

![[{FB8564B8-C031-4A4D-8DF7-1A7C751454CC}.png]]

NICK01 has made it all the way through the review process, and revision 9 is completely green.

```text
36 clips
36 GOOD
0 unresolved
```

That feels like a much bigger milestone than just finishing one fake Nickelodeon cartridge.

Because the real goal was never just NICK1.

The goal was to prove that the system I built around it is actually usable.

And now I think it is.

## I Had Already Put One On The TV

One thing I apparently never wrote down while I was buried in all of this:

I actually rendered an earlier version of NICK01 and watched the whole thing on one of the physical TVs around revision 3.

That test was incredibly useful.

Until then I was mostly reviewing the cart on my computer and making assumptions about what would feel right.

Watching the actual cartridge on the actual tiny television exposed a bunch of stuff that was much harder to notice in the builder.

Too many bumpers.

Too many commercials.

Weird transitions.

Wrong-show promos.

Bad crops.

Bad audio.

Things that technically "worked" but did not feel like television.

That physical test is what pushed a lot of the changes that eventually turned the builder from a pile of scripts into something I can actually use.

## Nine Revisions Later

NICK01 eventually made it to:

```text
r009
```

Which is hilarious.

But most of those revisions were not really about fixing NICK01.

They were about fixing the **system**.

Every time the cart found a new way to be wrong, I tried to solve that problem in the builder instead of manually patching the final output.

That gave me things like:

- persistent cart revisions
- permanent asset and slot IDs
- reusable cached proxies
- automatic replacement selection
- safer replacement validation
- non-destructive trimming
- non-destructive cropping
- FFmpeg crop detection
- audio repair profiles
- louder/clearer review-state indicators
- GOOD-state carryover between revisions
- handpicked branding registration
- sign-off support
- leaner commercial breaks
- better program-specific bumper detection
- USB size validation
- automatic cartridge volume labels
- copy progress bars
- a review page that is actually pleasant to use

There were plenty of bugs.

Some of them were very stupid.

One of my favorites was selecting a replacement clip in the review page and having the replacement saved without automatically changing the action to:

```text
REPLACE_THIS_CART
```

So later the apply script would look at:

```text
Action: GOOD
ReplacementAssetID: BR-whatever
```

and reasonably assume the replacement was stale garbage.

Except sometimes I absolutely meant to replace it.

That is fixed now too.

Selecting a replacement means replace the damn clip.

As it should have from the beginning.

![[{A0CF6E15-D53C-4536-A383-45635D2DF5BD}.png]]

## BAD_AUDIO Finally Means BAD_AUDIO

This was another one that took a few passes.

I wanted:

```text
BAD_AUDIO
```

to mean:

> Keep this source, but clean the audio up.

At one point it accidentally meant:

> Throw this source away and replace it.

Then it technically did audio processing, but the processing was so mild that some genuinely bad archival audio still sounded bad afterward.

So the audio side got rebuilt too.

The current system has a real restoration pass that can do things like:

- high-pass cleanup
- low-pass cleanup
- de-clipping
- de-clicking
- broadband noise reduction
- dynamic leveling
- loudness normalization

If a repaired clip still sounds bad and I mark it BAD_AUDIO again, it can escalate to a stronger repair profile.

And, just as importantly, the review page now tells me when a clip has already been audio-repaired.

That sounds obvious.

A lot of this project has been learning which things only become obvious after you have personally been annoyed by them.

## The Review System Is Finally Doing Its Job

At this point the workflow is pretty straightforward.

Build a cart.

Review it.

Mark the problems.

Export the review CSV.

Apply the review.

Rebuild only what changed.

Check the repaired clips.

Repeat until everything is green.

The newest review CSV for NICK01 is:

```text
NICK01-r009-review-state.csv
```

And this time there is nothing left to resolve.

Every clip is marked GOOD.

That means the system successfully carried this cartridge from a giant pile of random source media all the way to an approved final broadcast.

That is the proof-of-concept I wanted.

## From Here It Should Mostly Be Small Stuff

I am sure I will still find bugs.

I am also sure I will find little quality-of-life things that annoy me once I start building more cartridges.

But I do not think I need to fundamentally redesign this anymore.

The basic system works.

From here the plan is much nicer:

Build more carts.

Watch them.

Tweak the builder when something genuinely needs improvement.

And go hunting for new content when a network, era, or show is underrepresented.

There are still a lot of cartridges I want to make.

Nickelodeon was only the first one.

I already have plans for Cartoon Network, Kids' WB, Fox Kids, Boomerang, Sci-Fi, UPN, HBO, AMC, and more.

Now I actually have a machine for building them.

## Stretch Goal: Stop Making Me Type PowerShell

The current toolkit is usable.

But "usable by me" and "pleasant for another human being" are not the same thing.

Right now the workflow is still a collection of PowerShell commands.

Stuff like:

```powershell
.\Initialize-RetroCartLibrary.ps1
.\Build-RetroCartReview.ps1 -CartID NICK01
.\Open-RetroCart.ps1 -CartID NICK01
.\Apply-RetroCartReview.ps1 ...
.\Build-RetroCartFinal.ps1 -CartID NICK01
```

I am fine with that.

But the stretch goal is to make a small desktop program where those commands become buttons.

Something like:

```text
[ Scan / Refresh Library ]

[ Create Cart ]

[ Build Review ]

[ Open Review ]

[ Apply Review ]

[ Audit Audio Repairs ]

[ Build Final Cartridge ]

[ Copy To USB ]
```

Maybe with a cart dropdown, revision number, progress output, and a few sanity checks.

Nothing huge.

Just enough that the system feels like an actual application instead of me operating a tiny television broadcast facility from Windows Terminal.

## The Real End Goal

I want to put this whole thing on GitHub.

Not just dump the scripts into a repository and call it done.

Actually clean it up.

Remove all of my hard-coded local paths where possible.

Make setup sane.

Write proper documentation.

Include examples.

Explain the asset registry, cart revisions, review process, caching, repair system, and final build workflow.

Make it so someone else with a pile of old TV recordings and one of these little televisions can clone the project and build their own cartridges without needing to reverse-engineer my reverse-engineering project.

There will need to be a proper cleanup pass before that happens.

A clean Git commit.

A cleaner folder structure.

Configuration that does not assume everyone on Earth has:

```text
F:\[VIDEOS]\
```

Documentation that explains what the hell all of these scripts do.

And ideally that little button-driven app on top.

But that is future work.

For now, I have something much more satisfying:

A complete NICK01 review.

A usable cart-building system.

And a tiny television waiting for another cartridge.

That is a pretty damn good milestone.
