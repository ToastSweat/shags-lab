---
type: update
date: 2026-11-12
project: Star Wars Battlefront II Dedicated Server
publish: true
---
I have done enough work on the Battlefront II server over the last few days that I have once again failed to write updates while the work was actually happening. So here is the catch-up post.

The short version is that Phase 3 is finished and running in production. The server now has its own independent player-statistics ledger, recorded seasons, public player profiles, and a website that can show more than a single Top 10 list. Phase 4—the Discord account-linking system—is built, reviewed, and partially deployed, but it is still deliberately disabled while I finish the activation process.

Naturally, the final few feet have involved an incredible amount of arguing with PowerShell and NTFS about a zero-byte JSON file.

## Phase 3: recorded player profiles are live

The original website leaderboard was useful, but it was also narrow. It showed the current Top 10 and not much else. Phase 3 built a separate PGN-owned statistics system around the data already produced by SWBF2Admin.

The important word there is **separate**. I did not want the public website reading and writing directly against the live WebAdmin database. The new system imports completed matches into its own private SQLite ledger, records immutable match statistics, tracks seasons, and gives each recorded player a stable PGN public ID.

That let me add full player profiles with:

- Lifetime recorded matches, points, kills, deaths, and K/D
- Per-season totals
- Stable public profile IDs
- A clear distinction between PGN-recorded history and somebody's complete lifetime identity

The existing leaderboard still works the same way. I verified that the replacement site produced the same leaderboard data before switching it over, then tested the live profile API, invalid and unknown player handling, private-file access restrictions, and the actual desktop/mobile pages.

I also imported the existing completed match history into the new ledger. The initial production run accepted 2,036 completed matches, finished without holds, and reconciled cleanly on the final pass.

Once everything matched, I replaced the live website, checked the public endpoints, created another encrypted recovery backup, uploaded it off-server, and restarted the game normally. I then connected in-game and confirmed the server still behaved like an actual Battlefront II server instead of a very elaborate SQLite demonstration.

Phase 3 took basically an entire day. I thought Phase 4 might be faster. This was adorable.

## Phase 4: linking Discord to player profiles

Phase 4 is meant to connect a Discord account to a PGN player profile so the bot can answer commands like `!stats` without making somebody manually hunt down a public profile ID.

The hard part was not the Discord command. The hard part was deciding what "this Discord user owns this Battlefront player" can honestly mean in a 2005 game whose server tooling was not designed for modern account linking.

The answer is a deliberately narrow system: **moderator-attested current-session association**.

A player starts a private linking challenge through Discord, proves they are present in the current game session, and an authorized human moderator confirms the association. It does not pretend that a display name, player slot, shared machine, or old database token is cryptographic proof of a person's entire historical identity. Linking also grants no gameplay authority or administrative power. It is just a controlled association between one Discord account and one PGN profile.

The foundation now includes:

- Private, one-to-one Discord/profile associations
- Single-use linking challenges
- Relink and unlink controls
- Private audit history
- `!stats` support using the existing recorded-profile API
- A truthful unavailable response for `!rank`, because I have not invented an XP system yet
- Backup and recovery coverage for both the statistics ledger and the new link store

The Discord ingress, private SDK adapter, production backend, command definitions, bootstrap tooling, and deployment package have all been built and tested. The reviewed runtime code is now on the dedicated server, but the entrypoint still leaves linking disabled.

That is intentional. I would rather spend an extra day proving the off switch works than accidentally publish half a private account-linking system to Discord.

## The stupid zero-byte file incident

The current maintenance window has been mostly about creating the private disabled configuration that Phase 4 will eventually use.

The first attempt failed because I entered the human-moderator attestation in the guild-ID prompt. That one was entirely me.

The corrected attempt made it farther: it securely created the configuration file, then stopped before writing the JSON. A read-only diagnostic confirmed that the result was exactly what the source suggested—a valid, private, zero-byte file. Nothing was partially exposed, linking remained disabled, and the tool correctly refused to blindly overwrite or retry it.

The actual bug was wonderfully stupid. The creator treated an NTFS directory's reported length as if it were a stable invariant. Creating the new file could change that allocation value even though the directory's identity, security, type, links, and attributes had not changed. The safety check saw the length change and assumed the world was ending.

A separate recovery tool was built to adopt that exact protected zero-byte file in place. It reopened the existing file exclusively, revalidated its identity and security, rebuilt the disabled configuration from fresh masked inputs, wrote it once, flushed it, read it back from the same handle, and checked the final bytes and metadata.

That recovery completed successfully. The configuration now exists, its security and identity were preserved, and linking is still disabled.

Annoyingly, I had to look up and re-enter the private Discord IDs again. Happily, I should not have to do that particular ritual a third time.

## Where I left it

At the exact point I stopped, the Phase 4 code and private disabled configuration are both on the dedicated server. The game server, Discord bridge, and automatic backup uploader are still intentionally paused for the maintenance window. The private link database has not been initialized, Discord commands have not been registered, and linking has not been enabled.

The next steps are to initialize the empty private link store, create and verify another encrypted backup, register the Discord commands, enable the integration in a controlled cutover, and test the full player-to-Discord flow before restoring normal operation.

That should be the interesting half of Phase 4, so I will save it for the next post instead of turning this catch-up into a small technical book.
