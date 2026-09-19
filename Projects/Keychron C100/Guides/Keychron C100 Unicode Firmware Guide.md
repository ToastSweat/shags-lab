## Complete rebuild / recovery notes

**Original build date:** 2026-09-16  
**Keyboard:** Keychron C100 8K, 10×10 physical key grid  
**Host used:** Windows 11 + WSL2 / Ubuntu  
**Firmware base:** Keychron's QMK fork, `2025q3` branch  
**QMK target:** `keychron/c100_8k`  
**Flash interface:** AT32 DFU, VID:PID `2e3c:df11`  
**Flash tool that actually worked:** `dfu-util` inside WSL, with the DFU USB device passed through by `usbipd-win`

> [!IMPORTANT]
> This is **custom keyboard firmware**, not a Windows keyboard driver.
> The only Windows driver work in this process is giving the C100's **DFU bootloader**
> a WinUSB driver so WSL / `dfu-util` can talk to it.

This note is deliberately self-contained. The goal is that Future Me can rebuild the entire thing even if the old working directory, ZIP file, or ChatGPT conversation is gone.

---

# 1. What the finished keyboard does

Every one of the C100's 100 physical keys sends a unique Unicode symbol.

```text
© ® ™ ℠ ℗ § ¶ № † ‡
¢ £ € ¥ ₹ ₩ ₽ ₺ ₴ ₿
± × ÷ ≠ ≈ ≤ ≥ ∞ √ ∫
∑ ∏ ∂ ∆ π µ Ω λ α β
° ‰ ¹ ² ³ ⁰ ½ ¼ ¾ ⌀
… • · – — ‐ “ ” ‘ ’
← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙
⇐ ⇒ ⇑ ⇓ ↩ ↪ ↺ ↻ ⤴ ⤵
✓ ✔ ✕ ✖ ☑ ☐ ☒ ★ ☆ ※
♠ ♥ ♦ ♣ ♪ ♫ ☺ ☹ ♂ ♀
```

There are **no macro slots involved**. QMK's Unicode support is compiled directly into the firmware.

The full keymap uses calls such as:

```c
UC(0x00A9) // ©
UC(0x2122) // ™
UC(0x2192) // →
UC(0x2605) // ★
```

---

# 2. The DFU / recovery method — do not change this

The normal, tested recovery method is:

1. Unplug the C100.
2. Hold the **physical top-left key**.
3. Plug the USB cable back in while continuing to hold that key.
4. Release it after a couple of seconds.
5. The C100 enters its AT32 DFU bootloader.

When it is in DFU mode, the normal keyboard lighting may remain off. That is fine.

The DFU device appears as:

```text
DFU in FS Mode
VID:PID 2E3C:DF11
```

In WSL, `lsusb` showed:

```text
2e3c:df11 Artery-Tech DFU in FS Mode
```

This top-left-key bootloader method was tested **after custom firmware was already installed**, so it is not dependent on the 100-key application keymap.

**Do not sacrifice a normal key for DFU. Do not add a DFU combo. The hardware/startup method already works.**

---

# 3. Windows Unicode prerequisite

QMK's Windows Unicode mode uses Windows' HexNumpad input mechanism.

Open **Command Prompt or PowerShell on Windows** and run:

```cmd
reg add "HKCU\Control Panel\Input Method" /v EnableHexNumpad /t REG_SZ /d 1 /f
```

Then sign out and back in, or reboot Windows.

This only needs to be done once per Windows installation/user profile.

---

# 4. Install / prepare WSL2

Install Ubuntu under WSL2 if it is not already available.

Open the Ubuntu / WSL terminal and create a working directory:

```bash
mkdir -p ~/c100-dev
cd ~/c100-dev
```

Install QMK's setup tooling:

```bash
curl -fsSL https://install.qmk.fm | sh
```

On the machine used for the original build, the ARM compiler was still missing afterward, so explicitly install the pieces we actually needed:

```bash
sudo apt update
sudo apt install gcc-arm-none-eabi binutils-arm-none-eabi libnewlib-arm-none-eabi
```

Verify:

