# Build Your Own Obsidian-Powered Wiki/Blog Website

This guide shows one way to turn an Obsidian vault into a public website while keeping the vault itself as the permanent source of truth.

The basic idea is simple:

**Write locally in Obsidian. Keep everything in Git. Publish only the notes you explicitly mark public. Build a static website from those notes. Push everything to one private GitHub repository. Let the web server pull the repo and serve only the generated site.**

The website is disposable.

The Markdown vault is not.

---

## What You End Up With

On your personal computer:

```text
Your Vault
├── Projects/
├── Updates/
├── Welcome.md
├── .obsidian/
├── .git/
└── .site/
    └── public/        <-- generated website
```

Beside it:

```text
Quartz/
├── content/           <-- temporary/generated staging content
├── public/            <-- Quartz build output
├── Publish-Site.ps1
└── Quartz files...
```

In GitHub:

```text
One private repository
├── your full vault
└── .site/public
```

On the web server:

```text
C:\Repos\MySite\       <-- private Git checkout
└── .site\public

C:\xampp\htdocs\mysite <-- only public website files
```

The publishing flow looks like this:

```text
OBSIDIAN
   ↓
Markdown vault
   ↓
Generate indexes
   ↓
Select publish:true notes
   ↓
Copy referenced assets
   ↓
Quartz build
   ↓
.site/public
   ↓
Git commit + push
   ↓
Private GitHub repo
   ↓
Web server git pull
   ↓
Copy .site/public into Apache web root
   ↓
Internet
```

---

# 1. Why Structure It This Way?

You could technically make the Obsidian vault itself the website source directory.

Don't.

A better approach is:

```text
Vault = permanent source
Website = generated view
```

This gives you several advantages:

- your notes remain ordinary Markdown files;
- you can change static-site generators later;
- private notes never need to enter the public build;
- your original images remain untouched;
- Git tracks the history of your diary/wiki;
- GitHub becomes an off-machine backup;
- the web server does not need Obsidian;
- the web server does not even need Node or Quartz if you build on your home PC.

If the website disappears tomorrow, your vault is still fine.

---

# 2. Install the Required Software

On the computer where you write and build the site, install:

- Obsidian
- Git
- Node.js 22 or newer
- npm

Check them:

```powershell
node -v
npm -v
git --version
```

You should also have a GitHub account.

If you plan to self-host on Windows with Apache, this guide assumes something like XAMPP, but any ordinary static web server will work.

---

# 3. Create Your Obsidian Vault

Create an Obsidian vault anywhere you like.

Example:

```text
D:\Notes\My Lab
```

A simple starting structure might be:

```text
My Lab/
├── Projects/
│   └── Projects Home.md
├── Updates/
│   └── Updates Home.md
├── Assets/
└── Welcome.md
```

Do not over-design the folder structure.

Let it grow based on how you actually use it.

---

# 4. Use a Simple Content Model

A useful model is:

- **Updates** = chronological posts
- **Projects** = persistent wiki-style subjects

For example:

```text
Projects/
└── Custom Keyboard/
    ├── Custom Keyboard Home.md
    ├── Guides/
    └── Assets/

Updates/
├── 2026-09-01 - Started the Keyboard Project.md
├── 2026-09-05 - Firmware Finally Works.md
└── Updates Home.md
```

Use ISO dates:

```text
YYYY-MM-DD
```

instead of:

```text
M.D.YYYY
```

because ISO dates sort correctly as plain text.

---

# 5. Add Frontmatter

Use YAML frontmatter to tell the publishing script what a note is.

## Update

```yaml
---
type: update
date: 2026-09-19
project: Custom Keyboard
publish: true
---
```

## Project Home

```yaml
---
type: project
project: Custom Keyboard
status: active
publish: true
---
```

## Homepage

```yaml
---
title: Welcome
publish: true
---
```

The important property is:

```yaml
publish: true
```

Anything without that property stays out of the public build.

