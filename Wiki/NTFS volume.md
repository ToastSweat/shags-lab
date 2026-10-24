---
type: wiki
title: NTFS Volume
publish: true
---

# NTFS Volume

An **NTFS volume** is a storage area formatted with the [[Wiki/NTFS|NTFS]] filesystem. It often appears as a drive letter in Windows, but “volume” and “physical disk” aren't quite the same thing. One disk can contain several volumes, and volumes can also be mounted at folder paths.

For [[Wiki/hard links|hard links]], the boundary is the volume. Both names must belong to the same one; having two NTFS-formatted drives doesn't let a hard link jump between them.

That is why the [[Booru Image Downloader Home|image downloader's]] archive layout needs care when moving storage. Its tag folders and managed image store share underlying files. Moving part of the archive elsewhere can break that arrangement, and a normal copy can produce independent duplicates.

Check the destination filesystem and the migration method before moving the archive. Matching folder names alone don't preserve [[Wiki/filesystem identity|filesystem identity]].
