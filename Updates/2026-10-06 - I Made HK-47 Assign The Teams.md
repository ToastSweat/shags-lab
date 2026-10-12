---
type: update
date: 2026-10-06
project: Star Wars Battlefront II Dedicated Server
publish: true
---
I Made HK-47 Assign The Teams

The last time I wrote about the PGN Battlefront II server, I ended the post with this:

> The next job is to eliminate Chrome Remote Desktop.

That sounded simple.

It was not simple.

But it is done.

The server is still running **PGN - Ewok Around and Find Out**, still appearing in the public server list, and still letting people join normally. I can now connect and disconnect with regular Windows Remote Desktop without disturbing it.

The solution was not another remote-access product, a VPN, Tailscale, or some elaborate tunnel through the center of the Earth.

It was another Windows account.

## The Remote Desktop Problem Was Really A Session Problem

The dangerous part of Windows Remote Desktop was not simply opening RDC.

The dangerous part was letting GOG Galaxy, SWBF2Admin, and Battlefront II get tangled up with the temporary RDP session.

So I left the original `admin` account logged into the real Windows console session. GOG, SWBF2Admin, and Battlefront II all stay there.

Then I created a separate Windows account named `RDC` for administration.

The important process layout now looks like this:

```text
admin -> console session -> GOG + SWBF2Admin + BattlefrontII
RDC   -> RDP session     -> me poking at things from home
```

I can open RDC, work on the server, disconnect, reconnect later, and the game processes never leave the console session.

I tested this over multiple days and multiple RDC connections. The server stayed visible. I could still connect to it from the game. Nothing quietly vanished from the public master list.

Chrome Remote Desktop can remain installed as an emergency fallback, but it is no longer the thing holding the server together with duct tape and Google account authentication.

That entire problem is finally dead.

Good.

I was tired of talking about it.

## Back To The Fun Problem

The next experiment was something I had already failed at once: forcing every human player onto the same faction for PvE battles.

The original idea was simple:

- human players fight together;
- the opposite faction is controlled by AI;
- the server decides the human faction automatically;
- public Steam and GOG players do not need to install anything.

I previously tried calling Battlefront II's Lua function:

```lua
ForceHumansOntoTeam1()
```

It did nothing.

I tried the reported alternate form too.

That also did nothing.

At the time, it looked like I might have to modify mission files and build a server-side map experiment. I really did not want to do that. The entire point of this server is that somebody should be able to find it in the normal server browser and join with an ordinary copy of the game.

Then I found the missing half of the solution inside SWBF2Admin itself.

## Auto Assign Made The Swap Stick

SWBF2Admin already had a working manual player-swap action.

The problem was that, with normal team selection enabled, a player could get swapped to the other faction, reach its class-selection screen, press Back, and return to the original team.

That is not much of a team lock.

I changed the server to **Auto Assign** and restarted it.

That changed everything.

Players could no longer choose a faction manually. When WebAdmin swapped somebody, the game sent them to the other faction's class screen and they could not simply back out to undo it.

So the game already had the enforcement mechanism I needed.

I just needed something to press the swap button automatically.

Fortunately, I already had a homicidal protocol droid connected to WebAdmin.

## HK-47 Got A Promotion

I inspected SWBF2Admin's source instead of continuing to throw random Lua at a twenty-one-year-old game.

The dynamic Lua API does expose a player-swap function, but its event-listener system is local to each command. It is not connected to real player-join events. There was no hidden `PlayerJoined` callback waiting for me to spell it correctly.

The WebAdmin interface, however, exposes exactly what HK-47 needed:

```text
POST /live/players
```

One action returns the current human player list, including each player's slot and faction.

Another action swaps a selected player using the same server-side operation as the WebAdmin Players page.

So HK-47 v1.3.0 now watches the player list, checks the current map's era, and corrects anyone assigned to the wrong faction.

The entire faction policy is:

```dotenv
TEAM_LOCK_ENABLED=true
TEAM_LOCK_RULES=c=Rep,g=IMP
```

In Clone Wars battles, all human players fight as the Republic clones.

In Galactic Civil War battles, all human players fight as the Empire.

I decided to go nuclear and apply it across every normal map instead of maintaining a giant list of individual battles. Exact map overrides are still supported if I eventually decide that one particular map should use the other side.

## Preventing The Droid From Flipping People Forever

The dangerous version of this feature would poll too quickly, see stale player data, and swap the same person twice before SWBF2Admin refreshed its list.

That would technically enforce both factions, which is impressive but not useful.

The actual implementation has several protections:

- it only swaps known opposing stock factions;
- it ignores players still reported as `Non` while loading;
- it ignores unusual native factions used by special modes;
- it pauses after a map or rule change;
- it waits before retrying a player whose old team may still be cached;
- it detects round resets and settles before acting again.

The automated test suite grew from fifteen tests to twenty-three.

All twenty-three pass.

Then I deployed it to the live server.

It worked.

A human player on the wrong faction was automatically moved back to the configured PvE side, and Auto Assign prevented the player from escaping the lock through the normal team menu.

No custom client files.

No modified missions.

No workshop download.

Just HK-47 quietly deciding where the meatbags belong.

## The Backup System Immediately Earned Its Keep

After the live test passed, I ran the repository exporter so the new bridge source, tests, documentation, and Auto Assign configuration would join the disaster-recovery snapshot.

The Git diff also caught an unrelated bandwidth setting that looked suspicious.

I had selected what appeared to be the high-bandwidth option, but the exported configuration changed from `16384` to `128`.

SWBF2Admin's own source confirmed that those values are literal:

```text
16384 = 16 Mbit/s
128   = 128 Kbit/s
```

So `128` was not the higher setting. It was the bottom of the list wearing a fake mustache.

I restored the server to `16384`, re-exported the clean configuration, and pushed HK-47 v1.3.0 to GitHub.

That is exactly why I wanted the live configuration captured and reviewed instead of trusting that I would remember every checkbox forever.

## What Is Next

The remote-access problem is done.

Automatic PvE team assignment is done.

The server source and configuration are backed up again.

Next, I want to start connecting Battlefront players to persistent PGN identities. That opens the door to proper player profiles, lifetime statistics, XP, levels, ranks, nicknames, achievements, credits, and all of the other increasingly irresponsible systems on the roadmap.

That deserves its own post once it becomes real.

For now, HK-47 runs the chat, announces the battles, and assigns everybody to the correct army.

The droid has been given authority.

This will probably be fine.

[[2026-09-22 - PGN SWBFII Dedicated Server]]

[[PGN SWBFII Dedicated Server]]
