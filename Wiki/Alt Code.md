---
type: wiki
publish: true
---

# Alt Code

An **Alt code** is a Windows way of entering a character by holding Alt while typing a numeric sequence, usually on the numeric keypad. It's handy for occasional symbols, but remembering the right sequence gets old quickly.

Traditional decimal Alt codes and Windows' hexadecimal Unicode input aren't exactly the same mechanism. The latter needs a Windows setting and supports code-point-based entry. Keyboard layout, application behavior, and input mode can affect the result, so a symbol shortcut that works in one setup isn't automatically universal.

The [[Keychron C100 Unicode Firmware Guide|C100 project]] uses [[Wiki/QMK|QMK]]'s Windows [[Wiki/Unicode|Unicode]] input support. Its dedicated keys generate the needed input sequence, so the person at the keyboard doesn't have to remember the code each time.

That behavior lives in the keyboard's [[Wiki/firmware|firmware]], not a new Windows [[Wiki/Device Driver|device driver]]. The guide records the particular prerequisite used for this build.
