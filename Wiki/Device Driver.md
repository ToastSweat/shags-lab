---
type: wiki
publish: true
aliases:
  - driver
---

# Device Driver

A **device driver** is software that helps an operating system communicate with hardware. The hardware might be a keyboard, printer, graphics card, or a device temporarily connected in update mode. Many ordinary devices work with drivers already supplied by the operating system.

A driver isn't the same thing as [[Wiki/firmware|firmware]]. The driver runs on the computer; firmware runs on the device itself. Changing what a keyboard does internally is usually firmware work, even if the setup also involves a driver.

That distinction is the joke behind [[2026-09-16 - I Made A Custom Driver|the C100 update's title]]. The main project built [[Wiki/QMK|QMK]] firmware, but getting the [[Wiki/DFU|DFU]] update interface working also required Windows driver setup.

Only change the driver for the exact interface identified in the [[Keychron C100 Unicode Firmware Guide]]. Replacing an unrelated device's driver isn't a harmless troubleshooting experiment.
