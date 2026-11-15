---
type: update
date: 2026-11-10
project: My Mini Retro Television
publish: true
---
The first twenty carts are finished, but apparently finishing the television collection was the easy way to acquire a second job organizing it.

Since the last update, Retro TV Cart Builder v2 has grown from project setup into something I can actually sit down and populate. I have added my networks and shows, attached artwork, started rebuilding the cart definitions, and begun working through the media library. There are 17,532 files indexed in this project. That number has become an excellent test of whether a feature is useful or just technically exists.

## Stations, shows, and templates

I can now create networks with full names, short names, and artwork, then associate shows with one or more networks. That matters for things like The Flintstones appearing on both Cartoon Network and Boomerang. The show is one record; it doesn't need a separate identity every time a different station airs it.

Carts have their own names, station assignments, show selections, artwork, and reusable templates. The templates describe the sequence of clip types: ident, show intro, episode, commercial, bumper, and so on.

One useful addition was letting a slot have preferred alternatives. I might want a coming-up-next clip, but accept a bumper in if there isn't a suitable one. Or prefer a promo and fall back to a commercial. Those choices are ordered in the template rather than requiring a different template for every possible shortage. The preference rules are in place; generating actual carts from the library is still ahead.

Artwork supplied an early annoyance. The picker accepted WebP files, then rejected many of them because the image decoder couldn't read them. That got fixed, and I was able to finish adding the images. Editing a show also used to send me back to the top of the list, which is a small inconvenience until I have to do it fifty times. The list now keeps my place.

## Organizing by the handful

The media library needed bulk editing almost immediately. Assigning a network and show to an entire series should be one operation. Assigning a year might only apply to one season. Adding tags shouldn't erase the individual details I've already entered.

I now have selection across pages, selection of all matching results, and a bulk editor with explicit choices about which fields to change. Network and show assignments, matching tags, and personal labels can be added, replaced, or removed.

I also needed a way to distinguish files I'd finished organizing from the pile I hadn't touched. There is now a separate classification status and a Needs classification filter. I can finish a batch, mark it classified, and have it drop out of that work queue. That means organized, not watched and approved in Studio.

The control was initially buried in the bulk editor. After asking for it again and discovering it was already there, I requested an obvious Mark classified button. If I can't find the button while using the program to do the thing the button does, it needs a better home.

## Folders were the missing piece

Sorting thousands of clips by title scattered unrelated shows together. Sometimes I got a useful run of episodes; sometimes the list looked like someone had shuffled the entire television schedule in a cement mixer.

Folder browsing made a much bigger difference than another clever filter. I can choose a source library, open a show folder, then open a season. Subfolders can be included, and the list can sort by path or filename as well as title. The folders already contain a lot of the organization. The app finally lets me use it.

It is still a substantial job, but the workflow feels manageable now.

## A little help filling the blanks

I exported the project's media and show records and had ChatGPT prepare a classification pass. Episode titles were checked against reference guides rather than trusting the download's numbering. That distinction matters with cartoons, where one release might package several segments together and another might number each segment separately.

The update filled network, show, year, and classification fields, added TaleSpin, separated Nickelodeon Doug from Disney Doug, and corrected some mistakes I'd already entered for Are You Afraid of the Dark. Uncertain years and extras were left for further review.

I ran the preview, applied the update, and got 4,666 clips updated with zero skipped. The prepared changes included 4,481 newly classified clips. Both data files were backed up, and the source videos were untouched.

An export-and-import workflow for this kind of assisted sorting is now on the future list. For the moment, the library still needs work, and cart generation, composites, Studio, and final export are not finished in v2. But I can spend time organizing the collection without fighting the interface quite so much, which was the point of starting over.
