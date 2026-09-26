---
type: update
date: 2026-09-16
project: Keychron C100 Custom Firmware
publish: true
---
I Made A Custom Driver?!

Sorry, I just had to add some punctuation since I can't have it in the title. So cool! Seems ridiculous but this is a bucket list item for me. Something I've always wanted to do.

I got a new Keychron c100 keyboard, its 10x10 keys in a perfect square. I knew I would be able to find something to do with it, but I couldn't. I really wanted to make it have a bunch of symbols that I hardly used, because maybe I would use them more, or maybe that's just cool?

![[Pasted image 20260916232955.png]]

Turns out, Keychron's Launcher was not quite up to the job.

You can assign normal keys just fine, but there are only 16 macro slots. I tried making custom profiles and modifying the exported JSON to force functionality that just wasn't there.

No dice.

I kept digging and, after asking the oracle, ChatGPT, I learned that the firmware Keychron was using was open source and based on QMK.

And QMK is basically an entire open-source keyboard firmware ecosystem.

Oh.

Well now we're cooking.

The Keychron C100 8K has its own target in Keychron's QMK fork, which meant there was nothing stopping me from compiling my own firmware for it.

Except, you know, not knowing how to do that.

So I installed the QMK toolchain in WSL, cloned Keychron's firmware repository, installed an ARM compiler, installed `dfu-util`, fought with USB drivers for a little while, passed the keyboard's DFU device through from Windows into WSL...

And eventually compiled my first firmware.

I decided not to immediately flash all 100 keys because I am not _completely_ stupid.

The first test firmware did one thing.

The top-left key typed:

```
©
```

That was it.

Ninety-nine useless keys and one copyright symbol.

I flashed it.

Opened Notepad.

Pressed the button.

```
©
```

Holy shit.

So then I pressed it about twelve times.

```
©©©©©©©©©©©©
```

Obviously.

That proved the whole thing worked.

The trick was QMK's Unicode support. Instead of trying to store 100 macros or relying on Keychron Launcher, every physical key could be defined directly in the firmware as a Unicode code point.

So something like this:

```
UC(0x00A9)
```

becomes:

```
©
```

No macro slot.

No copy and paste.

No Alt-code cheat sheet.

The keyboard itself knows what that key is supposed to do.

Once the test worked, I compiled the real firmware.

All 100 keys.

And somehow, against all odds, every single one worked:

```
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

It's such a stupid keyboard.

I love it.

And yes, I know.

Technically I didn't make a **driver**.

I made custom **firmware**.

But "I Made Custom Keyboard Firmware" doesn't have quite the same energy, and I also had to manually install a USB driver along the way, so I'm invoking the rule of cool.

More importantly, this was one of those projects where I started with absolutely no intention of learning anything particularly deep.

I just wanted a button that typed ©.

Then one limitation turned into another question.

That question turned into QMK.

QMK turned into cross-compiling ARM firmware.

That turned into DFU bootloaders, USB passthrough, flashing microcontrollers, and writing my own keyboard layout at the firmware level.

And now I own a keyboard with a dedicated `‰` key.

Worth it.

**Next:** I need to make labels for all 100 keycaps, because right now I have created the world's least intuitive keyboard.

![[c100_symbol_pad_template.svg]]

If you want to do this yourself check out [[Keychron C100 Custom Firmware How Do]]