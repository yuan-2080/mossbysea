---
title: 'Three terminal agents, compared by what they ship'
description: 'Bundled skills: twenty, zero, and none-but-a-marketplace. Three different bets about where an agent''s capability should live, all readable off the CLI.'
pubDate: 2026-10-07
kind: comparison
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'terminal agents', 'CLI']
affiliate: false
draft: false
---

> **Tested** 2026-10-07\
> **Versions** Claude Code 2.1.238 · Muse Code 1.4.3 (1.4.3-R5018.1) · Antigravity CLI 1.2.14\
> **Scope** surfaces and defaults only — **none of the three was authenticated**, so no task was run and nothing here is about output quality

Ask the three how many skills they ship with and you get twenty, zero, and a
question about what you mean.

```
Muse Code     20 built-in skills, in the binary
Antigravity    0 bundled; empty plugin list on a fresh install
Claude Code    none in the binary; skills arrive as plugins from marketplaces
```

Three vendors, three different bets about where an agent's capability should
live. That one is visible in a single command, and so is most of what follows.

## How these numbers were obtained

Every value below was read out of the tool rather than remembered. The useful
trick is passing a deliberately invalid value and letting the parser print the
valid set:

```
$ claude --effort bogus --print "x"
Warning: Unknown --effort value 'bogus' — ignoring it and using the default
effort. Valid values: low, medium, high, xhigh, max.
```

```
$ claude --permission-mode bogus --print "x"
error: option '--permission-mode <mode>' argument 'bogus' is invalid.
Allowed choices are acceptEdits, auto, bypassPermissions, manual, dontAsk, plan.
```

More importantly: **every check was run against all three.** That sounds too
obvious to state, except that [last week I wrote a post](/tools/muse-code-ships-the-door-out/)
which explored one tool properly and compared it against what I assumed about
another. Three claims in it were wrong, and all three failed the same way. The
correction is at the bottom of that post.

So the discipline here is mechanical: no line in the table below exists unless
the same command was run three times.

## The table

<div class="table-wrap">

| | Claude Code 2.1.238 | Muse Code 1.4.3 | Antigravity 1.2.14 |
|---|---|---|---|
| **Bundled skills** | 0 in binary; plugins from marketplaces | **20** | 0 |
| **Effort tiers** | 5 — `low · medium · high · xhigh · max` | **8** — adds `none · minimal · ultra` | 4 — `low · medium · high · max` |
| **Permission model** | enum, 6 values | **named profiles** (`--permission-profile <ID>`) | enum, 2 values |
| **OS sandbox** | no flag | `muse sandbox` + `--sandbox-network` | `--sandbox` |
| **Git worktree** | `-w` + `--tmux` | `-w` with `off\|create\|existing`, `--worktree-base` | not found |
| **MCP management** | full CRUD in CLI | **OAuth only** — servers hand-edited in `settings.json` | full CRUD in CLI |
| **Imports from** | `codex`, `gemini` | `claude`, `codex` | `claude`, `gemini` |
| **Own wire protocol** | — | **MSP**, with `schema` export + `serve` | — |
| **Project concept** | — | — | **`--project` / `--new-project`** |

</div>

## Where capability lives

The twenty-versus-zero gap is the biggest single difference and it is not a
measure of maturity.

**Muse Code** puts them in the binary. Twenty skills covering planning, git
safety, Python environments, frontend taste, test collateral, scaffolding — and
four for migrating off competitors. They are on by default. The bet is that
most of what an agent should know is the vendor's job to decide.

**Claude Code** ships none in the binary. Skills arrive as plugins, from
marketplaces, with `--plugin-dir` and `--plugin-url` for local and remote ones
and a `plugin eval` subcommand for running test cases against them. The bet is
that capability is a distribution problem, and the vendor's job is the registry
and the tooling around it.

**Antigravity** ships nothing and says so plainly: `agy plugin list` on a fresh
install returns *"No imported plugins."* The bet appears to be that you bring
your own, or that this is simply earlier.

Neither extreme is obviously right. Twenty bundled skills are twenty opinions
you did not choose and cannot easily audit; an empty install is zero opinions
and zero help.

## The effort floor matters more than the ceiling

All three cap out around the same place. The spread is at the bottom:

```
Muse Code    none · minimal · low · medium · high · xhigh · max · ultra
Claude Code                  low · medium · high · xhigh · max
Antigravity                  low · medium · high · max
```

Only Muse Code offers `none` and `minimal`. That is a product expecting you to
turn reasoning *down* for cheap work, not only up for hard work — which fits a
pay-per-token model where the dial is a cost control rather than a quality
control.

