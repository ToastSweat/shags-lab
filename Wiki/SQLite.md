---
type: wiki
publish: true
---

# SQLite

**SQLite** is a [[Wiki/database|database]] engine that runs inside an application instead of needing a separate database server. Its persistent database is usually kept in a local file, which makes it useful for small tools and self-contained applications.

The [[Booru Image Downloader Home|image downloader]] uses SQLite to remember seen posts and download progress. [[Safe Cracker Discord Activity Home|Safe Cracker]] uses it for player sessions, game runs, and results. In both cases, closing the program shouldn't mean forgetting what happened.

“It's a file” doesn't mean copying it at any random moment is a safe backup. Depending on how the database is operating, recent changes may involve companion journal files. Use an appropriate backup method or stop writes cleanly.

SQLite also isn't just a spreadsheet with a different extension. It supports queries, relationships, and transactions that help keep related changes consistent.
