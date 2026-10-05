---
title: Dune Private Server Doomsday Guide
type: guide
date: 2026-09-26
updated: 2026-10-03
project: Dune Private Server
publish: true
---

# Dune Private Server Doomsday Guide

This is the “future me is tired, the server exploded, and I do not want to rediscover all of this again” guide.

The goal is to rebuild the Dune: Awakening self-hosted server from scratch on the dedicated Windows server, get the VM online, expose the correct ports, and avoid the specific traps that already ate multiple days of my life.

## Known Working Server Context

Current dedicated server:

```text
Host: ns518160.ip-158-69-52.net
Public IPv4: 158.69.52.183
OS: Windows Server 2022 Standard
RAM: 64 GB
Main NIC: Intel I350 Gigabit Network Connection / Onboard LAN 1
Gateway: 158.69.52.254
```

Steam app IDs:

```text
Dune: Awakening main game: 1172710
Dune: Awakening self-hosted server tool: 4754530
```

Known working Dune server install path:

```text
C:\PGN\DUNE
```

Current production identity captured on October 3, 2026:

```text
Hyper-V VM: dune-awakening
VM IP: 192.168.69.69
Server display name: Mysa Jar Jar Binks
Battlegroup ID: sh-238803c537a22e2-fdofyf
Namespace: funcom-seabass-sh-238803c537a22e2-fdofyf
Game-server build: 2064155-0-shipping
Database image: igw-postgres:17.4-alpine-fc-13
```

The battlegroup ID and namespace identify the real world. Preserve them in a
recovery and never substitute the old deleted `krmfhh` battlegroup.

Known working SteamCMD path:

```text
C:\PGN\STEAMCMD\steamcmd.exe
```

Avoid paths with brackets like:

```text
C:\[PGN]\[DUNE]
```

PowerShell, SteamCMD, scripts, and wildcard handling can all become weird for no good reason. Use boring paths.

## Big Picture Architecture

The working setup is:

```text
Internet
  ↓
Windows Server public IP
  ↓
Windows Firewall
  ↓
Windows NAT
  ↓
Hyper-V Internal Switch
  ↓
Dune self-hosting VM
  ↓
Kubernetes / k3s
  ↓
Dune battlegroup pods
```

The important part is that the VM is **not bridged directly to OVH’s public network**.

That was a trap.

The working solution uses an internal Hyper-V switch and Windows NAT.

## The Working Hyper-V / NAT Setup

Known working internal switch:

```text
Bootyhole
```

Yes, that is the real name.

Known working VM IP:

```text
192.168.69.69
```

Known working NAT subnet:

```text
192.168.69.0/24
```

Known working NAT:

```text
Bootyhole-NAT
```

The Dune VM should be connected to the `Bootyhole` internal switch.

### Check Hyper-V Switches

On the Windows host, run PowerShell as Administrator:

```powershell
Get-VMSwitch
```

Expected useful switch:

```text
Name       SwitchType
----       ----------
Bootyhole  Internal
```

### Check VM Adapter

```powershell
Get-VMNetworkAdapter -VMName "dune-awakening" | Format-List *
```

Expected:

```text
SwitchName: Bootyhole
IPAddresses: 192.168.69.69
```

### Check NAT

```powershell
Get-NetNat | Format-List *
```

Expected:

```text
Name: Bootyhole-NAT
InternalIPInterfaceAddressPrefix: 192.168.69.0/24
```

## Required Ports

Official/basic ports:

```text
7777-7810 UDP  = game server player ports
31982 TCP      = RMQ
```

Also required in the known-good setup:

```text
7888-7921 UDP  = IGW / inter-server gateway port range
```

That second UDP range matters. The server may appear in the browser and still fail to connect if this is missing.

## Known Working NAT Port Forwards

On the Windows host, run PowerShell as Administrator.

### UDP 7777-7810

