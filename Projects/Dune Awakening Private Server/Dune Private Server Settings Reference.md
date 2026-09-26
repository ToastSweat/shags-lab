---
title: Dune Private Server Settings Reference
type: guide
date: 2026-09-26
project: Dune Private Server
status: pre-new-build baseline
publish: true
---

# Dune Private Server Settings Reference

This is the configuration record for our self-hosted **Dune: Awakening** battlegroup immediately before the newly released build is audited.

**It records:**
- settings Funcom deliberately exposed through the Battlegroup Editor or seeded `UserSettings` files;
- additional settings we found in shipped defaults and tested ourselves;
- the values currently used on our server;
- the value types and ranges we can defend;
- settings that looked promising but turned out to be cooked-asset, database-state, or runtime problems instead.

This is a **known-good historical baseline**, not a claim that every value survives the new build unchanged.

> **Scope rule:** Funcom's extracted `DefaultGame.ini` contains thousands of properties. Many are internal defaults, asset references, UI values, or untested class properties. This guide catalogs the administratively useful controls we exposed or investigated. A key merely existing in an extracted file does not make it a safe server setting.

## Confidence labels

| Label | Meaning |
|---|---|
| **Official surface** | Exposed by Funcom's Battlegroup Editor or seeded self-host configuration. |
| **Confirmed** | We applied it and observed the expected behavior or persistence. |
| **Shipped key** | Present in shipped defaults, but our exact gameplay result still needs a controlled test. |
| **Candidate** | Found through asset/binary/database research; do not treat as a supported knob. |
| **Not a setting** | State or content that cannot be made persistent with a normal INI override. |

## What “acceptable values” means here

The server rarely publishes a formal minimum and maximum. This guide therefore separates:

- **formal range** — explicitly documented in the shipped template;
- **type-safe range** — the value shape the engine accepts, such as Boolean, integer, or finite float;
- **tested value** — a value we actually used;
- **safe advice** — a practical constraint intended to avoid pathological behavior.

If no formal range is known, the table says so. Do not mistake “parses successfully” for “balanced” or “safe.”

## Configuration surfaces

| Surface | Scope | Open it with | Apply changes |
|---|---|---|---|
| Battlegroup Editor | Per map, server, partition, or service | `battlegroup.bat → 6. edit` | Save the editor changes; restart affected servers if they do not reconcile automatically. |
| Advanced Battlegroup YAML | Entire Kubernetes battlegroup resource | Advanced option inside the editor | Save only valid YAML; a bad edit can break the battlegroup. |
| `UserEngine.ini` | Every game server in the battlegroup | `battlegroup.bat → 13. open-file-browser → UserSettings` | `3. restart`, then `1. status` |
| `UserGame.ini` | Every game server in the battlegroup | Same location | `3. restart`, then `1. status` |
| Map-specific config override | Only the selected map/server | Battlegroup Editor | Restart/verify the affected map. |
| Database state | Saved world/player/actor state, not ordinary configuration | PostgreSQL inside the database pod | Usually requires the relevant game process to be stopped before editing. |

`UserEngine.ini` and `UserGame.ini` are global to the battlegroup. Use the Battlegroup Editor when different maps or partitions need different settings.

## Battlegroup Editor settings

These are operational settings, not gameplay INI values.

| Setting | Accepted value | Important invariant | Our status |
|---|---|---|---|
| Maximum servers / dimensions for a map | Integer `>= 1` | Implemented as the map's `worldPartitions` count. | Official surface; our normal world uses a single Sietch. |
| Active servers / replicas | Integer from `0` through the map's partition count | `replicas` must be less than or equal to `worldPartitions`. Raising replicas without adding a partition causes a crash loop. | Official surface; confirmed operational behavior. |
| Per-partition display name | Non-empty string | Each Sietch name should be unique. | Official surface. |
| Per-partition login password | String; blank only if an open server is intended | Treat as a secret. Never copy the real password into a public guide. | Official surface. |
| Memory limit | Positive Kubernetes memory quantity such as `5Gi`, `8Gi`, or `10Gi` | Too little memory causes `OOMKilled` / exit code `137`. | Confirmed: `5Gi` was too low for at least one special map; `8–10Gi` was the successful troubleshooting range. |
| CPU/resource limits | Positive Kubernetes resource quantities | Must fit the VM's available resources across all running pods. | Official surface; no single universal value recorded. |
| Server arguments | A list of arguments recognized by that server component | There is no safe arbitrary-string range. Unknown arguments should be tested one at a time. | Official surface. |
| Per-server configuration overrides | Valid INI/CVar key-value pairs | Prefer this over global `UserSettings` when only one map should change. | Official surface. |
| Advanced component configuration | Valid Battlegroup YAML | Schema-valid YAML can still be operationally bad. Back up the battlegroup spec first. | Official surface; high risk. |

