---
type: update
date: 2026-10-11
project: My Mini Retro Television Channels
publish: true
---
I Built Nickelodeon On A Tiny TV

Okay, this got out of hand.

What started as "I should put some old cartoons on tiny USB drives and make them look like VHS tapes" has now turned into me basically building my own fake television network.

And I am having an unreasonable amount of fun with it.

The little My Mini Retro Television will play MP4 files from a USB drive in order, so my original idea was pretty simple:

Take a 4 GB thumb drive.

Put some episodes on it.

Mix in old commercials and bumpers.

Make the whole thing feel like somebody recorded a few hours of TV in 1998.

Easy.

Except I didn't really want a playlist.

I wanted **television**.

I wanted the dumb little five-second "we'll be right back" bumper.

I wanted the commercial break.

I wanted the slightly too-loud toy commercial.

I wanted the network ID before the next show.

I wanted it to feel like I turned on Nickelodeon, not like I opened a folder full of MP4s.

So naturally I built software.

Because apparently that is how every project works now.

## The Cart Plan

The current plan is twenty little USB "cartridges," each one pretending to be a different channel, block, or era.

The first five were all Nickelodeon:

- NICK1
- NICK2
- NICK3
- NICK4
- SNICK1

NICK1 through NICK4 are different fake Nickelodeon broadcasts built from shows like Doug, Rugrats, Hey Arnold!, Rocko's Modern Life, Angry Beavers, CatDog, and Aaahh!!! Real Monsters.

SNICK1 is the late-night one.

Are You Afraid of the Dark?

Ren & Stimpy.

SNICK bumpers.

Old commercials.

A proper SNICK closing.

SNICK1 is literally building while I write this.

That means, unless something explodes in the next few minutes, **the entire Nickelodeon phase is done.**

Hell yes.

## I Did Not Expect To Build A Broadcast Engine

The first cart taught me pretty quickly that just throwing commercials and bumpers between episodes wasn't enough.

It worked.

It also felt insane.

Too many ads.

Too many transitions.

Bumpers for the wrong shows.

Repeated material.

Bad crops.

Audio that sounded like it was recovered from the bottom of Lake Erie.

So the project slowly turned into what is now the **Retro TV Cart Builder**.

It keeps a registry of all of my episodes, commercials, network branding, bumpers, promos, IDs, sign-offs, and other assorted garbage.

It remembers what has already been used.

Commercials are generally one-use.

Branding can be reused.

Bad source files can be excluded globally.

A clip can be marked for a crop, trim, audio cleanup, replacement, or just declared GOOD and left alone.

Then the builder creates a fake broadcast.

The current Nickelodeon rhythm is intentionally pretty lean:

```text
SHOW
↓
COMMERCIAL
↓
MATCHED OR GENERIC NETWORK BUMPER
↓
NEXT SHOW
```

That sounds obvious now.

It took me several carts to arrive at "maybe television should not have six things between every television show."

## The Studio

Eventually I got sick of managing all of this through CSV files and PowerShell, so I built a little local web app for reviewing everything.

Retro TV Cart Studio lets me go clip by clip and actually see what the final television output is going to look like.

I can:

- preview every clip
- replace bad material
- repair noisy audio
- trim junk from the beginning or end
- crop garbage off old recordings
- compare the crop against the actual 618x480 TV output
- approve every clip
- build one continuous full-cart review
- build the final cartridge
- copy it directly to a USB drive

The crop tool was especially annoying to get right because a lot of this old video uses weird pixel aspect ratios.

A crop rectangle that looked correct mathematically did not necessarily look correct when displayed.

The final version now shows a draggable, resizable crop box locked to the physical proportions of the TV, and then shows the exact rendered result beside it.

Much better.

There have also been some spectacularly boring bugs.

A failed render could leave a corrupt cached MP4 behind.

Windows occasionally decided a file was still open and refused to delete it.

I clicked the final build button twice because I thought the first click didn't register and accidentally started two builds at the same time.

That one was fun.

Every stupid failure has made the builder slightly less stupid.