```bash
arm-none-eabi-gcc --version
```

Also install `dfu-util`:

```bash
sudo apt install dfu-util
```

That package also supplied the `dfu-suffix` utility required near the end of the QMK build.

Optional, if needed for moving ZIPs around:

```bash
sudo apt install unzip
```

---

# 5. Clone Keychron's QMK fork

From:

```bash
cd ~/c100-dev
```

clone the Keychron repository and the branch that contained the working C100 8K target:

```bash
git clone --branch 2025q3 --recurse-submodules \
  https://github.com/Keychron/qmk_firmware.git
```

The final directory should be:

```text
~/c100-dev/qmk_firmware
```

---

# 6. Create the custom userspace project

Create this directory tree beside `qmk_firmware`:

```text
~/c100-dev/
├── qmk_firmware/
└── c100-symbol-pad/
    ├── Makefile
    └── keyboards/
        └── keychron/
            └── c100_8k/
                └── keymaps/
                    ├── unicode_test/
                    │   ├── config.h
                    │   ├── keymap.c
                    │   └── rules.mk
                    └── symbol_pad/
                        ├── config.h
                        ├── keymap.c
                        └── rules.mk
```

Create it with:

```bash
cd ~/c100-dev
mkdir -p c100-symbol-pad/keyboards/keychron/c100_8k/keymaps/unicode_test
mkdir -p c100-symbol-pad/keyboards/keychron/c100_8k/keymaps/symbol_pad
cd c100-symbol-pad
```

---

# 7. Project Makefile

Create:

```text
~/c100-dev/c100-symbol-pad/Makefile
```

with:

```makefile
QMK_HOME ?= ../qmk_firmware
USERSPACE_PATH ?= $(CURDIR)

.PHONY: test full clean

define run_qmk
	@set -eu; \
	tmp=$$(mktemp -d); \
	ln -s "$(USERSPACE_PATH)" "$$tmp/userspace"; \
	trap 'rm -f "$$tmp/userspace"; rmdir "$$tmp"' EXIT; \
	$(MAKE) -C "$(QMK_HOME)" keychron/c100_8k:$(1) QMK_USERSPACE="$$tmp/userspace"
endef

test:
	$(call run_qmk,unicode_test)

full:
	$(call run_qmk,symbol_pad)

clean:
	$(MAKE) -C "$(QMK_HOME)" clean

```

This is the little wrapper that allowed the custom keymaps to live outside the cloned QMK repository while still being discovered as QMK userspace.

---

# 8. Shared QMK configuration

Both `unicode_test` and `symbol_pad` use the same `config.h` and `rules.mk`.

## `config.h`

Put this in **both**:

```text
keyboards/keychron/c100_8k/keymaps/unicode_test/config.h
keyboards/keychron/c100_8k/keymaps/symbol_pad/config.h
```

```c
#pragma once

// Windows-only build. QMK emits Windows HexNumpad Unicode sequences.
#define UNICODE_SELECTED_MODES UNICODE_MODE_WINDOWS
#define UNICODE_CYCLE_PERSIST false

```

## `rules.mk`

Put this in **both**:

```text
keyboards/keychron/c100_8k/keymaps/unicode_test/rules.mk
keyboards/keychron/c100_8k/keymaps/symbol_pad/rules.mk
```

```makefile
UNICODE_COMMON = yes
UNICODE_ENABLE = yes
VIA_ENABLE = no

# Keychron's C100 source produced an unused-variable warning in an RGB effect
# during this build. Do not promote that warning to a build-stopping error.
CFLAGS += -Wno-error=unused-but-set-variable

```

`VIA_ENABLE = no` is intentional for this dedicated symbol-pad firmware. Keychron Launcher / VIA functionality is not part of this build.

---

# 9. Build a safe one-key test first

Do not make the first ever flash the 100-key version.

Create:

```text
keyboards/keychron/c100_8k/keymaps/unicode_test/keymap.c
```

with:

