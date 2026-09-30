---
type: update
date: 2026-09-28
project: PGN Discord Archive
publish: true
---
# I Downloaded Ten Years of Discord and Accidentally Became the Clan Historian

This started because I had a stupid thought:

**Can I just... download the entire history of my Discord server?**

Turns out, yes.

And once I realized that, obviously the next reasonable thing to do was dump roughly a decade of my friends' conversations into a pile of JSON and start doing archaeology on it.

The Discord server is for **PGN — Progeny Gaming Network**, which has existed in one form or another since around 2015. We started as more of a traditional gaming clan around stuff like Multi Theft Auto and Minecraft, but over the years it slowly turned into something much harder to define.

At this point PGN is basically:

- a gaming group
- a pile of old dedicated servers
- a graveyard full of games we swear we're going to play again
- a software lab
- an excuse for me to host things
- and, mostly, a group of friends who somehow never completely logged out

So I decided I wanted the receipts.

## Step One: Vacuum Up Discord

I set up a dedicated Discord bot and used **DiscordChatExporter** to export the entire server.

I did the archive in JSON first because I was less interested in having a pretty offline copy of Discord and more interested in having **data I could actually do things with**.

The first complete archive came out to:

- **79 JSON channel/thread exports**
- **68,975 unique messages**
- almost exactly **10 years of Discord history**
- earliest surviving message: **October 19, 2016**
- latest message in the export: **September 27, 2026**

There are also thousands of attachment and embed references waiting for me to deal with later.

The raw text archive is only around 30 MB compressed, which is honestly kind of hilarious considering how much human nonsense is contained inside it.

The first message in the surviving archive is:

> Harro

Which is about as dignified a beginning as PGN deserves.

## Step Two: Apparently We're Doing Data Archaeology Now

Once I had the JSON, staring at 69,000 messages one at a time sounded like a terrible idea.

So I started building a little analysis tool I called:

**PGN Discord Archaeologist**

The first version normalizes the exported messages and generates things like:

- yearly and monthly activity
- channel statistics
- member activity
- game/thread timelines
- Steam links
- long-term participation
- attachment counts
- return-after-disappearing patterns
- and candidates for stupid clan titles

It also builds a SQLite database so the archive becomes something I can actually search.

That means instead of scrolling through Discord for two hours trying to remember something, I can eventually ask questions like:

> When did we first start playing PUBG?

> When did Dargeath disappear?

> How many separate times did we revive Crossout?

> When did Helvete become a restaurant?

> Who disappeared for four years and then randomly came back?

These are important historical questions.

## Step Three: Oh No, There's Actually A Story Here

The funniest part was that the archive stopped looking like a pile of chat logs pretty quickly.

There are very obvious eras.

2017 is absolutely enormous. It is by far the busiest year in the archive.

Then there are periods where everybody piles into ARK, PUBG, Crossout, Grounded, Valheim, Helldivers, Minecraft, The Isle, Dune, or whatever terrible multiplayer decision we have made that month.

But underneath all of that there is a much more interesting pattern.

PGN keeps doing the **same thing on different technology**.

Early on it was:

> Let's run an MTA server.

Then:

> Let's run a Minecraft server.

Then:

> Let's run an ARK server.

Then:

> Okay but can we mod the server?

Then:

> Can we write our own scripts?

Then:

> Maybe we should just make games.

Then:

> Maybe this twenty-year-old Battlefront game needs a website, persistent player identities, statistics, XP, achievements, an economy, Discord integration, and a database.

You know.

Normal progression.

One of the best lines I found in the archive was Steven describing old game communities in 2022:

> a place to interact with a community, the game being the medium

That might actually be the best explanation of PGN I've ever heard.

The games keep changing.

The group is the thing that survives them.

## The Things That Refuse To Die

There are also a few things that keep resurfacing over and over again.

### Helvete

Helvete predates PGN and originally comes out of the old MTA era.

Over the years it has been:

- an old gang/group
- a logo
- a possible PGN rebrand
- a revived SAES group
- a motorcycle club
- a restaurant
- a fast-food joke
- and now the name behind **helvete.pizza**

