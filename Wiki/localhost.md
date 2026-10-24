---
type: wiki
publish: true
title: Localhost
---

# Localhost

**Localhost** means the computer making the request. The familiar address `127.0.0.1` is an IPv4 loopback address: traffic goes back to the same machine rather than out to another device.

That's the catch in [[2026-10-20 - Companion AI Finally Escaped Localhost!|the chatbot hosting update]]. An app working at a loopback address on the desktop isn't automatically reachable from a phone. On the phone, that address means the phone, not the desktop hiding elsewhere in the house.

Localhost is also useful on a hosted server. An application and [[Wiki/database|database]] can listen privately on loopback while a front-facing web server accepts public HTTPS requests and passes the appropriate traffic inward.

Those are separate boundaries. Local availability, network reachability, [[Wiki/TLS|encrypted transport]], and [[Wiki/authentication|authentication]] each answer a different question. Passing one check doesn't prove all the others.
