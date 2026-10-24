---
type: wiki
publish: true
---

# SWBFIIAdmin

**SWBFIIAdmin**, also written **SWBF2Admin** in the project notes, is the administration software used with the lab's original *Star Wars Battlefront II* dedicated server. It sits alongside the game-server setup rather than being the game itself.

In the [[Star Wars Battlefront II Dedicated Server Home|server project]], it is part of the administration and statistics workflow, with a [[Wiki/SQLite|SQLite]] [[Wiki/database|database]] holding information that matters for recovery and future player features. The exact installed version remains an explicit housekeeping item in that project, so this page doesn't guess one.

The documented remote-access arrangement keeps it with GOG and the game in the `admin` console session. Routine [[Wiki/Remote Desktop Connection|Remote Desktop Connection]] access uses a separate account.

For the actual rebuild procedure and private-data boundaries, use [[PGN Star Wars Battlefront II Dedicated Server Disaster Recovery]]. Public documentation should explain the setup without exposing player identifiers or [[Wiki/credentials|credentials]].
