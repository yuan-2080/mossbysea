---
title: 'An SEO skill that refuses to repeat folklore'
description: 'Most SEO tools cannot tell what Google requires from what people merely repeat. Four evidence tiers, one of which exists to say: Google never said that.'
pubDate: 2026-10-01
kind: hands-on
tags: ['SEO', 'Claude Code', 'skills', 'Google Search Central']
affiliate: false
draft: false
---

> **Built** 2026-09-30 · **384 lines across three files**\
> **Stack** Claude Code skill · Google Search Central as the only source\
> **Result** three findings on my own site, one of them my own fault

Run any site through an SEO tool and you get a list of red crosses. Somewhere in that list, presented identically, are three completely different kinds of statement:

1. Things Google **requires**, where failing means the page cannot be indexed.
2. Things Google **recommends**, in published documentation you can go read.
3. Things people **repeat**, which Google never said, or said once in 2009 and removed.

Sorting those out by hand, every time, is the actual work. So I built a skill that does it, and made the sorting the primary output rather than a footnote.

## The four tiers

Every finding carries one:

| Tier | Meaning |
|---|---|
| `REQUIRED` | Google states it as a requirement |
| `RECOMMENDED` | Google documents it as best practice |
| `DISPLAY` | A search-results rendering reality, not a rule |
| `NOT-GOOGLE` | Common advice with no basis in the docs |

The first two are ordinary. The other two are why the thing exists.

### DISPLAY: the title length example

The canonical case. Every tool will tell you a title over roughly 60 characters is a problem, in the same red as a missing `<title>`.

Google's [title link documentation](https://developers.google.com/search/docs/appearance/title-link) specifies **no character limit**. What it says is that titles are *"truncated in search results as needed, typically to fit the device width."*

Those are different claims. One is a rule you're breaking. The other is a rendering behaviour you might want to account for. A long title that front-loads its meaning survives truncation fine; a short vague one fails at every length.

So the skill reports **where the truncation falls and what is lost**, and never a character count against a limit that does not exist.

The one thing Google *does* warn against is *"unnecessarily long or verbose text"* — which is about verbosity, not a number.

### NOT-GOOGLE: a tier for saying no

This is the part I actually wanted. Ask the skill about keyword density, or meta keywords, or LSI keywords, or "Google penalises duplicate content", and it answers that Google does not document it, then links to what Google does say.

It is a small thing that changes how the tool feels to use. A checker that only ever adds items to your to-do list trains you to distrust it. One that will say "that's not real, here's the source" is one you can actually delegate to.

## What goes in it

Three files, 384 lines:

```
.claude/skills/seo-audit/
├── SKILL.md                      instructions, tiers, scope, output format
└── references/
    ├── checklist.md              every item + tier + source URL
    └── spam-policies.md          all 16 policies, two expanded
```

The rule that shaped all of it: **every finding cites a Google URL, or is labelled as not coming from Google.** If I couldn't find the source, the item didn't go in the file. That constraint removed perhaps a third of what I first drafted from memory, which tells you something about how much SEO knowledge is absorbed rather than read.

A few items worth pulling out.

**The three technical requirements.** Google lists exactly three things a page needs to be *eligible* for indexing, and they are refreshingly blunt: Googlebot isn't blocked, the page returns HTTP 200, the page has indexable content. Everything else anyone tells you about SEO sits downstream of those three lines.

Google's own caveat goes in the report too: *"Just because a page meets these requirements doesn't mean that a page will be indexed; indexing isn't guaranteed."*

**Core Web Vitals thresholds**, quoted rather than remembered: LCP within 2.5 s, INP under 200 ms, CLS under 0.1. And Google's framing of how they matter — they *"align with what our core ranking systems seek to reward"* — which is weaker than "is a ranking factor", and the skill keeps the distinction.

**The sixteen spam policies**, named. For an affiliate site two of them decide everything, so they get their own expanded section.

## The two policies an affiliate site can fail by accident

### Thin Affiliation

> *"Publishing affiliate content copied from merchants without original information or meaningful added value."*

The test is **original value, not disclosure**. You can disclose your affiliate links immaculately and still fail this, if what you wrote about the product could have been assembled from the merchant's own page.

The skill asks five questions and wants evidence from the page for each:

- Does it contain information the merchant does not publish?
- Is there evidence of first-hand use — original photographs, own measurements?
- Is there a stated method?
- Are limits admitted?
- **Would the page be worth reading with every affiliate link removed?**

That last one is the whole policy in a sentence.

### Scaled Content Abuse

> *"Generating many pages with little value using AI tools, scraping, or stitching content to manipulate rankings."*

Read the clause carefully, because it is widely misquoted as "AI content is spam". Three conditions are doing work: *many* pages, with *little value*, to *manipulate rankings*. The policy is about volume, value and intent — not about which tool produced the text.

