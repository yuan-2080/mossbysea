---
title: 'Installing Gemini CLI, Codex CLI, Muse Code and Antigravity'
description: 'Four installs, each under a minute. Then: Gemini CLI could not sign in, Codex CLI wanted a phone number, two binaries are not named after their packages.'
pubDate: 2026-10-07
kind: guide
tags: ['Claude Code', 'Muse Code', 'Antigravity', 'Codex', 'Gemini CLI', 'setup']
affiliate: false
draft: false
---

> **Installed** 2026-10-07, macOS, Homebrew and npm\
> **Result** four installed, two usable without further decisions

I set out to install four terminal coding agents in one afternoon. Every
install succeeded and took under a minute. Two of them I still could not use at
the end of it.

**The install is never the hard part.** The gate is what happens the first time
you run the binary, and in three of four cases that gate was invisible until
after the install had already succeeded.

## What happened to each

| Tool | Install | First run |
|---|---|---|
| Claude Code 2.1.238 | already present | fine |
| **Gemini CLI 0.62.0** | `npm i -g @google/gemini-cli`, 12s | **dead** — free tier ended 2026-06-18 |
| Antigravity CLI 1.2.14 | `brew install --cask antigravity-cli` | Google sign-in |
| **Codex CLI 0.159.2** | `npm i -g @openai/codex`, 50s | **phone number required** |
| Muse Code 1.4.3 | `brew install --cask muse-code` | account **or** API key |

## Gemini CLI: installed fine, cannot sign in

The package installs cleanly and `gemini --version` reports 0.62.0. Run it and
pick "Sign in with Google", which is the free path, and:

```
Failed to sign in. Message: This client is no longer supported for Gemini Code
Assist for individuals. To continue using Gemini, please migrate to the
Antigravity suite of products: https://antigravity.google
```

Google ended consumer access to Gemini CLI and the Gemini Code Assist IDE
extensions on **18 June 2026**. The package is still on npm, still installs,
still reports a version. Nothing about the install tells you the product is
retired for your account type.

This is the worst failure mode of the five: a successful install of something
that cannot work. If you are following a tutorial written before June, you will
get all the way to the sign-in screen before anything goes wrong.

**Antigravity is the successor**, and it is where that error message sends you.

## Codex CLI: the gate is a phone number

Codex is bundled into every ChatGPT tier, free included, and also works with an
API key and no subscription at all. On paper the most accessible of the set.

In practice, signing in with ChatGPT asked for a phone number. For a tool
evaluation that is a disproportionate thing to hand over, so I stopped there.

The API-key path exists and avoids it — `$1.50` per million input tokens,
`$4.25` output at the time of writing — but then you are paying per token for
something you were trying to evaluate for free.

Not a bug. Just the gate, and it is not visible until after `npm install`.

## Two binaries are not named after their packages

Small, and it cost me a minute each:

```bash
brew install --cask antigravity-cli   # binary is  agy
brew install --cask muse-code         # binary is  muse
```

Homebrew tells you if you read the output — `Linking Binary 'antigravity' to
'/opt/homebrew/bin/agy'` — but `antigravity --help` and `muse-code --help` both
fail, and the obvious guess is that the install broke.

Also worth checking before you install either: there is a separate `muse` cask
on Homebrew which is a different company's product entirely. `brew info` first.

## Muse Code has the one gate you can skip

```
$ muse login --help
Log in with your Meta account: approve a code in your browser.
META_API_KEY always takes priority over the account login.
```

An environment variable that overrides account login, stated in the help text.
No account, no browser round-trip, no phone number.

Its `auth` subcommand is careful about the key, too:

```
Usage: muse auth set [--provider <PROVIDER>] --api-key-stdin

The API key is read from stdin (never taken as a command-line argument, so it
never lands in shell history).
```

Reading a secret from stdin specifically so it stays out of `~/.zsh_history` is
a small thing that tells you someone thought about it.

Pricing is per token, with one choice attached:

| | Input | Output |
|---|---|---|
| Standard | $1.25 / M | $4.25 / M |
| **If Meta may train on your code** | **$0.10 / M** | **$0.20 / M** |

Twelve times cheaper in, twenty-one times out. Fine for a weekend project; not
your decision to make under an employer's confidentiality terms, and large
enough to tempt someone who has not thought about it.

## Antigravity: free, with a weekly ceiling

Individual tier is $0 and generally available, not a preview. Tab completions
and Command requests are unlimited; the constraint is a **weekly agent quota**,
which is the thing an evaluation actually consumes.

Sign-in is a Google account and a browser approval. Nothing surprising.

## If you are doing this yourself

The order that would have saved me the most time:

1. **Check the free tier is alive before installing.** Not the docs — the
   vendor's own current pricing page, or a dated post. Gemini CLI's free tier
   had been gone four months and the package still installed.
2. **Find the auth method before the install, not after.** API key, account,
   phone, MDM. This is what decides whether you can proceed, and no package
   manager will tell you.
3. **Read what Homebrew says it linked.** The binary is often not the cask name.
4. **`brew info` before `brew install`** when the name is a common word.

Of the five, exactly two could be taken from zero to running without creating
an account or handing over a phone number: **Muse Code**, via `META_API_KEY`,
and **Claude Code**, which I already had.

## A footnote on how fast this moves

I installed Antigravity CLI at version **1.2.14**. Checking the same binary a
few hours later, in the same session, it reported **1.3.1** — the cask is marked
`auto_updates` and it had taken one.

Three posts on this site cite 1.2.14 in their version line. They are not wrong;
they are dated, and the version they were tested against is stated at the top of
each. That is the entire reason for stamping them.

If you are reading this more than a few weeks out, treat every version number
and every price above as the state of one afternoon.