```c
#include QMK_KEYBOARD_H

void keyboard_post_init_user(void) {
    set_unicode_input_mode(UNICODE_MODE_WINDOWS);
}

// Proof-of-concept:
// - top-left key: ©
// - top-right key: QK_BOOT
// - every other key: disabled
//
// IMPORTANT:
// The C100's normal hardware DFU entry still works independently:
// unplug, hold the PHYSICAL top-left key, reconnect USB.
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_tkl_ansi(
        UC(0x00A9), KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, QK_BOOT,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO,
        KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO, KC_NO
    )
};

```

This firmware intentionally makes:

- physical top-left → `©`
- physical top-right → `QK_BOOT`
- other 98 keys → disabled

The `QK_BOOT` mapping is only a convenience in the **test firmware**. It is not needed for recovery and is not present in the final 100-symbol firmware.

Build it:

```bash
cd ~/c100-dev/c100-symbol-pad
make test QMK_HOME=../qmk_firmware
```

A successful build ends with lines similar to:

```text
Creating binary load file for flashing: .build/keychron_c100_8k_unicode_test.bin [OK]
Creating load file for flashing: .build/keychron_c100_8k_unicode_test.hex [OK]
```

The binary is:

```text
~/c100-dev/qmk_firmware/.build/keychron_c100_8k_unicode_test.bin
```

---

# 10. Full 100-key `keymap.c`

Create:

```text
keyboards/keychron/c100_8k/keymaps/symbol_pad/keymap.c
```

with:

```c
#include QMK_KEYBOARD_H

void keyboard_post_init_user(void) {
    set_unicode_input_mode(UNICODE_MODE_WINDOWS);
}

// 10x10 symbol pad. Physical order is top-left to bottom-right.
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_tkl_ansi(
        UC(0x00A9), UC(0x00AE), UC(0x2122), UC(0x2120), UC(0x2117), UC(0x00A7), UC(0x00B6), UC(0x2116), UC(0x2020), UC(0x2021),
        UC(0x00A2), UC(0x00A3), UC(0x20AC), UC(0x00A5), UC(0x20B9), UC(0x20A9), UC(0x20BD), UC(0x20BA), UC(0x20B4), UC(0x20BF),
        UC(0x00B1), UC(0x00D7), UC(0x00F7), UC(0x2260), UC(0x2248), UC(0x2264), UC(0x2265), UC(0x221E), UC(0x221A), UC(0x222B),
        UC(0x2211), UC(0x220F), UC(0x2202), UC(0x2206), UC(0x03C0), UC(0x00B5), UC(0x03A9), UC(0x03BB), UC(0x03B1), UC(0x03B2),
        UC(0x00B0), UC(0x2030), UC(0x00B9), UC(0x00B2), UC(0x00B3), UC(0x2070), UC(0x00BD), UC(0x00BC), UC(0x00BE), UC(0x2300),
        UC(0x2026), UC(0x2022), UC(0x00B7), UC(0x2013), UC(0x2014), UC(0x2010), UC(0x201C), UC(0x201D), UC(0x2018), UC(0x2019),
        UC(0x2190), UC(0x2191), UC(0x2192), UC(0x2193), UC(0x2194), UC(0x2195), UC(0x2196), UC(0x2197), UC(0x2198), UC(0x2199),
        UC(0x21D0), UC(0x21D2), UC(0x21D1), UC(0x21D3), UC(0x21A9), UC(0x21AA), UC(0x21BA), UC(0x21BB), UC(0x2934), UC(0x2935),
        UC(0x2713), UC(0x2714), UC(0x2715), UC(0x2716), UC(0x2611), UC(0x2610), UC(0x2612), UC(0x2605), UC(0x2606), UC(0x203B),
        UC(0x2660), UC(0x2665), UC(0x2666), UC(0x2663), UC(0x266A), UC(0x266B), UC(0x263A), UC(0x2639), UC(0x2642), UC(0x2640)
    )
};

```

Build it later with:

```bash
cd ~/c100-dev/c100-symbol-pad
make full QMK_HOME=../qmk_firmware
```

A successful build produced:

```text
Linking: .build/keychron_c100_8k_symbol_pad.elf [OK]
Creating binary load file for flashing: .build/keychron_c100_8k_symbol_pad.bin [OK]
Creating load file for flashing: .build/keychron_c100_8k_symbol_pad.hex [OK]
```