```powershell
for ($p = 7777; $p -le 7810; $p++) {
    Add-NetNatStaticMapping `
        -NatName "Bootyhole-NAT" `
        -Protocol UDP `
        -ExternalIPAddress "0.0.0.0" `
        -ExternalPort $p `
        -InternalIPAddress "192.168.69.69" `
        -InternalPort $p
}
```

### UDP 7888-7921

```powershell
for ($p = 7888; $p -le 7921; $p++) {
    Add-NetNatStaticMapping `
        -NatName "Bootyhole-NAT" `
        -Protocol UDP `
        -ExternalIPAddress "0.0.0.0" `
        -ExternalPort $p `
        -InternalIPAddress "192.168.69.69" `
        -InternalPort $p
}
```

### TCP 31982

```powershell
Add-NetNatStaticMapping `
    -NatName "Bootyhole-NAT" `
    -Protocol TCP `
    -ExternalIPAddress "0.0.0.0" `
    -ExternalPort 31982 `
    -InternalIPAddress "192.168.69.69" `
    -InternalPort 31982
```

### Verify NAT Mappings

```powershell
Get-NetNatStaticMapping |
    Where-Object {
        ($_.ExternalPort -ge 7777 -and $_.ExternalPort -le 7810) -or
        ($_.ExternalPort -ge 7888 -and $_.ExternalPort -le 7921) -or
        ($_.ExternalPort -eq 31982)
    } |
    Sort-Object ExternalPort |
    Format-Table NatName,Protocol,ExternalIPAddress,ExternalPort,InternalIPAddress,InternalPort
```

## Windows Firewall Rules

Run PowerShell as Administrator.

```powershell
New-NetFirewallRule `
    -DisplayName "Dune Awakening UDP 7777-7810" `
    -Direction Inbound `
    -Action Allow `
    -Protocol UDP `
    -LocalPort 7777-7810

New-NetFirewallRule `
    -DisplayName "Dune Awakening UDP 7888-7921" `
    -Direction Inbound `
    -Action Allow `
    -Protocol UDP `
    -LocalPort 7888-7921

New-NetFirewallRule `
    -DisplayName "Dune Awakening TCP 31982" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 31982
```

Verify:

```powershell
Get-NetFirewallRule -DisplayName "Dune Awakening*" | Format-List *
```

## Installing / Updating the Self-Hosted Server Tool

Use SteamCMD.

Example updater BAT:

```bat
@echo off
setlocal

set "STEAMCMD=C:\PGN\STEAMCMD\steamcmd.exe"
set "INSTALL_DIR=C:\PGN\DUNE"

"%STEAMCMD%" ^
  +force_install_dir "%INSTALL_DIR%" ^
  +login YOUR_REAL_STEAM_LOGIN_NAME ^
  +app_update 4754530 validate ^
  +quit

pause
```

Important:

- Use the real Steam login name, not the display name.
- Do not hardcode the password if you can avoid it.
- If Steam Guard prompts, complete it.
- The self-hosted server tool is app `4754530`, not the main game app.

## Starting the Battlegroup Tool

From Windows:

```cmd
cd /d C:\PGN\DUNE
battlegroup.bat
```

Useful menu options we used:

```text
1. status
2. start
3. restart
4. stop
5. update
6. edit
7. edit-advanced
8. backup
9. import
10. logs-export
11. open-file-browser
12. open-director
13. shell-vm
14. shell-pod
```

These numbers were confirmed on build `2064155-0-shipping` on October 3, 2026.
Funcom may change them again, so always read the displayed menu before entering
a number.

## First Setup

When the VM shell opens, it may say:

```text
To start the setting up your own server type: setup and press the enter key
```

That is a generic login banner.

Do **not** rerun `setup` on a working server unless intentionally reconfiguring from scratch.

During initial setup only:

```bash
setup
```

You will need the Dune self-host token from the Dune account/self-host page.

Use SSH if possible instead of the Hyper-V console. Hyper-V console paste can inject garbage characters.

Known useful SSH command from Windows PowerShell:

```powershell
ssh dune@192.168.69.69
```

## UserSettings Files

Open with:

```text
battlegroup.bat → 14. open-file-browser → UserSettings
```

There are two main files:

```text
UserEngine.ini
UserGame.ini
```

Settings in these files apply to every server in the battlegroup.

If different maps/partitions need different settings, use the battlegroup editor instead.

### Known Good UserEngine.ini Shape

```ini
; Settings in these config files will be applied to every server in the battlegroup
; If you need to override different settings for different servers, use the battlegroup editor instead

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