That gives you an explicit privacy model:

```text
No publish:true
    = private

publish:true
    = public
```

---

# 6. Put the Vault Under Git

Open PowerShell.

If your path contains square brackets, use `-LiteralPath`.

Example:

```powershell
Set-Location -LiteralPath "D:\Notes\My Lab"
```

Initialize Git:

```powershell
git init
git branch -M main
```

Create a `.gitignore`:

```gitignore
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
Thumbs.db
.DS_Store
desktop.ini
```

Do not automatically ignore the whole `.obsidian` directory.

Keeping lightweight Obsidian settings in Git can make restoring the vault easier.

Then:

```powershell
git add .
git commit -m "Initial vault"
```

---

# 7. Create a Private GitHub Repository

Create a new **private** GitHub repository.

Do not initialize it with a README, license, or `.gitignore` if your local repository already exists.

Then connect your local vault:

```powershell
git remote add origin https://github.com/YOURNAME/YOUR-REPO.git
git push -u origin main
```

Because the repository contains your full vault, keep it private unless you intentionally want every note public.

---

# 8. Install Quartz

Create a separate directory for Quartz.

Example:

```text
D:\Notes\
├── My Lab\
└── MyLab-Web\
```

Clone Quartz:

```powershell
git clone https://github.com/jackyzha0/quartz.git "D:\Notes\MyLab-Web"
```

Then:

```powershell
Set-Location -LiteralPath "D:\Notes\MyLab-Web"
npm install
```

Initialize Quartz for Obsidian-style Markdown:

```powershell
npx quartz create --template obsidian --strategy new --baseUrl example.com/lab
```

If the default theme package is missing and Quartz complains about:

```text
Cannot find module '@quartz-themes/default'
```

install it:

```powershell
npm install @quartz-themes/default
```

In `quartz.config.yaml`, set at least:

```yaml
configuration:
  pageTitle: "My Lab"
  baseUrl: "example.com/lab"
```

---

# 9. Do Not Point Quartz Directly At Your Vault

Instead, use a staging directory:

```text
Quartz\content
```

Your publishing script should recreate this directory every time.

That script can:

1. scan the vault;
2. generate your automatic index pages;
3. select only `publish: true` notes;
4. copy those notes into Quartz;
5. copy only the assets referenced by those public notes;
6. rename `Welcome.md` to `index.md`;
7. run Quartz;
8. copy the final website into `.site/public` inside the vault repository.

This gives you a hard boundary between:

```text
private source
```

and:

```text
public build
```

---

# 10. Auto-Generate Updates Home

Instead of manually maintaining:

```text
Updates Home.md
```

generate it from frontmatter.

The generator should:

```text
find all notes where:
type = update
publish = true
```

then sort by:

```text
date descending
```

and output something like:

```markdown
---
title: Updates Home
type: index
publish: true
---

# Latest Updates

- [[Updates/2026-09-19 - Built My Website|2026-09-19 - Built My Website]]
- [[Updates/2026-09-18 - Fixed My Server|2026-09-18 - Fixed My Server]]
- [[Updates/2026-09-17 - Started Something Weird|2026-09-17 - Started Something Weird]]
```

Now every new update appears automatically.

---

# 11. Auto-Generate Projects Home

The same idea works for projects.

Find all notes where:

```text
type = project
publish = true
```

Then find the newest Update where:

```yaml
project: Exact Same Project Name
```

and sort the projects by most recent activity.

That gives you:

```markdown
# Projects

- [[Projects/Custom Keyboard/Custom Keyboard Home|Custom Keyboard]] — last activity 2026-09-19
- [[Projects/Game Server/Game Server Home|Game Server]] — last activity 2026-09-17
- [[Projects/Retro Computer/Retro Computer Home|Retro Computer]] — last activity 2026-09-12
```

You write the content.

The script handles the bookkeeping.

---

# 12. Store the Generated Site in the Same Repository

After Quartz builds:

