---
type: update
date: 2026-11-04
project: My Mini Retro Television Channels
publish: true
---
# More Fake Television, Now With More Bears

Last night's retro television work was mostly about getting my existing carts into Jellyfin properly and deciding what comes next. Apparently building a collection of pretend television stations also means becoming their scheduling department.

## Jellyfin needs normal filenames

Jellyfin was only showing a few files in each cart folder. The clips were there, but the cart filenames weren't giving it a useful sequence of television episodes.

I wanted a simple workflow: copy a finished cart into my Jellyfin media folder, then run a tool there to rename the clips. I don't need another export process to babysit.

That led to a small standalone PowerShell tool. It turns the copied clips into a sequence like `CN01 - S01E01.mp4`, `CN01 - S01E02.mp4`, and so on. Each bumper, commercial, and show remains its own clip, in cart order. It only changes filenames, with no re-encoding, and keeps a log so the original names can be restored. Previously renamed carts are skipped when another fresh cart gets added.

Naturally, the first launch immediately complained about an empty folder path. Very nice. A replacement was prepared that explicitly passes the tool's own folder to the script. I still need to confirm the corrected run and Jellyfin scan on my setup.

The point is to make watching the carts on my phone as convenient as watching them on the little television. Considerable effort is going into making sure I can enjoy commercial interruptions wherever I am.

## Two flavors of Boomerang

I also started planning BOOM1 and BOOM2. My existing library had Flintstones, Jetsons, Scooby-Doo, and Looney Tunes, but those four already formed the classic cartoon lineup on CN05. Different episodes would avoid literal repeats, but I wanted the new carts to have more of their own identity.

I settled on adding Yogi Bear, Huckleberry Hound, Tom and Jerry, and Quick Draw McGraw. Top Cat was suggested, but Quick Draw was the one I wanted.

The planned lineups are:

| BOOM1 | BOOM2 |
|---|---|
| The Flintstones | Scooby-Doo |
| The Jetsons | Looney Tunes |
| Yogi Bear | Tom and Jerry |
| Quick Draw McGraw | Huckleberry Hound |

The downloads include both the 1940s and 1950s Tom and Jerry collections. That should give me plenty to look through without forcing the two carts to feel like CN05 with a different label stuck on it.

I stopped before running the inventory command while the last files were still downloading. The next session starts there: check the actual episode files, see what Boomerang branding is available, and find the gaps before assembling anything. The no-repeat rule still applies to episodes, commercials, promos, and bumpers across the project.

Neither Boomerang cart is built yet. For now, I have the lineups and a fresh pile of cartoons waiting for inspection. The bears can report to scheduling shortly.
