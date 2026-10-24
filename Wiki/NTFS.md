---
type: wiki
publish: true
---

# NTFS

**NTFS** is a filesystem commonly used by Windows. A filesystem is the part that organizes stored data into files and folders, tracks their names, and manages details such as permissions.

Here, NTFS matters most because of [[Wiki/hard links|hard links]]. The [[Booru Image Downloader Home|image downloader]] uses them to show one stored image in several tag folders. That feature depends on the archive staying within one [[Wiki/NTFS volume|NTFS volume]], not merely on every folder having a Windows-looking [[Wiki/paths|path]].

An [[Wiki/NTFS file record|NTFS file record]] holds information about a file and connects its names with its data. Several names can share that same record, which is why adding another hard link doesn't mean storing the full image again.

Don't assume another drive, network share, or cloud-copy operation preserves those relationships. Check how a move or backup handles links before trusting its apparent folder sizes.