### Known Good UserGame.ini Shape

```ini
; Settings in these config files will be applied to every server in the battlegroup
; If you need to override different settings for different servers, use the battlegroup editor instead

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
```

## Applying Config Changes

After editing `UserEngine.ini` or `UserGame.ini`:

```text
3. restart
4. status
```

Do not reboot the entire Windows server unless you need to.

## Backups and Full Recovery

The normal disaster-recovery backup is the small, targeted portable bundle.
It is designed for a clean Funcom installation followed by restoration of the
world and configuration. It is **not** necessary to keep cloning the entire
virtual machine.

The full Hyper-V export is only an optional emergency safety net.

### Verified Recovery Snapshot: 20261003-015515

Canonical portable package:

```text
C:\DuneBackups\PGN-2026-10-03\dune-backup-20261003-015515.tar.gz
```

Package size and SHA-256:

```text
7,836,960 bytes
f46c95b0468570b408cc64ed75769ac6016b288dd27b3ba9bde7ebf0351a5c4d
```

Its companion `.sha256` file contains the same hash. The Windows copy was
hashed after transfer and matched exactly.

The snapshot was taken while the battlegroup was stopped and PostgreSQL was
still running. This avoids live game-server memory overwriting database changes
during shutdown.

### What the Portable Package Preserves

| Recovery need | Backup component |
| --- | --- |
| Players, characters, bases, inventories, vehicles, water, and world state | `database/*.backup` |
| Battlegroup specification associated with the dump | `database/*.backup.yaml` |
| Live settings actually used by the battlegroup | `config-live/UserEngine.ini` and `UserGame.ini` |
| Setup-template settings | `config-setup/UserEngine.ini` and `UserGame.ini` |
| Persistent battlegroup `/srv` contents | `battlegroup-persistent-files.tar.gz` |
| Funcom custom resources and battlegroup definition | `kubernetes/funcom-resources.yaml` |
| PVC and PV identities | `kubernetes/persistent-volume-claims.yaml` and `persistent-volumes.yaml` |
| Workloads and ConfigMaps | `kubernetes/workloads-and-configmaps.yaml` |
| VM, OS, k3s, IP, and routing information | `system/vm-and-network.txt` |
| Container images and exact build references | `system/container-images.txt` |
| Persistent-file inventory | `system/battlegroup-persistent-files.list` |
| Backup explanation | `BACKUP-INFO.txt` |
| Integrity of every packaged file | package checksum manifests |

The PostgreSQL dump is the authoritative gameplay backup. Dune stores the
important world and character state in PostgreSQL rather than ordinary world
save files. That includes structures and the generic component records used by
placed objects.

The database dump was tested with `pg_restore --list` and returned:

```text
VALID: pg_restore parsed the backup successfully
```

Its original files were:

```text
sh-238803c537a22e2-fdofyf-20261003-015515.backup
sh-238803c537a22e2-fdofyf-20261003-015515.backup.yaml
```

Original individual hashes:

```text
f74237a745dda278c50330b5944c52c1c4eda1ad2f0674c1f36cb996cc305ac8  .backup
010129e75e3824ecfc0ce228235395f292641a0a3febf1c7398928d2e2ebf561  .backup.yaml
```

The persistent-files archive was also parsed successfully and contained 102
entries at the time of backup.

### Windows Host Configuration Package

The Windows host configuration is stored separately:

```text
C:\DuneBackups\PGN-2026-10-03\PGN-HostConfig-2026-10-03.zip
C:\DuneBackups\PGN-2026-10-03\PGN-HostConfig-2026-10-03.zip.sha256
```

