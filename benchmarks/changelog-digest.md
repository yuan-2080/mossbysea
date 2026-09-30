# Benchmark: changelog digest

A task specification for comparing AI coding agents on one identical piece of
real work. Published so the comparison can be reproduced rather than taken on
trust.

**Status:** not yet run.
**Sources verified reachable:** 2026-10-01.

---

## Why this task

Most AI coding comparisons use a toy build — a todo app, a landing page, a
snake game. Toy tasks flatter every tool roughly equally, and nobody reading
can check the result.

This one is a tool the author actually wants, built against three live public
APIs whose data is deliberately awkward in three different ways. Anyone can
clone the sources, paste the same prompt, and get their own numbers.

### What makes it non-trivial

Verified against the live GitHub API on 2026-10-01:

| Source | Actual shape | Failure mode it tests |
|---|---|---|
| `anthropics/claude-code` | Release bodies of **21,273** and **16,760** characters; a release most days | Content overload — the tool must summarise, not relay |
| `openai/codex` | Release body of **25 characters**, essentially empty; tags like `rust-v0.161.0-alpha.4`, several per day | Empty content, and pre-release filtering |
| `cline/cline` | Bodies around 2,500 characters, but tags mix `v4.1.22` with `sdk/sdk/v0.0.88` | Mixed tag namespaces — product releases vs sub-packages |

Three different ways for a naive implementation to break, all real, none
contrived.

---

## The prompt

Given **verbatim**, **once**, to each tool under test. No improvisation, no
additions, no clarification unless the rules below permit it.

```text
Build a CLI tool that reports what changed recently in three AI coding tools.

Sources (GitHub Releases API):
  - anthropics/claude-code
  - openai/codex
  - cline/cline

Requirements:
1. Fetch releases published in the last 7 days.
2. Exclude pre-releases (alpha, beta, rc).
3. For cline, include only main product releases (vX.Y.Z), not sub-package
   tags such as sdk/*.
4. Some releases have an empty or near-empty body. Handle this without
   crashing and without emitting an empty section.
5. Some release bodies exceed 20,000 characters. The output for any single
   release must be at most 10 lines.
6. Deduplicate: running the tool twice must not report the same release twice.
7. If one source is unreachable, still report the others and note the failure.
8. Output a plain-text digest grouped by tool, newest first.
9. Runs with one command. No API key required.
```

---

## Acceptance criteria

Nine checks, each objectively true or false. Score is `n/9`.

| # | Check | How to verify |
|---|---|---|
| 1 | Fetches from all three sources | Output contains a section per source |
| 2 | Pre-releases excluded | No `alpha`, `beta` or `rc` tag appears in output |
| 3 | `sdk/*` excluded for cline | No tag containing `sdk/` appears |
| 4 | Empty bodies handled | No crash; no section with an empty body |
| 5 | Long bodies truncated | No single release exceeds 10 lines of output |
| 6 | Deduplication works | Run twice; second run reports nothing already reported |
| 7 | Partial failure tolerated | Point one source at a bad URL; others still report, failure noted |
| 8 | Grouped, newest first | Inspect output ordering |
| 9 | One command, no API key | Run in a clean shell with no credentials set |

Checks **4, 5, 6 and 7** are the discriminating ones. A tool that reaches 9/9
without being told about them is doing something the others are not.

---

## Metrics recorded per tool

| Metric | Definition |
|---|---|
| **Score** | Acceptance checks passed, out of 9 |
| **Rework rounds** | Number of corrections given (see rules below) |
| **Elapsed** | Wall-clock from pasting the prompt to acceptance or abandonment |
| **Cost** | Subscription tier used, plus token spend if the tool reports it |
| **Failure point** | If abandoned, which check it was stuck on |

Elapsed time includes the author's own time reading output and deciding. That
is the number that matters in practice and is almost never reported.

---

## Rules of engagement

1. **Fresh empty directory** for each tool. No shared scaffolding, no
   carried-over files.
2. **Prompt pasted verbatim**, once. No additions.
3. **Corrections are error reports only.** Permitted: pasting an error message,
   or stating which acceptance check fails. Not permitted: suggesting a cause,
   naming an API, proposing a fix.
4. **Maximum 10 rework rounds.** Beyond that, record the score reached and stop.
5. **Each tool uses its own default model.** Not normalised — model choice is
   part of what a tool is.
6. **No internet research on the author's part** mid-run to help a tool along.

---

## The methodological problem, stated up front

By the third tool the author knows this task considerably better than at the
first. Prompting improves, error reports get sharper, and the third tool gets
an advantage that has nothing to do with the tool.

Nearly every published comparison has this problem. Very few mention it.

Mitigations used here:

- The prompt is fixed in writing and pasted verbatim, which removes the
  largest channel for the effect.
- **The running order is disclosed** in the write-up.
- **Control run:** after the third tool, the first tool is run again from a
  clean directory. If its score or rework count changes materially, order
  effects are real and measurable, and that measurement is reported.

The control run costs one extra pass. It is the only part of this protocol
that produces evidence about the protocol itself.

---

## Tools under test

| Slot | Tool | Architecture | Notes |
|---|---|---|---|
| 1 | Claude Code | Terminal agent, high autonomy | |
| 2 | Cursor | IDE-native, step-by-step approval | |
| 3 | Gemini CLI | Terminal agent, open source, different vendor | Free tier — **verify current quota before starting**, reporting on it has been inconsistent |

The three span a deliberate spread: two terminal agents from different vendors,
one IDE-native tool. Slot 3 is free to run, so the comparison can be reproduced
at no cost for at least one contender.

Codex CLI was considered for slot 3 and dropped. It remains one of the three
*data sources*, which is unrelated to it being under test.

---

## Results

Not yet run.

| Tool | Score | Rework | Elapsed | Cost | Stuck on |
|---|---|---|---|---|---|
| Claude Code | — | — | — | — | — |
| Cursor | — | — | — | — | — |
| Gemini CLI | — | — | — | — | — |
| Claude Code (control) | — | — | — | — | — |

Running order: to be recorded.
