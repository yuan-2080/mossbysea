---
title: 'Muse Code ships the door out of Claude Code'
description: 'Meta bundles twenty skills with its terminal coding agent. Four exist only to move you off Claude Code or Codex. I pointed the importer at my own setup.'
pubDate: 2026-10-07
kind: hands-on
tags: ['Muse Code', 'Claude Code', 'terminal agents', 'migration']
affiliate: false
draft: false
---

> **Tested** 2026-10-07\
> **Versions** Muse Code 1.4.3 (1.4.3-R5018.1) · Claude Code 2.1.238\
> **Scope** installed and inspected; **not** authenticated, so no task was run

Meta's coding agent ships twenty built-in skills. Four of them exist for one
purpose: moving you off Claude Code or Codex. Unfinished sessions, memory notes,
MCP server configuration, rules, skills — five entry points, documented inside
the agent's own skill descriptions so the model offers them unprompted.

Claude Code ships no `resume-muse`.

Muse Code launched on 5 August 2026 and left beta on 1 September. It is a
terminal coding agent: same shape as Claude Code, same shape as Codex CLI. On
macOS it is one Homebrew cask and a binary called `muse`.

I installed it, read its entire surface, and ran the one thing that can be run
without credentials. That last part turned out to be the interesting bit.

**What this post is not:** a capability comparison. I have not authenticated,
so nothing here says a word about whether Muse Code writes better code than
Claude Code. What it covers is everything you can learn before the first
token — the CLI surface, the bundled skills, and what both reveal about who
the product is aimed at.

## Twenty bundled skills, and four of them are for leaving

`muse skills list --source built-in` returns twenty entries. Most are what you
would expect: planning, git safety, Python environments, frontend taste,
scaffolding, test collateral.

Four are not:

| Skill | Its stated job |
|---|---|
| `resume-claude` | *"Continue work from a local Claude Code session in Muse Code... with or without a session ID or log path"* |
| `resume-codex` | The same, for Codex |
| `migrate` | *"Bring what Claude Code or Codex already remembers or has configured for this user into Muse Code — their memory notes and their MCP servers"* |
| `import` | Continuation from *"other coding agents and unnamed artifacts"* |

Plus a dedicated subcommand:

```bash
muse skills import --from claude|codex [--scope user] [--dry-run] [--force]
```

And, per `migrate`'s own text, `/rules import` for rule files.

Add those up and the covered surface is: **unfinished session state, memory
notes, MCP server configuration, rules, and skills.** That is not a convenience
feature someone added late. That is a product decision to make switching cost
approximately zero, implemented across five entry points and documented inside
the agent's own skill descriptions so the model volunteers it.

The `migrate` skill even routes you correctly between the options — session
transcripts go to `resume-claude`, MCP servers and memory go to `migrate`,
skills go to `skills import`. Somebody drew that decision tree deliberately.

I have not seen the reverse anywhere. Claude Code ships no `resume-muse`.

## Pointing it at my own setup

`--dry-run` makes the importer read-only, which means it runs without
credentials. So I aimed it at the nine skills in my actual `~/.claude/skills`:

```
$ muse skills import --from claude --dry-run

diagnostic=unsupported-skill-field severity=warning
  path=/Users/.../skills/journalist-writer/SKILL.md
  message=`allowed-tools` is recorded as advisory metadata but is not
          enforced and grants no tool permissions

candidates:8  installed:0  quarantined:0  skipped:0  failed:0
compat:claude-code-in-slack  unavailable-binaries:start,stop,daemon,logs
compat:<redacted>            unavailable-binaries:interval,dt,cannot,sql
```

Eight of nine recognised as candidates, nothing installed because it was a dry
run, and three diagnostics. Two of those are worth keeping.

### `allowed-tools` is accepted and ignored

Claude Code skills can carry an `allowed-tools` field in frontmatter. Muse Code
parses it, records it, and **grants nothing**. The warning says so plainly,
which is the right behaviour — far better than silently honouring a field with
different semantics.