The binary is:

```text
~/c100-dev/qmk_firmware/.build/keychron_c100_8k_symbol_pad.bin
```

The original successful binary was 59,584 bytes. Do not treat that size as a permanent requirement; it is just a useful historical sanity check.

---

# 11. If `make` complains that files are from the future

When the project was copied from Windows into WSL, `make` warned that the Makefile and other files had modification times thousands of seconds in the future.

Normalize the timestamps:

```bash
cd ~/c100-dev/c100-symbol-pad
find . -type f -exec touch {} +
```

Then build again.

---

# 12. If `arm-none-eabi-gcc` is missing

Symptom:

```text
/bin/sh: 1: arm-none-eabi-gcc: not found
```

Fix:

```bash
sudo apt update
sudo apt install gcc-arm-none-eabi binutils-arm-none-eabi libnewlib-arm-none-eabi
```

Then verify:

```bash
arm-none-eabi-gcc --version
```

and rebuild.

---

# 13. If `dfu-suffix` is missing during the build

Symptom:

```text
dfu-suffix: not found
```

The compiler may already have produced the `.bin`, but QMK still treats the build as failed.

Fix:

```bash
sudo apt install dfu-util
```

Then:

```bash
dfu-suffix --version
```

and rebuild.

---

# 14. Windows DFU driver — Zadig

The C100 successfully entered DFU but originally appeared as:

```text
USB device connected (NO DRIVER): DFU in FS Mode (2E3C:DF11:0200)
```

The fix was **Zadig**.

Get Zadig from:

```text
https://zadig.akeo.ie/
```

It is a standalone Windows executable.

Run Zadig as Administrator while the C100 is in DFU mode.

1. `Options` → `List All Devices`
2. Select **DFU in FS Mode**
3. **VERIFY THE USB ID IS `2E3C:DF11`**
4. Select **WinUSB**
5. Install / Replace Driver

Afterward, the device showed:

```text
USB device connected (WinUSB): (Undefined Vendor) DFU in FS Mode (2E3C:DF11:0200)
```

> [!CAUTION]
> Only change the driver for the **DFU in FS Mode** device with VID:PID **2E3C:DF11**.
> Do not replace the driver for the C100's normal keyboard interface or some unrelated USB device.

QMK Toolbox was useful for seeing the device/driver state, but its **Flash** button remained unavailable for this AT32 DFU workflow. The actual successful flashing path was `dfu-util` inside WSL.

---

# 15. Install Windows USB passthrough for WSL

`dfu-util` runs inside WSL, but the DFU USB device initially belongs to Windows. Use `usbipd-win` to pass it through.

In **Windows PowerShell as Administrator**:

```powershell
winget install --interactive --exact dorssel.usbipd-win
```

If just installed, reopen PowerShell afterward.

Important: `usbipd` commands below are **Windows PowerShell commands**, not WSL commands.

If you accidentally run `usbipd list` inside WSL and see warnings about missing `linux-tools-...-WSL2`, you are on the wrong side. Do **not** install those packages for this procedure. Switch back to Windows PowerShell.

---

# 16. Enter DFU and attach it to WSL

First put the keyboard in DFU mode:

1. Unplug C100.
2. Hold physical top-left key.
3. Plug C100 in.
4. Release after a couple seconds.

Then in **Windows PowerShell as Administrator**:

```powershell
usbipd list
```

Find:

```text
2e3c:df11  DFU in FS Mode
```

The original machine showed BUSID:

```text
1-1
```

**Do not assume it will always be `1-1`. Use whatever BUSID `usbipd list` reports.**

The first time, bind/share it:

```powershell
usbipd bind --busid 1-1
```

Then attach it to WSL:

```powershell
usbipd attach --wsl --busid 1-1
```

Successful attach output looked like:

```text
usbipd: info: Using WSL distribution 'Ubuntu' to attach; the device will be available in all WSL 2 distributions.
usbipd: info: Detected networking mode 'nat'.
usbipd: info: Using IP address ... to reach the host.
```

