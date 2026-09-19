---
type: guide
date: 2026-09-18
project: Rule34 Tag Watcher
publish: true
---

# Rule34 Tag Watcher: The Doomsday File

This is the file for Future Me, Curious You, or Whoever Is Staring At A Dead Drive At 2 A.M.

It explains what the watcher does, how to install it from nothing, how the storage trick works, how to recover it, and how to unstick Windows Task Scheduler when it decides to become a cryptid.

The short version: this is a Windows Python downloader for exact Rule34 tags. It checks for new posts on a schedule, can backfill all available history, and uses NTFS hard links so one post can appear in several tag folders without storing several physical copies.

## What you need

- Windows 10 or 11
- Python 3.10 or newer from [python.org](https://www.python.org/downloads/windows/)
- An NTFS drive for the archive
- A Rule34 account, numeric user ID, and API key
- The project files from this repository or the release ZIP
- Enough free space for the inevitable consequences of your decisions

The watcher uses only Python's standard library. You do not need `pip`.

## What the finished archive looks like

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
    │   └── ...one canonical copy of every post...
    ├── state.sqlite3
    └── watcher.lock
```

The visible category files and the canonical file are NTFS hard links. They are multiple names for the same physical bytes.

Do not delete `.r34-watcher`. It contains the canonical file links and the database that remembers what happened.

## The five-minute clean install

### 1. Install Python

Install Python 3.10 or newer from python.org. During setup, enable the option that adds Python to PATH or installs the `py` launcher.

Open Command Prompt and confirm:

```bat
py -3 --version
```

If `py` is unavailable, try:

```bat
python --version
```

### 2. Get the project

Download the repository as a ZIP and extract it somewhere permanent, or clone it:

```bat
git clone https://github.com/ToastSweat/r34-tag-watcher.git
cd r34-tag-watcher
```

Do not run the watcher from inside a ZIP. Do not schedule it from a temporary Downloads folder unless you enjoy leaving traps for yourself.

### 3. Get Rule34 API credentials

Log into Rule34, open the account options page, and generate an API key.

The site may display a fragment resembling:

```text
&api_key=ABC123&user_id=456789
```

The configuration needs only the values:

```json
"user_id": "456789",
"api_key": "ABC123"
```

Do not include `user_id=`, `api_key=`, `&`, or the combined URL fragment.

Never commit `config.json`. It contains the API key in plain text because the unattended task must be able to read it.

### 4. Run setup

Open PowerShell in the extracted project folder and run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup.ps1
```

Setup asks for:

- Archive destination
- Copyright tags
- Character tags
- Artist tags
- General tags
- Check interval
- Numeric user ID
- API key

Enter tags exactly as the site displays them. Use underscores, not spaces. Separate multiple tags with commas.

Setup writes `config.json`, checks that the archive drive supports hard links, and installs a scheduled task named `Rule34 Tag Watcher`.

### 5. Test it visibly

Double-click:

```text
run_now.bat
```

Or run it from Command Prompt:

```bat
run_now.bat
```

The first normal run downloads the newest 25 posts for each tag by default. Older results in the scanned pages become a baseline so the hourly watcher can concentrate on new posts.

### 6. Download history if wanted

Double-click:

```text
run_backfill.bat
```

Backfill walks every available API page for every configured tag. It is safe to interrupt and rerun. Completed work is skipped, baseline entries are revisited, and overlapping posts receive more hard links rather than more downloaded copies.

Popular tags can take a very long time. Leave the one-second request delay alone unless you have a compelling reason to annoy the API.

## Manual configuration

If you do not want to use setup, copy `config.example.json` to `config.json` and edit it:

```json
{
  "output_directory": "D:\\Rule34 Tag Archive",
  "api": {
    "base_url": "https://api.rule34.xxx/index.php",
    "user_id": "456789",
    "api_key": "ABC123"
  },
  "watched_tags": {
    "copyright": ["example_series"],
    "character": ["example_character"],
    "artist": ["example_artist"],
    "general": ["example_general_tag"]
  },
  "schedule": {
    "interval_minutes": 60
  },
  "scan": {
    "results_per_page": 100,
    "pages_per_check": 3,
    "first_run_download_limit_per_tag": 25,
    "max_downloads_per_tag_per_run": 100,
    "request_delay_seconds": 1.0,
    "request_timeout_seconds": 45,
    "retry_attempts": 3
  },
  "downloads": {
    "allowed_extensions": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "save_sidecar_metadata": false
  }
}
```

Add `.mp4` and `.webm` to `allowed_extensions` before backfill if videos are wanted too.

Validate the configuration and hard-link support without contacting the site:

```powershell
py -3 .\r34_tag_watcher.py --config .\config.json --check-config
```

Preview destinations without downloading:

```powershell
py -3 .\r34_tag_watcher.py --config .\config.json --dry-run
```

## The deduplication trick

Each post is downloaded into:

```text
.r34-watcher\files\<two-character-shard>\<post-id>_<hash>.<extension>
```

The watcher then calls the operating system's hard-link function for every matching tag destination.

That gives us all three properties we wanted:

1. Every tag folder contains ordinary browsable files.
2. A post can appear under several tags.
3. The file data consumes space once.

Useful facts:

- Hard links must live on the same filesystem volume.
- The archive destination must support them; on Windows that normally means NTFS.
- Deleting one tag link does not destroy the bytes while another hard link still exists.
- Explorer's folder Properties may count every path and exaggerate used space.
- The drive's free-space change is the reliable measure of physical storage use.
- A normal cross-drive copy usually dereferences the links and creates full duplicates.

## Installing, checking, and removing the scheduled task

Install or reinstall it from Command Prompt or PowerShell:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File .\install_task.ps1
```

Verify it from Command Prompt:

```bat
schtasks /Query /TN "Rule34 Tag Watcher" /V /FO LIST
```

Verify it from PowerShell:

```powershell
Get-ScheduledTask -TaskName "Rule34 Tag Watcher"
```

`Get-ScheduledTask` is a PowerShell command. Command Prompt will say it is not recognized if you paste it there without launching PowerShell. That does not mean the task is broken.

Remove only the task:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File .\uninstall_task.ps1
```

Removing the task does not delete the archive, configuration, database, or logs.

## Moving the project or archive

There are two different things:

- The project folder contains the Python and launcher scripts.
- The archive folder contains the media, hard links, and SQLite state.

If the project folder moves, the scheduled task still points at the old absolute path. Changing `config.json` is not enough. Remove the old task before the move and reinstall it from the new project folder afterward.

Safe project-folder move:

1. Run `uninstall_task.ps1` from the old project folder.
2. Move the project folder.
3. Update `output_directory` only if the archive also moved.
4. Run `install_task.ps1` from the new project folder.
5. Run `run_now.bat` once and check the log.

Moving the archive to another drive is more delicate. A normal Explorer copy can turn every hard link into a separate physical file. Until a dedicated migration tool exists, the safest space-efficient choices are:

- Start a fresh archive on the new NTFS drive and run backfill again, or
- Use a proven hard-link-aware backup/migration tool and verify the result before deleting the source.

Never delete the source archive until the destination has been verified. Check matching files with:

```powershell
fsutil hardlink list "D:\Rule34 Tag Archive\Character\some_tag\some_file.jpg"
```

The output should include both the visible tag path and a path under `.r34-watcher\files` on the same volume.

## Fixing “Another watcher run is already in progress”

The watcher creates:

```text
<archive>\.r34-watcher\watcher.lock
```

That stops the scheduled check and a manual backfill from modifying the database at the same time.

First, see whether the scheduled task is actually running:

```powershell
Get-ScheduledTask -TaskName "Rule34 Tag Watcher" | Select-Object TaskName, State
```

If it says `Running`, let it finish. A backfill may genuinely take hours.

If it is stuck and you intentionally want to stop it:

```powershell
Disable-ScheduledTask -TaskName "Rule34 Tag Watcher"
Stop-ScheduledTask -TaskName "Rule34 Tag Watcher" -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name='python.exe' OR Name='pythonw.exe' OR Name='py.exe'" |
  Where-Object { $_.CommandLine -like '*r34_tag_watcher.py*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

Only after confirming no watcher Python process remains, remove the stale lock. Replace the path with the real archive path:

```powershell
Remove-Item "D:\Rule34 Tag Archive\.r34-watcher\watcher.lock" -Force -ErrorAction SilentlyContinue
```

Run `run_now.bat`. If it succeeds, re-enable the task:

```powershell
Enable-ScheduledTask -TaskName "Rule34 Tag Watcher"
```

Do not casually delete the lock while a watcher is alive. Two concurrent writers are exactly what the lock is preventing.

## Common failures

### Missing authentication

Both credentials are required. Confirm `user_id` contains numbers only and `api_key` contains only the key value.

### Unexpected API response type

Old builds hid string messages from the API. Current builds unwrap double-encoded JSON, treat “No images found” as an empty result, and display real API messages while redacting the configured API key.

### Nothing downloads on the second normal run

That is usually correct. The first run establishes a baseline; later normal runs only download new discoveries. Use backfill for history.

### The task exists but does not run after reboot

The task uses an interactive-logon principal. It runs while the configured Windows account is logged in. Check its action path with `schtasks`; if the project moved, reinstall the task.

### The archive appears several times larger than the drive space used

Explorer is adding the logical size of every hard-link path. Check actual drive free space and verify links with `fsutil hardlink list`.

### A tag file was deleted

The watcher repairs a missing managed link the next time that post is encountered. It does not redownload the bytes if the canonical file still exists.

## Recovery scenarios

### The project folder vanished, but the archive survived

1. Download the project again.
2. Create a new `config.json` pointing at the existing archive.
3. Use the same watched tags.
4. Run `--check-config`.
5. Run `run_now.bat`.
6. Reinstall the scheduled task.

The history database lives in the archive, so it should be found automatically.

### The database vanished, but `.r34-watcher\files` survived

Make a backup first. Then run backfill. The watcher can recognize existing canonical files, rebuild records, and restore missing tag links without downloading those bytes again.

### Everything vanished

Install from the repository, restore the tag lists and credentials, choose a new NTFS archive, test normally, and run backfill.

This is why the safe-to-share parts belong on GitHub and the secret `config.json` does not.

## Running the test suite

From the project folder:

```bat
py -3 -m unittest discover -s tests -v
```

The tests cover configuration validation, API response oddities, initial baselining, new-post checks, resumable multi-page backfill, General tags, one-download/multiple-link behavior, and link repair.

## Reimplementing it from the design

If the source somehow disappears from every backup, these are the essential pieces:

1. Load and validate JSON configuration.
2. Represent every watched item as a category/tag pair.
3. Query the Rule34 DAPI with `page=dapi`, `s=post`, `q=index`, `json=1`, `tags`, `pid`, `limit`, `user_id`, and `api_key`.
4. Normalize normal lists, message strings, and double-encoded JSON responses.
5. Rate-limit and retry all requests.
6. Store tag initialization, per-tag post status, and canonical file paths in SQLite.
7. Download into a temporary `.part` file, verify it is non-empty, then atomically move it into the canonical store.
8. Use post ID plus file hash for collision-resistant filenames.
9. Use `os.link` to create every visible tag path from the canonical file.
10. Refuse to replace unrelated existing files.
11. Use a single-instance lock around database and archive changes.
12. Keep normal checks bounded; make full backfill explicit and resumable.
13. Log to both the console and rotating files.
14. Schedule only normal mode. Backfill remains a deliberate manual operation.

That is the whole machine.

One polite API client.

One memory.

One physical copy of every file.

As many useful folder paths as you want.

Good luck, Future Me.
