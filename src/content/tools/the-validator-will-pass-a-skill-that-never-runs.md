---
title: 'The validator will pass a skill that never runs'
description: 'Missing frontmatter is a warning. Missing description is a warning. Only broken YAML fails. A clean validation says little about whether your skill fires.'
pubDate: 2026-10-07
kind: guide
tags: ['Claude Code', 'skills', 'plugins', 'validation']
affiliate: false
draft: false
---

> **Tested** 2026-10-07 · **Version** Claude Code 2.1.238\
> **Method** deliberately broken skills, validated, exit codes recorded\
> **Worked example** the [`seo-audit` skill](https://github.com/yuan-2080/mossbysea/tree/main/.claude/skills/seo-audit) in this site's repository

Write a skill with no frontmatter at all and Claude Code's validator says this:

```
⚠ Found 1 warning:
  ❯ frontmatter: No frontmatter block found.
✔ Validation passed with warnings
```

Exit code `0`. It passed.

That skill will never be invoked by anything. It has no description, so nothing
can decide when to load it. The validator is checking that the file is
well-formed, not that it is useful — and the gap between those two is where
most non-working skills live.

Here is what actually matters, verified by breaking things on purpose.

## The minimum that works

A skill is one directory with one file.

```
seo-audit/
├── SKILL.md              ← required
└── references/           ← optional; loaded on demand
    └── checklist.md
```

```markdown
---
name: seo-audit
description: Audit a page against Google's published documentation and report
  findings with citations. Use when asked to check, audit or review SEO, or
  before publishing a post.
---

# SEO Audit

[instructions for the model]
```

Three places it can live:

| Location | Scope |
|---|---|
| `~/.claude/skills/<name>/` | personal, every project |
| `<project>/.claude/skills/<name>/` | that repository, committed with it |
| inside a plugin | distributed to others |

## What validation actually checks

Point the validator at a directory and it walks the components inside:

```bash
claude plugin validate .claude
```

**Not at the skill itself.** That gives a confusing error, because the
validator assumes a directory you hand it directly is a plugin or marketplace:

```
$ claude plugin validate .claude/skills/seo-audit
✘ directory: No manifest found in directory.
  Expected .claude-plugin/marketplace.json or .claude-plugin/plugin.json
```

Point it one level up, at the directory containing `skills/`, and it finds and
checks each one.

### Warnings, which pass

| Broken thing | Result | Exit |
|---|---|---|
| No frontmatter block | warning | **0** |
| No `description` | warning | **0** |
| `name:` with spaces and capitals | **no complaint at all** | 0 |

### The one real error

Malformed YAML is the only thing I could make it reject:

```
✘ frontmatter: YAML frontmatter failed to parse: YAML Parse error:
  Unexpected EOF. At runtime this skill loads with empty metadata
  (all frontmatter fields silently dropped).
```

Exit code `1`.

That message is worth the price of admission. It does not just say the parse
failed — it tells you the runtime consequence, which is that your skill loads
with **every frontmatter field silently dropped**. A skill whose YAML is subtly
broken does not crash. It quietly becomes a skill with no description, and then
never runs.

## The field that decides everything

Of the frontmatter, `description` is the one that determines whether your skill
is ever used. It is the text something reads to decide "is this relevant to
what is happening right now".

No validator can check it, because the question it answers is not "is this
well-formed" but "will this match the situations you meant it to".

What has worked for me:

**Say when, not what.** A description that only describes the skill gives
nothing to match against. One that names the triggering situations does.

```yaml
# weak — describes the skill
description: An SEO auditing tool.

# better — names the moments it should fire
description: Audit a page against Google's published documentation and report
  findings with citations. Use when asked to check, audit or review SEO; to
  diagnose why a page may not rank; or before publishing a post.
```

**Say when not to, as well.** If a skill has a neighbour it keeps getting
confused with, exclude the neighbour explicitly. The `seo-audit` description
ends with what it will not do, because "write me something SEO-friendly" and
"audit this page" are adjacent requests with different answers.

**Use the words a person would use.** Not your internal name for the thing.

## Testing it properly

This is the part the validator cannot do, and Claude Code ships a separate tool
for it:

```bash
claude plugin eval [target]
```

It runs eval cases — `case.yaml`, or `prompt.md` plus `graders/*.md` — against a
plugin and scores the results. The flag that matters:

```
--ablation <mode>   Run a no-plugin baseline arm and report the score delta
                    (default: with-without whenever a plugin resolves)
```

By default it runs your cases **twice**: once with the skill available, once
without, and reports the difference. That is the only mechanical answer to
"did this skill help" rather than "did this skill load".

The grader vocabulary includes `tool_used: Skill`, so you can assert that the
skill actually fired rather than inferring it from the output.

I have not run a full eval suite, so I cannot tell you how good the scoring is.
What I can say is that it exists, it is one subcommand, and it is the step
between "the validator passed" and "this is worth installing".

## Packaging it for other people

A loose skill directory is fine for yourself. To hand it to someone, it needs a
manifest.

```
my-plugin/
└── .claude-plugin/
    └── plugin.json          ← makes it a plugin
```

A marketplace is a directory listing plugins:

```
my-marketplace/
├── .claude-plugin/
│   └── marketplace.json     ← name, owner, plugins[]
└── plugins/
    └── my-plugin/
```

```bash
claude plugin validate ./my-marketplace
claude plugin marketplace add <owner>/<repo>
claude plugin install my-plugin@my-marketplace
```

Two things that bite, both documented and both easy to hit:

- **Relative `source` paths are written from the marketplace root** — the
  directory containing `.claude-plugin/`. A path containing `..` fails
  validation outright.
- **The entry name in `marketplace.json` must match the `name` in the plugin's
  own `plugin.json`.** When they differ, installing by the manifest name fails
  with `Plugin "<name>" not found in marketplace`.

For a skill you just want someone to try, you do not need any of this. Publish
the directory and let people copy it — which is what [this site's own
skill](/tools/seo-audit-skill/) does, with a licence file and an install
command that is one `git clone` and one `cp -r`.

## The short version

1. `SKILL.md` with frontmatter in a directory. That is the whole format.
2. Validate the **parent** of `skills/`, not the skill directory.
3. Validation passing means your YAML parses. It does not mean your skill works.
4. `description` decides whether it ever runs. Write it as a list of moments,
   not a summary.
5. `claude plugin eval --ablation` is the actual test, because it measures
   against not having the skill at all.
6. Add a `plugin.json` only when someone else needs to install it.

## What I did not test

I did not run `plugin eval` against a real suite, so everything in that section
is read off the command's help rather than from a scored run. I also tested
validation only on skills — the same command checks agents and commands, and I
did not try those.

And the description advice is experience, not measurement. The ablation arm
exists precisely so that this kind of advice can be checked, and I have not
checked mine.
