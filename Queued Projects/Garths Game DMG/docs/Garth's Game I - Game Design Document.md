---
type: guide
project: Garth's Game DMG
status: living
publish: true
---
# Garth's Game DMG - Game Design Document

## Document status

This is the living design document for Garth's Game I.

It separates the playable legacy foundation from the approved redesign and leaves unresolved mechanics marked as open instead of pretending they have already been decided.

## High concept

Garth's Game I is a Game Boy virtual-pet game starring Garth, a strange little man living in an industrial spaceship cabin.

The player keeps Garth comfortable by managing his food, fun, power, and gas. Short minigames maintain those needs. TALK, jokes, mood animations, synthesized speech, and ridiculous result text give Garth personality between the mechanical care tasks.

The game should feel like a lost, unusually ambitious monochrome Game Boy release: funny, tactile, readable, and built around the actual limitations of the hardware.

## Product goals

- Make a real Game Boy ROM, not a modern imitation.
- Create a virtual pet with enough personality to feel worth revisiting.
- Keep sessions short and controls immediately understandable.
- Give every activity its own strong visual identity.
- Reward continued care without turning neglect into an unrecoverable punishment.
- Finish the project as a physical object: cartridge, label, box, and manual.

## Design pillars

### Garth must feel specific

This should not feel like a generic pet system with Garth pasted on top.

Mixed-up foods, robotic speech, mood songs, bad jokes, sleep caught in space, and industrial gas management should all feel like parts of the same character.

### One-screen clarity

The player should be able to look at a screen and understand what matters.

The Game Boy display is only 160×144 pixels. Large shapes, clean contrast, stable footers, and deliberate animation matter more than decorative text.

### Short games, persistent consequences

Each activity should be easy to enter and finish. The long-term interest comes from the persistent stats, progression, moods, scores, result names, and Garth's responses.

### Care creates pressure, not misery

FOOD, FUN, and POWER fall over time. GAS rises. That gives the player reasons to return.

The game should not permanently trap a save in an unwinnable or permanently unhappy state.

### The limitations are part of the style

Background tiles should repeat intentionally. Animation should usually use two frames. Movement should be readable rather than smooth for its own sake. Hardware compromises should preserve the composition and joke instead of chasing a pixel-perfect mockup that does not fit.

## Platform and audience

- Primary platform: original Game Boy-compatible ROM built with GBDK 2020.
- Display target: 160×144, four-shade monochrome presentation.
- Input: D-pad, A, B, START, SELECT where appropriate.
- Save: battery-backed SRAM.
- Audience: players who like virtual pets, odd retro games, pixel art, and short score-based minigames.

## Core loop

1. Visit Garth on the home screen.
2. Read FOOD, FUN, POWER, GAS, and mood.
3. Choose a minigame, TALK, or joke.
4. Complete a short interaction.
5. Receive a result, score, and stat changes.
6. Return home and see Garth respond.
7. Come back later as his needs change over time.

## Home screen

The redesigned home screen is a detailed industrial cabin.

### Layout

- Top-left: large GARTH sign/logo.
- Top-right: four horizontal stat bars.
- Center: Garth inside the cabin.
- Bottom-left/center: four minigame icons and a joke icon.
- Bottom-right: TALK icon and mood indicator.

### Garth

Garth uses mood-specific animation, ideally simple two-frame loops.

His pose should communicate his state before the player reads the mood icon. An urgent need may also affect idle behavior, but the first implementation should keep the state set small enough to fit and test reliably.

### Navigation

The D-pad moves between the bottom actions. A selects. The final behavior of B, START, and a selectable mood icon remains open.

The home screen must restore its full art, palette, sprites, music, and input state every time the player returns from another mode.

## Persistent stats

| Stat | Healthy direction | Time behavior | Primary action |
|---|---|---|---|
| FOOD | High | Decreases | Food Is Good |
| FUN | High | Decreases | Simon Says; possibly jokes |
| POWER | High | Decreases | Catch Some Zs |
| GAS | Low | Increases | Pass the Gas |

### FOOD

Represents hunger/fullness. Food Is Good restores FOOD. Eating also creates GAS, either as an immediate increase or a temporary faster generation rate.

### FUN

Represents stimulation/happiness. Simon Says is the primary source. A joke may add a very small amount, but it should not replace the full minigame.

### POWER

Represents rest/energy. Catch Some Zs is the primary source.

### GAS

GAS is an inverse-pressure stat.

