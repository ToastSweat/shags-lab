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

## Indexes

Folder landing pages use `type: index`. When a folder has a note named exactly `Folder Name Home.md`, the publisher can treat that note as the folder homepage.

## Rules

- Do not keep empty `title`, `project`, `git`, or `youtube` properties.
- Use canonical project names consistently. Put old names in `project_aliases` on the Home note instead of continuing to use old names in new notes.
- `title` is optional. Use it only when the display title should differ from the filename.
- `publish: true` is an explicit public-site opt-in.
- Keep filenames filesystem-safe; expressive punctuation belongs in `title` when needed.
