---
type: wiki
title: Macros
publish: true
aliases:
  - macro
---

# Macros

A **macro** bundles a sequence of actions into one trigger. Press a key, and it might type a phrase, send several shortcuts, or repeat a small routine. It's a way to stop doing the same fiddly thing by hand.

The [[Keychron C100 Custom Firmware Home|C100 symbol-pad project]] started by exploring the keyboard launcher's macro features. Its limited slots weren't a good fit for a whole board of dedicated symbols, so the project moved to custom [[Wiki/QMK|QMK]] [[Wiki/firmware|firmware]] instead.

A key that produces a symbol doesn't necessarily need a saved macro. QMK can define [[Wiki/Unicode|Unicode]] input behavior directly in the keymap. The result may look similar from the chair, but the configuration and limitations are different.

A macro is best for a repeatable action. A [[Wiki/script|script]] is usually a better fit once the task needs decisions, files, error handling, or saved state.
