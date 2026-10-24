---
type: wiki
publish: true
---

# TLS

**TLS**, short for *Transport Layer Security*, protects a connection while data travels between its endpoints. HTTPS uses TLS for web traffic. Certificates help a browser check that it's talking to the expected hostname rather than an impostor.

It doesn't automatically make the application behind that connection safe. A site can have a valid certificate and still mishandle passwords, expose private files, or trust the wrong person. [[Wiki/authentication|authentication]] and application permissions remain separate jobs.

In [[2026-10-20 - Companion AI Finally Escaped Localhost!|the chatbot deployment]], Apache handles the public HTTPS connection while the app listens on [[Wiki/localhost|localhost]]. The update distinguishes a successful reload command from checking the certificate actually served to a browser.

Certificates also need renewal. Scheduling that work is useful, but future automation isn't proven merely because the settings look right. Check the real endpoint and keep maintenance expectations explicit.
