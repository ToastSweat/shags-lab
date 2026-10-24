---
type: wiki
publish: true
---

# Discord Activities

**Discord Activities** are applications people can launch inside Discord, including games and shared experiences. They run as embedded web apps and can integrate with Discord features such as identity, presence, and result sharing.

[[Safe Cracker Discord Activity Home|Safe Cracker]] is the local example: a daily number-guessing game with persistent runs and leaderboards. Its interface lives inside Discord, but the game's server decides the answer, official timing, and recorded result. Being embedded doesn't make the browser trustworthy.

The game's [[Wiki/API|API]] and [[Wiki/SQLite|SQLite]] [[Wiki/database|database]] do the lasting work underneath the interface. Discord handles identity through its login flow, while the game maintains its own authenticated session.

An Activity also isn't the same thing as a chat bot. One is an interactive app surface; the other usually responds to messages or commands. Both can belong to the same community without being the same software.
