---
title: 'Every agent ships a door out of its competitor'
description: 'Three coding agents ship importers that name rivals in a flag. A Google product routes to Anthropic. If the model were the moat, none of that makes sense.'
pubDate: 2026-10-08
kind: hands-on
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'strategy', 'migration']
affiliate: false
draft: false
---

> **Tested** 2026-10-08\
> **Versions** Claude Code 2.1.238 · Muse Code 1.4.3 · Antigravity CLI 1.3.1\
> **Scope** three importers run in dry-run mode on my own machine. The market reading in the second half is **interpretation of public facts**, clearly separated and labelled.

Run the help for all three terminal coding agents I have installed and each one
names its competitors in a command-line flag:

```bash
claude import [codex|gemini]
muse   skills import --from claude|codex
agy    plugin import claude|gemini
```

Then, on 8 October 2026, Google announced Gemini agent and said it can route
work to Anthropic's Claude.

A vendor does not build a migration tool for a product it considers irrelevant,
and it does not send inference to a competitor's model if the model is the thing
it is defending. Put those two facts together and they say something specific
about where these companies think the defensible part is.

## What I actually ran

Dry-run mode on all three, read-only, no credentials needed.

**Claude Code**, pointed at a Codex config on this machine:

```
$ claude import codex --dry-run

I ran a dry-run scan of your OpenAI Codex config and found:

**User-level MCP servers (3)** — importable now
**7 items with no automatic mapping** (would need manual porting)
```

It offers to write a reference skill documenting the unmapped items, which is a
more considered failure mode than dropping them.

**Muse Code**, pointed at my `~/.claude/skills`:

```
$ muse skills import --from claude --dry-run

candidates:8  installed:0  quarantined:0  skipped:0  failed:0
diagnostic=unsupported-skill-field severity=warning
  message=`allowed-tools` is recorded as advisory metadata but is not
          enforced and grants no tool permissions
```

Eight of nine skills recognised, with a real compatibility warning.

**Antigravity**:

```
$ agy plugin import claude
No claude extensions found.
```

It ran and found nothing in the format it wanted. The command exists.

### Who imports from whom

| ↓ imports from → | Codex | Gemini | Claude Code | Muse Code |
|---|---|---|---|---|
| **Claude Code** | ✓ | ✓ | — | ✗ |
| **Muse Code** | ✓ | ✗ | ✓ | — |
| **Antigravity** | ✗ | ✓ | ✓ | — |

Two readings fall out. **Nobody imports from Muse Code** — it launched in August
and is not yet worth harvesting. And each vendor's source list is a list of the
incumbents it wants your users to be leaving: Antigravity imports from Gemini
because it *is* the Gemini CLI's successor, and from Claude Code because that is
where the users are.

What gets carried across is the interesting part. Not code — **configuration**.
MCP servers, memory notes, rules, skills, and in Muse Code's case unfinished
session state.

---

## The reading

**Everything below this line is interpretation.** The commands above I ran; the
following is me reasoning from them and from public announcements. Treat it
accordingly.

### If the model were the moat, you would not do any of this

Three behaviours only make sense if the model is not the defensible asset:

1. **Shipping an importer for a competitor.** You are asserting that what holds
   a user is portable — and then building the tool that ports it.
2. **Routing to a rival's model.** Google's new agent can [send work to
   Anthropic's Claude](https://9to5google.com/2026/10/08/gemini-agent-google-cloud/).
   You do not do that while defending model superiority.
3. **Documenting the importer inside the agent's own skill descriptions**, as
   Muse Code does, so the model volunteers migration unprompted.

What they are competing for instead is the layer the importers move: your MCP
servers, your skills, your rules, your session history. That accumulates, it is
specific to you, and until someone writes an importer it does not travel. Which
is presumably why they all wrote one.

### Each of them is buying what it lacks

The 2026 moves line up suspiciously neatly along that reading.

| | Has | Lacks | Move |
|---|---|---|---|
| **Anthropic, OpenAI** | model and product | — | defend |
| **Meta** | capital, data centres | model lead, developers | **buy data with price** |
| **Google** | model, enterprise channel | developer mindshare | **rebuild, and route to rivals** |
| **SpaceXAI** | compute | product, revenue | **buy the product** |

**Meta** prices Muse Code at $1.25 / $4.25 per million tokens — or **$0.10 /
$0.20 if you let them train on your code.** Twelve times cheaper in, twenty-one
out. That is not a discount, it is a purchase offer for your source code.
Reporting around the launch put it plainly: another way to generate revenue from
AI [while investing heavily in data centres](https://www.cnbc.com/2026/08/05/meta-debuts-muse-code-to-take-on-anthropic-and-openai-.html).

**Google** retired Gemini CLI for individuals on 18 June 2026 — enterprise
access [remains unchanged](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) —
rebuilt the developer surface as Antigravity, and launched an enterprise agent
that routes to Claude. Three tiers, three doors, and an admission in the third
that model parity is not where this is won.

**SpaceX** closed its roughly **$60 billion all-stock acquisition of Anysphere**,
Cursor's parent, on 14 August 2026, folding it into the SpaceXAI division formed
when SpaceX absorbed xAI in February. The reading in the coverage was compute on
one side and product on the other: Cursor had the revenue and the workflow
surface, xAI had Colossus and no comparable product.

*(Worth correcting a thing I had wrong before checking: the buyer was SpaceX
itself, now publicly listed, not xAI directly.)*

### Why coding, specifically

Of all the things an agent could do, coding got the investment from everyone at
once. Three properties it has that personal assistants and enterprise search do
not:

- **Someone already pays.** There is an existing budget line for developer
  tools and a user base accustomed to subscriptions.
- **It consumes.** An agent loop burns orders of magnitude more tokens than
  chat. If you have built data centres, this is the demand that fills them.
- **It accumulates state.** Skills, servers, rules, history — the stuff that
  makes switching annoying, which is the only thing resembling lock-in when the
  models are substitutable.

The third is why the importers exist. They are each other's answer to the one
moat any of them actually has.

## What I did not test

I ran three importers in dry-run and read three help outputs. I have not
authenticated Muse Code or Antigravity, run a task on either, or used Gemini
agent, which is enterprise-only and which I cannot access.

The market reading is reasoning, not measurement. The importer behaviour is
verifiable on any machine with the three tools installed — the acquisition
rationales are not, and I am relaying them from coverage rather than from the
companies.

One claim I saw and could not corroborate: that each Gemini agent gets its own
Workspace account with a Gmail address and Drive storage. Treat it as
unverified.

---

The cheapest version of this check is one you can run yourself in a minute. Open
the help for whatever agent you use and look for the names of its competitors.
Where a vendor builds you a door out of someone else's product, it has told you
what it thinks is worth taking — and by omission, what it thinks is not.
