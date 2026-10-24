---
type: wiki
title: Firmware
publish: true
---

# Firmware

**Firmware** is software that lives on a device and tells its hardware what to do. In a keyboard, that includes scanning the keys and deciding what to send to the computer. It's closer to the gadget than an ordinary desktop app.

The [[Keychron C100 Custom Firmware Home|C100 project]] replaces the board's key behavior with a custom [[Wiki/QMK|QMK]] build. Its symbol layout is compiled into the keyboard firmware instead of squeezed into the launcher's limited [[Wiki/macros|macro]] slots.

A driver is different: it runs on the computer and helps the operating system communicate with hardware. The keyboard update's title jokes about making a driver, but the project is primarily firmware work.

Firmware needs to match the exact device. Keep the source, build instructions, known-good files, and [[Wiki/DFU|recovery method]] together before experimenting.
