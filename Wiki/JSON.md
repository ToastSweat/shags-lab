---
type: wiki
publish: true
---

# JSON

**JSON** is a plain-text format for structured data. It gives programs a common way to exchange lists, named values, numbers, and simple yes/no settings. People can read it too, though missing punctuation can make an otherwise sensible-looking file invalid.

A tiny illustrative example looks like this:

```json
{"tag": "example", "enabled": true}
```

The [[Booru Image Downloader Home|image downloader]] receives JSON from an [[Wiki/API|API]]. The [[Keychron C100 Unicode Firmware Guide|keyboard project]] also encountered JSON while exploring exported launcher settings.

A valid JSON response isn't automatically the response a program expected. An error message can be a JSON string when the code expects a list of posts. Good software checks the structure as well as the syntax, then reports the actual problem. JSON also provides no secrecy: don't put public [[Wiki/credentials|credentials]] in an exported file.