## `UserEngine.ini`

### `[URL]`

| Key | Type and acceptable values | Our value | Status | Effect / notes |
|---|---|---:|---|---|
| `Port` | Integer `1–65535`; must not collide with another listener | `7777` | Official surface / confirmed | Starting client/game UDP port. Our firewall/NAT range is `7777–7810/UDP`. |
| `IGWPort` | Integer `1–65535`; must not collide with another listener | `7888` | Official surface / confirmed | Starting inter-gateway UDP port. Our firewall/NAT range is `7888–7921/UDP`. |

The self-host stack also requires `31982/TCP` for RabbitMQ. That port is infrastructure, not an INI gameplay setting.

### `[ConsoleVariables]`

| Key | Type and acceptable values | Shipped/default | Our value | Status | Effect / notes |
|---|---|---:|---:|---|---|
| `Bgd.ServerDisplayName` | Quoted string | Installation-specific | Private | Official surface / confirmed | Browser/server display name. |
| `Bgd.ServerLoginPassword` | Quoted string | Installation-specific | **Not recorded here** | Official surface / confirmed | Sensitive. Keep it out of screenshots and public repositories. |
| `Dune.GlobalMiningOutputMultiplier` | Finite float `>= 0`; no published maximum | `1.0` | `2.0` | Confirmed | Player/manual mining output multiplier. `2.0` means 2×. Zero behavior was not tested. |
| `Dune.GlobalVehicleMiningOutputMultiplier` | Finite float `>= 0`; no published maximum | `1.0` | `2.0` | Confirmed | Vehicle mining output multiplier. |
| `SecurityZones.PvpResourceMultiplier` | Finite float `>= 0`; no published maximum | Build-dependent | `5.0` | Confirmed | Resource multiplier in PvP/security-zone contexts. |
| `dw.VehicleDurabilityDamageMultiplier` | Formal shipped range `0–10`; `0` disables durability damage | `1.0` | `1.0` | Official surface / confirmed baseline | Vehicle durability damage multiplier. |
| `Sandstorm.Enabled` | Boolean CVar: `0` or `1` | `1` | `1` | Official surface / confirmed | Master ordinary sandstorm toggle. |
| `Sandstorm.Treasure.Enabled` | Boolean CVar: `0` or `1` | `1` | `1` | Official surface / confirmed | Enables sandstorm treasure behavior. |
| `sandworm.dune.Enabled` | Boolean CVar: `0` or `1` | `1` | `1` | Official surface / confirmed | Enables the Hagga Basin sandworm system. |
| `Vehicle.SandwormCollisionInteraction` | Boolean: `true` or `false` | Build-dependent | `false` | Confirmed; intentionally retained | Whether vehicle/sandworm collision interaction can push or damage vehicles. We disabled this because of prior bugs and intend to leave it disabled for the foreseeable future. |
| `Sandworm.SandwormDangerZonesEnabled` | Boolean: `true` or `false` | `true` | `true` | Confirmed | Enables sandworm danger-zone behavior. |
| `Vehicle.SandwormInvulnerabilitySecondsOnExit` | Finite seconds `>= 0` | Build-dependent | `900.0` | Confirmed | Vehicle protection after a player exits. `900` seconds = 15 minutes. |
| `Vehicle.SandwormInvulnerabilitySecondsOnServerRestart` | Finite seconds `>= 0` | Build-dependent | `7200.0` | Confirmed | Vehicle protection after restart. `7200` seconds = 2 hours. |

### Known-good `UserEngine.ini`

