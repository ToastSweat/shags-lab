---
type: wiki
title: Scheduled Jobs
publish: true
---

# Scheduled Jobs

A **scheduled job** is work a computer starts automatically at a chosen time or in response to an event. It might check for new files every hour, start an application at boot, or run a backup while nobody is watching.

On Windows, [[Wiki/Windows Task Scheduler|Windows Task Scheduler]] is one common way to arrange this. The [[Booru Image Downloader Home|image downloader]] uses it for recurring checks, while other lab projects use scheduled tasks for startup and maintenance.

The schedule is only part of the job. The program also needs the right account, [[Wiki/paths|paths]], permissions, and configuration. It should behave sensibly if a previous run is still active or the network is unavailable.

Logs and outcome checks matter. “The scheduler launched something” doesn't prove the intended work finished. For [[Wiki/backups|backups]], the useful question is whether the saved data can actually be restored.