It contains the Hyper-V VM, processor, memory, disk, virtual switch, network
adapter, Windows NAT, NAT mappings, IP addresses, firewall export, and Windows
system information. The ZIP is only about 40 KB because it is configuration,
not a VM image.

### Optional Full Hyper-V Export

One cold export was made while `dune-awakening` was cleanly powered off:

```text
C:\DuneBackups\PGN-2026-10-03\HyperV-Export\dune-awakening
```

The exported VHDX is approximately 96.82 GB. `Test-VHD` returned `True`.
This preserves the entire appliance, cached images, operating system, and
historically allocated disk blocks. It is overkill for normal recovery and is
not the canonical backup.

Keep it only as temporary insurance until the portable clean-install recovery
has been tested. Future routine backups should not copy the full VM.

### Critical Off-Host Rule

A backup stored only on `C:` of the same OVH machine is not protection against
host loss or disk failure. At minimum, copy these three small artifacts to a
different physical system or cloud location:

```text
dune-backup-20261003-015515.tar.gz
dune-backup-20261003-015515.tar.gz.sha256
PGN-HostConfig-2026-10-03.zip
PGN-HostConfig-2026-10-03.zip.sha256
```

The 96.82 GB VM export is optional off-host material. The small portable files
are mandatory.

### Clean-Install Recovery Order

This is the intended recovery path. It restores the important state onto a
fresh Funcom installation instead of treating the giant VM export as the only
way home.

1. Verify the portable package SHA-256 before extracting it.
2. Extract the package and run the included per-file checksum verification.
3. Reinstall the Dune self-hosted server tool with SteamCMD app `4754530`.
4. Recreate the Hyper-V internal switch, NAT, firewall rules, and VM networking
   from `PGN-HostConfig-2026-10-03.zip` and the networking sections above.
5. Run Funcom `setup` once on the fresh VM with a valid self-host token.
6. Recreate or restore the battlegroup while preserving the saved identity and
   specification for `sh-238803c537a22e2-fdofyf`.
7. Keep the battlegroup game servers stopped during data restoration.
8. Use the official menu option `11. import` to import the saved `.backup`.
   Prefer the supported importer over a hand-written `pg_restore` command so
   Funcom can apply any required schema handling.
9. Restore the two files from `config-live` into `/srv/UserSettings`. These are
   the authoritative tuned settings. Keep `config-setup` as a reference for
   setup defaults; do not let it overwrite the known live files accidentally.
10. Restore additional `/srv` files only if needed. Logs and crash reports are
    historical evidence, not required world state. Do not blindly replace a
    newly created PVC with an old archive.
11. Confirm the battlegroup specification points to the intended server build,
    maps, resources, and database.
12. Start the battlegroup.
13. Complete the recovery validation checklist below before allowing normal
    play.

The October 3 backup was created on game build `2064155-0-shipping` and
PostgreSQL `17.4-alpine-fc-13`. If restoring into a newer Funcom release, keep
an untouched copy of the original dump and allow the official tools to perform
their migrations. Never modify the only copy of the dump.

### Recovery Validation Checklist

After the restored battlegroup starts, verify all of the following:

- Database, gateway, director, Overmap, and Survival servers become ready.
- The public browser shows `Mysa Jar Jar Binks`.
- Existing players can use their original characters.
- Player inventories, currencies, and equipment are present.
- Bases, land claims, placed containers, vehicles, and their contents exist.
- World-state changes and stored resource values are present.
- Live `UserEngine.ini` and `UserGame.ini` settings are active.
- Solo/low-player multipliers and building limits match the saved configuration.
- Travel between maps works.
- No restored pod enters `CrashLoopBackOff`.
- A new official database backup succeeds after validation.

The backup is structurally verified, but the entire clean-install restoration
has not yet been rehearsed on a separate VM. Do not delete the optional cold VM
export until that rehearsal passes.

### Routine Targeted Backup Procedure