```ini
; Applies to every server in the battlegroup.

[URL]
Port=7777
IGWPort=7888

[ConsoleVariables]
Bgd.ServerDisplayName="YOUR SERVER NAME"
Bgd.ServerLoginPassword="YOUR PASSWORD"

Dune.GlobalMiningOutputMultiplier=2.0
Dune.GlobalVehicleMiningOutputMultiplier=2.0
SecurityZones.PvpResourceMultiplier=5.0

dw.VehicleDurabilityDamageMultiplier=1.0

Sandstorm.Enabled=1
Sandstorm.Treasure.Enabled=1

sandworm.dune.Enabled=1
Vehicle.SandwormCollisionInteraction=false
Sandworm.SandwormDangerZonesEnabled=true
Vehicle.SandwormInvulnerabilitySecondsOnExit=900.0
Vehicle.SandwormInvulnerabilitySecondsOnServerRestart=7200.0
```

## `UserGame.ini`: official and confirmed baseline

### PvP and security zones

| Section / key | Type and acceptable values | Our value | Status | Effect / notes |
|---|---|---:|---|---|
| `[/Script/DuneSandbox.PvpPveSettings]` → `m_bShouldForceEnablePvpOnAllPartitions` | `True` or `False` | `False` | Official surface / confirmed | `True` forces PvP globally. `False` leaves partition and security-zone rules in control. |
| Same section → `+m_PvpEnabledPartitions` | Repeated integer partition IDs that actually exist | Commented examples `1`, `2` | Official surface / untested | Unreal array append syntax. Do not enable arbitrary IDs. |
| `[/Script/DuneSandbox.SecurityZonesSubsystem]` → `m_bAreSecurityZonesEnabled` | `True` or `False` | `True` | Official surface / confirmed | Master security-zone system toggle. |

### Deterioration

| Section / key | Type and acceptable values | Our value | Status | Effect / notes |
|---|---|---:|---|---|
| `[/DeteriorationSystem.ItemDeteriorationConstants]` → `UpdateRateInSeconds` | Formal shipped range `0–10`; `0` disables the update | `1.0` | Official surface / confirmed baseline | Tick/update cadence, **not** a simple “1× decay speed” multiplier. Lower positive values update more often. |

### Coriolis storms

| Section / key | Type and acceptable values | Our value | Status | Effect / notes |
|---|---|---:|---|---|
| `[/Script/DuneSandbox.SandStormConfig]` → `m_bCoriolisAutoSpawnEnabled` | `True` or `False` | `False` | Official surface / configured | Intended to disable automatic Coriolis storm spawning. The value loaded without error, but we did not isolate and formally prove the resulting spawn behavior. This is separate from the ordinary `Sandstorm.Enabled` CVar. |

### Building limits

| Section / key | Type and acceptable values | Shipped/default | Our value | Status | Effect / notes |
|---|---|---:|---:|---|---|
| `[/Script/DuneSandbox.BuildingSettings]` → `m_MaxNumLandclaimSegments` | Integer `>= 1`; practical upper bound not published | `6` | `12` | Confirmed | Maximum connected landclaim segments. The same value may need to be added to each player's client `Game.ini`. |
| Same section → `m_BuildingBlueprintMaxExtensions` | Integer `>= 0`; no published maximum | `4` | `8` | Confirmed | Maximum blueprint/landclaim extension count. Not the number-of-bases cap. |
| Same section → `m_BaseBackupMaxExtensions` | Integer `>= 0`; no published maximum | `8` | `16` | Confirmed | Base backup/reconstruction extension count. Not the number-of-bases cap. |
| Same section → `m_bBuildingRestrictionLimitsEnabled` | `True` or `False` | `True` | `True` | Confirmed baseline | Enables restriction-limit enforcement. This value may also need to match on clients. |

## `UserGame.ini`: settings we found and exposed

### Random encounter cadence

Section:

```ini
[/Script/DuneSandbox.EncountersSubsystem]
```

