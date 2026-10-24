---
type: wiki
title: Hard Links
publish: true
aliases:
  - NTFS hard links
---

# Hard Links

A **hard link** is another filename for the same stored file. It isn't a copy, and it isn't a shortcut that points to an original filename. Every hard-linked name reaches the same underlying file data.

The [[Booru Image Downloader Home|image downloader]] uses [[Wiki/NTFS|NTFS]] hard links so one image can appear under character, artist, and other tag folders without storing it repeatedly. Its managed file lives under `.r34-watcher`; the visible tag entries share its [[Wiki/NTFS file record|NTFS file record]].

There are catches. Hard links must stay on the same [[Wiki/NTFS volume|NTFS volume]]. Editing the shared file through one name changes what the others see. Removing one name doesn't remove the remaining names, but the downloader's management folder still contains essential application state.

Ordinary copying can turn links back into separate copies. Moving or backing up the archive needs a link-aware plan, not just reassuring folder-size totals.
