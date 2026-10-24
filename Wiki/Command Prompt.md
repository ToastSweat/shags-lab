---
type: wiki
publish: true
---

# Command Prompt

**Command Prompt** is the traditional Windows command shell, usually opened as `cmd.exe`. It's a place to type instructions rather than click buttons, and it runs `.bat` or `.cmd` batch files as well as ordinary programs.

It isn't the same thing as [[Wiki/PowerShell|PowerShell]], even when both appear inside the same terminal app. They have different built-in commands, quoting rules, and variable syntax. A terminal is the window; the shell is the program interpreting what you type.

The [[2026-09-17 - I Built A Booru Librarian|image downloader update]] includes the very ordinary trap of pasting PowerShell instructions into Command Prompt and getting errors. Before debugging a [[Wiki/script|script]], check which shell its instructions expect. Also check [[Wiki/paths|paths]]: a correct command aimed at an old folder is still the wrong command.