## SNICK Was A Good Test

SNICK exposed a few things the regular Nickelodeon carts didn't.

For one, SNICK is actually its own branding pool.

At first I accidentally configured the cart as regular `NICK`, and the software very obediently gave me regular Nickelodeon IDs and regular Nickelodeon replacement options.

Technically correct!

Completely wrong.

Thankfully I had already tagged all of the actual SNICK material separately, so once the cart was correctly identified as `SNICK`, everything suddenly clicked into place.

And this time the smarter bumper selection really started showing off.

The builder knows the upcoming show and prefers branding that matches it when possible.

My SNICK archive happens to contain things like:

```text
SNICK - Bumper - Are You Afraid of the Dark
SNICK - Now Back - Ren & Stimpy
```

Since the entire cart alternates between those two shows, a lot of the transitions feel surprisingly intentional.

Some of the commercials even seem perfectly matched.

Those are mostly luck.

I will take it.

## The Ren & Stimpy Problem

SNICK also gave me another weird problem.

A lot of Ren & Stimpy episodes in my collection are stored as separate shorts.

For example:

```text
Space Madness
+
The Boy Who Cried Rat!
```

I wanted those to behave like one normal half-hour show block.

Otherwise the cart would happily put a commercial break between the two halves.

So I ended up making a composite utility.

If the two source files have matching video and audio formats, it combines them without re-encoding.

If one file has some dumb extra audio track, it ignores the extra track and still combines them losslessly.

If the actual video formats differ, it normalizes them into a common high-quality intermediate first.

That happened with one pair where one half was 696x480 and the other was 704x480.

Four pixels.

Four stupid pixels were enough to turn this into another feature.

Of course.

The nice part is that this is not just a SNICK hack anymore.

The upcoming Cartoon Network carts contain Powerpuff Girls and Dexter's Laboratory shorts that need the exact same treatment, so the composite builder is now a reusable utility.

## Where This Is Going

At this point I am realizing that the thing I am building could eventually be useful to somebody besides me.

Right now I am still perfectly comfortable dropping into PowerShell and poking around CSV files when I need to.

That cannot be the final experience.

Eventually I want somebody who knows the bare minimum about computers to be able to install this and build their own fake TV channels.

The workflow should be something like:

```text
ADD MEDIA LOCATIONS
↓
TAG SHOWS / COMMERCIALS / BRANDING
↓
CREATE SHOWS
↓
CREATE CHANNELS OR BLOCKS
↓
CHOOSE WHAT BELONGS ON EACH CHANNEL
↓
BUILD A BROADCAST
↓
REVIEW IT
↓
EXPORT TO USB
```

And "add media" does **not** mean copying somebody's giant TV collection into the program.

The program should index the files where they already live.

If you move them later and break the path, that is your problem.

There should be a clear separation between:

```text
SOURCE MEDIA
Your files.
Never modified.
Never moved.
Never duplicated.

DERIVED MEDIA
Previews.
Caches.
Combined episodes.
Review videos.
Finished cartridges.
Stuff the program can regenerate.
```

I also want channel identity to be simple.

A normal user should not have to know what the hell the difference is between an `IDENT`, `INTRO`, `BUMPER_IN`, `BUMPER_OUT`, and `SIGN_OFF`.

They should be able to say:

```text
Channel: SNICK
Branding Pool: SNICK
Shows: Are You Afraid of the Dark?, Ren & Stimpy
Commercial Pool: 90s Kids
```

Then the software figures out where the appropriate branding belongs.

If somebody wants to micromanage it, there can be an Advanced Mode.

I will obviously be using Advanced Mode.

## Five Down

So that is where this ridiculous thing stands.

Four Nickelodeon carts are finished.

SNICK1 is being built now.

The software is significantly better than it was when I started.

I have a growing pile of tiny USB drives that pretend to be television stations.

And next up is Cartoon Network.

Five carts down.

Fifteen to go.

This is going to take forever.

I am delighted.

**Next:** CN1. Time to enter the Powerhouse era.