Before scary operations:

```text
4. stop
5. backup
```

Then preserve the new `.backup`, its `.backup.yaml`, both live INI files, the
battlegroup specification, and current checksums off-host. Use a timestamped
folder for every snapshot and never overwrite the last known-good backup.

Do this before:

- deleting battlegroups
- restoring backups
- major updates
- risky configuration changes
- direct database work
- anything involving persistent world state

After the server is healthy again, make another fresh targeted backup.

## Kubernetes Commands

Open shell:

```text
battlegroup.bat → 16. shell-vm
```

List namespaces:

```bash
sudo kubectl get namespaces | grep funcom
```

Real current battlegroup namespace:

```text
funcom-seabass-sh-238803c537a22e2-fdofyf
```

Old deleted/bad unused battlegroup:

```text
funcom-seabass-sh-238803c537a22e2-krmfhh
```

List pods:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf get pods -o wide
```

Events:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf get events --sort-by=.lastTimestamp | tail -40
```

Describe a pod:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf describe pod POD_NAME
```

Previous crash logs:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf logs POD_NAME --previous --tail=160
```

## Known Problem: Special Area Fails to Load

Symptom:

- A special area / DLC area will not load
- Status shows a map stuck in startup
- Pod describe shows `OOMKilled`
- Exit code `137`
- Memory limit is too low, often `5Gi`

Example fix:

```text
battlegroup.bat → 6. edit
```

Find the affected map/server and increase memory.

Example:

```text
5Gi → 8Gi
```

or:

```text
5Gi → 10Gi
```

Then:

```text
3. restart
4. status
```

If the pod stops getting OOMKilled and becomes ready, that was the issue.

## Known Problem: Server Visible But Cannot Connect

Check these first:

```powershell
Get-NetNatStaticMapping |
  Where-Object {
    ($_.ExternalPort -ge 7777 -and $_.ExternalPort -le 7810) -or
    ($_.ExternalPort -ge 7888 -and $_.ExternalPort -le 7921) -or
    ($_.ExternalPort -eq 31982)
  } |
  Sort-Object ExternalPort |
  Format-Table NatName, Protocol, ExternalIPAddress, ExternalPort, InternalIPAddress, InternalPort
```

Make sure both UDP ranges exist:

```text
7777-7810 UDP
7888-7921 UDP
```

Also check firewall rules.

The `7888-7921 UDP` range was likely the missing piece during the first successful connection.

## Known Problem: Blank Game Server Rows / CrashLoopBackOff

Symptom:

```text
Database/Gateway/Director healthy
Game server rows blank
Server not visible or not usable
Pods show CrashLoopBackOff
```

Check pods:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf get pods -o wide
```

If Overmap / Survival are crashlooping:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf logs POD_NAME --previous --tail=160
```

## Known Problem: Bad Funcom Build

This actually happened.

Symptoms:

- Server was working previously
- Later no server appeared correctly in browser
- Restart did not fix it
- Update initially re-applied the same bad build
- Infrastructure healthy
- Overmap and Survival crashloop
- Exit code `139`
- SIGSEGV / segmentation fault
- Fatal log references missing Spice data table

Crash clue:

```text
Failed to load data table property 'm_SpiceFieldTypeDataTable'
/Game/Dune/Systems/SpiceHarvesting/DT_SpiceFieldTypes
```

Local checks that did not fix it:

```bash
sudo grep -R --line-number -E "DT_SpiceFieldTypes|m_SpiceFieldTypeDataTable|SpiceHarvesting" /home/dune /funcom 2>/dev/null | head -200
```

No result.

```bash
sudo find /funcom /home/dune -iname "*SpiceField*" -o -iname "*DT_Spice*" 2>/dev/null | head -100
```

No result.

Disk was fine:

```bash
df -h
```

Image reimport did not fix it:

```bash
sudo k3s ctr -n k8s.io images rm registry.funcom.com/funcom/self-hosting/seabass-server:2007976-0-shipping
```

