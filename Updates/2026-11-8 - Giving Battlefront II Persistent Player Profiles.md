---
type: update
date: 2026-11-08
project: Star Wars Battlefront II Dedicated Server
publish: true
---
Giving Battlefront II Persistent Player Profiles Without Setting The Server On Fire

The last time I wrote about the PGN Battlefront II server, I ended with a list of future community features.

Persistent player identity.

Lifetime statistics.

Player profiles.

Seasons.

All the fun stuff that makes a server feel like a community instead of a Windows process somebody forgot to close.

Those features are no longer just sitting on the roadmap looking important.

Over the last couple of days, I built the foundation for them.

Naturally, this required several thousand automated browser assertions, two different PHP compatibility tracks, a second SQLite database, multiple review packages, and an argument with a website that was lying about how many bots were on the server.

Normal hobby stuff.

The first important decision was that continued development would not happen directly on the dedicated server.

The live server already works. It runs the game, SWBF2Admin, HK-47, Apache, the public website, scheduled backups, and all of the private configuration holding that mess together. Turning production into an experimental workbench would have been a fantastic way to spend the weekend rebuilding it.

Instead, I gave Hermes a dedicated development copy of the repository and wrote a very large handoff document explaining the architecture, current behavior, privacy rules, recovery system, testing expectations, and exactly where it had to stop for review.

Hermes could inspect and build the safe repository on my development computer.

It could not touch the host.

It could not see the production database, credentials, logs, or binaries.

It could not deploy anything just because the tests passed and it felt enthusiastic.

Every phase ended at a checkpoint where I reviewed the result before allowing the next one to begin.

This was slower than yelling “YOLO” at an autonomous agent.

It was also considerably less stupid.

## Figuring Out What SWBF2Admin Actually Knows

Before designing player identity, I needed to know what the old software was really storing.

The installed SWBF2Admin version is 1.3.0.0. I recorded its exact executable hash and produced a schema-only export of its SQLite database. The export included tables and columns, but no player names, matches, credentials, logs, or other private data.

That schema answered enough questions to begin safely.

SWBF2Admin has player rows, games, statistics, names, and an ominous field called `player_keyhash`.

What it does not have is a documented, trustworthy definition of what that key actually means.

It might be stable.

It might identify an installation.

It might be shared by multiple people on one computer.

It might occasionally be nonsense produced by a game from 2005.

I was not going to quietly turn an undocumented token into permanent human identity.

So Phase 2 deliberately chose the narrower, honest milestone: each source player row receives a stable PGN UUID. If the name on that row changes, it remains the same PGN player and the name history is preserved. If two different source rows happen to look related, the system does not automatically merge them and pretend it has discovered a person.

The more ambitious cross-row identity design was documented, reviewed, and deferred until there is real evidence for the key semantics.

Sometimes the correct feature is refusing to invent certainty.

## Building The PGN Ledger

The new identity and statistics system lives in a separate PGN-owned SQLite ledger.

SWBF2Admin remains the source. The PGN ledger records what was imported from it without modifying the vendor database or pretending to replace it.

The importer is transactional and replay-safe. Completed matches become immutable recorded facts. Re-running the same import does not create duplicate players, appearances, or statistics. If a completed source match later changes or disappears, the importer does not silently rewrite history. It creates a hold and stops for review.

That sounds a little dramatic for Battlefront statistics.

It is also how I avoid waking up six months from now to discover that somebody has 900,000 kills because a retry ran twice.

The ledger now supports explicit seasons, observed player-name history, seasonal totals, lifetime totals, and public PGN player IDs.

The website gained a recorded player profile page and a read-only PHP API. A profile clearly says that its numbers are PGN-recorded statistics from imported seasons, not a claim about somebody’s complete human history since birth.

The existing Season 1 Top 10 leaderboard stays intact. Its URLs, SQL behavior, and public output were preserved while its database connection was hardened to open SQLite genuinely read-only.

That distinction mattered because `PRAGMA query_only` is helpful, but opening the file with native read-only flags is better than politely asking a writable connection not to write.

## Testing Both The Future And The Actual Server

My development environment has newer PHP and SQLite versions than the dedicated server.

The real host is running PHP 8.2.12, SQLite 3.39.2, and Apache 2.4.58. It uses the guarded legacy PDO SQLite constants rather than PHP’s newer `Pdo\Sqlite` API.

I did not upgrade XAMPP merely to make development easier.

Instead, the readers detect which API is genuinely available and fail closed if they cannot obtain real read-only support.

The complete profile system passed on both a modern PHP 8.5 track and an isolated PHP 8.1 legacy-API track. The corrected review ran 248 tests and 232 browser assertions on each configuration, with zero failures.

Then the production activation work expanded that into 22 validation stages, 434 tests, and 2,065 browser assertions on each PHP track.

That is 4,130 browser assertions for a server whose active player population can often be counted without removing my shoes.

I regret nothing.

## Preparing Production Without Quietly Deploying Production

The activation tooling is intentionally boring and paranoid.

There is a separate production-only command-line tool with explicit activation flags. It uses one writer lock, bounded import pages, durable receipts, frozen reconciliation boundaries, transactional updates, and recovery state for uncertain outcomes.

The source database is opened read-only.

The private PGN ledger lives outside the web root.

The public profile reader can only read.

The backup tooling in the repository was extended to preserve the ledger, configuration, importer state, website release, and matching code as a coherent recovery set. The existing encrypted 7-Zip and Dropbox system remains in place. Nothing was scheduled automatically, because I want the first production imports watched by an actual human being.

After the implementation passed review, I committed and pushed it. Then Hermes built a separate deployment review package pinned to that exact commit.

The package contained 37 runtime files: a fresh complete website build, the private writer and migrations, and the two operator tools needed for recovery. Every member had a recorded size, provenance, and SHA-256 checksum. Private configuration, databases, logs, binaries, secrets, and test artifacts were excluded.

The package itself was clean.

Then the review caught something useful.

The website said rounds lasted 30 minutes and the server used 16 bots.

The live sanitized settings say 15 minutes and 32 AI per team.

The server was right.

The website was stale.

That is exactly why I built all these stupid gates.

It would have been easy to look at thousands of passing tests, declare victory, and publish incorrect information. Instead, deployment package version 1 is blocked while the public text is corrected and covered by a regression test.

Nothing has been deployed yet.

Nothing on the live server was changed to match the website.

The website must describe reality, not the other way around.

## What Comes Next

The immediate next step is small: correct the two public server values, review the change, commit it, and rebuild the deployment package from the new commit.

After that comes the careful part.

I will bind the real host paths and Apache configuration, take the required recovery snapshots, initialize the PGN ledger, import Season 1, compare the results against the existing leaderboard, test the profile pages through the real production stack, and only then consider the feature active.

That activation deserves its own post after it actually happens.

For now, the important result is that persistent PGN identities, recorded seasons, lifetime statistics, and player profiles are real code instead of a bullet list.

They are tested.

They are recoverable.

They are still safely outside production.

And the review process already prevented me from confidently publishing bullshit about my own server.

I would call that progress.

[[PGN SWBFII Dedicated Server]]
