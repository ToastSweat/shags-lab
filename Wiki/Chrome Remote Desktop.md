---
type: wiki
publish: true
---

# Chrome Remote Desktop

**Chrome Remote Desktop** is Google's tool for viewing and controlling a computer from somewhere else. It can be handy when a machine is running normally but you're not sitting in front of its keyboard. Access still depends on the remote computer being available and properly secured.

It came up during the [[Star Wars Battlefront II Dedicated Server Home|Battlefront II server]] work because remote-control methods affected the Windows session running the game and its supporting software.

The project now documents a different normal setup: GOG, the game, and [[Wiki/SWBFIIAdmin|SWBFIIAdmin]] remain in the dedicated `admin` console session, while a separate `RDC` account is used for [[Wiki/Remote Desktop Connection|Remote Desktop Connection]]. Older notes about needing Chrome Remote Desktop describe an earlier workaround, not the final recommendation.

The important distinction is the session being controlled, not just which remote-viewing app looks nicest.
