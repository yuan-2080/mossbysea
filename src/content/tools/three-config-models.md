---
title: 'Where Claude Code, Muse Code and Antigravity keep config'
description: 'One layers user, project and local settings on disk. One prints a sha256 of your policy state. One only sets your PATH. Three config models, side by side.'
pubDate: 2026-10-07
kind: comparison
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'configuration', 'enterprise']
affiliate: false
draft: false
---

> **Tested** 2026-10-07\
> **Versions** Claude Code 2.1.238 · Muse Code 1.4.3 · Antigravity CLI 1.2.14\
> **Scope** CLI surfaces and on-disk layout; nothing authenticated, no settings file written

Run the closest thing each has to "show me my configuration" and you get three
different kinds of answer.

```
$ muse config status
Enterprise configuration status
Generation: sha256:db7c1fb6263c2ca1483bcaae0cce50d323b491f600c88f38069012a1b008b5e4
Sources:
  plane=defaults  source_class=system_file                  state=absent
  plane=policy    source_class=system_file                  state=absent
  plane=defaults  source_class=macos_managed_preferences    state=absent
  plane=policy    source_class=macos_managed_preferences    state=absent
```

Claude Code has no equivalent command. Antigravity has no configuration model
at the CLI at all — its `install` subcommand configures your `PATH` and shell,
and that is the whole of it.

The spread is not about maturity. It is about who each vendor thinks writes the
configuration.

## Muse Code writes for the IT department

Four slots, from two orthogonal ideas.

**Two planes.** `muse config validate --plane <defaults|policy>`. One set of
values an organisation suggests, one it imposes. Validated as schema-versioned
documents — `{"schema_version":1,"settings":{...}}` — explicitly *"not the
user's flat settings.json"*.

**Two source classes.** `system_file` and `macos_managed_preferences`. The
second one is the significant one: macOS managed preferences are what an MDM
pushes to a fleet. Muse Code reads enterprise policy straight out of the device
management channel, which means configuring a hundred laptops is a profile push
rather than a hundred file copies.

**And a generation hash.** That `sha256:` line is the fingerprint of the whole
resolved configuration state. For anyone running a fleet, that is the
difference between believing the policy applied and being able to assert it —
one value to compare across machines.

`muse config status` reports all four slots whether or not they exist. On my
machine every one reads `state=absent`, which is itself the useful answer: no
enterprise configuration is in effect here, and I did not have to go looking
through directories to establish that.

## Claude Code writes for the developer

```
$ claude --setting-sources bogus
Invalid setting source: bogus. Valid options are: user, project, local
```

Three layers, and they are visible on disk rather than behind a command:

```
~/.claude/
  settings.json          user
  settings.local.json    local
  settings.json.bak
  policy-limits.json
  policy-limits.json.stamp.json
  remote-settings.json
  projects/  sessions/  skills/  plugins/  telemetry/
```

The layering is the developer's own: machine-wide preferences, per-project
settings committed to a repository, and a local override that is not. That is
the ordinary shape of dotfile configuration and it is aimed squarely at the
person typing.

**Claude Code is not without an enterprise story.** `--safe-mode` disables every
customisation — CLAUDE.md, skills, plugins, hooks, MCP servers, commands,
agents, themes, keybindings — and its help states that *"admin-managed (policy)
settings still apply."* There is a `claude gateway` subcommand that runs an
enterprise auth and telemetry gateway from a YAML config. And `policy-limits.json`
sits on disk next to a `.stamp.json`, which suggests the same
content-stamping idea Muse exposes as a hash.

What is missing is the reporting. There is no `claude config status`. The
closest is `claude doctor`, which covers installation health — version, install
method, update channel, duplicate installations — and does not tell you which
settings sources loaded or what policy resolved to. The mechanism appears to
exist; the inspection surface does not.

## Antigravity has not built one

```
$ agy install --help
Configure environment paths and shell settings
  --dir   Custom directory target to configure PATH for
```

That is the entire configuration surface. No settings file flag, no layering, no
policy, no status. `~/.config/muse` exists on my machine as an empty directory
created at install; Antigravity created nothing at all.

Given it also ships zero bundled plugins and no worktree support, this reads as
a product earlier in its life rather than a stance about configuration.

## Side by side

<div class="table-wrap">

| | Claude Code | Muse Code | Antigravity |
|---|---|---|---|
| **User-facing layers** | **3** — user, project, local | flat `settings.json` | — |
| **Enterprise planes** | policy settings (admin-managed) | **2** — `defaults`, `policy` | — |
| **MDM integration** | not surfaced | **macOS managed preferences** | — |
| **Config state command** | — | **`muse config status`** | — |
| **State fingerprint** | `.stamp.json` on disk | **`sha256:` generation, printed** | — |
| **Validate a config document** | — | **`muse config validate`** | — |
| **Enterprise gateway** | **`claude gateway`** (auth + telemetry) | — | — |
| **Config home** | `~/.claude/` | `~/.config/muse/` (XDG) | none created |
| **Scaffold into a repo** | — | **`muse init`** | — |

</div>

Two small things in that table worth a sentence each.

Muse Code puts its configuration in `~/.config/muse`, following the XDG Base
Directory convention. Claude Code uses `~/.claude`, the older dotfile-home
style, and keeps a great deal more there — sessions, transcripts, file history,
telemetry, shell snapshots. These are different bets about whether an agent's
directory is a config home or a working store.

And only Muse Code has `muse init`, which scaffolds agent config into a
workspace. Claude Code's per-project layer is a file you write yourself.

## The trade each one made

Muse Code's model is the only one an IT administrator could deploy against
without reverse-engineering anything: documented planes, a schema version, an
MDM channel, a validator, and a status command that answers "is my policy live
on this machine" with a hash. The cost is that there is no layering for the
individual — one flat `settings.json` and whatever the organisation pushed.

Claude Code's model is the only one a developer can layer comfortably: a
committed project file, an ignored local override, a user default underneath.
The cost is that its policy mechanism is real but unreportable, so the same IT
administrator has to take it on faith.

Antigravity has not made the trade yet.

## What I did not test

No settings file was written, no policy document validated, no MDM profile
pushed. Everything above is the surface each tool exposes plus the directories
each created on install.

In particular I have not confirmed that Muse Code's `macos_managed_preferences`
slot actually reads a pushed profile, only that it is enumerated as a source.
Nor have I verified what Claude Code's `policy-limits.json` contains or where it
comes from — I listed filenames and deliberately did not read their contents.