The bind generally persists, so on later flashes only `attach` may be necessary. If `attach` says the device is not shared/bound, run `bind` again.

---

# 17. Verify the device inside WSL

Back in **WSL**:

```bash
lsusb
```

Expected:

```text
2e3c:df11 Artery-Tech DFU in FS Mode
```

Then:

```bash
sudo dfu-util -l
```

Using `sudo` matters. Without it, the original attempt returned:

```text
LIBUSB_ERROR_ACCESS
```

The correct enumeration looked like:

```text
Found DFU: [2e3c:df11] ... alt=1, name="@Option byte   /0x1FFFF800/01*512g", serial="AT32"
Found DFU: [2e3c:df11] ... alt=0, name="@Internal Flash   /0x08000000/128*002Kg", serial="AT32"
```

The important target is:

```text
alt=0
@Internal Flash
0x08000000
```

Do **not** flash the option-byte target (`alt=1`).

---

# 18. Flash the safe one-key test

Only after the one-key test firmware successfully builds and DFU enumeration looks correct:

```bash
sudo dfu-util \
  -a 0 \
  -d 2e3c:df11 \
  -s 0x08000000:leave \
  -D ~/c100-dev/qmk_firmware/.build/keychron_c100_8k_unicode_test.bin
```

The successful output looked like:

```text
Opening DFU capable USB device...
Device ID 2e3c:df11
Setting Alternate Interface #0 ...
DfuSe interface name: "Internal Flash   "
Downloading element to address = 0x08000000
Erase    done.
Download done.
File downloaded successfully
Submitting leave request...
Transitioning to dfuMANIFEST state
```

The keyboard should reboot out of DFU.

Open Notepad and press physical top-left.

Expected:

```text
©
```

The original proof-of-concept produced:

```text
©©©©©©©©©©©©
```

because, naturally, the button had to be pressed a bunch of times.

If `©` works, QMK Unicode + Windows HexNumpad is working.

---

# 19. Build and flash the full 100-key version

Build:

```bash
cd ~/c100-dev/c100-symbol-pad
make full QMK_HOME=../qmk_firmware
```

Confirm the binary exists:

```bash
ls -lh ~/c100-dev/qmk_firmware/.build/keychron_c100_8k_symbol_pad.bin
```

Enter DFU using the **normal physical top-left-key-on-connect method** again.

In **Windows Admin PowerShell**:

```powershell
usbipd list
```

Use the current BUSID and attach:

```powershell
usbipd attach --wsl --busid 1-1
```

Back in WSL:

```bash
lsusb
sudo dfu-util -l
```

Confirm `alt=0` is still `@Internal Flash /0x08000000...`.

Then flash:

```bash
sudo dfu-util \
  -a 0 \
  -d 2e3c:df11 \
  -s 0x08000000:leave \
  -D ~/c100-dev/qmk_firmware/.build/keychron_c100_8k_symbol_pad.bin
```

Wait for:

```text
Erase done.
Download done.
File downloaded successfully
Submitting leave request...
Transitioning to dfuMANIFEST state
```

---

# 20. Final validation

Open Notepad and press every key from top-left to bottom-right.

The exact successful output was:

```text
©®™℠℗§¶№†‡
¢£€¥₹₩₽₺₴₿
±×÷≠≈≤≥∞√∫
∑∏∂∆πµΩλαβ
°‰¹²³⁰½¼¾⌀
…•·–—‐“”‘’
←↑→↓↔↕↖↗↘↙
⇐⇒⇑⇓↩↪↺↻⤴⤵
✓✔✕✖☑☐☒★☆※
♠♥♦♣♪♫☺☹♂♀
```

If those ten rows appear exactly, the firmware is working.

---

# 21. Quick rebuild / reflash cheat sheet

Assuming the machine is already configured and the source tree still exists:

## Build

```bash
cd ~/c100-dev/c100-symbol-pad
make full QMK_HOME=../qmk_firmware
```

## Enter DFU

```text
Unplug → hold PHYSICAL top-left key → reconnect USB → release
```

## Windows Admin PowerShell

