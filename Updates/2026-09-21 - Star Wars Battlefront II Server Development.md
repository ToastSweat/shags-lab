---
type: update
date: 2026-09-21
project: Star Wars Battlefront II Dedicated Server
publish: true
---
I Accidentally Built Modern Infrastructure For A 2005 Star Wars Game

This started because I wanted to run a Battlefront II server.

The 2005 one. You know, the good one.

I have been running game servers for [[PGN]] for years, so the basic idea did not seem especially complicated.

Install the game.
Pick some maps.
Give the server a stupid name.
Play Battlefront.
Classic PGN Style.

So I brought **PGN - Ewok Around and Find Out** online.

It is a private (for now) STAR WARS Battlefront II Classic server running the GOG server build through SWBF2Admin on a Windows dedicated server.

Conquest only.
No heroes. (usually)
No friendly fire.

Just twenty-year-old Star Wars men shooting each other over command posts like God intended.

Naturally, this became an infrastructure project.

The first problem was simply keeping the damn thing online.

Battlefront II is old enough to drink, and the software around its dedicated server is from a very different era of Windows administration.

The server would run.

It would appear in the public server list.

Steam players could join the GOG-hosted server.

Then sometimes it would disappear even though the process still looked alive.

For a while I thought closing the remote desktop window was killing it.

That turned into a long series of tests involving Chrome Remote Desktop, Windows Remote Desktop, GOG Galaxy, SWBF2Admin, automatic restarts, RCON timeouts, and me repeatedly asking:

> Okay, but is it actually still in the list?

Eventually I confirmed that the server could remain public and joinable for almost twenty-four hours through a Chrome Remote Desktop console session.

I also found the warning in SWBF2Admin's own documentation: standard Windows Remote Desktop can interfere with the GOG server's communications and make it disappear from the public master list.

That is an incredibly specific problem.

It is also exactly the kind of problem you get when you build modern infrastructure around a game released in 2005.

Chrome Remote Desktop is currently the known-good workaround. I do not love that. In fact, let me be honest. I loathe it... with hate.

So let's ignore that for now.
Denial is not just a river in Africa.

Once the server itself was reasonably stable, I started digging into SWBF2Admin.

It provides a local WebAdmin dashboard, match management, player administration, statistics, announcements, and a Lua command system.

Lua, you say?

I claimed my in-game administrator account and started experimenting.

The first useful custom command was not useful at all:

```text
!ping
```

It replied:

```text
PONG! SWBF2Admin Lua is working.
```

That tiny stupid command was important because it proved the whole path worked.

The game could see a command.
SWBF2Admin could execute custom Lua.
Permissions worked.
The response made it back into the game.

I also tried using Lua to lock human players onto one team for future PvE ideas.

That did absolutely nothing. Then I tried more and more. That also did not work. Anyone for a nice African river cruise?

Both versions of the experiment failed, which at least told me that team locking will probably require server-side mission work instead of one magic function call.

Not every experiment needs to become a feature.

Sometimes the result is just:

> Well, that is not how that works.

Then I found the statistics system.

SWBF2Admin was already capable of recording completed matches, player performance, kills, deaths, points, and map history into a SQLite database.

The information was there, to my surprise and delight.

It was just hiding behind right-clicking a completed match and opening its Details window like a secret menu in a restaurant.

Once I knew the data existed, the obvious next thought was:

> I should put this on a website.

I first built a basic PHP Top 10 leaderboard.

Then I rebuilt the whole thing as a SvelteKit and Tailwind landing page served through the existing XAMPP/Apache setup on `helvete.pizza`.

The website reads the SWBF2Admin database locally and exposes the useful community-facing information without publishing the database itself.

