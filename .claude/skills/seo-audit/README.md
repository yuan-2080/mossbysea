# seo-audit

A Claude Code skill that audits a page or site against Google's own published
documentation, and reports findings with a citation for each one.

Built because most SEO tooling cannot distinguish three different things:

- what Google **requires**
- what Google **recommends**
- what people **repeat** that Google never said

Every finding carries an evidence tier, and the fourth tier — `NOT-GOOGLE` —
exists so the skill can decline to repeat folklore.

## Install

```bash
git clone --depth 1 https://github.com/yuan-2080/mossbysea.git /tmp/mbs \
  && mkdir -p ~/.claude/skills \
  && cp -r /tmp/mbs/.claude/skills/seo-audit ~/.claude/skills/ \
  && rm -rf /tmp/mbs
```

Then, in any project:

```
audit this page with the seo-audit skill
```

## What it does not do

It will not rewrite your body copy, and it will not do keyword-density work.
Keyword stuffing is one of Google's sixteen named spam policies; a tool that
quietly optimises prose is producing the thing the policy describes.

Titles, meta descriptions, slugs, internal links and heading structure are
mechanical, and it will draft those on request.

## Files

| File | Contents |
|---|---|
| `SKILL.md` | Instructions, evidence tiers, scope boundary, output format |
| `references/checklist.md` | The checklist — every item with its tier and source URL |
| `references/spam-policies.md` | All 16 spam policies; Thin Affiliation and Scaled Content Abuse expanded |

Verified against Google's documentation on 2026-09-30. Google changes its
docs; re-check before relying on any specific item.

MIT licensed. The rest of the repository it lives in is not.