At this point Helvete is less of a specific organization and more like some kind of cursed cultural object we keep carrying from game to game.

### Dargeath

Dargeath was our old Minecraft RPG server.

At one point I went looking for the backups and realized they were probably gone.

The Discord archive literally contains:

> rip Dargeath

Naturally, this did not stop us from trying to resurrect it repeatedly.

There is now a thread called **Dargeath 17.0**.

Death is apparently a temporary status.

### Safe Cracker

Safe Cracker might be my favorite example.

It started life as a little safe-cracking concept tied to the old MTA/SAES days.

Then I rebuilt it in Unity.

Then I considered making it a Game Boy game because apparently I enjoy suffering.

Then it became a Steam game.

Now I'm turning it into a Discord Activity.

At this rate I expect to be porting Safe Cracker to a refrigerator in 2031.

## Then I Wrote The History Book

Once I realized there was an actual narrative hiding in the archive, I stopped treating this as purely a statistics project.

I started reconstructing a proper history of PGN.

The first version was around 7,000 words.

Then I went back into the archive and did a much deeper pass.

The current internal version is about **9,500 words**, backed by **86 individual historical events** pulled directly from the archive.

For each major event I keep:

- the date
- channel
- author
- Discord message ID
- original excerpt
- and a short note explaining why it matters

That distinction is important because PGN has now existed long enough that we have actual **oral history**.

People remember things.

People also remember things incorrectly.

So I started separating:

**documented event**

from:

**later recollection**

from:

**clan mythology**

For example, we have a later song that describes the lineage as:

**Hell Soldiers → Helvete → WSS → PGN**

That is absolutely part of PGN lore.

But until I dig up older records, I'm treating it as oral history rather than pretending I found a 2013 board meeting transcript.

This is apparently the level of archival rigor I am bringing to a gaming clan whose Battlefront server is named:

**PGN - Ewok Around and Find Out**

## The Discord Is Becoming A Museum

Something else became obvious while doing this.

The modern PGN server itself has slowly started preserving history.

We now have things like:

- dedicated project channels
- game threads
- server status posts
- The Workshop
- an About PGN page
- and an actual **Graveyard** category for dead games and projects

Older PGN history is incredibly difficult to reconstruct because almost everything happened in one giant `#general` channel, voice chat, game servers, or services that no longer exist.

Modern PGN leaves ruins with signs on them.

That is much easier for the archaeologist.

## The Perfect Ending

There is one detail I could not have planned better.

The archive ends on September 27, 2026.

The final message in the entire exported history is an automated Discord welcome message.

It says:

> Welcome to Progeny Gaming Network, @PGN Archivist!

The bot I created to preserve the history became the last event preserved by the first archive.

That is so absurdly appropriate that if I wrote it into a story I would probably think it was too cute.

But that's actually how the export ends.

## What's Next

The text history is only the first layer.

There are still **thousands of attachments, screenshots, embeds, logos, maps, project images, memes, and probably completely forgotten artifacts** referenced in the archive.

So the next obvious terrible idea is to start indexing those too.

Eventually I want this to become something closer to a little **PGN digital museum**:

- a proper timeline
- game eras
- old servers
- project histories
- member timelines
- screenshots
- old logos
- running jokes
- ridiculous quotes
- dead projects
- resurrected dead projects
- and a **Hall of Titles**

The Hall of Titles is especially important.

Things like:

- The Ancient One
- The Chronicler
- The Server Goblin
- Return From the Void
- The Necromancer
- The Ping Lord
- and, obviously, **Clan Troll**

I can use the archive to produce candidates based on actual evidence.

Then I can post the nominations in Discord and let everyone fight over them.

Which is probably the most historically accurate way possible to decide anything about PGN.

For now, though, I have something I never really expected to have:

**a ten-year primary-source archive of one very weird group of friends.**

And for once, when one of our projects inevitably dies, I might actually remember what the hell happened.

[[Progeny Gaming Network Home]]