# Audit checklist

Every item carries its evidence tier and the Google URL it comes from. If you cannot cite a source, the item does not belong in this file.

Last verified against Google's documentation: 2026-09-30.

---

## 1. Technical requirements

Google states exactly three minimum requirements for a page to be *eligible* for indexing. Everything else in this file is downstream of these.

| # | Check | Tier | Source |
|---|---|---|---|
| 1.1 | **"Googlebot isn't blocked."** Verify robots.txt, meta robots, `X-Robots-Tag`, and any auth wall. | `REQUIRED` | [Technical requirements](https://developers.google.com/search/docs/essentials/technical) |
| 1.2 | **"The page works, meaning that Google receives an HTTP `200 (success)` status code."** | `REQUIRED` | same |
| 1.3 | **"The page has indexable content"** in a supported file type. | `REQUIRED` | same |

Google's own caveat, which belongs in any report that only checks these: *"Just because a page meets these requirements doesn't mean that a page will be indexed; indexing isn't guaranteed."*

---

## 2. Indexability and crawl control

| # | Check | Tier | Notes |
|---|---|---|---|
| 2.1 | `robots.txt` reachable and does not block the page or its CSS/JS | `REQUIRED` | Blocking CSS/JS prevents Google rendering the page as users see it |
| 2.2 | No `noindex` where indexing is wanted | `REQUIRED` | — |
| 2.3 | **`noindex` is not combined with a robots.txt block** | `REQUIRED` | A blocked page cannot be crawled, so its `noindex` is never read. Explicitly called out in Google's title-link docs as a problem. |
| 2.4 | `<link rel="canonical">` present, absolute, self-referential unless deliberately pointing elsewhere | `RECOMMENDED` | — |
| 2.5 | Canonical target returns 200 and is itself indexable | `RECOMMENDED` | — |
| 2.6 | Page is reachable by crawlable `<a href>` links from elsewhere on the site | `RECOMMENDED` | ["Make your links crawlable"](https://developers.google.com/search/docs/essentials) is one of the six key best practices |
| 2.7 | Page appears in the sitemap; sitemap referenced from robots.txt | `RECOMMENDED` | — |
| 2.8 | Sitemap URLs match canonical URLs exactly — protocol, host, trailing slash | `RECOMMENDED` | Mismatches are a common silent bug |

---

## 3. Title

| # | Check | Tier | Source |
|---|---|---|---|
| 3.1 | Every page has a `<title>` element | `RECOMMENDED` | [Title link docs](https://developers.google.com/search/docs/appearance/title-link) |
| 3.2 | Title is unique across the site — no repeated boilerplate | `RECOMMENDED` | same |
| 3.3 | Title is descriptive; not "Home", "Untitled", or a bare category word | `RECOMMENDED` | same |
| 3.4 | Title matches the page's actual current content | `RECOMMENDED` | Inaccurate titles are a documented cause of Google rewriting them |
| 3.5 | No keyword stuffing or repeated phrases in the title | `REQUIRED` | Keyword stuffing is a named spam policy |
| 3.6 | Title language matches the page's primary content language | `RECOMMENDED` | same |
| 3.7 | One visually prominent `<h1>`, not several competing headings | `RECOMMENDED` | Multiple equally-prominent headings are a documented cause of title rewriting |

### 3.8 Title length — read this before reporting it

**Google specifies no character limit.** The documentation says titles are *"truncated in search results as needed, typically to fit the device width."*

So:

- Report length as `DISPLAY`, never `REQUIRED` or `RECOMMENDED`.
- Report **where it truncates and what is lost**, not a character count against an invented limit.
- A long title that front-loads its meaning is fine. A short title that is vague is worse.
- Never write "titles should be under 60 characters" as though Google said it. Google did not.

What Google *does* warn against is *"unnecessarily long or verbose text"* — which is about verbosity, not a number.

---

## 4. Meta description

| # | Check | Tier | Notes |
|---|---|---|---|
| 4.1 | Present and unique per page | `RECOMMENDED` | Google may use it as the results snippet, or may not |
| 4.2 | Accurately summarises the page | `RECOMMENDED` | — |
| 4.3 | Not keyword-stuffed | `REQUIRED` | Spam policy |
| 4.4 | Length | `DISPLAY` | Same logic as titles: report truncation behaviour, not a limit. Google publishes no character count. |

**`NOT-GOOGLE`:** the meta description is not a ranking factor. If a report implies it is, that report is wrong.

---

## 5. Content and on-page

| # | Check | Tier | Source |
|---|---|---|---|
| 5.1 | Content is **"helpful, reliable, people-first"** | `RECOMMENDED` | First of the [six key best practices](https://developers.google.com/search/docs/essentials) |
| 5.2 | Relevant terms appear in **titles, headings, alt text and link text** | `RECOMMENDED` | Google's phrasing is "prominent locations" — this is *not* a density instruction |
| 5.3 | Heading hierarchy is sequential — no skipped levels, one `h1` | `RECOMMENDED` | — |
| 5.4 | Every `<img>` has meaningful `alt`; decorative images use `alt=""` | `RECOMMENDED` | Alt text is named as a prominent location |
| 5.5 | Link text is descriptive — not "click here", not a bare URL | `RECOMMENDED` | — |
| 5.6 | Content is present in rendered HTML, not only injected client-side | `REQUIRED` | Relates to 1.3, indexable content |
| 5.7 | Where expertise or first-hand experience is claimed, the page shows who and how | `RECOMMENDED` | Supports the people-first requirement; also what an affiliate site needs to clear Thin Affiliation |

**`NOT-GOOGLE`:** keyword density targets, keyword-to-word ratios, "LSI keywords", minimum word counts. None of these appear in Google's documentation. Do not report against them.

---

## 6. Structured data

Only audit this if the page has structured data or is a type that would benefit.

| # | Check | Tier | Source |
|---|---|---|---|
| 6.1 | Format is JSON-LD, Microdata or RDFa — **JSON-LD recommended** | `REQUIRED` | [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) |
| 6.2 | Page carrying the markup is not blocked by robots.txt, `noindex`, or access control | `REQUIRED` | same |
| 6.3 | Markup describes content **actually visible on that page** | `REQUIRED` | Marking up hidden content is explicitly prohibited |
| 6.4 | All **required** properties for the type are present; recommended ones added where sensible | `REQUIRED` | Missing required properties forfeit rich-result eligibility |
| 6.5 | Markup is on the page it describes, not a hub page | `REQUIRED` | same |
| 6.6 | The most specific schema.org type is used | `RECOMMENDED` | same |
| 6.7 | No fake reviews, invented ratings, or misrepresented identity | `REQUIRED` | Explicitly prohibited; causes manual action |
| 6.8 | Images referenced in markup are relevant, crawlable and indexable | `REQUIRED` | same |
| 6.9 | Duplicate pages carry identical structured data | `RECOMMENDED` | same |

### 6.10 Article / BlogPosting specifically

Google's [Article structured data docs](https://developers.google.com/search/docs/appearance/structured-data/article) state plainly: **"There are no required properties; instead, add the properties that apply to your content."**

Recommended properties, as listed:

| Property | Type | Note |
|---|---|---|
| `author` | Person or Organization | — |
| `author.name` | Text | — |
| `author.url` | URL | Part of author markup best practice |
| `datePublished` | DateTime | — |
| `dateModified` | DateTime | Only when applicable to the site |
| `headline` | Text | — |
| `image` | ImageObject or URL, repeatable | — |

`publisher` does **not** appear in the recommended table for Article types. Emitting it is not an error, but do not report it as satisfying a recommendation.

Never report a missing Article property as `REQUIRED`. There are none.

**Deprecations:** Google periodically removes support for structured data types, and removes them from Search Console and the Rich Results Test. Before asserting a type is supported, check [Search Central updates](https://developers.google.com/search/updates). If not verified this session, mark the finding "not verified against current deprecations".

A structured data manual action removes rich-result eligibility. It does **not** affect web search ranking — say so, rather than implying a penalty.

---

## 7. Core Web Vitals

Thresholds for "good", quoted from [Google's documentation](https://developers.google.com/search/docs/appearance/core-web-vitals):

| Metric | Measures | Good |
|---|---|---|
| **LCP** — Largest Contentful Paint | Loading | within **2.5 s** of page load starting |
| **INP** — Interaction to Next Paint | Responsiveness | under **200 ms** |
| **CLS** — Cumulative Layout Shift | Visual stability | under **0.1** |

Google's framing: Core Web Vitals *"aligns with what our core ranking systems seek to reward."* That is weaker than "is a ranking factor" — keep the distinction.

### Static checks (no measurement needed)

| # | Check | Risk |
|---|---|---|
| 7.1 | `<img>` missing `width`/`height` | **CLS** |
| 7.2 | `aspect-ratio` box without `max-width: 100%` | **CLS** |
| 7.3 | Web font without `font-display` | **CLS** (FOIT/FOUT) |
| 7.4 | Ads, embeds or banners injected above existing content | **CLS** |
| 7.5 | Render-blocking CSS/JS in `<head>` | **LCP** |
| 7.6 | Hero image lazy-loaded, or below-fold images not lazy-loaded | **LCP** |
| 7.7 | Large unoptimised images; no modern format | **LCP** |

**Always state the limit:** these predict risk. Actual values come from field data (CrUX / Search Console) or a lab tool (Lighthouse / PageSpeed Insights). Report them under "Not assessed" when unavailable.

---

## 8. Site-level

| # | Check | Tier |
|---|---|---|
| 8.1 | HTTPS, valid certificate | `RECOMMENDED` |
| 8.2 | One canonical hostname — www and apex do not both serve 200 without a canonical or redirect | `RECOMMENDED` |
| 8.3 | Mobile layout works; no horizontal scroll; tap targets adequate | `RECOMMENDED` |
| 8.4 | `sitemap-index.xml` or `sitemap.xml` present, valid, referenced from robots.txt | `RECOMMENDED` |
| 8.5 | 404s return 404, not 200 with an error page (soft 404) | `REQUIRED` |
| 8.6 | `hreflang` correct and reciprocal, if multilingual | `RECOMMENDED` |

---

## 9. Spam policies

See `references/spam-policies.md`. Always check, and for affiliate sites always check **Thin Affiliation** and **Scaled Content Abuse** specifically.
