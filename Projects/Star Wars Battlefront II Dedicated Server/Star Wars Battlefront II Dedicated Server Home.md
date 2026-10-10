---
type: project
date: 2026-09-22
project: Star Wars Battlefront II Dedicated Server
status: paused
publish: true
---
![[{134E8752-3718-48BA-8015-096001C14916}.png]]
## About
::shrug::

## ToDo
> [!IMPORTANT]
> **Next major project:** PGN player identity and database groundwork.

## Recently Completed

- [x] Build and publish the sanitized GitHub disaster-recovery repository.
- [x] Create encrypted private backups containing the player database, private configuration, and bridge credentials.
- [x] Automatically verify and upload encrypted backups off-server to Dropbox.
- [x] Write full recovery documentation for rebuilding the server from scratch.
- [x] Remove Chrome Remote Desktop as the normal administration method.
- [x] Keep GOG, SWBF2Admin, and Battlefront II isolated in the `admin` console session.
- [x] Use the separate `RDC` account for normal Remote Desktop administration.
- [x] Confirm the server remains public and joinable across repeated RDC connections over multiple days.
- [x] Set team selection to Auto Assign so players cannot undo administrative team swaps.
- [x] Upgrade HK-47 to v1.3.0 with automatic PvE team enforcement.
- [x] Assign all humans to Republic clones during Clone Wars battles.
- [x] Assign all humans to the Empire during Galactic Civil War battles.
- [x] Preserve vanilla Steam/GOG client compatibility with no mission or client mods.
- [x] Expand the HK-47 automated test suite from 15 to 23 passing tests.
- [x] Export, commit, and push the working team-lock implementation and server settings to GitHub.

## Immediate Housekeeping

- [ ] Update the recovery README and project vault to replace the old Chrome Remote Desktop guidance with the final `admin` console + `RDC` account model.
- [ ] Update the stale Current Status, Next Actions, PvE Team Locking, and Lua Experiments notes with the confirmed v1.3.0 results.
- [ ] Record the exact installed SWBF2Admin version.
- [ ] Confirm the HK-47 and Dropbox scheduled tasks after the next convenient Windows reboot.
- [ ] Perform one recovery drill by extracting an encrypted Dropbox backup into a temporary folder and verifying its contents.
- [ ] Decide on a manual private-backup cadence and eventual local/Dropbox retention policy.
- [ ] Rotate any historical admin credential that may still match an old screenshot.

## Phase 1 — PGN Player Identity And Database

- [ ] Document the live SWBF2Admin SQLite schema and confirm stable player key-hash behavior.
- [ ] Design a separate PGN database keyed to an internal PGN player ID.
- [ ] Never expose raw game key hashes, IP addresses, or private identifiers publicly.
- [ ] Decide how players claim or verify an existing game identity.
- [ ] Design optional Discord-account linking.
- [ ] Define duplicate, renamed, and shared-machine identity handling.
- [ ] Build a migration path from existing Season 1 statistics.

## Phase 2 — Player Profiles And Lifetime Statistics

- [ ] Add individual player pages to the website.
- [ ] Separate seasonal statistics from lifetime statistics.
- [ ] Show matches, wins, losses, score, kills, deaths, captures, and other trustworthy recorded statistics.
- [ ] Add archived seasons and season champions.
- [ ] Add `!stats` and `!rank` proof-of-concept commands.
- [ ] Add privacy controls for Discord-linked identities if needed.

## Phase 3 — XP, Levels, Ranks, And Nicknames

- [ ] Define XP sources from completed matches and objectives.
- [ ] Add anti-farming and duplicate-match protections.
- [ ] Define level thresholds and rank titles.
- [ ] Decide how custom nicknames are earned, selected, and moderated.
- [ ] Display progression on player pages and through HK-47 commands.
- [ ] Add `!xp` and expand `!rank`.

## Phase 4 — Awards, Achievements, And Challenges

- [ ] Determine which stock in-game awards are actually observable from server data.
- [ ] Define custom achievements derived from saved match statistics.
- [ ] Add daily and weekly challenges.
- [ ] Add achievement badges to website profiles.
- [ ] Add `!awards` and challenge-status commands.
- [ ] Prevent reconnects or duplicated statistics from awarding progress twice.

## Phase 5 — Credits, Economy, And Gambling

- [ ] Define how fictional credits are earned from matches, objectives, challenges, levels, and achievements.
- [ ] Build a transaction ledger instead of storing only a mutable balance.
- [ ] Add `!balance` and transaction-history support.
- [ ] Decide what credits can purchase without creating pay-to-win garbage.
- [ ] Add gambling only after identity, persistence, balance validation, and transaction logging are reliable.
- [ ] Add limits and anti-abuse rules before allowing player wagers.

## Phase 6 — PvE Difficulty Scaling

- [x] Lock human players to the configured faction automatically.
- [x] Use Republic clones for Clone Wars and the Empire for Galactic Civil War.
- [ ] Add exact per-map faction overrides only if a battle should use the opposite side later.
- [ ] Measure how current AI settings feel with one, two, three, and four human players.
- [ ] Prototype dynamic AI count or difficulty based on active human player count.
- [ ] Avoid mid-match changes that destabilize a running battle.

## Phase 7 — Custom Classes

- [ ] Research the boundary between server-only changes and mandatory client mods.
- [ ] Prototype one low-risk class change in an isolated test environment.
- [ ] Preserve the public vanilla server experience whenever possible.
- [ ] Define how classes would interact with ranks, achievements, or credits.
- [ ] Consider a small PGN launcher/mod manager only if client-side assets become unavoidable.

## Phase 8 — Persistent Campaign

- [ ] Define campaign factions, planets, and the persistent campaign state model.
- [ ] Map stock Conquest missions to campaign planets.
- [ ] Add planet ownership and bonuses.
- [ ] Add faction commanders and campaign roles.
- [ ] Add map or campaign-battle voting through Discord, the website, or game chat.
- [ ] Apply completed match results to planet ownership.
- [ ] Archive completed campaigns and champions.
- [ ] Keep ordinary public matches playable even when somebody does not care about the campaign layer.

## Sidequests

- [ ] Add Discord server-status and outage notifications.
- [ ] Add richer utility commands for maps, profiles, ranks, awards, balance, and challenges.
- [ ] Add website and Discord voting for special map nights or campaign battles.
- [ ] Add themed events, boss rounds, or temporary faction bonuses.
- [ ] Improve the public website beyond the current Season 1 Top 10 leaderboard.
- [ ] Revisit backup retention only after a successful recovery drill.

## Safe Change Checklist

For every meaningful server change:

1. Back up or commit the previous known-good state.
2. Change one subsystem at a time.
3. Test it manually.
4. Confirm the public server remains joinable.
5. Run the relevant automated tests.
6. Export and inspect the sanitized Git diff.
7. Commit and push the recovery snapshot.
8. Update the project notes so Future Me does not have to perform digital archaeology again.

[[PGN SWBFII Dedicated Server]]



[[PGN Star Wars Battlefront II Dedicated Server Disaster Recovery]]