| Key | Type and acceptable values | Shipped/default | Our value | Status | Effect / notes |
|---|---|---:|---:|---|---|
| `m_bAreRandomEncountersEnabled` | `True` or `False` | `True` | `True` | Shipped key | Master random-encounter toggle. |
| `m_RandomEncounterInstigationAroundPlayersBoxExtentInMeters` | Finite float `> 0` | `500` | Unchanged | Shipped key | Search extent around players. |
| `m_RandomEncounterInstigationAroundPlayersDelayInSec` | Finite seconds `> 0`; no formal bounds | `15.0` | `12.0` | Confirmed | Reduced the interval between around-player encounter attempts. Very low values may increase server load. |
| `m_RandomEncounterInstigationOnWholeServerDelayInSec` | Finite seconds `> 0`; no formal bounds | `60.0` | `45.0` | Confirmed | Reduced the interval between whole-server encounter attempts. |
| `m_RandomEncounterInstigationByAreaDelayInSecOverride` | Finite seconds; `-1.0` means use default/no override | `-1.0` | Unchanged | Shipped key | Per-area delay override. |
| `m_bAreEncounterAreaLimitsEnabled` | `True` or `False` | `True` | `True` | Confirmed | Keeps encounter area limits enabled. |
| `m_bAreEncounterNodesEnabled` | `True` or `False` | `True` | `True` | Shipped key | Enables encounter nodes. |
| `m_bIsRandomEncounterInstigationAroundPlayersEnabled` | `True` or `False` | `True` | `True` | Shipped key | Enables around-player instigation. |
| `m_bIsRandomEncounterInstigationOnWholeServerEnabled` | `True` or `False` | `True` | `True` | Shipped key | Enables whole-server instigation. |
| `m_bIsRandomEncounterInstigationOnWholeServerForced` | `True` or `False` | `False` | `False` | Shipped key | Forced whole-server mode. We did not enable it. |
| `m_bIsRandomEncounterInstigationByAreaEnabled` | `True` or `False` | `True` | `True` | Shipped key | Enables area-based instigation. |
| `m_DisabledEncounterNames` | Unreal map/array syntax containing valid encounter names | Deprecated DD wreck entry | Unchanged | Shipped key | The shipped disabled entry is `DE_120_SmallShipWreck_DeepDesert_Depricated`. Do not remove entries without testing. |

Known override:

```ini
[/Script/DuneSandbox.EncountersSubsystem]
m_RandomEncounterInstigationAroundPlayersDelayInSec=12.0
m_RandomEncounterInstigationOnWholeServerDelayInSec=45.0
m_bAreEncounterAreaLimitsEnabled=True
```

These values make **all qualifying random encounters poll more often**. They are not shipwreck-only controls.

### Grandfather Worm for a low-population server

The giant-worm spawning controls are shipped under:

```ini
[/Script/DuneSandbox.TimeOfDaySettings]
```

| Key | Type and acceptable values | Shipped/default | Our value | Status | Effect / notes |
|---|---|---:|---:|---|---|
| `m_bGiantWormSystemEnabled` | `True` or `False` | `True` | `True` | Shipped key | Master giant-worm system toggle. |
| `m_GiantWormSpawningUpdateFrequency` | Finite seconds `> 0` | `60.0` | Unchanged | Shipped key | How often the spawn conditions are evaluated. |
| `m_GiantWormSpawningCooldown` | Finite seconds `>= 0` | `7200.0` | `3600.0` | Confirmed behavior target | Reduced cooldown from 2 hours to 1 hour. |
| `m_GiantWormMinimumSpiceAmountHarvested` | Finite amount `>= 0` | `50000.0` | `20000.0` | Confirmed behavior target | Lowers the harvested-spice trigger. |
| `m_GiantWormMinimumPlayersOnSpiceField` | Integer `>= 1` | `4` | `1` | Confirmed behavior target | Allows a solo player to satisfy the population requirement. |
| `m_GiantWormSafezoneDetectionDistance` | Finite distance `>= 0` | `35000.0` | Unchanged | Shipped key | Not part of our low-population change. |

Our intended override block:

```ini
[/Script/DuneSandbox.TimeOfDaySettings]
m_bGiantWormSystemEnabled=True
m_GiantWormSpawningCooldown=3600.0
m_GiantWormMinimumSpiceAmountHarvested=20000.0
m_GiantWormMinimumPlayersOnSpiceField=1
```

