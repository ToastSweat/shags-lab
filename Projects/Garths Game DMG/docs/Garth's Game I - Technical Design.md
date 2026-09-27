---
type: guide
project: Garth's Game I
status: living
publish: true
---
# Garth's Game DMG - Technical Design

## Purpose

This document records the technical shape of Garth's Game I and the constraints that matter when implementing the redesign.

It is not a replacement for the complete source archive. It is the short version Future Me should read before touching the game.

## Current source warning

The available archive contains several overlapping revisions:

- an older partial project snapshot;
- later individually uploaded files;
- accepted fix packages;
- debug maps;
- a rejected minigame GUI experiment.

The next coding session must begin with a ZIP of the exact active Windows project and a fresh successful compile/map. Do not reconstruct the current game by silently mixing old files.

## Toolchain

- Language: C.
- SDK: GBDK 2020.
- Target: Game Boy-compatible `.gb` ROM.
- Historical working path: `C:\gbdk\examples\gb\garth_game_i`.
- Build entry point: `compile.bat`.
- Art conversion: `png2asset` plus custom Python asset builders.
- Music: hUGEDriver exports and a bank-aware wrapper.
- Save: battery-backed SRAM.

The available build flags include:

```bat
-Wl-m
-Wm-yt0x1B
-Wm-ya1
-Wm-yoA
```

Their resulting cartridge header, mapper, RAM size, and battery behavior must be verified against the final physical PCB before ordering cartridges.

## Known modules

| Area | Files | Responsibility |
|---|---|---|
| Boot/menu | `main.c`, splash/logo/menu resources | Startup, CONTINUE, NEW GAME, HANGOUT, menu resources |
| Pet | `pet.c/.h` | Stats, decay, mood, SRAM, rewards, screen flow |
| Progression | `progression.c/.h` | Stat-cap unlock thresholds |
| Food data | `food.c/.h` and food resources | Food catalog, names, graphics |
| Minigames | `food_game.c`, `play_game.c`, `nap_game.c` | Current FEED/PLAY/NAP loops |
| Shared UI | `gui.c/.h`, `print_util.c` | Borders, text, controls, values |
| Dialogue | `hangout.c`, `dialogue*.c/.h` | TALK/HANGOUT flow and banked text |
| Face | `hangout_face*.c/.h` | Face frames and animation state |
| Speech | `lang808.c/.h`, `audio.c/.h` | Token timing and synthesized voice |
| Audio | `music.c/.h`, `sfx.c/.h`, hUGEDriver/music data | Music selection/update and SFX |
| Generated art | `res/*.c/.h` | Background tiles, maps, sprites, stat UI |
| Build tools | `tools/*.py`, `compile.bat` | Conversion, tile ordering, minification, compile/report |

## Runtime model

The project uses several blocking screen loops.

Each active mode is responsible for:

1. loading its palette and resources;
2. draining transition input;
3. polling controls;
4. updating game/animation state;
5. updating music;
6. waiting for VBlank;
7. cleaning up before returning.

This is simple to understand, but it means every transition can leak global Game Boy state.

The most common leaked state has been:

- held input;
- background/sprite palette;
- background tiles;
- sprite positions/tiles;
- music mode;
- speech/SFX channels.

## Screen-entry contract

Every screen should explicitly perform this sequence:

```text
stop/switch old audio
set palette
hide unused sprites
load required tile data
load/draw map and initial UI
start correct music
wait for clean input edge
enter frame loop
```

Returning to a screen must go through its normal entry routine. Never assume its previous VRAM contents survived.

## Input handling

A held button once crossed CONTINUE into the pet screen and immediately launched FEED.

Recommended shared input state:

```c
current = joypad();
pressed = current & ~previous;
previous = current;
```

Use `pressed` for menu choices, slot locking, TALK advance, and other discrete actions. Use held input only for continuous movement.

The redesign should use one consistent active-minigame exit. START is the current recommendation because B is gameplay in Simon Says and Pass the Gas.

## Palette handling

Palette inversion previously leaked from minigames/TALK back into other screens.

Rule:

> Every screen writes the palette it expects on entry.

Do not rely on the screen that came before it.

## VRAM and tile ownership

### Confirmed historical collision

The 16-tile randomized menu background uses tile IDs:

```text
202–217
```

An available pet revision used:

```c
#define PET_BLACK_TILE 211
#define PET_GUI_TILE_START 212
```

