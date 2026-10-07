---
title: 'Three ideas about what a session is'
description: 'One treats a session as a place to return to, with seven doors back. One treats it as a record you can audit and redact. One treats it as the last conversation.'
pubDate: 2026-10-08
kind: comparison
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'sessions', 'recovery']
affiliate: false
draft: false
---

> **Tested** 2026-10-08\
> **Versions** Claude Code 2.1.238 · Muse Code 1.4.3 (1.4.3-R5018.1) · Antigravity CLI **1.3.1**\
> **Scope** command surfaces and on-disk layout; nothing authenticated, no session resumed

Every terminal agent can continue your last conversation. Past that one command
the three diverge so far that "session" barely means the same thing in each.

```
Claude Code   --continue · --resume <id> · --fork-session · --session-id <uuid>
              --from-pr · --teleport · --cloud <id|url>        seven ways in

Muse Code     resume --last | <session-ref>                    one way in
              export --redacted · trace inspect · session-message

Antigravity   --continue · --conversation <id>                 two ways in
```

Claude Code built doors. Muse Code built an archive. Antigravity built the
minimum.

## Claude Code: a session is a place you return to

Seven entry points, and the interesting ones are not the obvious ones.

| Flag | What it resumes |
|---|---|
| `-c, --continue` | the most recent conversation here |
| `-r, --resume [id]` | a conversation by session ID |
| `--session-id <uuid>` | start *with* a chosen ID, rather than resume one |
| `--fork-session` | resume, but branch to a new ID instead of extending |
| **`--from-pr [value]`** | **a session linked to a pull request** |
| **`--teleport [session]`** | **a teleport session** |
| `--cloud [id\|url]` | a cloud session, by ID or by a `claude.ai/code` URL |

`--from-pr` is the one worth stopping on. The unit of work it assumes is not
"my terminal from this morning" but "the conversation attached to that PR" —
which implies sessions outlive the machine they started on and are addressable
by something a team already shares.

`--fork-session` is the other. Resuming normally appends to a session's history;
forking takes the state and branches it. That is a cheap way to try two
directions from one expensive context, and none of the others expose it.

On disk the state is substantial:

```
~/.claude/
  sessions/     6 entries
  projects/     24 entries
  file-history/  shell-snapshots/  session-env/  telemetry/
```

What it does **not** have is a CLI command to export one. There is no
`claude export`. The transcript lives in those directories; getting it out as a
document is not a first-class operation.

## Muse Code: a session is a record you can audit

One way back in — `muse resume`, with `--last` or a session reference, and an
interactive picker when you give neither. No forking, no PR linkage, no cloud.

The investment went somewhere else:

```
$ muse export --help

Exports one session's durable log as a single self-contained JSON document
(export_schema_version 1): timestamps, messages, verbatim encrypted
reasoning, tool calls/results, approvals, question outcomes, model ids,
ses_/trajectory_ ids, and fork/subagent lineage.
```

Read that contents list. **Approvals** and **question outcomes** are in the
record — not just what the model did, but what you permitted and what you
answered when it asked. **Fork and subagent lineage** means a multi-agent run
exports with its tree intact. And `export_schema_version 1` means the format is
a contract rather than whatever the current build emits.

Three more details, all of which read as someone having been burned before:

- **`--redacted`** — a second export mode for transcripts you intend to show
  somebody.
- **Never overwrites.** *"An existing file is never overwritten — the name is
  uniquified."*
- **One line on stdout: the absolute path written.** So `muse export` composes
  into a script without parsing anything.

Then `muse trace inspect`, with flags for `fixture`, `session-log`, `run-log`,
`task-log` and render modes — a separate tool for reading a recorded run back,
not just replaying it.

And `muse session-message`, which lists and sends messages *between* sessions.
That only makes sense if sessions are long-lived addressable things running
beside each other.

The trade is explicit: Muse gives you one door back and a document you could
hand to an auditor. Claude Code gives you seven doors and no document.

## Antigravity: a session is the last conversation

```
-c, --continue        Continue the most recent conversation
--conversation <ID>   Resume a previous conversation by ID
```

That is the whole surface. No fork, no export, no trace, no cross-session
messaging. It had created no directory on my machine at all, having never been
run past the auth prompt.

Consistent with the rest of it — no bundled plugins, no worktree support, no
config model — this reads as a product earlier in its life.

## Side by side

<div class="table-wrap">

| | Claude Code | Muse Code | Antigravity |
|---|---|---|---|
| Continue most recent | ✓ | ✓ | ✓ |
| Resume by ID | ✓ | ✓ | ✓ |
| Interactive session picker | `/resume` in-session | **✓ in `resume` and `export`** | — |
| **Fork a session** | **✓** | lineage recorded, no fork flag | — |
| Choose the ID up front | **`--session-id`** | — | — |
| **Resume from a PR** | **✓** | — | — |
| Cloud / teleport sessions | **✓** | — | — |
| **Export transcript (CLI)** | — | **✓ schema-versioned JSON** | — |
| **Redacted export** | — | **✓** | — |
| Inspect a recorded run | — | **`trace inspect`** | — |
| Cross-session messages | — | **✓** | — |
| Disable session persistence | `--no-session-persistence` | `--no-session-log` | — |

</div>

## What each one is afraid of losing

Claude Code's flags protect against **losing your way back**: the machine
changed, the session is in the cloud, the context is attached to a PR, you want
to try a second approach without destroying the first.

Muse Code's protect against **losing the account of what happened**: what the
model did, what you approved, what you were asked, which subagent did which
part, and a redacted version you can show someone.

Those are different fears and neither tool covers the other's. If you need to
produce a defensible record of an agent session, Claude Code will make you
assemble it from `~/.claude` yourself. If you need to branch an expensive
context in two directions, Muse Code has no flag for it.

## What I did not test

No session was resumed, forked, exported or traced, because none of the three
is authenticated here. Everything above is the documented surface and the
directories each created on install.

In particular I have not confirmed that `--redacted` removes what you would
want removed, or that `--from-pr` resolves a PR the way the flag name suggests.
Both are testable with an account and neither was tested.

## A note on the version line

This post tests **Antigravity CLI 1.3.1**. [Three earlier posts](/tools/three-agents-by-what-they-ship/)
on this site test 1.2.14 — the cask auto-updated between them, within about a
day.

One thing visibly changed in that bump: reasoning effort went from four tiers
to five, gaining `xhigh`. The earlier posts' tables are not wrong; they are
stamped, and the version they describe is in the line at the top of each. If you
are comparing numbers across posts here, compare the version lines first.
