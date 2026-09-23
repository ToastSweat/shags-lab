---
title: 2026-09-22 - I Made A Discord Activity and Accidentally Built An API!
type: update
date: 2026-09-22
project: Safe Cracker Discord Activity
publish: true
---
I Made A Discord Activity And Accidentally Built An API

This started because I wanted to remake a stupid little game.

Safe Cracker is simple.

There is one safe every day.

It has a four-digit combination from:

```text
0000-9999
```

You guess a number.

The game tells you:

```text
HIGHER
```

or:

```text
LOWER
```

and you keep going until you crack it.

That is basically the whole game.

No complicated inventory.
No skill tree.
No twelve-hour tutorial.
No battle pass featuring Tactical Safe Pants.

Just you, a number, and the rapidly increasing realization that you absolutely should have remembered whether 4200 was too high.

The scoring is equally simple.

Fewest guesses wins.

If two people use the same number of guesses, fastest time wins.

I had made versions of this idea before, but this time I wanted it to live inside Discord as an Activity.

That seemed reasonable.

Make a little web game.
Put it in Discord.
Done.

Naturally, I built an authentication system, an API, a database, a leaderboard service, production infrastructure, HTTPS certificates, persistent sessions, Rich Presence, and a social sharing system.

This happens to me a lot.

The game itself came first.

I built it with SvelteKit and TypeScript.

The first version was intentionally ugly.

I did not want to spend three days making glowing buttons before I knew if the game actually felt good.

The important part was making the guessing loop fast.

You enter a four-digit number.
Hit Enter.
Immediately start entering another guess.

The game never waits for an animation.
It never locks the keypad while HIGHER or LOWER is displayed.
It never makes you watch some cute little transition before accepting another number.

Safe Cracker does not wait for the player.

The feedback flashes briefly and disappears.

That matters more than it sounds.

A huge part of the game is remembering the range in your own head while trying to move quickly.

If the game kept a visible guess history or showed the current minimum and maximum values, it would basically solve half the puzzle for you.

So it does not.

You have to remember.

Skill issue.

Once the prototype felt right, I needed an actual daily safe.

The game uses Central Time as the authoritative clock because that is where I am and apparently I have appointed myself the International Commissioner of Safe Time.

Every calendar day maps to a Safe number.

The launch date is Safe #001.

The next day is Safe #002.

And so on.

The combination itself is generated deterministically on the server using HMAC-SHA256 and a private secret.

That means the same date always produces the same safe combination without me having to manually create thousands of daily puzzles.

It also means the answer never needs to exist in the browser before the player solves it.

The client knows:

```text
Safe #009
```

The server knows:

```text
Nice try.
```

That distinction became increasingly important because I decided the server should be authoritative about basically everything that matters.

The browser does not decide how many guesses you made.
The browser does not decide your final time.
The browser does not decide whether you already completed today's safe.

The server does.

The first guess creates the run.
Every valid guess increments the attempt count in SQLite.
The first guess starts the official timer.
The correct guess stops it.
If you close Discord halfway through and come back later, your run is still there.

I tested that specifically.

I made a few guesses, closed the Activity, waited, reopened it, and watched the timer jump forward correctly.

The safe had not forgotten me.
Unfortunately.

Once a run has started, you are committed.
Closing the Activity does not magically stop time.
Once you crack the safe, you cannot replay it that day for a better score.
That would make the leaderboard fairly pointless.

This was also around the time I realized:

> Oh shit. I am making an API.

That was genuinely exciting.

"Make an API" has been one of those vague programming bucket-list things in my head for years.

Apparently I just needed to stop thinking about APIs and start trying to make a tiny safe game.

Safe Cracker now has several actual HTTP endpoints:

```text
GET  /api/daily
POST /api/token
GET  /api/me
GET  /api/run
POST /api/guess
GET  /api/stats
GET  /api/health
```

The Svelte frontend talks to those endpoints.

Some are public.
Others require an authenticated session.
The browser sends guesses to the server.