But if you migrate a skill that leaned on `allowed-tools` to constrain what it
could touch, that constraint is gone and only a warning line tells you. Worth
knowing before you trust a migrated skill with anything destructive.

### The compatibility checker reads prose as commands

Look at the second compat line. The importer scans skills for binaries they
invoke and reports which are missing. For one of my skills it reported four
unavailable binaries: `interval`, `dt`, `cannot`, `sql`.

None of those are commands. They are **words from the skill's prose**, caught by
whatever extracts command names. `sql` appears because the skill talks about
SQL. `cannot` appears because a sentence contains the word "cannot".

Harmless — it is a warning, not a gate. But it tells you the check is a
heuristic over text rather than a parse, so a real missing dependency could sit
in the same list as the noise and read as noise.

## What the flags say about the design

Two terminal agents, same category. The differences in surface are where the
design shows.

**Reasoning effort has eight tiers, not four.**

```
Muse Code    none | minimal | low | medium | high | xhigh | max | ultra
Claude Code  low | medium | high | max
```

Whether eight is better than four is an empirical question I cannot answer
here. What it signals is a product expecting you to tune cost per task rather
than pick a setting once.

**Git worktrees are a top-level flag.**

```bash
muse -w                           # create a worktree for this session
muse --worktree existing --worktree-existing <path>
muse --worktree-base <ref>
```

Isolation for parallel agents is on the front door, not behind a setting.

**It has its own wire protocol.** `muse schema` exports an "MSP wire schema" as
JSON Schema or TypeScript, and `muse serve` runs an MSP session host over
stdio. There is also `session-message`, for sending messages *between* sessions.
Multi-agent coordination is a first-class concept with a published schema, not
an emergent pattern.

**Oddities worth noting.** `muse voice` transcribes an audio clip. `--provider`
takes `echo`, `meta` or `local` — a stub provider and a local-model path are
built in. `--preset` offers `native-basic`, `miniswe` and `openai-apply-patch`,
the last of which is an OpenAI-compatible edit format, bundled.

And `model-profile` prints internal architecture-decision-record IDs at you:

```
re-resolution (ADR 42674 D7):
  default_reasoning_effort  startupFixed — it SELECTS the session tier, so
                            re-resolving it mid-session would fight the
                            user's own /effort choice
```

Shipping your ADR numbers in CLI output is a choice. I rather like it.

## The price of the cheap tier

Muse Code is pay-as-you-go. Two rates:

| | Input | Output |
|---|---|---|
| Standard | $1.25 / M | $4.25 / M |
| **If you let Meta train on your code** | **$0.10 / M** | **$0.20 / M** |

**Twelve times cheaper for input, twenty-one times for output**, in exchange for
your code entering a training set.

For a weekend project that may be an easy yes. For anything under an employer's
confidentiality terms it is not your decision to make, and the discount is
large enough to be tempting to someone who has not thought about it. The rate
card is the clearest statement of what the data is worth to Meta.

Authentication offers the same kind of choice. `muse login` runs a browser
approval against a Meta account; `META_API_KEY` skips it entirely, and the help
text states that the key takes priority over the account login. An API-key path
that works without an account is not something every vendor still offers.

## What I did not test

Everything that matters most.

No task was run, so there is nothing here about code quality, instruction
following, long-context behaviour, tool use, or how it recovers from its own
mistakes. No elapsed times, no rework counts, no cost in practice.

The import was `--dry-run`, so I have not confirmed that an imported skill
actually works once installed — only that the importer recognises it and what
it warns about.

A real comparison needs one identical task, run on both, with acceptance
criteria fixed in advance. That is a longer piece and this is not it.

---

What I will say after a day of reading its surface: Muse Code is not positioned
as an alternative for people choosing their first agent. It is built for people
who already have one. The twenty bundled skills include four for leaving a
competitor, the importer handles sessions and memory and MCP servers and rules
and skills, and the pricing undercuts by an order of magnitude if you will pay
in code.

That is a switching strategy, and it is unusually explicit about it.
