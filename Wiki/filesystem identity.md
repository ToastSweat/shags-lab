---
type: wiki
title: Filesystem Identity
publish: true
---

# Filesystem Identity

**Filesystem identity** means identifying the actual stored file, rather than only the name you used to reach it. A [[Wiki/paths|path]] is an address. It isn't always a unique identity: the same file can have more than one address.

That becomes important with [[Wiki/hard links|hard links]]. On [[Wiki/NTFS|NTFS]], several filenames can point to the same [[Wiki/NTFS file record|NTFS file record]]. Comparing their names would suggest different files; checking their underlying identity reveals that they share the same stored object.

The [[Booru Image Downloader Home|image downloader]] relies on this distinction when organizing one image under several tags and repairing managed links. A duplicate-looking filename isn't enough to prove either a real duplicate or a correct link.

Identity also differs from matching contents. Two independent copies can contain identical [[Wiki/bytes|bytes]] without being the same file. Editing one copy won't change the other; editing a shared hard-linked file will.