It has a proper server landing page, a Season 1 leaderboard (Bryce's idea), and a foundation for archived seasons later.

Season 1 currently includes all recorded matches because there was no reason to invent a preseason that nobody knew existed.

That felt like enough.
It was not enough.

I wanted the game server and Discord to talk to each other. There were naysayers. Why? Is that it is cool not enough? Fine. Ou la laa you can enter commands between Discord and the game server and, yes, talk. To nay sayers I say nay.

So I built a Node.js bridge and named the bot **HK-47**.

QUERY: Why would I not?

HK-47 connects to the local WebAdmin interface and bridges chat between Battlefront II and the PGN Discord server.

Messages sent in `#swbfii-chat` appear in the game.
Messages from players in the game appear in Discord.

System messages and commands are filtered out so Discord does not become a firehose of internal server garbage.

Discord formatting is neutralized before game messages are sent back out.
Messages are bounded, forced onto one line, and prevented from becoming accidental admin commands.

The first version had the usual collection of dumb integration problems.

Discord said `Missing Access` because I had authorized an application but had not actually installed the bot correctly.

WebAdmin returned HTTP 400 because it wanted `localhost` instead of `127.0.0.1`.

Those are technically different addresses if you are a twenty-year-old game administration tool with strong opinions.

Once two-way chat worked, I added map awareness.

SWBF2Admin knows the maps by codes like:

```text
dea1c
tat2c
cor1c
```

Those are useful to the server.

They are not especially useful to a normal human being who wants to know what map is next.

So HK-47 learned the actual map, era, and mode names, with support for both the stock maps and friendly names supplied by WebAdmin for custom maps.

I made a test command:

```text
!battle
```

It worked! It gets a readable current and next battle message instead of raw internal codes.

Then I made HK-47 announce the battle automatically.

It announces after it detects the first active match, announces again when the current or next map changes, and repeats the status every sixteen minutes without spamming the same message constantly.

The bridge has fifteen automated tests covering chat handling, commands, map labels, announcement timing, authentication, WebAdmin parsing, message safety, and the client session itself.

All fifteen pass.

That was the point where this stopped feeling like a weird batch file attached to an old game and started feeling like a real little service.

Which led directly to the next question:

> What happens when the dedicated server explodes?

At that point the project existed in too many places.
There was the live game installation.
There was SWBF2Admin and all of its XML, Lua, server settings, and database files.
There was the Discord bridge source and its secret environment file.
There was the editable SvelteKit website.
There was the compiled website actually being served by Apache.
There were a bunch of things I knew because I had just spent days figuring them out, which is another way of saying they were about to be forgotten forever.

So I built a proper disaster-recovery system.

The first half is a sanitized GitHub repository.

I wrote a PowerShell exporter that copies the safe, irreplaceable parts of the live server into a clean repository structure:

```text
discord-bridge
swbf2admin-config
website/source
website/live-deployment
scripts
```

It preserves the bridge source and tests, SWBF2Admin configuration, Lua commands, server rotation, editable website, exact live website deployment, and recovery scripts.

It also sanitizes known password fields and refuses to include things that absolutely do not belong in Git:

```text
.env
SQLite databases
logs
executables
DLLs
game assets
passwords
tokens
```

I tested the exported bridge source.
Fifteen tests passed.

I copied the website source into a completely separate temporary folder, installed it from the package lock, ran the Svelte checks, and built a fresh production deployment.

Zero errors.
Zero warnings.
Successful build.

Then I pushed the whole safe recovery snapshot to GitHub.

That protects the code and configuration, but it deliberately does not protect the most sensitive state.

The player statistics database cannot go in GitHub.
The Discord token cannot go in GitHub.
The live WebAdmin and server passwords cannot go in GitHub.
Unfortunately, those are also the exact things I would need after a catastrophic failure.

So the second half is a private encrypted backup.

I wrote another PowerShell script that refuses to run while Battlefront II or SWBF2Admin is active, because copying a live SQLite database and hoping for the best is how you create a backup that becomes exciting only when you desperately need it.

The script collects the database, Discord bridge environment, unsanitized private configuration, server rotation, and a recovery manifest containing the matching Git commit.

Then it creates a 7-Zip archive with AES-256 encryption, including encrypted filenames.

It tests the archive.
It generates a SHA-256 checksum.
It removes the temporary plaintext staging folder.

If anything fails, it removes the incomplete archive instead of leaving behind something that merely looks like a backup.

Naturally, the first version found an exciting PowerShell edge case where a one-item process list stopped behaving like a list.

That is fixed now.

I also did not want the only private backup sitting on the same dedicated server it was supposed to protect.

That would be less like disaster recovery and more like placing a spare key inside the burning house.

So I created a restricted Dropbox app folder and configured `rclone` on the dedicated server.

The server can access only its own backup area inside Dropbox.

It cannot browse the rest of my account.

An hourly Windows Scheduled Task runs as `SYSTEM`, looks for new encrypted archives, verifies their local checksums, uploads them, retries temporary failures, and confirms the remote files exist with matching sizes.

It never overwrites a conflicting backup.
It never deletes a local backup.
It never deletes a Dropbox backup.

My home computer then receives the off-server copy through the normal Dropbox client.
We created a real backup and watched both the encrypted archive and its checksum arrive.

Hell yes.

I also wrote the doomsday documentation.

There is now a complete recovery README covering the folder layout, installation order, server settings, bridge setup, website deployment, secrets, validation, known landmines, and how to rebuild the entire stack from a blank Windows server.

The wider project is documented as an Obsidian wiki too.

It has pages for architecture, normal operation, Discord, SWBF2Admin, the website, statistics, recovery, security, experiments, failed approaches, research, current status, decisions, and the development roadmap.

Because I know exactly what Future Me would do without that documentation.

He would open the server, stare at six vaguely related folders, and say:

> What the fuck did I do here?

Now he has instructions.
You are welcome, asshole.

So that is the PGN Battlefront II server now.

A public server for a 2005 game.
A WebAdmin stack.
A persistent statistics database.
A seasonal leaderboard.
A custom two-way Discord bridge named after a homicidal protocol droid.
A tested source repository.
An encrypted off-site backup system.
And enough documentation to resurrect the whole thing after a small meteor strike.

The next job is to eliminate Chrome Remote Desktop.

That does **not** mean blindly switching to normal Windows Remote Desktop, because that is the thing most strongly associated with the server disappearing from the public list.

I need a remote-control setup that preserves the real console session, survives a reboot, lets me manage the server safely from home, and does not disturb GOG or SWBF2Admin.

Chrome Remote Desktop will remain installed as the emergency fallback until the replacement has proven all of that.

After remote access is settled, the roadmap moves into the fun community systems: persistent PGN player identity, profiles, lifetime statistics, XP, levels, ranks, nicknames, awards, achievements, credits, and eventually increasingly questionable ideas involving gambling and a persistent campaign.

That will be another post.

For now, the important part is that the server works, the community layer works, the source is protected, and the private state exists somewhere other than the machine that could die.

Not bad for wanting to play an old Star Wars game.

[[PGN Star Wars Battlefront II Dedicated Server]]