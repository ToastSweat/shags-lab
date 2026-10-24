---
type: wiki
publish: true
---

# Unicode

**Unicode** is a standard for identifying text characters: letters from many writing systems, punctuation, mathematical symbols, and plenty more. A character has a code point, while a font decides how it looks. The code point and the picture aren't the same thing.

The [[Keychron C100 Custom Firmware Home|C100 symbol pad]] uses [[Wiki/QMK|QMK]] Unicode support to give symbols such as © and → their own keys. Its [[Wiki/firmware|firmware]] sends the input sequence Windows expects instead of relying on a full set of saved [[Wiki/macros|macros]]. The [[Keychron C100 Unicode Firmware Guide]] records the Windows input prerequisite.

Unicode isn't itself a file encoding. UTF-8 is one way to turn Unicode text into stored [[Wiki/bytes|bytes]]. That's why character counts and file sizes don't necessarily match, and why opening text with the wrong encoding can produce garbled characters.
