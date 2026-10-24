---
type: wiki
publish: true
---

# Python

**Python** is a programming language known for relatively readable code and a large collection of built-in and third-party tools. It's useful for small automation jobs as well as bigger applications. A Python [[Wiki/script|script]] is still real software, even when it's only doing one household chore.

The [[Booru Image Downloader Home|image downloader]] uses Python to call an [[Wiki/API|API]], save files, and maintain [[Wiki/SQLite|SQLite]] history. Its project note specifically says it uses only Python's standard library, so it doesn't require a separate stack of third-party Python packages.

Python itself still has to be installed and available to the process running it. [[Wiki/Windows Task Scheduler|Windows Task Scheduler]] also needs the correct executable, working folder, [[Wiki/paths|paths]], and account permissions. “Works when I double-click it” doesn't automatically prove that an unattended scheduled run has the same environment.
