---
type: wiki
publish: true
---

# ARM

**ARM** is a family of processor designs used in everything from phones to tiny controllers inside gadgets. Software has to be built for the processor that will actually run it, not just the computer doing the building.

That matters in the [[Keychron C100 Unicode Firmware Guide|C100 keyboard project]]. Windows and [[Wiki/WSL|WSL]] were the workshop, but the keyboard's controller was the destination. An ARM compiler turned the [[Wiki/QMK|QMK]] source into [[Wiki/firmware|firmware]] that the keyboard could understand. Building software for a different kind of processor is called *cross-compiling*.

ARM alone doesn't identify a compatible firmware file. The exact keyboard, controller, memory layout, and build target still matter. A file meant for some other ARM device isn't interchangeable just because the processor family matches.
