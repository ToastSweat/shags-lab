---
type: guide
project: Garth's Game I
status: active
publish: true
---
# Garth's Game DMG - Production Roadmap

## Current checkpoint

### Working

- Three-stat virtual-pet loop.
- FEED, PLAY, and NAP.
- TALK/HANGOUT.
- Lang808 speech and face animation.
- Menu, mood, minigame, and result music.
- SFX.
- SRAM save/load and NEW GAME confirmation.
- Stat-cap progression.
- Time decay across pet/TALK.
- Four randomized menu backgrounds.

### Designed, not implemented

- Cabin home screen.
- Mood-driven full-body Garth animation.
- GAS as a fourth inverse stat.
- Food Is Good visual redesign.
- Simon Says expansion to six inputs/seven rounds.
- Catch Some Zs larger catcher/objects and space scene.
- Pass the Gas.
- Joke action.
- New/updated music and SFX.

### Main risks

- No single verified canonical source tree in the current archive.
- ROM0 and Bank 4 have limited historical headroom.
- New mockups may exceed a naive tile/sprite budget.
- GAS changes the SRAM structure.
- B cannot be both the universal Back button and gameplay in Simon/GAS.
- Pass the Gas art exists before its final mechanic.

## Phase 0 - Freeze the playable foundation

### Tasks

- [ ] ZIP the exact active Windows project.
- [ ] Compile it unchanged.
- [ ] Save clean compiler output.
- [ ] Run `romusage` and save the fresh map.
- [ ] Record the ROM SHA-256.
- [ ] Test NEW GAME, CONTINUE, all three minigames, TALK, saving, and progression.
- [ ] Name/tag this as the final legacy three-stat checkpoint.

### Exit condition

One source tree demonstrably builds the known playable game.

## Phase 1 - Lock the redesign rules

### Decisions

- [ ] Select the Pass the Gas mechanic after a simple prototype.
- [ ] Define GAS start/max/tick/food/release values.
- [ ] Decide how GAS affects mood and other stats.
- [ ] Decide version 1 save migration versus forced new game.
- [ ] Approve START or another universal active-game exit.
- [ ] Decide whether Simon is independent matching or sequence memory.
- [ ] Decide joke FUN/progression behavior.
- [ ] Define the minimum set of Garth mood animations.

### Technical planning

- [ ] Count unique tiles in each mockup.
- [ ] Mark every moving element as BG tile swap, window, or sprite.
- [ ] Measure worst-case sprites per scanline.
- [ ] Assign VRAM ranges per screen.
- [ ] Propose ROM banks for new code/data/music.
- [ ] Reserve safety headroom instead of filling banks to 100%.

### Exit condition

The design rules are stable enough that implementation will not repeatedly invalidate art, save data, or controls.

## Phase 2 - Build common foundations

### Tasks

- [ ] Add shared joypad edge/release handling.
- [ ] Add screen-entry palette/resource cleanup conventions.
- [ ] Add reusable footer/button icon drawing.
- [ ] Add title animation timing helper if it saves code overall.
- [ ] Add shared result application/return behavior.
- [ ] Preserve game-specific result layouts.
- [ ] Implement save version 2 or the chosen reset path.
- [ ] Add GAS to pet state and persistence.

### Exit condition

The old activities still work through the new transition/save foundation without regressions.

## Phase 3 - New home screen

### Tasks

- [ ] Convert the cabin background.
- [ ] Reduce/reuse tiles without losing the main composition.
- [ ] Implement four stat bars.
- [ ] Implement bottom action icons/cursor.
- [ ] Implement mood icon.
- [ ] Add a placeholder Garth sprite/animation hook.
- [ ] Route Food, Play, Nap, Gas, Joke, and TALK selections.
- [ ] Restore home palette/tiles/music/sprites on every return.

### Exit condition

All current activities are reachable from the new home shell and can return safely.

## Phase 4 - Food Is Good

### Tasks

- [ ] Convert title flash frames.
- [ ] Convert food-machine gameplay background.
- [ ] Preserve all ten foods and four-slot roulette.
- [ ] Preserve accepted `39/33/27/21` timing.
- [ ] Add scrolling current-selection header.
- [ ] Add consistent footer/exit.
- [ ] Build new result screen.
- [ ] Preserve generated food names.
- [ ] Add selected GAS side effect.
- [ ] Regression-test every result category and food quadrant.

### Exit condition

The accepted FEED mechanics/rewards survive inside the new presentation with no jumbled or stale art.

## Phase 5 - Simon Says

### Tasks

- [ ] Convert four-frame title animation.
- [ ] Add Left/Right alongside Up/Down/A/B.
- [ ] Increase to seven rounds/lights.
- [ ] Implement pending/correct/miss light states.
- [ ] Add lit/unlit input states.
- [ ] Add exit control that does not conflict with B.
- [ ] Retune response time and rewards for seven rounds.
- [ ] Build new result screen.

### Exit condition

All six physical inputs and seven results are clear at native screen size and behave correctly.

## Phase 6 - Catch Some Zs

### Tasks

