---
type: wiki
publish: true
---

# Rule34

**Rule34**, as used in these notes, means the adult imageboard Rule34.xxx. It's a [[Wiki/Booru|booru-style]] site where posts are organized with searchable tags, including artists, characters, and source material. This entry is about the service used by the project, not an endorsement of every post or tag.

The [[Booru Image Downloader Home|image downloader]], also called Rule34 Tag Watcher, checks selected tags through the site's [[Wiki/JSON|JSON]] [[Wiki/API|API]]. It stores download history in [[Wiki/SQLite|SQLite]] and can organize matching images under several categories using [[Wiki/hard links|hard links]].

Access isn't just “a browser can open the page, so a script can do anything.” The downloader needs appropriate [[Wiki/authentication|authentication]], respects [[Wiki/rate limiting|rate limiting]], and treats large historical downloads separately from normal checks.

The linked project guides discuss operation and recovery. They aren't a substitute for the site's current rules or content restrictions.
