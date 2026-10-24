---
type: wiki
publish: true
---

# WSL

**WSL** stands for *Windows Subsystem for Linux*. It lets you run a Linux environment on a Windows computer, which is useful when development tools expect Linux commands and packages. It doesn't make Windows and Linux shells interchangeable.

The [[Keychron C100 Unicode Firmware Guide|C100 firmware project]] uses Ubuntu under WSL2 to build [[Wiki/QMK|QMK]] with an [[Wiki/ARM|ARM]] compiler. The working flashing setup also ran `dfu-util` there, after passing the keyboard's [[Wiki/DFU|DFU]] USB device through from Windows.

That boundary matters. A Linux tool inside WSL doesn't automatically own every USB device attached to the Windows host. Some setup steps run on the Windows side, while others belong in the Linux shell.

The project guide labels those steps explicitly. Follow those labels rather than trying each command in [[Wiki/PowerShell|PowerShell]], [[Wiki/Command Prompt|Command Prompt]], and Linux until something stops complaining.
