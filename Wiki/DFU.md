---
type: wiki
publish: true
---

# DFU

**DFU** stands for *Device Firmware Upgrade*. It's a mode that lets a device accept replacement [[Wiki/firmware|firmware]] instead of doing its normal job. A keyboard in DFU mode may stop acting like a keyboard until the update is finished and it restarts.

For the [[Keychron C100 Unicode Firmware Guide|C100 symbol-pad project]], the documented recovery method is to unplug the board, hold its physical top-left key, and reconnect it. The working flashing route used `dfu-util` inside [[Wiki/WSL|WSL]], with the USB device passed through from Windows.

This isn't a generic recipe for every keyboard. Follow the exact board's guide, verify the device identity, and use the matching firmware. Changing the Windows driver for the update interface is also different from replacing the normal keyboard driver. Those distinctions matter when a recovery step can otherwise target the wrong device.