The cooldown and thresholds make the event possible; they do not guarantee an immediate spawn because location, safe-zone, field type, and other eligibility checks still apply.

### Dew refresh

Section:

```ini
[/Script/DuneSandbox.DewHarvestSettings]
```

| Key | Type and acceptable values | Shipped/default | Our target | Status | Effect / notes |
|---|---|---:|---:|---|---|
| `m_DewRefreshTime` | Finite float `>= 0`; observed as hours in this system | `12.0` | `24.0` | Shipped key / behavior recorded | We selected a 24-hour refresh. Reconfirm the unit and persistence after the new build. |
| `m_DewRefreshTimeNPE` | Finite float `>= 0`; special/NPE behavior | `300.0` | Unchanged | Shipped key / not tested | Do not mirror the normal value into this field without a separate test. |

Historical override:

```ini
[/Script/DuneSandbox.DewHarvestSettings]
m_DewRefreshTime=24.0
```

### Hagga Basin spice-field cap

Section and authoritative compound key:

```ini
[/Script/DuneSandbox.SpiceHarvestingSystem]
m_PerMapSystemSettings=...
```

| Sub-value | Type and acceptable values | Shipped/default | Our target | Status |
|---|---|---:|---:|---|
| `Survival_1` → `Small` → `MaxGloballyPrimed` | Integer `>= 0` | `5` | `15` | Confirmed behavior target |
| `Survival_1` → `Small` → `MaxGloballyActive` | Integer `>= 0` | `5` | `15` | Confirmed behavior target |

This key is a serialized per-map structure. **Do not paste only the Survival fragment**, because replacing the compound value can discard the Deep Desert entries. During the new-build audit, re-extract the complete shipped value and change only these two `Survival_1` sub-values.

The field cap is authoritative and observable in the spice-field database state. A separate persistent spawn-rate multiplier has not been confirmed.

### Ping controls found but not adopted

Section:

```ini
[/Script/DuneSandbox.PingSystemSettings]
```

| Key | Type and acceptable values | Shipped/default | Our status |
|---|---|---:|---|
| `m_PingsPerPlayerLimit` | Integer `>= 0` | `5` | Found; not part of our baseline. |
| `m_PingMaximumDistance` | Finite distance `>= 0` | `2000.0` | Found; not tested. |
| `m_PingInWorldMarkerExpiryTime` | Finite seconds `>= 0` | `5` | Found; not tested. |
| `m_PingMapMarkerExpiryTime` | Finite seconds `>= 0` | `60` | Found; not tested. |

### Inventory-size controls found but deliberately rejected

Section:

```ini
[/Script/DuneSandbox.InventorySystemSettings]
```

| Key | Type and acceptable values | Shipped/default | Our status |
|---|---|---:|---|
| `PlayerInventoryStartingSize` | Integer `>= 0` | `35` | Found; not adopted. |
| `PlayerInventoryColumnCount` | Integer `>= 1` | `5` | Found; not adopted. |
| `PlayerInventoryStartingVolumeCapacity` | Finite float `>= 0` | `175.0` | Found; not adopted. |
| `P2pTradingInventoryStartingSize` | Integer `>= 0` | `10` | Found; not adopted. |

We rejected this change after learning that the client also needs matching configuration and that starting-size settings may not safely resize existing characters. This is different from the cooked capacity problem for placed containers and vehicles.

## Complete recorded `UserGame.ini` baseline

This block contains only settings whose exact syntax was preserved. Some entries were configured or selected without a perfectly isolated gameplay test, as noted in the tables above. The compound spice-field override is intentionally omitted until it is re-extracted in full.

