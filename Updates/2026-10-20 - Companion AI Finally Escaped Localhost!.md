---
type: update
date: 2026-10-20
project: ChatBot
publish: true
---
# IT'S ALIIIIIIIIIIIIVE!

I wanted to use my character chat app on my phone.

At home.
Away from home.
Without leaving my desktop running just so another device could talk to it.

That was the request.

The app already existed. It had Characters, Personas, Scenarios, conversations, memories, images, and voice features. I had actual data in it, and I wanted to start using the thing instead of continually preparing to eventually use the thing.

The next step seemed reasonable:

> Put it on the server I already own and give it a proper URL.

Naturally, this involved Apache, PostgreSQL, Windows service accounts, private file permissions, certificate renewal, a stalled file transfer, and several opportunities to confuse “a command returned successfully” with “the thing actually works.”

There was also a failed Apache upgrade detour.

We will get to that.

The useful result is that Companion AI is now live at:

```text
https://bot.helvete.pizza
```

The server deployment is finished.

My actual phone still gets the final acceptance test. I am keeping those two statements separate because this project has already produced enough optimistic progress reports.

## Localhost Is a Terrible Travel Companion

The local app was available at:

```text
http://127.0.0.1:5174
```

That works beautifully when the browser and the application are sitting on the same computer.

It becomes less useful when the browser is in my hand and the computer is somewhere else.

On the phone, `127.0.0.1` means the phone.

It does not mean my desktop. It does not mean the server. It does not mean “please find the computer where I was working on this yesterday.”

Installing the app as a PWA would not solve that either. An icon on the home screen does not secretly contain a PostgreSQL server and all of my conversations.

I needed the application, database, and private files to live on the always-on OVH machine.

The browser could then be wherever I happened to be.

That also meant avoiding a hidden dependency on a model running on my desktop. The saved hosted chat profile was checked, and it did not depend on a loopback model endpoint.

The desktop was allowed to stop being infrastructure.

## This Was a Move, Not a Fresh Start

I did not want a clean installation that politely forgot everything.

I wanted to keep:

- the existing account and login
- Characters, Personas, and Scenarios
- conversation history
- scoped memories
- provider profiles and model choices
- uploaded and generated images
- retained audio
- portrait bindings and the other saved settings

The local copy also needed to stay intact.

“Just upload the character folder” was not going to cover all of that.

Some of the important state lives in PostgreSQL. Images and reference captures live in private storage. Retained audio is stored in the database itself. The runtime configuration is another piece again.

Copying one visible folder would have been an excellent way to preserve the part I could see while quietly abandoning the part that made it work.

So this became a database-and-assets migration, with a separate private configuration transfer.

## The Apache Detour Was Not the Win

The OVH host already had websites and other services running on it.

That made “install whatever the new app wants and hope nothing else notices” an unacceptable deployment strategy.

The Apache security-maintenance work turned into a much larger detour than it should have. There were preparation tools, compatibility checks, backups, and eventually an attempted controlled update.

That update failed after Apache stopped, before the managed binary replacement began.

The original configuration was tested, the original service was brought back, and the existing sites were checked again.

I also opened the sites myself and confirmed that they worked.

That was recovery.

It was not a successful Apache upgrade, and I am not going to rename it one because the server eventually came back.

The phone deployment continued separately. It did not get to keep replaying the failed maintenance attempt until something different happened.

The practical route was to preserve the working host, add the dedicated bot site, and leave the larger Apache update as an explicit maintenance issue.

This was another Hermes-assisted project, and this part was frustrating. The original goal got buried under a lot of infrastructure work while I still could not use the app on my phone.

Eventually, the plan needed to become a deployment again.

## The Important Backup Was Small Enough to Be Suspicious

Before moving the data, I approved a fresh paired backup of the database and private assets.

The database dump was:

```text
404,449 bytes
```

The private image and reference files accounted for:

```text
28 files
1,611,026 bytes
```

Apparently I am continuing my tradition of discovering that the important data is much smaller than the machinery surrounding it.

The backup covered:

```text
31 application tables
27 migration records
28 private image/reference files
Retained audio inside the database dump
```

