---
title: 'The four places my leak scanner did not look'
description: 'A forty-line leak scanner, written before I published anything. The scanner was the easy part: git history and screenshots are where things leaked.'
pubDate: 2026-09-30
kind: hands-on
tags: ['privacy', 'git', 'bash', 'publishing']
affiliate: false
draft: false
---

> **Written** 2026-09-30\
> **Stack** ~40 lines of bash · a gitignored word list · one npm script\
> **Outcome** four real leaks found, three of them somewhere the scanner never looked

I write here under a name, about work I do at a company. Those two facts don't sit together on their own. The site is deliberately unaffiliated — no employer named, no industry named, nothing about the products I work on. Holding that line by *remembering to* is not a plan. So before the first post went up, I wrote a scanner.

The scanner took twenty minutes. Finding out what it misses took considerably longer, and this post is mostly about that.

One thing to say up front: **this post can't name the word it's about.** The term that leaked is a single common noun that names my industry. Writing it here would undo the thing I'm describing. So it appears below as "the term", and that constraint is itself a decent illustration of the problem.

## The scanner

A word list, a grep, an exit code. That's the whole idea.

```bash
#!/bin/bash
# Pre-publish leak scan. Word list lives in scripts/leak-words.txt (gitignored).
set -uo pipefail
cd "$(dirname "$0")/.."
WORDS="scripts/leak-words.txt"

if [ ! -f "$WORDS" ]; then
  echo "Missing word list $WORDS — see scripts/leak-words.example.txt"
  exit 1
fi

hits=0
while IFS= read -r w; do
  [ -z "$w" ] && continue
  case "$w" in \#*) continue ;; esac
  found=$(grep -rn --fixed-strings "$w" src/content src/pages 2>/dev/null)
  if [ -n "$found" ]; then
    echo "✗ hit: $w"
    echo "$found" | sed 's/^/    /'
    hits=$((hits+1))
  fi
done < "$WORDS"

[ "$hits" -eq 0 ] && { echo "✓ clean"; exit 0; }
echo ""
echo "$hits term(s) matched. Fix before publishing."
exit 1
```

Wired up as `npm run check:leak`. Three decisions in there worth explaining:

**The word list is gitignored.** This is the whole trick. A list of the words you don't want published is itself the most sensitive file in the repo — it names your employer, your industry, your internal systems, in one convenient place. It cannot go in a public repository. What gets committed is `leak-words.example.txt`, which is a comment block explaining what categories to put in your own copy.

**`--fixed-strings`.** Word lists accumulate things with regex metacharacters in them — internal IDs, domains, API paths. One stray `.` or `+` and you get silent false negatives, which is the worst kind of failure for a tool whose entire job is catching things.

**Non-zero exit on a hit.** So it can gate a script rather than just print colour.

What goes in the list, by category: employer name in every language it's written in, industry terms, internal system and platform names, internal metric names, ID prefixes, intranet domains, colleagues' names.

That's the easy part. Now the four places it doesn't look.

## 1. Git history, which is permanent and public

The scanner reads the working tree. The working tree is the one version of your repository that is guaranteed to be clean, because it's the version you've been editing.

I had already rewritten the site's copy to remove every industry reference. `npm run check:leak` came back clean. Then:

```bash
for w in <terms>; do
  git log -S"$w" --oneline
done
```

The term appeared in two commits. It had been in the original copy, I'd taken it out later, and **the diff that removed it is a permanent public record of it having been there.**

On a public repository, `git log -p` shows this to anyone. So does clicking any commit in the GitHub UI.

This is the finding that matters. Everything else in this post is smaller. If you take one thing away: **a clean working tree tells you nothing about your history**, and on a public repo the history is the part that's archived forever.

Add a second pass:

```bash
# content that ever existed
git log -S"$term" --oneline

# every file at every commit
for c in $(git rev-list main); do git grep -l --fixed-strings "$term" "$c"; done
```

Use `git rev-list main`, not `--all`. `--all` includes the backup refs that a history rewrite leaves behind, so every term shows up as a hit and you can't tell real from residue. I wasted a confused minute on exactly that.

## 2. Commit authorship

Less severe, easy to miss. The first commits here were authored by:

```
alex <alex@laptop.local>
```

Not a real address — that's git's fallback when `user.email` was never configured. It leaks a first name and a machine model, and it's stamped on every commit forever.

(That example is anonymised. Publishing my actual one here would have reproduced the leak inside the post about the leak, and my own word list didn't catch it on the first pass — `yuan` and `MacBook` weren't in it. Add your own name and machine to the list; the obvious entries are the ones you forget.)

