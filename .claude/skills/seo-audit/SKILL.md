---
name: seo-audit
description: Audit a web page or site against Google's own published documentation and report findings with citations. Use when asked to check, audit, or review SEO; to diagnose why a page may not rank or index; to check Core Web Vitals, structured data, titles, meta descriptions, headings, alt text, canonical tags, robots directives or sitemaps; or before publishing a post. Also drafts titles, meta descriptions, slugs and internal-link suggestions on request. Does not rewrite body copy and does not do keyword-density optimisation.
---

# SEO Audit

Check pages against what Google actually publishes, and report findings the reader can verify.

## The one rule

**Every finding cites a Google URL, or it is labelled as not coming from Google.**

Most SEO advice in circulation is folklore that was never in Google's documentation, or was removed from it years ago. The value of this skill is refusing to repeat it. When a check cannot be traced to an official source, say so in the finding.

## Evidence tiers

Tag every finding with one:

| Tag | Meaning |
|---|---|
| `REQUIRED` | Google states it as a requirement for indexing or eligibility |
| `RECOMMENDED` | Google documents it as a best practice |
| `DISPLAY` | A search-results rendering reality, not a Google rule (e.g. title truncation) |
| `NOT-GOOGLE` | Common advice with no basis in Google's docs — report as a non-finding |

The `DISPLAY` tier matters. Titles are the usual case: Google specifies **no character limit**, but long titles get truncated to fit device width in results. "Your title is over 60 characters" is a display observation, not a rule violation, and must never be presented as the latter.

The `NOT-GOOGLE` tier is a feature. If asked about keyword density, meta keywords, LSI keywords, a fixed title character limit as a ranking factor, or "Google penalises duplicate content" as stated, answer that Google does not document it, and link to what Google does say instead.

## Scope

### Does

- Audit pages against `references/checklist.md`
- Draft or critique **titles**, **meta descriptions**, **URL slugs**
- Suggest **internal links** between existing pages
- Check **heading hierarchy** structure

### Does not

- **Rewrite body copy.** The writing is the author's. Optimised prose is what Google's helpful-content work targets, and an audit tool that quietly launders voice into SEO register destroys the thing it was meant to protect.
- **Keyword density, keyword insertion, or "optimise this paragraph for X".** Keyword stuffing is a named spam policy. Decline and explain.

If asked to do either, say what this skill does instead and offer the audit.

## Procedure

1. **Get the page.** A local file, a built file in `dist/`, or a URL. For a whole site, audit the built output — that is what gets served, and templates inject things the source does not show.
2. **Work through `references/checklist.md`** in order: technical → indexability → metadata → content → structured data → performance → spam policies.
3. **Verify, don't assume.** Read the actual HTML. Do not infer a tag is present because a framework usually adds it.
4. **Check the spam policies** in `references/spam-policies.md`. For affiliate sites, **Thin Affiliation** and **Scaled Content Abuse** are the two that matter most and the two most often skipped.
5. **Report.**

## Output

Group by severity. Within a group, order by how much work the fix is — cheapest first.

```
## Blocking — page cannot be indexed
## Should fix — documented best practice not met
## Display — will render suboptimally in results
## Checked, no issue
## Not assessed — and why
```

Each finding:

```
[TIER] What is wrong
  Found:     <the actual value in the page>
  Expected:  <what Google documents>
  Fix:       <concrete change>
  Source:    <google url>
```

**"Not assessed" is a required section.** Field data (real-user Core Web Vitals), manual actions, and index coverage need Search Console or CrUX, which this skill does not have. Say so rather than guessing from the HTML.

## Performance

Lab measurement is out of scope unless a tool is available in the session. What *can* be checked statically:

- `<img>` and any `aspect-ratio` box missing explicit `width`/`height` → CLS risk
- Render-blocking resources in `<head>`
- Images not lazy-loaded below the fold
- Fonts without `font-display`

Report these as **CLS/LCP risks**, not as scores. A real LCP number requires measurement; say which tool would give it.

## References

| File | Contents |
|---|---|
| `references/checklist.md` | The audit checklist, each item with its tier and source URL |
| `references/spam-policies.md` | All 16 named spam policies, with the affiliate-relevant ones expanded |
