---
type: update
date: 2026-11-14
project: Star Wars Battlefront II Dedicated Server
publish: true
---

# Phase 4 and the XML Goblin

I have spent most of the day trying to finish Phase 4 of my *Star Wars Battlefront II* server project: Discord account linking, private moderator approval, player statistics commands, and all the machinery needed to keep that from becoming an identity-stealing disaster.

Most of the actual system is built. The linking database is separate and private, linking stays disabled by default, uncertain message delivery forces the system into a safe HOLD state, and the deployment process has backups and rollback paths. The remaining job is getting the finished runtime onto the server and proving it works against the real game, Discord, and WebAdmin.

Today's final boss was not JavaScript, PHP, SQLite, or even the 2005 game server. It was Windows Task Scheduler XML.

The maintenance runner expected the live task definition to contain an explicit `Enabled` setting. Windows legally leaves that element out because the default is already `true`. On top of that, Task Scheduler's GUI and PowerShell can export the same task using different formatting and serialization. The safety system saw those differences, assumed something might be wrong, and stopped—as it was designed to do.

Unfortunately, that turned deployment into several hours of forensic analysis of whitespace wearing a trench coat.

Nothing was damaged, and the new linking system was never activated. The existing server remained in its prior state. The fix is now clear: compare the actual meaning of the task definitions instead of demanding byte-for-byte identical XML, and capture the live definitions as the rollback baseline immediately before maintenance.

So Phase 4 is still not finished, but at least the problem is no longer mysterious. The next attempt should be one corrected maintenance runner, one outage, and one final acceptance pass.

At this point I am less worried about Discord users stealing identities than I am about Task Scheduler discovering a fourth way to say `true`.
