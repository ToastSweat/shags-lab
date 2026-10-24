---
type: wiki
title: Pagination
publish: true
---

# Pagination

**Pagination** means splitting a large collection into smaller batches. A website might show one page of search results at a time; an [[Wiki/API|API]] does the same thing so a caller doesn't have to fetch everything in one enormous response.

The [[Booru Image Downloader Home|image downloader's]] historical backfill walks through result pages for each selected tag. Its saved [[Wiki/SQLite|SQLite]] history lets it resume instead of starting the whole archive again after an interruption.

Pagination and [[Wiki/rate limiting|rate limiting]] solve different problems. Pages control the size of each response; rate limits control how often requests happen. A small page can still be requested too aggressively.

Page numbers aren't always permanent bookmarks, either. New posts or deletions can shift results. A robust downloader tracks the identities of processed posts rather than assuming every page will contain exactly what it contained yesterday.
