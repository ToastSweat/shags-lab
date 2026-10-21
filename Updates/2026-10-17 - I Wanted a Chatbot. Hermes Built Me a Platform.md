---
type: update
date: 2026-10-17
project: ChatBot
publish: true
---
I had a simple idea.

I like character-based AI chat. Sakura has some fun character and roleplay tools, Replika has some interesting companion features, and neither one is exactly what I want. So why not make my own?

You know. A little chatbot.

Naturally, I handed Hermes Agent a product manifest, a roadmap, an architecture plan, and a pile of acceptance criteria, and this has escalated into building an entire application.

Cool. That's normal.

## Five things that shouldn't be the same thing

The idea behind **Companion AI** (working title, because naming things is apparently harder than building them) is that a _Character_ should be its own person on paper, not just a prompt glued to an AI model.

A **User Persona** is who I'm playing as. A **Scenario** is what's happening. A **Conversation** is the actual exchange. **Memory** is what should survive after the conversation ends.

Those are five separate things on purpose. I should be able to put the same character in a completely different situation, play a different persona, or swap AI providers without destroying their identity or mixing everybody's memories together.

And, most importantly, I want to own the data. No more having a favorite character or years of conversations held hostage by somebody else's website.

## Oh, it actually talks

Hermes started with a SvelteKit/Node application backed by PostgreSQL. It has real accounts, character and scenario editors, persistent conversations, and provider profiles. OpenRouter is configured for chat, but the model isn't welded to any particular character.

The first time I got an actual response from a character, with their personality and scenario coming through, was the moment this stopped feeling like a design document and started feeling like a real project.

And it's not just a textbox that spits out answers. I can stream responses, stop and retry a generation, regenerate an answer, and edit my last message without silently throwing away the original conversation. I can start new conversations with different personas and scenarios without rewriting old ones.

I've also got authored opening messages, reusable name placeholders, tags, searchable libraries, and little bits of world-building lore. Turns out making a roleplay app requires a surprising amount of work that isn't actually roleplay.

## The memory problem

Memory was one of the main reasons I wanted to do this in the first place.

A character remembering something is great. A character remembering something that happened in an unrelated scenario, with the wrong version of me, is considerably less great.

So memories have scopes and sources. I can add them manually, correct them, archive them, and see where they came from. The app can also _suggest_ memories from a conversation, but I have to review and accept them before they become part of the character's knowledge.

No automatic rewriting of someone's personality because a model got enthusiastic about a conversation. Thank you very much.

## Rescuing the characters

I also wanted a way to bring my existing Sakura characters along for the ride.

I ended up making a small browser extension that exports Sakura character definitions as JSON. I pulled together **39 characters**, then caught and cleaned up some mangled export text in **10** of those files. That collection gives me some actual material to work with instead of making up test characters all day.

On the app side, Hermes built a reviewed Sakura importer that separates the character from the scenario and opening context. It previews the mapping and warns about duplicates rather than quietly overwriting things.

There's now a native archive system, too. Characters can be exported with their relevant memories, relationships, conversation history, and images, then reconstructed as a new copy. That last part matters. **Exporting a file isn't the same thing as proving you can restore it.**

Replika preservation is still on the list, but I deliberately postponed it instead of letting it hold up everything else.

## Now I want pictures, apparently

The current milestone is image generation.

The first piece is already working: separate image-provider profiles, prompt previews, and manual image generation for Characters, Personas, and Scenarios. Generated images go into a review flow instead of automatically replacing a portrait or burning through credits in the background.

I hit a fun issue where the selected model rejected the image resolution the app was sending. Hermes added explicit resolution choices and better diagnostics, I retested the workflow, and we got it working.

Next is **conversation-specific image generation**, using the context of the actual chat. Consistent-looking characters across multiple generated images are still a problem to solve, not something I'm pretending is finished.

Voice, animation, mobile/PWA polish, and eventually maybe 3D are all later projects. I am trying very hard not to turn this into a virtual dollhouse before the conversation system is solid.

Trying.

## Let the robot write code. Make it prove the code works.

One part I'm especially happy with is the workflow. Hermes builds an increment, runs tests and reviews, makes database backups before migrations, and stops for me to try the feature before it moves on.

The latest image-resolution release passed **783 unit tests, 342 database tests, and 56 targeted browser tests**. Those numbers aren't a substitute for actually using the thing, but they're a lot better than asking an AI to write 10,000 lines of code and hoping for the best.

It has also found and fixed plenty of very real bugs along the way. Which is good, because I have no interest in letting my shiny new AI assistant eat my database.

So that's where things stand. I can create characters, switch personas, set scenarios, chat with them, keep scoped memories, bring in Sakura definitions, export my data, and generate reviewed character imagery. Conversation images are next.

What started as "I should make a little chatbot" has turned into a private, portable companion platform that I actually get to control.

I still haven't named the damn thing.