## Permissions: two enums and a profile

```
Claude Code  --permission-mode       acceptEdits · auto · bypassPermissions ·
                                     manual · dontAsk · plan
Antigravity  --mode                  accept-edits · plan
Muse Code    --permission-profile    <ID>
```

Claude Code and Antigravity both model this as a per-session switch, one with
six positions and one with two. Muse Code models it as a **named profile you
reference by ID** — something written once and reused, and by implication
distributed. `muse config` validating *"enterprise configuration documents"*
points the same direction.

That is the clearest enterprise signal of the three surfaces.

## The MCP difference is the one that will annoy you

All three support MCP. Only two let you manage it from the CLI.

```
$ claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
$ agy mcp add | remove | list | enable | disable
$ muse mcp login | logout          # OAuth only
```

Muse Code's `mcp` subcommand does authentication and nothing else. Its own help
says servers are *"a streamable-HTTP entry under `mcpServers` in settings.json"*
— that is, you add servers by hand-editing JSON.

For a tool that bundles twenty skills so you do not have to configure anything,
leaving MCP server registration as manual file editing is an odd gap. It is
also the kind of thing that is invisible in a feature matrix and obvious within
ten minutes of use.

## Sandboxing

```
Muse Code    muse sandbox   — check or set up the OS sandbox
             --sandbox, --sandbox-network <MODE>
Antigravity  --sandbox      — run with terminal restrictions
Claude Code  no flag
```

Claude Code has no sandbox option. The word appears in its help only inside
advice about other flags — *"recommended only for sandboxes with no internet
access"* — which tells you the model is: the sandbox is yours to provide, and
the tool's own controls are the permission modes.

Six permission values instead of two or a profile ID starts to look like a
deliberate trade rather than an accident.

## Everyone imports from everyone, except the newest

All three ship a competitor importer. Laid out as a matrix, the pattern is
clearer than any single row:

<div class="table-wrap">

| ↓ imports from → | Codex | Gemini | Claude Code | Muse Code |
|---|---|---|---|---|
| **Claude Code** | ✓ | ✓ | — | ✗ |
| **Muse Code** | ✓ | ✗ | ✓ | — |
| **Antigravity** | ✗ | ✓ | ✓ | — |

</div>

Two things fall out of it. **Nobody imports from Muse Code**, which launched in
August and has not yet become something worth harvesting. And every vendor's
source list is a list of the incumbents it wants your users to be leaving —
Antigravity imports from Gemini because it *is* the Gemini CLI's successor, and
from Claude Code because that is where the users are.

The commands are not symmetric in depth. Claude Code's walks config and MCP
servers and writes a reference skill for anything it cannot map. Muse Code's
spans five entry points including unfinished session state. Antigravity's
`agy plugin import claude|gemini` handles plugins, and on my machine reported
*"No claude extensions found"* despite an installed-plugins directory being
present — so either it looks elsewhere or it wants a format I do not have.

## One each that the others don't have

**Muse Code — its own wire protocol.** `muse schema` exports an MSP schema as
JSON Schema or TypeScript; `muse serve` runs an MSP session host over stdio;
`muse session-message` sends messages between sessions. Multi-agent
coordination as a published contract, not an emergent pattern.

**Antigravity — projects.** `--project` and `--new-project` make a project a
first-class session attribute. Neither of the others has the concept at the CLI
level; both are directory-scoped. It also ships `agy mic-serve`, which serves
your machine's microphone to a CLI on another host, which I cannot place.

**Claude Code — eval.** `claude plugin eval` runs test cases against a plugin's
skills. It is the only one of the three that ships a way to check whether the
thing you installed actually does what it claims.

## What this does not tell you

Everything that decides which one you should use.

No task was run on any of the three. Nothing here speaks to code quality,
instruction following, long-context behaviour, recovery from error, or cost in
practice. A surface comparison measures what a vendor decided to expose, which
correlates with the product's intent and not necessarily with its competence.

Three snapshots on one day, too. Muse Code left beta five weeks ago;
Antigravity's CLI is newer than that. Checking these numbers against the
versions at the top is the first thing to do before trusting any of them.

---

**Correction, 2026-10-07.** The table first said Antigravity has no competitor
importer. It does — `agy plugin import claude|gemini`. I had checked `agy
--help` and not the sub-subcommands, so the same class of mistake as last time,
one level deeper. The row is fixed and the matrix above was added because the
complete picture is more interesting than the row was.
