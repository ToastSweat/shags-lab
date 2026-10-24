---
type: wiki
publish: true
title: Backups
---

# Backups

A **backup** is a recoverable copy of data kept so the original can be lost, damaged, or changed without becoming a disaster. The important word is *recoverable*. A file called “backup” isn't much comfort if nobody has checked what's inside or tried restoring it.

Different lab projects need different pieces. The [[Star Wars Battlefront II Dedicated Server Home|Battlefront II server]] separates public rebuild material from encrypted private data. The [[2026-10-20 - Companion AI Finally Escaped Localhost!|chatbot deployment update]] describes preserving its database and private assets together rather than copying only the visible images.

[[Wiki/Git|Git]] history helps with source files, but it doesn't automatically capture databases, secrets, or uncommitted work. Synchronization can also propagate accidental deletion.

Keep copies away from the original machine, protect sensitive contents, and document the restore procedure. For archives using [[Wiki/hard links|hard links]], check whether the backup preserves links or expands them into independent files.