The server checks the answer, records the attempt, calculates the official elapsed time, and sends back the result.

That is an API.

Look at me go.

Naturally, none of this was useful inside Discord until I knew who the player actually was.

So I wired in Discord OAuth through the Embedded App SDK.
When Safe Cracker launches inside Discord, it asks Discord to identify the player.
The authorization code goes to my server.

The server exchanges it with Discord.

Then the server independently asks Discord who that token belongs to instead of simply trusting whatever identity the browser claims it has.

The player gets stored in SQLite.

Then Safe Cracker creates its own random session token, stores only the hash in the database, and gives the browser an HttpOnly Secure cookie.

So Discord authenticates who you are.
Safe Cracker maintains its own authenticated session afterward.

That sentence makes this project sound approximately nine hundred times more sophisticated than:

> Guess the number, idiot.

But here we are.

There was, of course, an authentication bug.
I had added logic that removed old Safe Cracker sessions whenever a new one was created.
That part worked.

Unfortunately, while editing the function, I removed the part where it actually returned the new session token.

So the login process successfully created a session and then immediately attempted to read:

```text
session.token
```

from:

```text
undefined
```

Beautiful.

The Activity responded with the highly informative message:

```text
Discord auth failed
```

After digging through the actual code, I found the missing:

```ts
return {
    token,
    expiresAt
};
```

and everything came back to life.

That bug also taught me something useful about the build process.

```text
npm run build
```

can successfully build the application without catching every TypeScript mistake.

So now the ritual is:

```text
npm run check
npm run build
```

Much better.

Once accounts and daily runs were persistent, the next obvious feature was competition.

I added streaks.

Current streak.
Best streak.
Total safes cracked.

The current streak has one rule I particularly like:
Your streak does not die merely because you have not played today's safe yet.
If you completed yesterday, your streak remains alive throughout today.
It only breaks once an entire day has actually been missed.
That sounds obvious, but "obvious" things still have to become actual database logic.

Then came the daily leaderboard.

Players are ranked by:

```text
1. Fewest guesses
2. Fastest time
3. Completion time as a stable final tiebreaker
```

The game returns the Top 10 and also returns your own rank separately if you are outside the Top 10.

The first leaderboard was not especially competitive.
It was me.
Rank #1.
Also last place.
An incredible performance.

I tested the whole persistence chain by completing Safe #001.

The result was:

```text
22 guesses
03:00.55
```

Then I closed the Activity.
Reopened it.
Same result.
Same completed state.
Same leaderboard entry.
No replay.

That was the moment the backend stopped feeling theoretical.
The little game had memory.
Then I needed somewhere for the thing to actually live.

I already run a Windows server with XAMPP and Apache for `helvete.pizza`, so Safe Cracker got its own subdomain:

```text
safecracker.helvete.pizza
```

The production SvelteKit build runs through Node on:

```text
127.0.0.1:3000
```

Apache sits in front of it as a reverse proxy.
Discord talks to Apache over HTTPS.
Apache talks to the local Node service.
The Node service talks to SQLite.
This project apparently needed architecture.
I created the DNS record.
Configured Apache virtual hosts.
Enabled the proxy modules.

Set up a separate Let's Encrypt certificate using win-acme.

The certificate uses automatic filesystem HTTP validation so renewal does not require me to perform some ridiculous ceremonial DNS ritual every few months.

The Node application runs through a Windows Scheduled Task:

```text
PGN Safe Cracker
```

It starts automatically with the server.

The production update process is now:

```text
stop task
git pull
npm ci
npm run build
start task
```

There was also an educational period where I forgot the `npm run build` part.

Git had the new source.
Node was still happily running yesterday's compiled application.
Computers are extremely literal.

The development copy also lives inside Dropbox, which repeatedly decided that locking generated Svelte files while I was trying to build them would be a helpful collaboration feature.

It was not.
I now pause Dropbox before Git or build operations.
We have reached an understanding.
Once the production app was stable, I added a health endpoint:

```text
GET /api/health
```

