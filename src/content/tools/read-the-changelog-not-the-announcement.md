---
title: 'Read the changelog, not the announcement'
description: 'Google launched a universal work agent today. I cannot run it. What I can run is `agy changelog` — and bug fixes say more than any launch post.'
pubDate: 2026-10-08
kind: hands-on
tags: ['Antigravity', 'Gemini', 'Google', 'changelogs']
affiliate: false
draft: false
---

> **Read** 2026-10-08 · **Version** Antigravity CLI 1.3.1\
> **Scope** one command — `agy changelog` — plus Google's own published statements. **Nothing authenticated, no agent run.**

Google announced **Gemini agent** today, 8 October 2026: a single universal
agent for work, running in Gemini Enterprise and Workspace, able to spawn
temporary sub-agents with their own identities, and — per the announcement —
able to route to Anthropic's Claude as well as Google's own models.

I cannot run it. It is an enterprise product and I do not have Gemini
Enterprise. **Nothing in this post is a review of it**, and if you came looking
for one, the launch coverage is better than anything I could write without an
account.

What I do have installed is Antigravity CLI, Google's developer-facing agent.
And it ships a subcommand almost nobody runs:

```bash
agy changelog
```

Roughly 170 lines of release notes. It is the most informative document Google
has published about that product, and it was not written to inform you.

## Why a changelog beats a launch post

A launch post is written to make you want the thing. A changelog is written to
stop support tickets. The second constraint produces better evidence, because
every entry is an admission that something was wrong, and the shape of what was
wrong tells you what the product actually is.

Three things you can read off it.

### It says what was broken, which says what exists

```
Fixed subagents that stopped on an error, such as running out of quota or
model capacity, being shown as `Done` in `/agents` and the list of running
agents; they now show `Error:` with the reason.
```

Two facts in one bug. Subagents are real and were shipping. And until 1.3.1, a
subagent that died of quota exhaustion **reported success**. If you ran a
multi-agent job before this version and it came back clean, clean did not
necessarily mean clean.

No announcement will ever tell you that. This one does, in passing, while
apologising.

```
Fixed `/tasks`, the active task list, and the status line's task count showing
only background shell commands; timers and recurring jobs the agent schedules
... now appear there too.
```

So the agent schedules its own timers and recurring jobs — and for some number
of versions, you could not see them in the task list.

### It says who is using it, by saying where it broke

```
Fixed trackpad and mouse-wheel scrolling in the conversation view jumping back
and forth, most noticeably over SSH or inside tmux.

Fixed markdown table columns drifting out of alignment when a cell contains
emoji ... or scripts with combining characters such as Hindi, which affected
every session over SSH or inside tmux.

Improved the Windows command sandbox so sandboxed commands no longer need
administrator rights.

Fixed installing ... plugins with `/plugin` on Windows failing while one of the
plugin's MCP servers was running.
```

SSH, tmux, Windows, non-Latin scripts, emoji in tables. These are not the bugs
of a demo. They are the bugs of people running the thing on real machines they
did not get to choose, which is a thing you cannot establish from a feature
list.

### It says what the vendor changed its mind about

```
Changed the default `Verbosity` setting from `high` to `medium` ... This applies
to everyone who never picked a verbosity, including anyone who selected `high`
while it was still the default.
```

A default moved under everyone who had not made a choice — including people who
had chosen the old default while it *was* the default, and therefore never
stored the preference. That is a real behaviour change delivered silently to
the people least likely to expect it, and the note says so plainly rather than
burying it.

And then this, from 1.2.17:

```
Added announcement cards above the prompt for model launches, deprecations,
and other service notices.
```

A product that builds in-terminal cards for **deprecations** is a product that
expects to deprecate things at you. Which brings us to the other half of
today's story.

## What Google actually said about retiring Gemini CLI

Primary source, Google's developer blog:

> *"You now require multiple agents communicating with each other to split up
> the work and solve complex problems."*

That is the stated reason for folding Gemini CLI into Antigravity. The dates
and the split are unambiguous:

| | |
|---|---|
| Gemini CLI consumer access | **ends 18 June 2026** — it "will stop serving requests" |
| Who loses it | Google AI Pro and Ultra consumers, free Gemini Code Assist individuals, Code Assist for GitHub |
| **Who keeps it** | **Enterprise.** Access "remains unchanged" under Code Assist Standard or Enterprise licences |
| Carried over to Antigravity | "Agent Skills, Hooks, Subagents, and Extensions" |

I hit the consumer half of that in person [a few days ago](/tools/installing-is-not-the-hard-part/):
`npm i -g @google/gemini-cli` installed cleanly, reported version 0.62.0, and
the Google sign-in returned a message telling me to migrate to Antigravity. The
package still ships, four months after the thing behind it stopped serving
individuals.

Line those up and the pattern for the day is tidy: consumers are moved off the
old developer CLI, developers are moved onto Antigravity, and the new universal
agent announced today is an enterprise product. Each tier gets a different
door.

## The version moved while I was writing about it

[Three posts here](/tools/three-agents-by-what-they-ship/) test Antigravity CLI
**1.2.14**. This one tests **1.3.1**. The Homebrew cask is marked
`auto_updates` and took one between them — about a day apart.

The changelog shows what went past in that window: 1.2.17, 1.3.0, 1.3.1. One of
them changed a default for everyone. One of them stopped failed subagents from
reporting success.

The earlier posts are not wrong. They are stamped, and the version they
describe is in the line at the top of each. This is the entire argument for
stamping them, and I did not expect to get a demonstration this quickly.

## What I did not do

I did not run Antigravity. I have not authenticated it, so nothing here is
about its output, its speed, its reasoning, or whether its subagents are any
good now that they report their errors.

I did not run Gemini agent either, and will not be able to without an
enterprise account. The claims about it above are Google's, relayed, not
tested — including one I saw reported and could not corroborate, that each
agent gets its own Workspace account with a Gmail address and Drive storage.
Treat that one as unverified.

What I did was run one command that ships with a tool I installed, and read it.

---

It is worth doing on whatever you are evaluating. `agy changelog`,
`CHANGELOG.md`, the releases page — whatever the vendor keeps. Read it
backwards from the current version and ask what each fix implies had been true
before it. The answer is usually not in the launch post, because the launch post
was not trying to tell you.