- It slowly increases over time.
- Eating increases it.
- Pass the Gas reduces it.
- High GAS should hurt Garth's mood.

Open values:

- starting GAS;
- maximum;
- base tick rate;
- food effect;
- warning/danger thresholds;
- whether high GAS changes other stats or progression.

## Mood

The legacy game uses the lowest FOOD/FUN/POWER value to select DYING, SAD, OKAY, or HAPPY.

The redesign should include GAS as an inverted need. A useful model is to calculate comfort for all four needs and let the worst one strongly influence mood.

The final formula remains open.

Important correction needed: the legacy system can permanently lower a stat maximum to 10, while HAPPY requires the lowest stat to reach 22. That can make HAPPY mathematically impossible. The redesign needs a recovery mechanic, scaled mood thresholds, a higher maximum floor, or removal of permanent cap damage.

## Minigame structure

Every minigame follows the same broad sequence:

```text
TITLE ANIMATION
      ↓
GAMEPLAY
      ↓
RESULTS
      ↓
HOME
```

### Title

- Short, visually distinct animation.
- May use a short stinger.
- Skip behavior remains open.

### Gameplay

- The main action occupies the largest possible playfield.
- A black footer identifies controls and/or score.
- The player must have a consistent way to exit.

### Results

- Minigame name in the header.
- Performance result in the center.
- Stat changes below.
- One predictable return control.

## Food Is Good

### Purpose

Primary FOOD activity. Also creates GAS.

### Title

`FOOD IS GOOD` flashes between light-on-dark and dark-on-light frames.

### Gameplay

Four food slots cycle through pieces from ten foods:

- donut;
- pizza;
- ice cream;
- burger;
- cupcake;
- drink;
- taco;
- corndog;
- chicken;
- fries.

The player presses A to stop each slot. Later slots cycle faster. The selected food name scrolls across the header.

The accepted legacy slot delays are:

```text
39 / 33 / 27 / 21 frames
```

### Results and current rewards

| Outcome | Pattern | FOOD | FUN | POWER |
|---|---|---:|---:|---:|
| Sloppy | No qualifying match | +3 | +0 | +0 |
| Unique | Two and two | +6 | +1 | +0 |
| Tasty | Three and one | +10 | +2 | +1 |
| Perfect | All four match | +15 | +3 | +2 |

The game generates names for mixed foods. Sloppy is treated as a bad result; Unique, Tasty, and Perfect use a good result.

### Open decisions

- Immediate GAS bump versus temporary faster GAS generation.
- Whether different foods have different GAS values.
- Final active-game exit control.

## Simon Says

### Purpose

Primary FUN activity.

### Title

The title assembles across four frames:

```text
SI
MON
SAYS
SIMON SAYS
```

### Gameplay

Six large controls appear in the center:

- Up;
- Down;
- Left;
- Right;
- A;
- B.

One lights up. The player presses the matching physical input.

Seven circles across the top show progress:

- dark/filled: miss;
- white/filled: correct;
- outline: not played.

The legacy game uses five independent prompts with A/B/Up/Down. The redesign expands that to seven and adds Left/Right.

### Open decisions

- Independent prompts or a growing memory sequence.
- Response time.
- Reward thresholds for seven rounds.
- Incorrect-input feedback.
- Universal exit because B is already gameplay.

## Catch Some Zs

### Purpose

Primary POWER activity.

### Title

The screen begins black. Scattered letters appear frame by frame until `CATCH SOME ZS` is complete.

### Gameplay

The player moves a catcher left and right along the bottom of a space scene.

- Small Z: +1.
- Large Z: +3.
- Exclamation point: -2, never below zero.

The redesigned catcher is two tiles wide. Z and exclamation objects are four tiles each, probably 2×2.

The footer shows movement on the left and score on the right.

### Current reward thresholds

| Score | POWER | FUN |
|---:|---:|---:|
| 12+ | +12 | +2 |
| 8–11 | +8 | +1 |
| 4–7 | +5 | +0 |
| 1–3 | +2 | +0 |
| 0 | +1 | +0 |

### Open decisions

- Retune after larger hitboxes.
- Background tiles versus metasprites for falling objects.
- Universal exit/footer layout.

## Pass the Gas

### Purpose

Reduce GAS.

### Title

```text
BLACK
OOPSIE POOPSIE
BLACK
WHOOPS POOPS
BLACK
PASS THE GAS
```

### Gameplay presentation