Set it per-repository, so it doesn't depend on remembering:

```bash
git config user.name "sitename"
git config user.email "hello@yourdomain.com"
```

Repository-local, not `--global`, so your other projects are untouched.

## 3. Screenshot pixels

I took a screenshot of a dashboard page to illustrate a point. I blurred the two email addresses in the table, because those were obviously the sensitive part.

The account switcher in the top-left corner showed my personal Gmail address, truncated to about fifteen characters. Truncated is not redacted — the visible portion was more than enough to reconstruct the whole thing.

No grep will ever catch this. Text inside an image is invisible to every tool in this post.

The habit that works: before publishing any screenshot, **look at all four corners and the top bar.** Not the middle — you already looked at the middle, that's why you took the screenshot. Account switchers, breadcrumbs, browser tabs, notification badges, and the window title are where identity hides.

## 4. Image metadata

Cheap to check, cheap to strip:

```python
from PIL import Image
im = Image.open(path)
print(len(im.getexif()), im.info.keys())
```

One of my three images carried an EXIF block. It turned out to be harmless, but EXIF is where GPS coordinates, device models and software versions live, and a phone screenshot can carry all three.

Stripping it, without re-encoding the pixels:

```python
clean = Image.new(im.mode, im.size)
clean.putdata(list(im.getdata()))
clean.save(path, optimize=True)
```

## The trap I set for myself

Having built the scanner, the obvious next move is to make it impossible to forget. In `package.json`:

```json
"prebuild": "bash scripts/check-leak.sh"
```

Now every build runs the scan. Locally this works beautifully.

**It also breaks your deployment.** The word list is gitignored, so it doesn't exist on the build server. The script hits its own missing-file branch, exits 1, and takes the build down with it. Every push fails, and the error message is about a file you deliberately excluded.

I caught this before pushing, which was luck rather than judgement.

Two ways out. Either keep the scan manual and run it as a pre-publish step — what I did, because it's a step I take deliberately, at a moment when I'm paying attention. Or make the script exit 0 when the word list is absent, so it degrades to a no-op in CI. The second is more convenient and quietly means your CI never scans anything, so be honest with yourself about which one you're choosing.

## What rewriting history actually does

Having found the term in two commits, I rewrote history to remove it. `git filter-branch` with a `--tree-filter` that rewrites file contents at every commit, plus an `--env-filter` to fix the authorship at the same time. Four commits, a few seconds.

Two things happened that are worth knowing before you try it.

**`--force-with-lease` refused the push.** It reported `stale info`. The cause: `filter-branch -- --all` rewrites your remote-tracking refs too, so the local record of `origin/main` had itself been rewritten. `--force-with-lease` compares its expectation against that ref, finds it doesn't match the real remote, and correctly declines. A `git fetch origin` restores the true remote state and the push goes through. The protection worked exactly as designed, which is reassuring in retrospect and confusing in the moment.

**The force push did not delete anything.** After the push the branch history was clean — four commits, correct authorship, term gone. But:

```bash
gh api "repos/OWNER/REPO/contents/src/pages/index.astro?ref=<old-sha>"
```

still returned the old file, with the term in it. Force-pushed commits become unreachable from any branch; they are not immediately garbage-collected. They sit in the repository's object store and stay readable by direct SHA.

Practically: those SHAs are no longer discoverable anywhere — not in the commit list, not in a fork, not in an issue reference. But "unreachable" is not "gone". If you need it actually gone, delete and recreate the repository, or open a support ticket asking for garbage collection. I chose to accept it, having weighed how much one common noun in an undiscoverable object is worth.

## The checklist

What I run now, in this order:

1. `npm run check:leak` — working tree
2. Same word list against history: `git log -S"$term"` per term
3. `git log --format='%an <%ae>'` — authorship on every commit
4. Every screenshot: look at all four corners and the top bar
5. Every image: EXIF count, strip if non-zero
6. Same word list against `dist/` after building — catches anything a template or config injects that isn't in your content files

Step 6 has never caught anything for me. I keep it because it costs one line and it checks the artefact that actually gets served, rather than the source I think produces it.

None of this is sophisticated. It is four greps, a corner check and a metadata read. The only real insight is that the working tree — the one thing a naive scanner looks at — is the one place that was never going to be the problem.

---

The scanner lives in `scripts/` in this site's repository, which is public. The word list does not, which is the point.
