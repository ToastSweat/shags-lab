---
type: wiki
publish: true
---

# Remote Desktop Connection

**Remote Desktop Connection** is Microsoft's Windows client for connecting to another computer using RDP. It lets you work on a remote Windows desktop without sitting beside the machine. The computer you connect to still needs suitable remote-access support and security settings.

It's different from [[Wiki/Chrome Remote Desktop|Chrome Remote Desktop]], and the difference can matter for software that depends on a particular logged-in session.

The [[Star Wars Battlefront II Dedicated Server Home|Battlefront II server]] notes document a working separation: GOG, the game, and [[Wiki/SWBFIIAdmin|SWBFIIAdmin]] stay in the `admin` console session, while routine RDP administration uses the separate `RDC` account. Earlier attempts used the same account for both roles and disrupted the setup.

For that server, a successful remote login isn't the whole test. The game must remain publicly joinable afterward. Remote convenience shouldn't silently interrupt what the machine is hosting.
