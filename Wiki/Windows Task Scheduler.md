---
type: wiki
publish: true
aliases:
  - Task Scheduler
---

# Windows Task Scheduler

**Windows Task Scheduler** is Windows' built-in tool for starting work automatically. A task can run on a timetable, at startup, or when another event occurs. It records what to launch, which account runs it, and the conditions that apply.

The [[Booru Image Downloader Home|image downloader]] uses it for hourly checks. [[Safe Cracker Discord Activity Home|Safe Cracker's]] deployment notes also describe a startup task for its server process. These are different uses of the same scheduler, not one shared task.

The awkward details matter: executable location, arguments, working folder, permissions, and what happens if a run is already active. Moving a project doesn't automatically update the task's old [[Wiki/paths|paths]].

A completed launch isn't proof of a completed job. Check the program's logs and actual result, especially for [[Wiki/backups|backups]] and other unattended [[Wiki/scheduled jobs|scheduled jobs]].
