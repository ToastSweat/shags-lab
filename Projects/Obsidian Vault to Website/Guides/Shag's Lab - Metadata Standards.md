---
title: Shag's Lab - Metadata Standards
type: guide
project: Obsidian Vault to Website
status: living
publish: true
---
# Shag's Lab Metadata Standards

This is the house style for frontmatter in this vault. The goal is boring, predictable metadata so the publisher can do the clever stuff automatically.

## Project Parents

Use `project-parent` for an umbrella/container that owns multiple child projects, not for every folder.

```yaml
---
type: project-parent
project: Exact Parent Name
status: active
publish: true
---
```

Current project parents are **Instruments**, **Keychron C100**, and **My Mini Retro Television**.

## Projects

```yaml
---
type: project
project: Exact Project Name
status: active
publish: true
---
```

`date`, `git`, `title`, and `project_aliases` are optional. Do not keep an empty property as a placeholder.

## Project Statuses

- `planned` - defined, but work has not really started.
- `active` - currently being worked on or actively maintained.
- `paused` - intentionally on hold, with the expectation it may resume.
- `complete` - the intended work is finished.
- `archived` - retired, abandoned, or retained only for history.

For a `project-parent`, use `active` while at least one child project is active. A parent can become `paused`, `complete`, or `archived` when the collection as a whole reaches that state.

## Updates

```yaml
---
type: update
date: YYYY-MM-DD
project: Exact Project Name
publish: true
---
```

`project` may be omitted for a genuinely general update. For now, multi-project updates use a comma-separated list because the publisher already understands that format.

## Guides

```yaml
---
type: guide
project: Exact Project Name
publish: true
---
```

Guide statuses are separate from project lifecycle statuses. Use them only when useful:

- `living` - actively maintained documentation.
- `snapshot` - deliberately captures a point-in-time state.
- `complete` - finished documentation that should not need routine updates.
- `deprecated` - retained for history but no longer current.

## Wiki

```yaml
---
type: wiki
publish: true
---
```

Leave `publish` absent while an article is an empty/private draft.

A public wiki article should explain the term in plain English, say why it comes up in the Lab, and link to a few genuinely related notes. Keep the jokes; skip the textbook impression.

Use one real article per concept. Link to the canonical note, and use a display label when the sentence needs a different form: `[[Wiki/Intonation|intonate]]`. Put alternate names or old spellings in `aliases` on that article rather than creating a second empty page or a page that only redirects to itself.

## Private folders

`Queued Projects/` and `Work/` are local-only folders. The publisher must exclude their notes **and attachments**, even if an individual note says `publish: true`. Quartz also ignores those folders as a second line of defense.

This hides the folders from the website, not from Obsidian or the private Git backup. Public diary entries may still discuss a queued project; hiding its folder does not erase those mentions. Links to private notes should become plain text in the website staging copy, while the original Obsidian links stay usable.

## Attachments and guides

- Put new images, downloads, and supporting files in an `assets` folder inside the relevant project or category. For example: `Projects/Booru Image Downloader/assets/`.
- Use `docs` for new collections of text guides. Existing `Guides` and `guides` paths are intentionally retained: renaming them without a URL migration would break older website links.
- Use note links that resolve in Obsidian as well as Quartz. A folder landing page on the website is not itself an Obsidian note; link to the actual `... Home` note in source Markdown.

## Indexes

Folder landing pages use `type: index`. When a folder has a note named exactly `Folder Name Home.md`, the publisher can treat that note as the folder homepage.

## Rules

- Do not keep empty `title`, `project`, `git`, or `youtube` properties.
- Use canonical project names consistently. Put old names in `project_aliases` on the Home note instead of continuing to use old names in new notes.
- `title` is optional. Use it only when the display title should differ from the filename.
- `publish: true` is an explicit public-site opt-in.
- Keep filenames filesystem-safe; expressive punctuation belongs in `title` when needed.