The dump was checked with `pg_restore --list`, and the stored files were hashed and checked again.

There was also a useful consistency problem caught during review.

If a repeatable-read database snapshot is established before the writer-blocking locks, the backup can see an older database while the filesystem already contains newer changes.

Repeatedly asking that same snapshot whether it agrees with itself does not discover the problem.

It will agree with itself very confidently.

The corrected order acquired the locks before the snapshot reads, exported that snapshot to the dump process, and kept the database and asset checks together.

That is the sort of boring detail I want a backup process to get right before I need the backup.

The dump's SHA-256 was:

```text
e0912385477477f273f0a3867210d25e33d8978f3f970fd28bb519565f2121cf
```

The original local data stayed where it was.

## Windows Had Opinions About the Transfer

Temporary, restricted SSH access made the remaining server work much easier than manually pasting PowerShell through Remote Desktop.

The private configuration went directly over the encrypted connection. Its contents did not need to become a chat message, a command-line password, or a helpful screenshot of all my secrets.

The binary backup transfer was less cooperative.

The first attempt through raw SSH standard input stalled after writing:

```text
81,920 bytes
```

That was not the complete archive.

It was also not permission to run the same operation again and pretend the partial destination did not exist.

The exact stuck receiver process was identified and stopped. The incomplete private copy was retained, and a separately named destination was prepared for an SCP transfer.

That transfer completed, and the checksum matched.

I do not particularly care which transfer method wins the argument as long as the private data stays private and the bytes on the other end are the correct bytes.

## Then the Database Actually Came Back

The destination got its own PostgreSQL installation and database service.

The restore went into a new target, not over some unrelated database already living on the host.

Afterward, the checks compared the restored data with the backup:

- every application table's row hashes
- the migration ledger
- column and constraint definitions
- every private image/reference file

Those checks passed.

Then a separate readback connected through the actual application configuration and checked the retained rows and asset bytes again.

That distinction matters.

Testing a connection with one password and then writing a different database URL into the application's configuration would be a very elaborate way to prove the wrong thing.

The application also got its own database role without superuser, role-creation, or database-creation privileges.

The provider settings and model selections stayed intact. Moving the host did not give the deployment permission to pick a different model or invent a new default voice.

The app owns the character data. The model provider is a service it calls.

I would like those two things to remain separate.

## Closing the Terminal Should Not Turn Off the App

A process running in an open shell is useful during development.

It is less useful as the long-term explanation for why the website exists.

The deployed setup now has two dedicated Windows services:

```text
CompanionApp
CompanionPostgres17
```

The app uses a private Node installation rather than replacing the global Node version used by other things on the machine.

The deployed runtime versions are:

```text
Node.js 24.22.0
PostgreSQL 17.11
FFmpeg / FFprobe 9.0.2
```

The app service runs under its own virtual Windows account. It can read its application configuration and modify its own assets, logs, and temporary files.

It does not get permission to read the database bootstrap secret or wander through the private backups.

The app and database listen only on the server's loopback interface:

```text
Application: 127.0.0.1:5175
Database:    127.0.0.1:5434
```

Apache handles the public HTTPS connection.

The services are configured for automatic startup, and the app has a configured failure-restart action.

The actual first startup and HTTP readiness were verified. A whole-server reboot and a deliberate crash test were not performed just to make a checklist look complete, especially with other services sharing the host.

## HTTPS Was More Than Putting a Padlock on It

The bot site needed its own certificate.

The certificate for the existing main website did not automatically cover a new subdomain just because both names belonged to me.

The dedicated certificate was issued, served, and checked through the public endpoint. The browser connection negotiated TLS 1.3 with the correct hostname.

Renewal uses the existing win-acme scheduled task, with a dedicated record and callback for the bot site.

The callback checks the Apache configuration, requires Apache to already be running, requests the Windows graceful-style reload, and checks which certificate the site actually serves.

That last part is important because:

```text
Reload command returned 0
```

and:

```text
The browser received the expected certificate
```

are different claims.

The actual callback was exercised successfully. A future scheduled renewal is still a future event, not something that has already happened because the configuration looks reassuring.