The pet screen overwrote menu tiles 211–217. The third/fourth menu patterns were corrupt after returning from pet mode.

Accepted fix:

> Reload all sixteen menu tiles every time `show_main_menu()` runs.

### Required redesign manifest

Each screen/stage needs a small resource record:

| Field | Purpose |
|---|---|
| Background tile range/count | Prevent overlap and measure load |
| Sprite tile range/count | Prevent metasprite corruption |
| Unique tile count | Determine VRAM/ROM cost |
| Map dimensions | Determine generated data size |
| Maximum total sprites | Hardware budget |
| Maximum sprites on one scanline | Flicker/drop risk |
| Palette | Restore correctly |
| ROM bank | Safe data access |
| Entry/exit cleanup | Prevent state leakage |

### Redesign strategy

- Use background maps for static machinery and footer icons.
- Use sprites for Garth and genuinely moving objects.
- Swap background tiles for Simon button lights where practical.
- Keep Pass the Gas machinery static; animate only bubbles/clouds/meters.
- Measure NAP's 2×2 falling objects against the ten-sprites-per-scanline limit.
- Reload a screen's entire tileset on entry when another mode can overwrite it.

## Game Boy display constraints

- 160×144 pixels.
- 20×18 background tiles.
- Four DMG shades through palette mapping.
- 40 sprites total.
- 10 sprites per scanline.
- Sprite color zero is transparent.

The final target may support CGB hardware, but the art must remain readable in the DMG presentation unless that design goal changes explicitly.

## Asset pipeline

The current build references:

```text
tools/build_menu_background.py
tools/build_dialogue_gui.py
tools/build_food_quadrants.py
tools/minify_tile_asset.py
```

Food assets use `png2asset` with options such as:

```bat
-spr8x8
-keep_duplicate_tiles
-noflip
```

### Important conversion lesson

`png2asset` may deduplicate or reorder tiles.

That is fine when the generated map/metasprite owns the relationship. It is not fine when code assumes the third 8×8 block in a PNG must become tile index 2.

The menu strip required a custom positional builder because tile position had semantic meaning.

### Redesign conversion process

1. Preserve the original mockup.
2. Confirm exact 160×144 composition.
3. Quantize to the intended four shades.
4. Separate static background, animated background, and sprites.
5. Slice/count unique 8×8 tiles.
6. Find intentional repeat/flip opportunities.
7. Build one isolated screen prototype.
8. Measure VRAM, sprite scanlines, ROM bytes, and bank placement.
9. Compare an emulator screenshot to the mockup.
10. Document any visual compromise.

## ROM banking

### Historical reports

An earlier build reported:

| Bank | Used | Free |
|---|---:|---:|
| ROM0 | 16,043 | 341 |
| ROM1 | 14,371 | 2,013 |

That build produced overflow warnings and should be considered historical/unsafe.

A later report showed:

| Bank | Used | Free | Used % |
|---|---:|---:|---:|
| ROM0 | 15,667 | 717 | 96% |
| ROM1 | 9,266 | 7,118 | 57% |
| ROM2 | 7,729 | 8,655 | 47% |
| ROM3 | 6,940 | 9,444 | 42% |
| ROM4 | 14,783 | 1,601 | 90% |
| WRAM_LO | 556 | 3,540 | 14% |

The accelerated progression test used ROM0 at 15,818 / 16,384 bytes, leaving 566 bytes.

These numbers predate the complete redesign and may predate some accepted fixes. A fresh map is required.

### Known placement

- Progression code/data uses Bank 2 in the available version.
- Dialogue uses banked data/copy helpers around Bank 3.
- hUGEDriver and music use Bank 4.
- Selected generated gameplay assets are placed in Bank 2.

### Banking rules

- Treat bank-span, overlap, multiple-write, and ROM0 overflow warnings as build failures.
- Use `#pragma bank`, BANKED declarations/functions, and intentional link placement.
- `-bank 2` was not a valid compiler option in this workflow.
- Switch to a data object's bank before dereferencing it and restore the prior bank.
- Keep large initializers out of ROM0.
- Re-run `romusage` after each meaningful screen/system addition.

## Save data

The available legacy save uses:

```c
#define SAVE_MAGIC_1 'G'
#define SAVE_MAGIC_2 'A'
#define SAVE_MAGIC_3 'R'
#define SAVE_MAGIC_4 'T'
#define SAVE_VERSION 1
```

