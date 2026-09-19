# Rule34 Tag Watcher 2.0

A small Windows downloader that checks Rule34.xxx for selected **Copyright**,
**Character**, **Artist**, and **General** tags. It uses the site's JSON API,
keeps resumable SQLite history, and has no third-party Python dependencies.

## One file, every matching folder

Version 2 stores each post's bytes exactly once. If the same post matches a
watched character, artist, and general tag, it still appears as a normal file
inside all three folders, but those paths are NTFS **hard links** to one file.
They do not consume three copies of the image.

For example:

```text
Rule34 Tag Archive\
├── Copyright\
│   └── example_series\
├── Character\
│   └── example_character\
├── Artist\
│   └── example_artist\
├── General\
│   └── example_general_tag\
└── .r34-watcher\
    ├── files\
    │   └── ...one canonical copy of each post...
    └── state.sqlite3
```

The files in the four category trees open, copy, rename, and browse like normal
files. Deleting one tag-folder link does not delete the underlying image while
another link still exists. Do not delete `.r34-watcher`: it contains the
canonical links and the history database.

Windows Explorer may add the apparent size of every visible link when showing a
folder's Properties even though NTFS allocated the file only once. Drive free
space is the reliable measure of actual storage used.

## Requirements

- Windows 10 or 11
- Python 3.10 or newer from [python.org](https://www.python.org/downloads/windows/)
- An **NTFS** download drive or folder
- A Rule34 numeric user ID and API key
- A network connection while the watcher runs

Hard links cannot cross drives and are not supported by filesystems such as
exFAT or FAT32. The setup performs a real hard-link test before installing the
scheduled task. The canonical file and all category links are kept inside the
same selected archive root, so they remain on one volume.

## Setup

1. Extract this entire folder somewhere permanent. Do not run it from inside
   the ZIP or move the project folder after scheduling it.
2. Open PowerShell in the extracted folder.
3. Run:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1
   ```

4. Enter the download folder and exact site tag names. Separate multiple tags
   in the same category with commas.
5. Enter only the numeric user ID and API key values. Do not include
   `user_id=`, `api_key=`, `&`, or other URL fragments. API-key input is hidden.
6. Double-click `run_now.bat` to test the API and download the initial batch.

Setup creates `config.json` and installs a Windows Scheduled Task named
`Rule34 Tag Watcher`. The default schedule checks once per hour while your
Windows account is logged in.

The API key is stored as plain text in `config.json` because the unattended
task must read it. Keep the project folder private. The watcher redacts the key
from API error messages.

## First run and scheduled checks

- The first normal check downloads the newest 25 posts per tag by default and
  records older scanned posts as a baseline.
- Later scheduled checks download only newly discovered posts.
- Each check scans up to three pages of 100 posts for every configured tag.
- The same post is fetched from the network once and hard-linked into every
  matching watched-tag folder.
- JPEG, PNG, GIF, and WebP are enabled by default.
- Failed downloads are not marked complete, so a later run retries them.
- If a managed tag link is accidentally deleted, a later scan repairs it from
  the canonical file without downloading the image again.

## Downloading all historical posts

Double-click `run_backfill.bat` and confirm the prompt. It walks all available
API pages for all configured tags, including posts skipped by the initial
25-post baseline.

- The scheduled task remains in new-post-only mode.
- An interrupted backfill is safe to run again. It starts at the newest page,
  skips completed entries, and continues toward older posts.
- Overlapping posts across tags are downloaded once and receive additional hard
  links instead of physical copies.
- The one-second delay applies to API pages and files. Avoid reducing it; a full
  history can take hours and the site may throttle abusive clients.
- You may leave the scheduled task installed during backfill. A single-run lock
  prevents both modes from running simultaneously.

To include historical videos, add `.mp4` and `.webm` to the
`downloads.allowed_extensions` array in `config.json` before starting backfill.

## Configuration reference

| Setting | Purpose |
| --- | --- |
| `output_directory` | NTFS root folder for the archive |
| `api.user_id` | Numeric Rule34 user ID only |
| `api.api_key` | API key value only |
| `watched_tags` | Exact tags grouped by copyright, character, artist, and general |
| `schedule.interval_minutes` | Interval used when installing the task |
| `first_run_download_limit_per_tag` | Initial newest-post download count |
| `pages_per_check` | Number of API pages inspected during normal checks |
| `max_downloads_per_tag_per_run` | Safety cap for one tag during a normal run |
| `allowed_extensions` | File types that may be saved |
| `save_sidecar_metadata` | Whether to add JSON metadata beside each tag link |

After changing `schedule.interval_minutes`, rerun `install_task.ps1`. Tag and
download settings take effect automatically on the next run.

## Useful commands

Validate the configuration and test hard-link support without contacting the
site:

```powershell
py -3 .\r34_tag_watcher.py --config .\config.json --check-config
```

Preview destinations without downloading:

```powershell
py -3 .\r34_tag_watcher.py --config .\config.json --dry-run
```

Reinstall the task after changing its interval:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install_task.ps1
```

Remove only the scheduled task:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\uninstall_task.ps1
```

Logs are stored in `logs\watcher.log`. Removing the task does not delete the
archive, configuration, logs, or history database.

## Notes

- Folder names are sanitized for Windows, but API searches use the exact tags
  from `config.json`.
- Filenames contain the post ID and file hash to prevent collisions.
- Use the tool only for material you may lawfully access and retain, and follow
  the site's terms and rate limits.
