---
type: wiki
title: Authentication
publish: true
aliases:
  - Authenticated
---

# Authentication

**Authentication** is proving who you are to a computer system. A password, an [[Wiki/API|API]] key, or an existing login session can all be part of that proof. *Authenticated* simply means the check succeeded.

It isn't the same as permission. Authentication asks “who are you?” Authorization asks “what are you allowed to do?” Being logged in doesn't mean you should be able to read somebody else's private files.

The [[Booru Image Downloader Home|image downloader]] needs valid [[Wiki/credentials|credentials]] when it calls the site's API. In [[Safe Cracker Discord Activity Home|Safe Cracker]], Discord identifies the player, then the game maintains its own session. Neither should trust a browser merely announcing a username.

If authentication fails, read the actual error before retrying endlessly. A missing key won't be fixed by sending the same request faster.