Then update/restart still failed.

Conclusion:

```text
Funcom pushed a bad build.
```

Actual fix:

```text
Wait for Funcom to publish a fixed build.
Run battlegroup update.
Restart battlegroup.
Check status.
```

## Checking Loaded Images

```bash
sudo k3s ctr -n k8s.io images ls | grep seabass-server
```

Useful when trying to confirm which build is loaded.

Bad build seen during incident:

```text
2007976-0-shipping
```

Older images may remain locally. Do not manually force old builds unless there is no safer rollback path.

## Deleting an Unused Battlegroup

Only do this after confirming:

- real battlegroup is healthy
- backup exists
- the target namespace has no useful resources
- the target battlegroup is definitely not your world

Known real battlegroup:

```text
sh-238803c537a22e2-fdofyf
```

Deleted unused battlegroup:

```text
sh-238803c537a22e2-krmfhh
```

Check namespaces:

```bash
sudo kubectl get namespaces | grep funcom
```

Check unused one:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-krmfhh get all
```

If it says:

```text
No resources found
```

Delete namespace:

```bash
sudo kubectl delete namespace funcom-seabass-sh-238803c537a22e2-krmfhh
```

Verify:

```bash
sudo kubectl get namespaces | grep funcom
```

Expected:

```text
funcom-operators
funcom-seabass-sh-238803c537a22e2-fdofyf
```

## Things Not To Do Casually

Do not casually delete:

```text
funcom-seabass-sh-238803c537a22e2-fdofyf
```

That is the real world.

Do not rerun:

```bash
setup
```

on a working VM unless intentionally rebuilding.

Do not wipe namespaces without backup.

Do not assume a blank status screen means networking. It may be Kubernetes/game server crashlooping.

Do not assume every crash is memory. Check exit codes and logs.

## Quick Health Checklist

After updates or restarts:

```text
1. status
```

Look for:

```text
DB healthy
Gateway healthy
Director healthy
Game servers populated
Overmap running/ready
Survival_1 running/ready
No CrashLoopBackOff
No blank map names
```

From shell:

```bash
sudo kubectl -n funcom-seabass-sh-238803c537a22e2-fdofyf get pods -o wide
```

Bad signs:

```text
CrashLoopBackOff
OOMKilled
Exit Code 139
Exit Code 137
serverReady: false
blank partitionMap/serverGuid annotations
```

## Emergency Summary

If rebuilding from scratch with the portable recovery package:

1. Verify and preserve the original portable backup and checksums.
2. Install SteamCMD.
3. Install app `4754530` to `C:\PGN\DUNE`.
4. Enable Hyper-V.
5. Use the internal switch, not OVH bridged networking.
6. Recreate `Bootyhole`, `Bootyhole-NAT`, and VM IP `192.168.69.69`.
7. Forward UDP `7777-7810` and `7888-7921`.
8. Forward TCP `31982`.
9. Open the same ports in Windows Firewall.
10. Run `battlegroup.bat`.
11. Complete `setup` once with a valid token.
12. Recreate the real battlegroup identity from the saved specification.
13. Leave its game servers stopped.
14. Import the saved PostgreSQL `.backup` with menu option `11`.
15. Restore the live `UserEngine.ini` and `UserGame.ini`.
16. Confirm the saved maps, resource limits, and build configuration.
17. Start the battlegroup.
18. Validate characters, bases, inventories, vehicles, world state, and tuning.
19. Test browser visibility, connection, and travel.
20. Make a fresh post-recovery backup.

## Final Note

The funniest part of this entire setup is that once it works, it works really well.

The least funny part is that every layer can lie to you.

The server can be installed correctly.
The VM can be running.
The database can be healthy.
The gateway can be healthy.
The server can even show in the browser.

And then one missing UDP range, one low memory limit, or one bad Funcom build can make it look haunted.

So check the layers one at a time.

Do not panic.

Do not delete the real namespace.

And absolutely preserve the `Bootyhole` switch unless there is a very good reason not to.