```powershell
usbipd list
usbipd attach --wsl --busid <CURRENT-BUSID>
```

If required:

```powershell
usbipd bind --busid <CURRENT-BUSID>
usbipd attach --wsl --busid <CURRENT-BUSID>
```

## WSL

```bash
lsusb
sudo dfu-util -l
```

Verify:

```text
2e3c:df11
alt=0
@Internal Flash
0x08000000
```

Then:

```bash
sudo dfu-util \
  -a 0 \
  -d 2e3c:df11 \
  -s 0x08000000:leave \
  -D ~/c100-dev/qmk_firmware/.build/keychron_c100_8k_symbol_pad.bin
```

---

# 22. Troubleshooting history

| Problem | What fixed it |
|---|---|
| `arm-none-eabi-gcc: not found` | Install `gcc-arm-none-eabi binutils-arm-none-eabi libnewlib-arm-none-eabi` |
| `dfu-suffix: not found` | Install `dfu-util` |
| Files reported modification times in the future | `find . -type f -exec touch {} +` |
| C100 enters DFU but Windows/QMK Toolbox says `NO DRIVER` | Zadig → `DFU in FS Mode` **2E3C:DF11** → WinUSB |
| QMK Toolbox sees AT32 DFU but Flash is disabled | Use `dfu-util` through WSL instead |
| Running `usbipd` in WSL gives missing WSL kernel tools warning | Run `usbipd` from **Windows PowerShell**, not WSL |
| WSL `lsusb` cannot see C100 DFU | `usbipd bind` / `usbipd attach --wsl` from Windows |
| `dfu-util -l` gives `LIBUSB_ERROR_ACCESS` | Run it as `sudo dfu-util -l` |
| Unsure which DFU target to flash | Use **alt 0 Internal Flash at `0x08000000`**, never alt 1 Option byte |
| Need to recover after custom firmware | Unplug → hold physical top-left → reconnect; confirmed working |

---

# 23. Things deliberately NOT implemented

These were considered and rejected:

- **16 Keychron Launcher macros:** not enough for 100 symbols.
- **100 Alt-code macros:** Launcher only exposes 16 macro slots.
- **Direct Unicode keycodes in Launcher JSON:** the stock C100 firmware did not have the necessary QMK Unicode feature enabled, so the experiment did not work.
- **AutoHotkey:** would work, but would make the keyboard dependent on a Windows-side script.
- **Dedicated DFU key in the final map:** unnecessary.
- **Two-key DFU combo:** unnecessary.
- **Changing the default/top-left DFU recovery behavior:** explicitly not wanted.
- **Numpad block:** abandoned so all 100 physical keys could be unique symbols.

---

# 24. Why this works

The stock Keychron Launcher is only a configuration layer over whatever functionality was compiled into the keyboard firmware.

The custom firmware changes the firmware itself.

QMK's Unicode feature converts a key such as:

```c
UC(0x2605)
```

into the Windows Unicode input sequence required to produce:

```text
★
```

That means all 100 symbols can exist as real firmware key behaviors without consuming Keychron Launcher macro slots.

---

# 25. Backup checklist for Future Me

Keep copies of:

- this Markdown note
- the complete `c100-symbol-pad` source directory
- the exact working `keychron_c100_8k_symbol_pad.bin`
- the one-key `keychron_c100_8k_unicode_test.bin`
- the 10×10 symbol/keycap artwork
- if convenient, a copy or commit reference for the Keychron `qmk_firmware` source used to build it

The Git branch used on 2026-09-16 was:

```text
Keychron/qmk_firmware
branch: 2025q3
target: keychron/c100_8k
```

Twenty years from now that branch, dependencies, URLs, or toolchain may no longer exist in the same form. Keeping the source tree and known-good `.bin` locally is much safer than relying only on today's GitHub state.

---

# 26. One-line summary

**Build Keychron C100 QMK firmware with `UNICODE_ENABLE = yes`, put the C100 into DFU by holding the physical top-left key while connecting USB, pass `2e3c:df11` into WSL with `usbipd-win`, then flash `alt=0` at `0x08000000` with `dfu-util`.**