```ini
; Applies to every server in the battlegroup.

[/Script/DuneSandbox.PvpPveSettings]
m_bShouldForceEnablePvpOnAllPartitions=False
;+m_PvpEnabledPartitions=1
;+m_PvpEnabledPartitions=2

[/Script/DuneSandbox.SecurityZonesSubsystem]
m_bAreSecurityZonesEnabled=True

[/DeteriorationSystem.ItemDeteriorationConstants]
UpdateRateInSeconds=1.0

[/Script/DuneSandbox.SandStormConfig]
m_bCoriolisAutoSpawnEnabled=False

[/Script/DuneSandbox.BuildingSettings]
m_MaxNumLandclaimSegments=12
m_BuildingBlueprintMaxExtensions=8
m_BaseBackupMaxExtensions=16
m_bBuildingRestrictionLimitsEnabled=True

[/Script/DuneSandbox.EncountersSubsystem]
m_RandomEncounterInstigationAroundPlayersDelayInSec=12.0
m_RandomEncounterInstigationOnWholeServerDelayInSec=45.0
m_bAreEncounterAreaLimitsEnabled=True

[/Script/DuneSandbox.TimeOfDaySettings]
m_bGiantWormSystemEnabled=True
m_GiantWormSpawningCooldown=3600.0
m_GiantWormMinimumSpiceAmountHarvested=20000.0
m_GiantWormMinimumPlayersOnSpiceField=1

[/Script/DuneSandbox.DewHarvestSettings]
m_DewRefreshTime=24.0
```

## Settings we wanted but did not expose safely

| Goal | Result | Current conclusion |
|---|---|---|
| Pause the server clock when no players are online | No confirmed pre-new-build INI or editor knob | Use **Stop Battlegroup** as the operational hibernation method. Verify base-power behavior after starting again because timestamp-based catch-up was not formally tested. |
| Stronger / Tier 6 ordinary sandstorms | Only enable/disable, treasure, and Coriolis auto-spawn controls were exposed | No pre-new-build intensity, tier, duration, frequency, or damage setting was confirmed. |
| Increase Advanced Fremen Deathstill processing speed | Timer lives in cooked placeable data (`DT_PlaceableBlood_Settings`) | Requires an asset/server-client mod or runtime hook, not a safe INI line. |
| Permanently enlarge containers or vehicle storage | Database capacity edits reverted to baked defaults at startup | Limits are reconstructed from cooked templates. Database edits are not authoritative. |
| Remove the altitude fuel penalty | No safe scalar INI setting found | Treat as cooked gameplay data until a real override is proven. |
| Increase only dynamic shipwreck encounter count/weight | Encounter cadence is exposed, per-encounter weights/caps are not | The cadence settings increase broad random-encounter polling, not only wrecks. |
| Directly tune CHOAM event count/weight | Asset references were found, safe scalar controls were not | Asset or runtime research required. |
| Increase building-piece cap beyond the observed limit | Candidate keys/assets exist, but no client/server-safe INI path was proven in our work | Do not confuse landclaim segments or blueprint extensions with the piece cap. |
| Increase the number of bases/sub-fiefs per player | No confirmed INI key | Landclaim segment count is not the same thing as the per-player base/totem cap. |

Known encounter assets found during research:

| Map | Asset |
|---|---|
| Hagga Basin | `DA_DE_Tn_SmallShipWreck_01` |
| Deep Desert | `DA_DE_120_SmallShipWreck_DeepDesert_01` |

These asset names prove content exists; they are not numeric spawn settings.

Our live check found an active Hagga Basin shipwreck actor, `BP_SmallShipwreck_01_C`, but no evidence that more than one could be active concurrently. Faster encounter attempts did not override the encounter asset's baked `InstancesNumber` or `SpawnCooldown` behavior.

## Database/runtime state we successfully changed

These are useful discoveries, but they are **not normal server settings**.

### Placed water cisterns

The stored amount is persisted in each cistern entity at:

```text
FWaterStorageComponent → m_WaterStored
```

For our Medium Water Cisterns:

| Field | Accepted/tested value |
|---|---|
| `m_WaterStored` | Integer from `0` through `25000` per cistern |
| Capacity used | `25000` |
| Cistern count | `16` |
| Filled total | `400000` |

The reliable workflow was:

1. Log the player out.
2. **Stop Battlegroup** completely.
3. Confirm no game-server pods are running and the database pod remains healthy.
4. Back up the database.
5. Update only the intended cistern entity rows.
6. Verify every changed row and commit.
7. **Start Battlegroup** normally.

Editing while the map server was running appeared to succeed in PostgreSQL, but the live process kept the old value in memory and overwrote the database on shutdown. Stopped-server timing was the difference between failure and success.

### Inventory and storage capacity

