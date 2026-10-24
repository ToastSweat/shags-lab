---
type: wiki
title: Credentials
publish: true
---

# Credentials

**Credentials** are the information used to prove access to an account or service. Passwords, [[Wiki/API|API]] keys, and access tokens are common examples. They are the ingredients a system checks during [[Wiki/authentication|authentication]], not merely account settings or a display name.

The [[Booru Image Downloader Home|image downloader]] ran into this when its API request lacked usable authentication. Better error reporting revealed the real problem; downloading more aggressively would not have helped.

Treat credentials as private even when the project itself is [[Wiki/open-source|open-source]]. A public rebuild guide can explain where a secret belongs without including the secret. Screenshots, logs, exported configuration, and [[Wiki/Git|Git]] history are all easy places to leak one accidentally.

If a real credential becomes public, remove the exposure and replace or revoke it. Deleting the visible text alone doesn't make the old secret safe again.