```text
Quartz\public
```

copy that into:

```text
Your Vault\.site\public
```

Now your single repository contains:

```text
source notes
+
generated website
```

This means the web server can get everything it needs with one:

```text
git pull
```

while Apache still exposes only the generated site.

---

# 13. A Simple Home-PC Publishing Wrapper

Create:

```text
Publish-Site.bat
```

with something like:

```bat
@echo off
setlocal

set "PUBLISHER=D:\Notes\MyLab-Web\Publish-Site.ps1"

echo.
echo ========================================
echo   Publishing Site
echo ========================================
echo.

if not exist "%PUBLISHER%" (
    echo ERROR: Publisher script not found:
    echo   %PUBLISHER%
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PUBLISHER%"

if errorlevel 1 (
    echo.
    echo PUBLISH FAILED
    pause
    exit /b 1
)

echo.
echo Publish complete.
echo.
pause
```

The PowerShell publisher itself should:

```text
generate indexes
build staging content
run Quartz
copy Quartz public output to .site/public
git add
git commit
git push
```

Once that works, publishing becomes one double-click.

---

# 14. Web Server Layout

Do not clone the full private repository directly into your Apache public directory.

Instead use:

```text
C:\Repos\MySite
```

for the private checkout.

Then have Apache serve:

```text
C:\xampp\htdocs\mysite
```

The reason is simple:

Your Git repository contains private source notes.

Only:

```text
.site\public
```

belongs on the public web.

---

# 15. Clone the Repo on the Web Server

On the web server:

```powershell
New-Item -ItemType Directory -Path "C:\Repos" -Force
```

Then:

```powershell
git clone https://github.com/YOURNAME/YOUR-REPO.git "C:\Repos\MySite"
```

Verify:

```powershell
Test-Path -LiteralPath "C:\Repos\MySite\.site\public\index.html"
```

Expected:

```text
True
```

---

# 16. Create a Web-Host Update BAT

Example:

```bat
@echo off
setlocal

set "REPO_DIR=C:\Repos\MySite"
set "WEB_DIR=C:\xampp\htdocs\mysite"
set "SITE_DIR=%REPO_DIR%\.site\public"

echo.
echo ========================================
echo   Updating Website
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or is not in PATH.
    pause
    exit /b 1
)

if not exist "%REPO_DIR%\.git" (
    echo ERROR: Git repository not found:
    echo   %REPO_DIR%
    pause
    exit /b 1
)

cd /d "%REPO_DIR%"

git pull --ff-only origin main

if errorlevel 1 (
    echo ERROR: Git pull failed.
    pause
    exit /b 1
)

if not exist "%SITE_DIR%\index.html" (
    echo ERROR: Generated site not found:
    echo   %SITE_DIR%
    pause
    exit /b 1
)

if not exist "%WEB_DIR%" (
    mkdir "%WEB_DIR%"
)

robocopy "%SITE_DIR%" "%WEB_DIR%" /MIR /R:2 /W:1 /NFL /NDL /NP

if errorlevel 8 (
    echo ERROR: Website copy failed.
    pause
    exit /b 1
)

echo.
echo Site updated successfully.
echo.
pause
```

The important part is:

```text
git pull
↓
copy .site/public
↓
Apache web directory
```

---

# 17. Why Use `robocopy /MIR`?

`/MIR` makes the live website exactly match the generated build.

That removes files that no longer exist in the site.

This is useful, but it also means:

**Do not manually store unrelated files inside the site's Apache directory.**

They may be deleted during the next deployment.

Treat the live website directory as disposable.

---

# 18. Apache

If your existing Apache site already serves:

```text
C:\xampp\htdocs
```

then putting your generated site at:

```text
C:\xampp\htdocs\mysite
```

may immediately give you:

```text
https://example.com/mysite/
```

If you prefer a subdomain, create a virtual host pointing directly at that directory.

Example:

