---
title: 'Three plugin systems: does it help, or can it hurt?'
description: 'Claude Code runs plugins against a no-plugin baseline and reports the delta. Muse Code approves them capability by capability. Two different questions.'
pubDate: 2026-10-07
kind: comparison
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'plugins', 'skills']
affiliate: false
draft: false
---

> **Tested** 2026-10-07\
> **Versions** Claude Code 2.1.238 · Muse Code 1.4.3 · Antigravity CLI 1.2.14\
> **Scope** CLI surfaces, nothing authenticated, no plugin actually installed from a marketplace

You install a plugin into a coding agent. Two reasonable questions follow:

1. **Does it help?** Is the thing I just added actually improving outcomes, or
   is it burning context for nothing?
2. **Can it hurt me?** What is it permitted to do, and when did I agree to that?

Three terminal agents ship plugin systems. **Each is noticeably better at one
of those questions than the other**, and the gap is wide enough that you can
tell which risk each vendor was worried about.

## Claude Code measures whether it helped

```
$ claude plugin eval --help

Run eval cases (<eval dir>/**/case.yaml or prompt.md + graders/*.md) against
a plugin and report scored results.

--ablation <mode>   Run a no-plugin baseline arm and report the score delta
                    (none | with-without; default: with-without ...)
```

Read that second flag again. `plugin eval` does not just run your plugin's test
cases. By default it **also runs the same cases with the plugin absent**, and
reports the difference.

That is a controlled comparison, shipped as a subcommand. The question it
answers is not "did my skill fire" but "did having it make the output better
than not having it" — which is the question that actually matters and the one
almost nobody checks.

Alongside it:

```
$ claude plugin details <name>
Show a plugin's component inventory and projected token cost
```

**Projected token cost.** Every skill you install sits in context and is paid
for on every turn. Claude Code is the only one of the three that will tell you
what that costs before you decide.

Both of these are measurement tools. Neither restricts what a plugin may do.

## Muse Code constrains what it may do

```
$ muse plugins --help

approve <plugin-id[[:kind]:capability-id] | stable-id>
        Trust and enable current runtime capability definitions
reject  <plugin-id[[:kind]:capability-id] | stable-id>
        Trust and disable current runtime capability definitions
inspect <id>     Inspect one installed plugin and its runtime capabilities
validate <path>  Validate a local plugin bundle without installing or executing it
hook test <plugin-id>:<hook-id> --fixture <path>
        Run one installed plugin hook against a fixture
```

Four separate ideas here, all pointing the same way.

**Capability-level consent.** You do not approve a plugin; you approve
`plugin-id:kind:capability-id`. Trust is granted per capability, and the help
says *"current* runtime capability definitions" — implying that when a plugin
changes what it wants, the approval does not silently carry over.

**Validate without executing.** Explicitly stated. You can inspect a bundle
before anything in it runs.

**Hook testing against a fixture.** One hook, one fixture file, in isolation —
you can see what a hook does to a given input without letting it loose on a
repository.

And marketplaces are **snapshots**, not live sources:

```
marketplace add <name> <source>   Add a ... source and store a snapshot
marketplace update <name>         Refresh a marketplace snapshot explicitly
```

Compare Claude Code's, which updates from source:

```
claude plugin marketplace update [name]
        Update marketplace(s) from their source - updates all if no name specified
```

Muse pins by default and makes refreshing a deliberate act. That is the
supply-chain-conscious choice, and it costs you freshness.

None of this tells you whether a plugin is any good.

## Antigravity keeps it small

```
$ agy plugin --help
list · import · install · uninstall · enable · disable · validate · link
```

`validate` wants a manifest and says so:

```
$ agy plugin validate
Error: missing plugin.json: stat plugin.json: no such file or directory
```

Install accepts `plugin[@marketplace]`, and `link <mp> <target>` generates a
marketplace link. It is the recognisable shape of the category with none of the
extras — no eval, no cost projection, no capability approval, no fixtures.

Given its plugin list is empty on a fresh install, this reads as earlier rather
than as a position.

## The table

<div class="table-wrap">

| | Claude Code | Muse Code | Antigravity |
|---|---|---|---|
| Validate manifest | ✓ | ✓ | ✓ |
| **Validate without executing** | — | **explicit** | — |
| **Run test cases** | **`plugin eval`** | `hook test --fixture` (one hook) | — |
| **No-plugin baseline arm** | **✓ default** | — | — |
| **Projected token cost** | **✓** | — | — |
| Inspect capabilities | — | ✓ | — |
| **Per-capability approve/reject** | — | **✓** | — |
| Marketplace | live from source | **pinned snapshot** | `@marketplace` |
| Enable / disable installed | ✓ | ✓ | ✓ |

</div>

## What the shape of each one says

**Claude Code's plugin tooling is built for authors.** Eval cases, graders, an
ablation arm, a token-cost projection — these are the tools you want when you
are writing a plugin and need to know whether it earns its place. The implicit
risk model is that your plugins are yours, and the danger is wasted context,
not malice.

**Muse Code's is built for installers.** Capability consent, no-execute
validation, fixture-isolated hook runs, pinned marketplace snapshots. The
implicit risk model is that plugins come from elsewhere and the danger is what
they do. It fits the rest of that product's surface: named permission profiles,
`muse config` validating *"enterprise configuration documents"*.

Neither is wrong. They are not the same product.

The practical consequence is that **the thing each one is missing is the thing
the other is good at.** Claude Code will tell you a plugin is worth its tokens
and nothing about what it is allowed to touch. Muse Code will let you withhold
a single capability and give you no way to find out whether the plugin helped.

## What I did not test

I installed nothing from a marketplace and ran no eval. Everything above is the
command surface — what each vendor built and documented, not whether it works
as described.

In particular I have not verified that Claude Code's ablation arm produces a
meaningful delta on a real plugin, or that Muse Code's capability approval
actually blocks a capability at runtime. Both are testable and neither was
tested here.

Nothing here is about the quality of what the plugins do, either. A good eval
harness and a bad ecosystem is a real possibility, and this comparison cannot
see it.
