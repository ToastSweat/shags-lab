---
title: Housekeeping Review
type: guide
project: Obsidian Vault to Website
status: living
publish: false
---

# Housekeeping review

This is the maintenance receipt, not another public blog post.

## Content changes

- Filled the existing wiki placeholders and added useful related topics. The wiki now has 100 actual articles plus its home page.
- Rebuilt [[Wiki/Wiki Home|Wiki Home]] into browsable topic groups.
- Reviewed all 45 dated Updates and all 104 existing notes under Projects and Progeny Gaming Network. Added useful concept links and links to the actual projects being discussed.
- Consolidated duplicate glossary pages: Hermes/Hermes Agent, Authenticated/authentication, NTFS hard links/hard links, and Task Scheduler/Windows Task Scheduler.
- Corrected the malformed Squire and `truss rod,` note names, and made instrument titles consistent. Incoming links use the canonical articles, with display labels where the sentence needs a different spelling or form.
- Added direct canonical wiki targets rather than relying on redirect pages. Removed redundant aliases that would generate the same URL as their own article, and aliases containing Windows-invalid filename characters.
- Completed the Cosmic Raven archive index with the transmissions and pinned comments that actually exist. No invented 005A entry and no renumbering.
- Corrected wrong cross-links, a television product URL, a television Channels self-link, and a pinned-comment self-link.
- Removed NUL characters from a corrupted duplicate repository heading in the Transmission Builder README. The readable text and procedures were retained.

## Website changes

- Work and Queued Projects are local-only. Folder-level publisher rules win over individual `publish: true` values, and Quartz has matching ignore rules as a second defense.
- Existing notes in those folders now explicitly say `publish: false` as well.
- Private notes and attachments stay out of staging, and links to unpublished notes become plain text in the website copy. Original Obsidian links stay usable.
- Generated Projects links point to actual Home notes, not folder-only targets that only work on the website.
- Updates Home retains newest-first post-date ordering. Explorer also sorts the top-level Updates folder newest-first, with numeric same-day editions in the correct order. Other categories stay alphabetic.
- The recovery guide includes the updated publisher; a saved Quartz configuration lives in the project's assets folder.
- Fixed the publisher's handling of normal Obsidian multiline aliases, non-ASCII Home-page text under Windows PowerShell 5.1, and code examples that were being mistaken for live file links.
- Existing Guides paths were not renamed. Moving them to docs would change published URLs, so that deserves a separate redirect-aware migration. New text documentation uses docs.

## Things still worth your attention

### Missing notes, not missing definitions

These original destinations are not present in the vault:

- `2026-09-28.1 - It's A Slow Day`, referenced from the September 26 Weekend Working post.
- `Companion AI Phone Hosting Guide`, referenced from the October 20 deployment post.
- `2026-09-26 - I Made A Game Boy Virtual Pet And Then Gave Him Gas`, referenced in the queued Garth project guide.

Their titles are now visible plain text with an explanation, rather than dead links. The queued guide also links to the existing September 26 progress post. No replacement deployment guide or lost diary entry was fabricated.

### A couple of diary inconsistencies

- [[Updates/2026-10-11 - I Built Nickelodeon On A Tiny TV|October 11]] compares 696 and 704 pixels, then says “Four pixels.” The difference is eight. Left as an editorial correction for you rather than silently rewriting the anecdote.
- [[Updates/2026-10-18 - Man, Still Going...|October 18]] gives `bot.helvete.com`; the October 20 post gives `bot.helvete.pizza`. The diary's original domains are retained; the intended address needs confirmation.
- The October 14 and October 18 posts repeat their opening sentences. This may be accidental, or may be the intended level of exhaustion.

### Deliberately unpublished or archival material

- The Keychron Custom Keycaps Home has no public opt-in and almost no body content. It stays unpublished; public links are de-linked in staging, not made public on your behalf.
- The Historical Evidence Ledger remains private. Public navigation does not expose it, while Obsidian can still use it for research.
- Copy-ready archived comments still contain `[ADD YOUTUBE LINK]` placeholders in 006C, 008A, and 010A. The completed archive index provides the available metadata URLs. The historical posting copy was not silently rewritten.
- The Battlefront disaster-recovery guide is an older snapshot with details that conflict with later project notes. It now has a dated warning; do not assume every old recovery instruction describes the current server.
- Hiding Queued Projects does not erase discussion of those projects from already-public diary entries. Those mentions remain intentionally.

## Verification record

- Wiki metadata/body checks: all 100 articles have public wiki metadata and substantive explanations.
- Final source wikilink audit: 1,673 links checked, with no missing or ambiguous targets, self-links, or folder-only note targets. Source links to unpublished notes remain intentional and become plain text in website staging.
- Preserved all three preexisting user-edited/new files by SHA-256: Updates/TODO and the two new Cosmic Raven notes.
- Compared 640 original code blocks across 149 existing notes against Git HEAD: unchanged. The website recovery guide is the intentional exception because its embedded publisher was updated.
- Publisher privacy fixtures and installed Quartz integration checks pass. The JavaScript/TypeScript test suite passes all 168 tests, including five Explorer/presentation checks.
- Full local build with `-SkipGit`: passed. It staged 250 public notes and 124 referenced attachments, then built the site successfully under `/lab`.
- Audited 20,645 internal references across 336 HTML pages: no missing local destinations, broken heading anchors, self-redirects, private live links, private output files, or private search/graph entries.
- Real Chromium checks: all 45 Updates sort newest-first in both the main list and Explorer; Video Games opens directly; no private folders appear in Explorer; the 390px mobile layout has no horizontal overflow; no uncaught JavaScript exceptions. Screenshots are in the project assets folder.
- Remaining nonfatal build warnings: the configured optional Excalidraw plugin cannot be loaded, and Quartz cannot find Git history for its disposable staging content. The Markdown build passes; original source files remain in the vault repository. PHP visitor-count behavior was not tested by the local static preview. Analytics and remote web fonts were blocked during browser QA to avoid recording test visits.

No commit, push, or remote deployment has been performed.