```apache
<VirtualHost *:80>
    ServerName lab.example.com

    DocumentRoot "C:/xampp/htdocs/mysite"

    <Directory "C:/xampp/htdocs/mysite">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Always validate Apache before restarting:

```powershell
C:\xampp\apache\bin\httpd.exe -t
```

You want:

```text
Syntax OK
```

---

# 19. HTTPS with win-acme and Apache

For a Windows Apache server, win-acme can request Let's Encrypt certificates and export PEM files.

Run `wacs.exe` as Administrator.

A common manual Apache setup is:

```text
Create certificate (full options)
→ manually enter domain
→ single certificate
→ HTTP validation using filesystem path
→ web root of your Apache site
→ RSA
→ PEM encoded files
→ save into Apache cert directory
→ no password on private key
→ no additional store
→ no IIS install step
```

Example PEM location:

```text
C:\xampp\apache\certs
```

Your Apache SSL config might contain:

```apache
SSLCertificateFile "C:/xampp/apache/certs/example.com-crt.pem"
SSLCertificateKeyFile "C:/xampp/apache/certs/example.com-key.pem"
SSLCertificateChainFile "C:/xampp/apache/certs/example.com-chain.pem"
```

After issuing or renewing:

```powershell
C:\xampp\apache\bin\httpd.exe -t
```

Then restart Apache.

Make sure win-acme's scheduled renewal task is healthy.

Otherwise you may discover the certificate expired only when your browser starts screaming at you six months later.

---


# 19.5. Make Quartz Clean URLs Work on Apache

Quartz normally generates links without `.html`.

For example, the browser may request:

```text
https://example.com/mysite/updates/my-post
```

while the generated file is physically:

```text
C:\xampp\htdocs\mysite\updates\my-post.html
```

Quartz's development server handles this automatically.

Plain Apache usually needs a rewrite rule.

Create an `.htaccess` file in the parent web root or another directory that will **not** be overwritten by your deployment process.

For example, if the live generated site is mirrored into:

```text
C:\xampp\htdocs\example\mysite
```

you can store the rewrite file at:

```text
C:\xampp\htdocs\example\.htaccess
```

with:

```apache
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+?)/?$ $1.html [L]
```

This means:

```text
/mysite/updates/my-post
```

will internally serve:

```text
/mysite/updates/my-post.html
```

without changing the visible URL.

Check that `mod_rewrite` is loaded:

```powershell
C:\xampp\apache\bin\httpd.exe -M | findstr rewrite
```

Expected:

```text
rewrite_module (shared)
```

## The HTTPS vhost must allow `.htaccess`

A common gotcha is having `AllowOverride All` on the port-80 virtual host but not on the port-443 SSL virtual host.

If HTTP works but HTTPS clean links still return 404s, inspect the SSL vhost.

Inside the relevant `<VirtualHost *:443>` block, make sure the web root has a matching directory section:

```apache
<Directory "C:/xampp/htdocs/example">
    AllowOverride All
    Require all granted
