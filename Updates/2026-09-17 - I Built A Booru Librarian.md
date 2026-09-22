---
title: 2026-09-17 - I Built A Booru Librarian?!
type: update
date: 2026-09-18
project: Rule34 Tag Watcher
publish: true
---
I Built A Booru Librarian?!

This started as an extremely normal request.

I wanted to save images from a booru. You know, for science.

Not everything. Just posts with specific copyright, character, artist, or general tags. I am a man of specific tastes, of course. I knew I could make some type of script to check the site every so often, grab anything new, and sort it into folders automatically.

You know.

A tiny librarian.

Except the library is Rule34.

The first version was pretty straightforward. I made a little Python program that talks to Rule34's JSON API, asks for exact tags, remembers what it has already seen in a SQLite database, and downloads new matches.

Windows Task Scheduler wakes it up once an hour, it checks the shelves, and then it goes back to sleep.

Something like this:

```text
Rule34 Tag Archive\
├── Copyright\
├── Character\
├── Artist\
└── General\
```

Beautiful.

Then authentication broke.

The API returned a string instead of the list I expected, my error message helpfully said the response was a `str`, and absolutely nobody learned anything.

After fixing that, the real message appeared:

```text
Missing authentication.
```

Cool.

Once the credentials were actually credentials, the thing worked.

Then I wanted history.

The normal watcher deliberately starts small. On the first run it downloads the newest 25 posts for each tag, records the older results as a baseline, and then only watches for new stuff. That was a good safety feature, but now I wanted the whole archive.

The kind of greed they talk about in the bible.

So I added a backfill mode.

It walks through every page for every configured tag, politely waits between requests, and records its work so it can be stopped and restarted without beginning from zero.

Then I remembered general tags existed.

So those got their own section too.

At this point the machine was happily collecting files, sorting them, resuming interrupted downloads, and quietly doing its job every hour.

![[{7179335A-107A-4B5D-9BE8-5C6B22AA69FB}.png]]

And then I had a tiny storage-related revelation.

I was already 500 GB in. Holy... Nico Robin you're going to rob me of all of my terabytes.

![[{F8988987-2C4D-4FA7-B989-19C803A366B3}.png]]

And I had barely scratched the surface.

The original version copied a matching image into every matching folder. If one post matched a character, an artist, and two general tags, congratulations: I had just stored the exact same bytes four times.

That is not organization.

That is a very expensive confidence trick.

So I rebuilt the archive layout around NTFS hard links.

Now every post has one canonical physical file inside a hidden management folder:

```text
.r34-watcher\files\...
```

The files visible under `Copyright`, `Character`, `Artist`, and `General` are hard links to that same file.

They look and behave like normal files. They open normally. They can have different paths. They can appear in five tag folders at once.

But the actual image data exists on disk once.

It is basically one book with several cards in the old library catalog.

Or, in filesystem language, several filenames pointing at the same NTFS file record.

This is extremely cool.

It also means Windows Explorer can be a little dramatic. Folder Properties may add the apparent size of every link and claim the archive is much larger than the space it really occupies. The drive's free-space number is the one that tells the truth.

There are rules.

The whole archive has to stay on one NTFS volume because hard links cannot cross drives. The `.r34-watcher` folder is not junk and absolutely cannot be deleted. A normal copy to another drive can expand the links back into separate physical copies.

So the clever storage trick is also the part that requires the most respect.

We also had a brief adventure with Windows Task Scheduler.

Moving the project folder without reinstalling the task leaves Windows pointing at the old path. Running PowerShell commands in Command Prompt makes Command Prompt complain that PowerShell commands do not exist. And if a watcher process is killed at precisely the wrong moment, a little lock file can remain behind and insist another run is still happening.

Every one of those problems is fixable.

None of them feels fixable while Windows is confidently telling you the program is already running when it definitely is not.

But now the project has:

- Exact Copyright, Character, Artist, and General tag lists
- Authenticated API requests
- An intentionally limited first run
- A resumable full-history backfill
- SQLite history
- Automatic hourly checks through Task Scheduler
- One physical copy per post, no matter how many watched folders it matches
- Link repair if a managed folder entry disappears
- Configuration validation
- Rotating logs
- A proper uninstall script
- Automated tests on Windows

And, somehow, it uses nothing outside the Python standard library.

No `pip install` ritual.

No mysterious dependency tower.

Just Python, PowerShell, SQLite, Task Scheduler, and NTFS doing increasingly elaborate things so I do not have to right-click Save Image As.

This project began as:

> Could this check a few tags for me?

It turned into API pagination, authentication, resumable state, rate limiting, filesystem identity, hard links, scheduled jobs, and a small amount of swearing at stale process locks.

Worth it.

![[{67CCBDB8-3D1E-47B1-901F-481E67A183C6}.png]]

The librarian lives!

And now it only buys one copy of each book.

**Next:** make the archive easier to move between drives without accidentally turning every hard link back into a full duplicate.

If you want to build it, recover it, move it, or figure out why Windows thinks it is already running, check out [[Rule34 Tag Watcher - Doomsday Rebuild Guide]].
Or check out [[Rule34 Tag Watcher - How Do]] for the README on GitHub.
Or, go to [GitHub](https://github.com/ToastSweat/r34-tag-watcher/). You're an adult (I assume), I have faith in you to make the right decision
