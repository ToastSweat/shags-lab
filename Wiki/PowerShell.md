---
type: wiki
publish: true
---

# PowerShell

**PowerShell** is a command shell and scripting language used heavily for Windows administration. It can launch programs, manage files, inspect system settings, and automate jobs that would otherwise involve a lot of clicking.

Unlike [[Wiki/Command Prompt|Command Prompt]], it can pass structured objects between commands rather than only lines of text. That makes it useful for asking precise questions about files, services, and [[Wiki/scheduled jobs|scheduled jobs]]. It also means its syntax isn't interchangeable with older batch commands.

The [[Booru Image Downloader Home|image downloader]] uses PowerShell around its Windows setup and scheduling. The [[Obsidian Vault to Website Home|vault publishing workflow]] also documents PowerShell automation.

Before pasting instructions, check which shell they're written for. With [[Wiki/paths|paths]] containing square brackets, PowerShell's `-LiteralPath` option is especially useful: it treats the supplied address as a literal path rather than a wildcard pattern.