SRAM begins at `0xA000` in that revision.

Adding GAS changes the persistent structure.

### Safe options

#### Migrate version 1

- Define an immutable `SaveDataV1`.
- Load/copy known fields into a new version.
- Initialize GAS and new counters.
- Validate before writing version 2.

#### Deliberate reset

- Detect version 1.
- Clearly require/confirm NEW GAME.
- Never partially load old bytes into the new structure.

Migration is friendlier; reset is safer if no public saves exist. The decision must happen before normal redesign work changes the struct.

## Pet timing

The available values include:

```c
#define PET_TICK_TIME 3600
#define PET_START_CURRENT 30
#define PET_START_MAX 30
#define PET_STAT_ABSOLUTE_MAX 100
#define PET_MIN_MAX 10
```

`PET_TICK_TIME 3600` is approximately one minute at 60 frames per second.

The accepted TALK fix shares this tick timer between STATUS and TALK. Main menu and minigames pause normal decay.

GAS should use the same care-time definition unless deliberately designed otherwise.

## Mood thresholds

Legacy values:

```c
#define PET_LOW_STAT_THRESHOLD 10
#define PET_DYING_STAT_THRESHOLD 5
#define PET_HAPPY_STAT_THRESHOLD 22
```

Because `PET_MIN_MAX` is 10, permanent maximum damage can make the 22-point HAPPY threshold unreachable. This requires a design/code correction before release.

## Audio architecture

### Music

The later wrapper defines:

```c
#define MUSIC_BANK 4
#define RESULT_MUSIC_FRAMES 96
```

Music modes include MENU, PET, MINIGAME, RESULT, and NONE.

Bank 4 is selected for `hUGE_init()` and `hUGE_dosound()`, then the previous bank is restored.

### Blocking loop rule

Every blocking loop must call:

```c
update_music();
```

once per frame. Starting a song outside the loop is not enough.

### Channel ownership

Channel 2 is reserved for SFX in the existing integration. Stray `E00`/`Cxx` commands were removed from minigame exports so the song would leave it alone.

New music must preserve a written channel allocation.

### Speech

Lang808 uses 23 token types made from vowel, consonant, and punctuation sounds.

Approximate timings in the available source:

- normal token: 6 frames;
- space: 9 frames;
- punctuation: 30 frames.

Speech start must be tied to a new dialogue line, not a new face frame. All exit paths must call the stop/channel-cleanup routine.

## New technical modules likely needed

- `gas_game.c/.h` or equivalent.
- Home-screen renderer/resources.
- Mood animation data/resources.
- GAS field and simulation in pet/save state.
- Joke selection/content pool.
- Shared title animation helper.
- Shared footer/button icon helper.
- Shared transition/input-release helper.
- Possibly a shared results presenter that still permits game-specific layouts.

Avoid putting all visual data into one universal resource package. Share lifecycle code while keeping stage-specific art banked and reloadable.

## Build verification

Every meaningful checkpoint should record:

- exact source ZIP/commit;
- clean compiler output;
- ROM SHA-256;
- `.map` file;
- `romusage` table;
- emulator/version;
- new-game and continue test;
- save persistence result.

## Regression hazards

Always check for:

- held button entering the next screen;
- wrong/inherited palette;
- overwritten background tiles;
- stale sprites;
- stale text glyphs;
- music that starts and freezes;
- result music that does not stop;
- repeated speech after face animation;
- stuck audio channels;
- wrong bank access/white screen;
- SRAM corruption/version mismatch.

## Release hardware checks

- Verify header/mapper/RAM/battery configuration.
- Test on more than one emulator.
- Test on a flash cart or physical development cartridge.
- Power-cycle and verify save retention.
- Test sound on real speaker/headphones.
- Test sprite flicker and native-size readability.
- Freeze final ROM checksum with the physical release source archive.

## Immediate technical order

1. Capture the exact active project.
2. Compile it unchanged and archive the ROM/map.
3. Decide save-version behavior.
4. Audit mockup tile/sprite demand.
5. Define per-screen VRAM and bank ownership.
6. Implement transition/input helpers.
7. Build the home shell.
8. Convert one minigame at a time.
9. Prototype GAS before locking final art behavior.
10. Run the complete regression/hardware plan.

## Related notes

- [[Garth's Game DMG]]
- [[Garth's Game I - Game Design Document]]
- [[Garth's Game I - Production Roadmap]]

