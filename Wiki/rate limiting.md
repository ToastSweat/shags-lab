---
type: wiki
title: Rate Limiting
publish: true
---

# Rate Limiting

**Rate limiting** puts a cap on how often something may make requests. It keeps a service from being overwhelmed and stops one client from consuming an unfair share of its resources. It's the online equivalent of “one at a time, please.”

The [[Booru Image Downloader Home|image downloader]] waits between [[Wiki/API|API]] requests while working through historical [[Wiki/pagination|result pages]]. Being able to fetch an archive doesn't mean it should hammer the site as fast as the connection allows.

If a service says to slow down, a sensible client waits and retries carefully. Authentication failures need a different fix: waiting won't repair invalid [[Wiki/credentials|credentials]], and retrying faster makes things worse.

Rate limits can depend on the account, endpoint, or service policy. Follow the actual service's rules rather than treating an old project's delay setting as a universal safe number.