The new site was also added after the existing default virtual hosts. Moving one personal app did not need to change which existing website answered an unmatched request.

The original sites continued returning HTTPS200 after the changes.

## Please Do Not Give Random Visitors an Expense Account

Before putting a personal model-backed app on a public hostname, account registration needed to be closed.

My existing account could move across with the database.

Random visitors did not need an invitation to create accounts backed by my provider credentials.

The deployed site rejects registration attempts, and the keys stay on the server.

The proxy also overwrites the client-address headers instead of trusting whatever a visitor decides to send. Otherwise, a browser could introduce itself as whichever IP address happened to be convenient.

Same-origin form handling and foreign-origin rejection were checked through the deployed site. Anonymous requests for private images, audio, and conversation inspection were refused.

This is still a personal deployment with maintenance work left to do, not a claim that I accidentally built a fully hardened public service.

## A Streaming Response Should Arrive Before It Is Finished

A chat interface can return HTTP200 and still feel broken if a proxy holds the entire reply until the end.

The browser-facing stream here is NDJSON, not SSE, so generic advice about making SSE work was not enough.

A temporary synthetic endpoint sent two harmless chunks through the real HTTPS proxy.

The first line arrived after:

```text
138 ms
```

The second arrived with a gap of:

```text
651 ms
```

That showed the response was arriving incrementally instead of appearing as one finished lump.

The same fixture confirmed that a forged client-address header was overwritten.

It did not call a model, synthesize speech, generate an image, or spend provider credits.

The temporary process was stopped before the real application service started.

I wanted a transport test, not a surprise conversation on my bill.

## The Phone Does Not Need an Offline Copy of Everything

The PWA side has deliberately limited ambitions.

It can cache public application resources and a generic offline shell.

It does not cache my private conversations, images, or recordings for offline use. It does not queue a message and quietly send it later when the connection returns.

That is a useful boundary for an app which can make paid requests and handle private material.

The deployed site was checked in real Chromium at desktop and mobile widths. The login form rendered, registration stayed closed, protected pages required login, and the mobile page did not overflow sideways.

Both browser contexts had only the allowed public resources in their PWA caches.

Those are useful checks.

They are not the same thing as me using Android Chrome on cellular with a real keyboard open and the desktop powered off.

## I Also Wanted Future Me to Understand the Server

The deployment left an operations guide with the service names, runtime paths, private configuration locations, backup information, certificate renewal setup, and the things that were not tested.

It also records the less exciting leftovers.

The larger Apache security update is still separate work.

WinSW rotates the child process logs, but its own wrapper diagnostic log still needs a retention solution.

There is a verified paired backup, but this deployment did not magically create an ongoing automatic database-and-assets backup schedule.

The documentation also needed to stop telling the next agent to deploy a site that was already running.

I have had enough infrastructure archaeology for now. The next person should be able to find the current state without interpreting a stack of old “still pending” paragraphs like sedimentary rock.

## The Phone Still Gets the Last Word

The server-side result is now in place:

- the existing data is on the host
- the app and database run as services
- the dedicated HTTPS site works
- certificate renewal is configured and its callback was tested
- registration is closed
- the original websites are still available
- the local copy is retained

The remaining acceptance test is mine:

1. Open the hosted URL in Android Chrome.
2. Sign into the existing account.
3. Open an old conversation and check its retained images and audio.
4. Refresh.
5. Turn Wi-Fi off and repeat over cellular.
6. Turn the desktop off and confirm that the hosted app still loads.

Optional installation, microphone behavior, and real generation tests can follow separately.

There is one rule worth keeping in front of me:

> The local copy and the hosted copy do not synchronize.

Keeping the old installation is insurance. Continuing to write new conversations into both installations would create a different problem.

For normal use, the hosted URL is the place to go.

The server work is finally at the point where I can test the app from my phone instead of asking for another explanation of why it is almost ready.

That was the whole point.

[[Companion AI Home]]

[[Companion AI Phone Hosting Guide]]

I will get the source fully commited to GitHub tomorrow night and posted here.