- Industrial pressure-control room.
- Large bubbling tank in the center.
- Long BURP and FART meters across the top.
- A: BURP.
- B: FART.
- Steam clouds appear during releases.
- Tank bubbles use a two-frame animation.

### Candidate mechanics

#### Alternating pressure release

A and B release their matching meter. Overusing one makes the other harder to control. Bring both under a safe threshold before time expires.

#### Balance window

A and B route pressure between burp and fart paths while total pressure slowly falls. Keep both inside safe ranges.

#### Prompted valves

React to the highlighted release. Easy to explain, but risks feeling too similar to Simon Says.

#### Pure mash race

Rapidly alternate A and B to empty both meters. Very readable, but potentially shallow and physically tiring.

The first prototypes should test alternating pressure release and the balance window.

### Results

The current mockup uses:

```text
CRISIS AVERTED
NICE FART
```

The secondary compliment should come from a randomized pool based on performance.

Open decisions:

- exact rules;
- score/success/failure states;
- GAS reduction;
- secondary FUN/POWER effects;
- whether `CRISIS AVERTED` appears after a poor performance.

## TALK

TALK lets Garth choose a dialogue line and speak through Lang808.

The existing fix allows normal care time to continue while TALK is open. Minigames and the main menu currently pause decay.

The redesign needs GAS-aware dialogue and must keep speech playback independent from face-animation frame changes.

## Jokes

The joke button produces a random Garth joke for flavor.

Recommended first implementation:

- do not repeat the immediately previous joke;
- use the normal speech system;
- play a short comic accent/sting if room allows;
- add +1 FUN;
- do not count toward stat-cap progression.

The reward and progression behavior are not yet final.

## Progression

Positive stat maximums begin at 30 and unlock in ten-point steps to 100.

Current production thresholds:

| New maximum | Activity | Days | Care streak |
|---:|---:|---:|---:|
| 40 | 3 | 4 | 2 |
| 50 | 6 | 8 | 4 |
| 60 | 9 | 12 | 6 |
| 70 | 12 | 16 | 8 |
| 80 | 15 | 20 | 10 |
| 90 | 18 | 24 | 12 |
| 100 | 21 | 28 | 14 |

Unlocking a maximum does not fill the current stat.

GAS does not currently use this progression model.

## Saving

The game stores pet state, progression, counters, scores, and TALK activity in SRAM.

Adding GAS changes the data structure. The redesign must either migrate version 1 saves or deliberately require a new game. It must never accidentally interpret old bytes as the new GAS state.

## Dialogue and voice

The planned dialogue rewrite targets roughly 120–150 strong lines instead of the current larger pool.

Goals:

- maintain Garth's dry, strange, specific voice;
- reduce generic/repetitive lines;
- keep display width within the UI limit;
- add low-stat and GAS-aware lines;
- keep jokes separate if it helps organization/banking;
- test speech timing and audio cleanup on real hardware.

## Music and sound

The existing build includes:

- menu music;
- DYING/SAD/OKAY/HAPPY mood music;
- three minigame songs;
- good/bad result music;
- menu and character SFX;
- Lang808 speech.

The redesign needs:

- new home behavior/arrangement;
- Pass the Gas music;
- burp/fart/pressure/valve sounds;
- possible joke sting;
- title/result accents where memory allows.

## Controls

### Proposed global rules

- D-pad: movement/navigation.
- A: select/primary action.
- B: back/secondary action when not used by gameplay.
- START: recommended universal active-minigame exit.

START is recommended because B is a valid Simon input and the FART input in Pass the Gas. This still needs final approval and testing for discoverability.

## Content scope

### Required for first release

- New home screen.
- Four stats and stable mood behavior.
- Four complete minigames.
- TALK and jokes.
- Music/SFX/speech.
- SRAM save/load.
- Progression.
- Real-hardware testing.
- Cartridge label, box, and manual.

### Not currently committed

- Online features.
- Large story campaign.
- More than four minigames.
- CGB-only visual mode.
- A new face-animation editor; one already exists.

## Major open questions

- What is the final Pass the Gas mechanic?
- How does GAS affect mood and other stats?
- How are version 1 saves handled?
- Is Simon independent matching or sequence memory?
- Is START the universal gameplay exit?
- Do jokes grant FUN or progression credit?
- Which mood animations are required for release?
- How much of each mockup survives the tile/sprite budget?

## Related notes

- [[Garth's Game DMG]]
- [[Garth's Game I - Technical Design]]
- [[Garth's Game I - Production Roadmap]]

