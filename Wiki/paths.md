---
type: wiki
title: Paths
publish: true
---

# Paths

A **path** is the address used to reach a file or folder. An absolute path starts from a known root, while a relative path starts from the current working folder. Move that starting point and the same relative text can lead somewhere else.

Paths explain two different problems in the [[Booru Image Downloader Home|image downloader]]. A [[Wiki/Windows Task Scheduler|Windows Task Scheduler]] entry can keep pointing at an old project location after the folder moves. Meanwhile, several tag-folder paths can correctly reach the very same image through [[Wiki/hard links|hard links]].

An address isn't the same as [[Wiki/filesystem identity|filesystem identity]]. Two paths may share one file, and two matching filenames may belong to unrelated files.

Spaces and special characters also matter when typing commands. Quote paths appropriately for the shell, and don't assume [[Wiki/PowerShell|PowerShell]] and [[Wiki/Command Prompt|Command Prompt]] interpret the same text identically.
