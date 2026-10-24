---
type: wiki
publish: true
---

# Quartz

**Quartz** is a tool for turning [[Wiki/Markdown|Markdown]] notes into a static website. “Static” means it builds web files ahead of time; visitors don't need to run [[Wiki/Obsidian|Obsidian]] or connect directly to the original vault to read them.

In the [[Obsidian Vault to Website Home|website project]], the vault is the permanent source and the website is a generated view. The publishing workflow selects public notes, gathers their referenced assets, and gives that staged material to Quartz. The generated output is what the web server serves.

That separation matters. A private note should never become public simply because it happens to sit beside a published one. Quartz isn't a reason to expose the entire vault folder or its [[Wiki/Git|Git]] history.

See [[Obsidian-to-Website-General-Guide]] for the documented approach. Rebuilding the website and preserving the original notes are related jobs, but they aren't the same job.