It returns something like:

```json
{
  "status": "ok",
  "safeNumber": 9,
  "date": "2026-09-21",
  "uptimeSeconds": 1843
}
```

Nothing sensitive.

Just enough information to prove:

```text
Internet
→ Apache
→ Node
→ SvelteKit
→ daily-safe logic
```

is alive.

I tested it locally.
Then I tested the production URL.
It worked.
Tiny feature.
Extremely satisfying.

The Discord integration was still missing one thing, though.

If somebody was playing Safe Cracker, I wanted Discord to actually show that they were playing Safe Cracker.

So I added Rich Presence.

The Activity now updates Discord while you play.

It can show:

```text
Cracking Safe #009
Playing the daily safe
```

with an elapsed timer.

Once the safe is open, it changes to something like:

```text
Cracked Safe #009
19 guesses • 0:58 • 1 day streak
```

This required adding Discord's:

```text
rpc.activities.write
```

OAuth scope and keeping the Embedded App SDK instance alive after authentication so the rest of the game could update the Activity.

At first I thought the code was broken because absolutely nothing appeared on my profile.

After investigating the SDK, the scopes, the Activity state, and probably preparing myself emotionally for another authentication adventure, I discovered the problem.

Discord's:

```text
Share my activity
```

setting was turned off.

Turned it on.
There it was.
Of course.

The profile now shows Safe Cracker properly while I am playing, complete with the game artwork and current result.

That immediately led to the next feature.
If somebody cracks the safe, they should be able to brag about it.
So I added Discord's native Activity sharing flow.

After completing the daily safe, there is now a:

```text
SHARE RESULT
```

button.

It opens Discord's normal share dialog and produces a proper result post.

Something like:

# Shagwrath was playing Safe Cracker

🏆 Rank #**1**  
🔥 **2** Day Streak  
**27** Guesses • 01:09.12

Then Discord automatically attaches the Safe Cracker Activity card underneath it.

The card has the game artwork.
The game icon.
The Activity name.

And, most importantly, a big:

```text
Play
```

button.

So someone can see another person's score in Discord, click Play, and immediately launch the Activity themselves.

That little loop is probably my favorite thing in the project so far.
Someone plays.
Discord shows that they are playing.
They finish.
They share their score.
Someone else sees it.
They click Play.
Now they are trying to beat it.

That is exactly what I wanted this thing to feel like.

Safe Cracker currently has:
Discord OAuth authentication.
Secure persistent sessions.
A server-authoritative daily game.
Deterministic daily combinations.
SQLite persistence.
Resumable runs.
Server-controlled timing and attempts.
Completion lockout.
Current and best streaks.
Daily leaderboards.
A REST-style HTTP API.
A production health endpoint.
Apache reverse proxy hosting.
Automated HTTPS.
Windows startup through Scheduled Tasks.
GitHub deployment.
Discord Rich Presence.
Native Discord result sharing.

And a direct social path from:

```text
Look at my score
```

to:

```text
Fuck you, I can beat that.
```

Not bad for higher-or-lower.

The funniest part is that the visual design is still basically the prototype.
It is a dark rectangle.
There are buttons.
They work.
That was intentional.

I wanted to prove the entire game underneath the graphics before spending time decorating it.

Now I know that the authentication works.
The database works.
The API works.
The daily puzzle works.
Persistence works.
The leaderboard works.
Discord presence works.
Sharing works.
Production works.

So now I can finally start making the thing actually look and sound like Safe Cracker instead of a development interface somebody forgot to delete.

That will be a much nicer problem to have.

For now, though, I am extremely happy with what this little game quietly turned into.

I wanted to remake a number guessing game.

Instead I learned SvelteKit, built a server-authoritative web application, made an actual API, implemented OAuth and secure sessions, deployed a Node service behind Apache, added persistent multiplayer-adjacent statistics, and wired the whole thing directly into Discord.

Bucket list item:

> Make an API.

Apparently checked.

[[Safe Cracker Discord Activity Home]]