</Directory>
```

Then validate:

```powershell
C:\xampp\apache\bin\httpd.exe -t
```

and restart Apache.

A useful diagnostic is:

```powershell
Test-Path -LiteralPath "C:\xampp\htdocs\example\mysite\updates\my-post.html"
```

If the `.html` file exists but the extensionless URL returns 404, the static build is probably fine and the problem is Apache routing.

# 20. Normal Daily Workflow

Once everything is configured, this should be boring.

## On your personal PC

Write in Obsidian.

When something should be public:

```yaml
publish: true
```

Then run:

```text
Publish-Site.bat
```

That:

```text
updates indexes
builds Quartz
updates .site/public
commits
pushes
```

## On the web server

Run:

```text
Update-Site.bat
```

That:

```text
git pull
copies generated site
```

Done.

---

# 21. Troubleshooting

## PowerShell cannot enter a folder containing `[square brackets]`

Use:

```powershell
Set-Location -LiteralPath "D:\Some\[Folder]\Vault"
```

instead of:

```powershell
cd "D:\Some\[Folder]\Vault"
```

Square brackets have wildcard meaning in PowerShell paths.

---

## Quartz homepage is a 404

Quartz expects:

```text
content\index.md
```

Your publisher should copy:

```text
Welcome.md
```

to:

```text
content\index.md
```

---

## Homepage title says `index`

Give your homepage frontmatter:

```yaml
---
title: Welcome
publish: true
---
```

---

## Explorer is empty

Quartz probably received only one file.

Inspect:

```text
Quartz\content
```

Your generated public notes should actually exist there before the build.

---

## Graph View shows one lonely dot

Same issue.

One page in Quartz means one graph node.

Once linked notes are present, the graph becomes interesting.

---

## A note is missing from the website

Check:

```yaml
publish: true
```

Then rebuild.

---

## A project is sorted incorrectly

Check that the Project Home and its Update posts use the same:

```yaml
project: Project Name
```

---

## Quartz cannot find `@quartz-themes/default`

Run:

```powershell
npm install @quartz-themes/default
```

---

## Windows PowerShell shows bizarre syntax errors in a script

Windows PowerShell 5.1 can be touchy about UTF-8 scripts without a BOM.

If a script suddenly claims normal lines contain broken syntax after a Unicode character, try:

- saving the operational script as ASCII if possible;
- saving it as UTF-8 with BOM;
- or using modern PowerShell 7.

For small automation scripts, ASCII-only text is often the least surprising option.

---

## `git pull` fails on the web server

Check:

```powershell
git remote -v
git status
git branch
```

The server checkout should generally stay untouched except for `git pull`.

Avoid hand-editing files in the checkout.

---

# 22. Security Notes

A few things matter here.

## Keep the repository private

If the repo contains your entire vault, it probably contains notes you never intended for the public internet.

The generated site may be public.

The repository does not need to be.

## Keep the Git checkout outside the web root

Good:

```text
C:\Repos\MySite
C:\xampp\htdocs\mysite
```

Bad:

```text
C:\xampp\htdocs\mysite\.git
C:\xampp\htdocs\mysite\Private Notes
```

Do not rely on web-server defaults to protect private source files.

## Use an explicit public flag

Prefer:

```yaml
publish: true
```

over an "everything is public unless hidden" model.

Accidentally forgetting to publish something is annoying.

Accidentally publishing something private is worse.

---

# 23. Backup Philosophy

Think of the layers separately:

```text
Obsidian vault
    = canonical source

Local Git
    = version history

Private GitHub
    = off-machine copy and transport

.site/public
    = generated website snapshot

Web-server checkout
    = deployment source

Apache web folder
    = disposable live copy
```

The one thing that should be treated as precious is:

```text
the vault
```

Everything else should be reproducible from it.

---

# 24. Rebuilding After Disaster

If your web server dies:

```text
clone repo
copy .site/public
configure Apache
restore HTTPS
```

If your personal PC dies:

```text
clone repo
open vault in Obsidian
reinstall Quartz
restore publisher script
```

If Quartz disappears:

Use another static-site generator.

Your Markdown still exists.

That is the entire reason for structuring the system this way.

---

# 25. Final Checklist

A healthy setup should have all of these:

- Obsidian opens the vault normally.
- The vault is a Git repository.
- The GitHub repository is private.
- Public notes use `publish: true`.
- Updates Home is generated.
- Projects Home is generated.
- Quartz builds successfully.
- `.site/public/index.html` exists.
- The home-PC publisher commits and pushes.
- The web server can `git pull`.
- The web server copies `.site/public` into the Apache directory.
- Apache serves the site.
- HTTPS works.
- Quartz extensionless links resolve correctly through Apache.
- The HTTPS vhost allows `.htaccess` overrides when rewrite rules are used.
- Automatic certificate renewal is configured.

Once all of that works:

**Stop touching the plumbing and go write things.**