`dune.inventories.max_item_count` and `max_item_volume` can be changed in PostgreSQL, but the game rebuilt our test container from its cooked template during startup. These columns therefore do not provide a persistent capacity setting for existing or newly built containers.

## Syntax notes

### Boolean spelling

- Unreal object properties in `UserGame.ini` normally use `True` / `False`.
- Console variables in `UserEngine.ini` may use `0` / `1` or lowercase `true` / `false`, depending on the key.
- Preserve the spelling used in the known-good examples.

### Arrays and maps

- A leading `+` appends an Unreal array entry.
- Repeating `+m_PvpEnabledPartitions=...` adds partition IDs.
- Compound map values such as `m_PerMapSystemSettings` should be copied from the **same build** before editing.
- Never replace a compound map with an isolated fragment unless the property is documented to merge rather than replace.

### Client synchronization

At minimum, custom building-limit values such as `m_MaxNumLandclaimSegments` and `m_bBuildingRestrictionLimitsEnabled` may also need matching values in each player's local client `Game.ini`. A mismatched client can show ghost placement behavior even when the server is authoritative.

## Safe change procedure

1. Record the current game/server build.
2. Use `9. backup` before risky changes.
3. Copy both `UserEngine.ini` and `UserGame.ini` somewhere safe.
4. Change one logical system at a time.
5. Restart with `3. restart`.
6. Verify health with `1. status`.
7. Check the actual gameplay behavior, not merely whether the file saved.
8. Record the test result and exact build in this guide.
9. Make a fresh backup after the server is healthy.

For database state changes, stop the relevant game process before writing unless that specific mutation has already been proven live-safe.

## New-build audit checklist

When we begin the next deep dive:

- [ ] Record the new build/image number.
- [ ] Back up the database, Battlegroup spec, `UserEngine.ini`, and `UserGame.ini`.
- [ ] Diff the newly seeded configuration files against this baseline.
- [ ] Check whether the new build adds `UserServerCustomSettings.ini` or another official difficulty surface.
- [ ] Re-test every **Confirmed** setting after restart.
- [ ] Check for renamed sections, deprecated keys, and new formal ranges.
- [ ] Re-extract the complete `m_PerMapSystemSettings` value before restoring the `15/15` Hagga spice cap.
- [ ] Test whether the new difficulty controls expose storm intensity, item durability, base decay, XP, death-loot, survival, or Landsraad behavior.
- [ ] Revisit pause-on-empty/hibernation and base-power consumption.
- [ ] Revisit Deathstill timers, storage capacity, vehicle capacity, and the altitude fuel penalty.
- [ ] Revisit per-encounter shipwreck/CHOAM weights rather than only global encounter cadence.
- [ ] Check whether settings now replicate automatically to clients.
- [ ] Update each table's shipped default, formal range, and validation status.

## Provenance and further research

Primary operational source:

- [Funcom: Self Hosted Servers](https://duneawakening.com/self-hosted-servers/)

Community extraction/research used to cross-check exact shipped keys:

- [snapetech/DuneAwakeningSelfHost — Server Config Keys](https://github.com/snapetech/DuneAwakeningSelfHost/blob/main/SERVER_CONFIG_KEYS.md)
- [snapetech/DuneAwakeningSelfHost — Deep Desert Event Knobs](https://github.com/snapetech/DuneAwakeningSelfHost/blob/main/DEEP_DESERT_EVENT_KNOBS.md)
- [Icehunter/dune-awakening-truenas — Complete Server Settings](https://github.com/Icehunter/dune-awakening-truenas/blob/main/COMPLETE-SERVER-SETTINGS.md)

Our server's confirmed values, failure modes, and database behavior come from our own tests. Community extractions are evidence of key names and shipped values, not a warranty that every key remains supported in later builds.

## Change log

### 2026-09-26 — Initial paper baseline

- Captured the known-good `UserEngine.ini` and `UserGame.ini` values.
- Added encounter cadence, low-population Grandfather Worm, dew refresh, and Hagga spice-cap discoveries.
- Separated official settings from shipped-but-untested properties.
- Recorded asset/database dead ends so they are not rediscovered as fake INI solutions.
- Added a focused checklist for auditing the newly released build.
