---
type: wiki
publish: true
---

# QMK

**QMK** is an [[Wiki/open-source|open-source]] keyboard [[Wiki/firmware|firmware]] ecosystem. It lets a keyboard's behavior be defined in code: key layouts, layers, shortcuts, lighting, and more. It's the software running on the board, not just a desktop configuration app.

The [[Keychron C100 Custom Firmware Home|C100 project]] uses Keychron's QMK fork to turn a large macro pad into a dedicated symbol keyboard. Instead of relying on the launcher's limited [[Wiki/macros|macro]] slots, the keymap defines [[Wiki/Unicode|Unicode]] behavior directly.

The workflow is to edit the source, compile it for the exact board, and flash the resulting firmware. In this project, [[Wiki/WSL|WSL]] supplied the build environment and [[Wiki/DFU|DFU]] supplied the update route.

QMK support isn't universal across every keyboard model or repository version. The [[Keychron C100 Unicode Firmware Guide]] records the specific working target and recovery process.
