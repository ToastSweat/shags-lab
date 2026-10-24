---
type: wiki
title: Database
publish: true
---

# Database

A **database** is an organized store of information that software can look up and change reliably. Think less “one enormous document” and more “a set of records with rules.” A record might describe a downloaded image, a player, or a conversation.

The [[Booru Image Downloader Home|image downloader]] uses [[Wiki/SQLite|SQLite]] to remember what it has already seen and downloaded. [[Safe Cracker Discord Activity Home|Safe Cracker]] stores runs and results so closing the game doesn't erase progress. The [[ChatBot Home|chatbot project]] uses PostgreSQL for its accounts and conversation data.

The database isn't necessarily the whole application. Images, configuration, and [[Wiki/credentials|credentials]] may live elsewhere. Useful [[Wiki/backups|backups]] need to preserve the pieces together, and restoring a database should be tested rather than assumed from the existence of a backup file.
