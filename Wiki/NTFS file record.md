---
type: wiki
title: NTFS File Record
publish: true
---

# NTFS File Record

An **NTFS file record** is an entry in the filesystem's Master File Table, or MFT. Think of it as the filing card Windows uses to keep track of a file: its attributes, names, and where its data is stored. It isn't just another name for the file's visible folder entry.

This is the useful bit for [[Wiki/hard links|hard links]]: several filenames can refer to the same record and therefore the same stored file. Different [[Wiki/paths|paths]] don't automatically mean different data.

In the [[Booru Image Downloader Home|image archive]], an image can appear in several tag folders without creating several independent copies. [[Wiki/filesystem identity|filesystem identity]] checks help distinguish those shared entries from ordinary duplicates.

The record belongs to one [[Wiki/NTFS volume|NTFS volume]]. You can't make a hard link to that record from a different volume, even if both volumes use [[Wiki/NTFS|NTFS]].