The skill checks the signals that actually match the clause: many pages in a short window, near-identical structure differing only in nouns, no first-hand specifics, pages existing to hold a keyword. And when a site doesn't match, it says so explicitly rather than leaving you vaguely worried.

## What it will not do

The scope boundary is written into `SKILL.md`, which means the skill enforces it on me when I am tired and want it to just fix something:

**Does:** audit; draft titles, meta descriptions, slugs; suggest internal links; check heading hierarchy.

**Does not:** rewrite body copy. Do keyword-density work.

The reasoning for the first: the writing is the point. A tool that quietly launders your prose into SEO register destroys the thing it was supposed to protect. Optimised-sounding content is precisely what Google's helpful-content work went after, and independent sites with real first-hand testing were the collateral damage.

The reasoning for the second is simpler. Keyword stuffing is one of the sixteen named spam policies. "Optimise this paragraph for X" is a request for the behaviour the policy describes. The skill declines and explains, and points at the compliant alternative Google actually documents: put relevant terms in **titles, headings, alt text and link text** — the "prominent locations" from Search Essentials — and leave the sentences alone.

The four generation functions it *will* do are the mechanical ones, where there is no voice to corrupt. A slug is not prose.

## Pointing it at my own site

Three findings.

### 1. Structured data is missing three recommended properties

Both posts emit `BlogPosting` with `headline`, `description`, `datePublished`, `author`, `publisher` and `mainEntityOfPage`.

Google's [Article documentation](https://developers.google.com/search/docs/appearance/structured-data/article) lists as recommended: `author`, `author.name`, `author.url`, `datePublished`, `dateModified`, `headline`, `image`.

So I'm missing `image` — on two posts that both have images — plus `author.url` and `dateModified`. And I'm emitting `publisher`, which does not appear in the recommended table for Article types at all.

Note the tier: this is `RECOMMENDED`, not an error. Google's exact words are *"There are no required properties; instead, add the properties that apply to your content."* Tools that report missing Article properties as errors are wrong, and it took reading the source to know that.

### 2. A title truncates and loses its point

`Putting a blog on Cloudflare in 2026: eight things that broke · MossBySea` is 73 characters. It renders as:

```
Putting a blog on Cloudflare in 2026: eight things that brok…
```

The word "broke" is the entire proposition of the post, and it's the word that gets cut. Reported as `DISPLAY` — not a violation, but I'd still rather it didn't happen.

### 3. The one I caused myself

Earlier the same week, I shortened a different title from 90 characters to 44, and wrote down the reason as though it were a Google rule: *titles should be under 60 characters*.

It isn't a rule. Google publishes no limit. The shorter title was a better title, and my reason for it was folklore that I had absorbed somewhere and never checked.

That is the exact failure mode this skill exists to catch, and I'd committed it four days earlier while building the site the skill now audits. `NOT-GOOGLE` went in because of it.

### And what passed

Worth recording, since an audit that only ever finds problems is not measuring anything: the three technical requirements, unique titles and descriptions and exactly one `h1` across all eight pages, canonical tags everywhere, robots.txt and sitemap referencing each other, and every image carrying `alt`, explicit `width`/`height` and `loading` — zero image findings, which is Astro's image pipeline doing its job rather than me doing mine.

Thin Affiliation and Scaled Content Abuse both pass, for now, on two posts.

## Take it

The skill is MIT licensed and lives in this site's repository, at
**[`.claude/skills/seo-audit`](https://github.com/yuan-2080/mossbysea/tree/main/.claude/skills/seo-audit)**.
Read it there before installing it — it is three markdown files and you should
know what you are pointing at your site.

To install:

```bash
git clone --depth 1 https://github.com/yuan-2080/mossbysea.git /tmp/mbs \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/mbs/.claude/skills/seo-audit ~/.claude/skills/ \
  && rm -rf /tmp/mbs
```

Then, in any project: `audit this page with the seo-audit skill`.

| File | What's in it |
|---|---|
| [`SKILL.md`](https://github.com/yuan-2080/mossbysea/blob/main/.claude/skills/seo-audit/SKILL.md) | Instructions, the four tiers, the scope boundary, output format |
| [`references/checklist.md`](https://github.com/yuan-2080/mossbysea/blob/main/.claude/skills/seo-audit/references/checklist.md) | Every check, its tier, and the Google URL it comes from |
| [`references/spam-policies.md`](https://github.com/yuan-2080/mossbysea/blob/main/.claude/skills/seo-audit/references/spam-policies.md) | All sixteen policies; Thin Affiliation and Scaled Content Abuse expanded |

Two caveats. It was verified against Google's documentation on 2026-09-30, and Google changes its documentation — the dates are in the reference files, re-check before trusting any specific item. And it reads HTML, so field data, manual actions and index coverage are outside it; those need Search Console, and the skill says so in a required "Not assessed" section rather than guessing.

---

The useful part was never the checklist. It was being forced to find a URL for every line, and discovering how many lines I couldn't.