- [ ] Convert progressive-letter title sequence.
- [ ] Convert space playfield/background.
- [ ] Expand catcher to two tiles.
- [ ] Expand Z/`!` objects to 2×2.
- [ ] Rewrite collision as rectangle overlap.
- [ ] Adjust spawn and movement bounds.
- [ ] Measure scanline sprite load.
- [ ] Retune speed/difficulty if larger hitboxes change scoring.
- [ ] Build result screen/footer.

### Exit condition

The larger art improves the game without causing unfair collision or sprite flicker.

## Phase 7 - Pass the Gas

### Prototype first

- [ ] Prototype alternating pressure release with plain bars/text.
- [ ] Prototype the balance-window version if needed.
- [ ] Test clarity, fun, repetition, and hand fatigue.
- [ ] Select one rule before wiring final visuals.

### Full implementation

- [ ] Convert six-beat title sequence.
- [ ] Convert industrial background/tank.
- [ ] Implement two meters.
- [ ] Implement A BURP / B FART actions.
- [ ] Add safe non-B exit.
- [ ] Add two-frame bubbles.
- [ ] Add burp/fart steam clouds.
- [ ] Add GAS reduction and result grading.
- [ ] Add randomized performance compliments.
- [ ] Add music and SFX.

### Exit condition

The game is funny, readable, and worth replaying even after the title joke is no longer new.

## Phase 8 - Personality pass

### Garth

- [ ] Final mood animation set.
- [ ] Urgent-need visual reactions if budget permits.
- [ ] Home idle timing.

### TALK

- [ ] Rewrite dialogue to roughly 120–150 strong lines.
- [ ] Rewrite at least nine contextual low-stat lines.
- [ ] Add GAS reactions.
- [ ] Test at least 25 representative lines.
- [ ] Verify no repeated/stuck speech.

### Jokes

- [ ] Build joke pool.
- [ ] Prevent immediate repeats.
- [ ] Add final reward/cooldown behavior.
- [ ] Add optional sting.

### Audio

- [ ] Add Pass the Gas track.
- [ ] Update old minigame naming/routing.
- [ ] Add burp/fart/pressure/joke SFX.
- [ ] Confirm channel ownership.
- [ ] Confirm every blocking loop updates music.

### Exit condition

Garth feels alive across home, TALK, jokes, results, and mood changes.

## Phase 9 - Balance and regression

### Core tests

- [ ] Every stat/reward boundary.
- [ ] GAS rise, food effect, and release.
- [ ] Every mood threshold.
- [ ] Long idle session.
- [ ] Repeated entry/exit from every screen.
- [ ] Palette restoration.
- [ ] VRAM/tile restoration.
- [ ] Sprite cleanup.
- [ ] Input leak prevention.
- [ ] Music/SFX/speech cleanup.
- [ ] Save/reload after every activity.
- [ ] Old-save handling.
- [ ] Progression unlock at each tier.

### Playtest questions

- [ ] Are needs understandable without instructions?
- [ ] Are footers consistent?
- [ ] Does START exit feel natural?
- [ ] Is Simon's rule what players expect from the name?
- [ ] Does the larger NAP art improve or trivialize the game?
- [ ] Does Pass the Gas stay fun after several plays?
- [ ] Is GAS annoying, funny, or both in the correct ratio?
- [ ] Do jokes repeat too often?
- [ ] Are the mockups readable on a real unscaled screen?

### Exit condition

No known corruption, soft lock, stuck audio, save loss, impossible mood, or screen-transition regression.

## Phase 10 - Hardware and release candidate

- [ ] Test on multiple emulators.
- [ ] Test on a flash cart/real Game Boy-compatible hardware.
- [ ] Verify battery-backed save retention.
- [ ] Verify cartridge header/mapper/RAM/battery configuration.
- [ ] Freeze version, ROM, checksum, source, map, and build instructions.
- [ ] Capture final screenshots/photos.
- [ ] Complete credits and licenses.

### Exit condition

The exact archived source reproducibly builds the exact tested ROM.

## Phase 11 - Physical release

- [ ] Cartridge/PCB order and test.
- [ ] Cartridge label.
- [ ] Box art/layout.
- [ ] Manual/booklet.
- [ ] Controls and stat explanation.
- [ ] Save warning/instructions.
- [ ] Credits/licenses.
- [ ] Final packaging proof.
- [ ] Optional digital ROM/readme release.
- [ ] Optional trailer/GIFs/project page.

## Definition of done

Garth's Game I is done when:

- the four-stat care loop works;
- all four minigames are complete and polished;
- Garth talks, jokes, reacts, and animates correctly;
- saving and progression are reliable;
- the game survives long regression and real-hardware testing;
- the final ROM is reproducible from an archived source tree;
- the physical cartridge, label, box, and manual exist.

## Not now

- More minigames.
- A large narrative campaign.
- Online features.
- CGB-only art.
- Rebuilding the face-animation editor.
- Promotional work before the game is stable.

## Related notes

- [[Garth's Game DMG]]
- [[Garth's Game I - Game Design Document]]
- [[Garth's Game I - Technical Design]]

