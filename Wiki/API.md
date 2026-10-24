---
type: wiki
publish: true
---

# API

An **API** is a way for programs to ask each other for information or actions. Think of it as a menu: it tells the caller what it can request, what details to provide, and what kind of reply to expect. A web API often sends that reply as [[Wiki/JSON|JSON]].

The [[Booru Image Downloader Home|Booru Image Downloader]] asks an API for posts matching selected tags instead of reading the website like a person. [[Safe Cracker Discord Activity Home|Safe Cracker]] has its own API: the browser sends guesses, and the server checks the answer and records the result.

An API isn't automatically public or unlimited. [[Wiki/authentication|authentication]] proves who's calling; [[Wiki/rate limiting|rate limiting]] controls how often; [[Wiki/pagination|pagination]] splits large result sets into manageable chunks.
