# Google's spam policies

All sixteen named policies, from [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies). Violations can lower a page or an entire site in results, or remove it altogether.

Verified: 2026-09-30.

---

## The sixteen

| Policy | Definition |
|---|---|
| **Cloaking** | Presenting different content to users and search engines with the intent to manipulate rankings |
| **Doorway abuse** | Pages built to rank for specific queries that funnel users to an intermediate destination rather than a useful one |
| **Expired domain abuse** | Repurposing an expired domain mainly to exploit its ranking history with low-value content |
| **Hacked content** | Unauthorised content placed via a security vulnerability — injection, malicious redirects |
| **Hidden text and link abuse** | Content placed invisibly to influence search engines rather than serve readers |
| **Keyword stuffing** | Filling a page with keywords or numbers to manipulate rankings |
| **Link spam** | Links created primarily to manipulate rankings — bought, sold, exchanged, automated, or low-quality placements |
| **Machine-generated traffic** | Automated queries to Google without permission, including rank checking |
| **Malicious practices** | Malware, unwanted software, back-button hijacking |
| **Misleading functionality** | Sites that trick users into believing they offer a service they don't |
| **Scaled content abuse** | Producing many low-value pages — by AI, scraping, or stitching — to manipulate rankings |
| **Scraping** | Republishing others' content without original value or attribution |
| **Site reputation abuse** | Publishing third-party content on an established site mainly to exploit its ranking signals |
| **Sneaky redirects** | Sending users somewhere other than what they or the crawler were shown |
| **Thin affiliation** | Affiliate content copied from the merchant with no original information or meaningful added value |
| **User-generated spam** | Spam added by users through a site's public channels |

---

# The two that decide an affiliate site

Audit these on every post. They are the policies an honest affiliate site can fail by accident.

## Thin Affiliation

> *"Publishing affiliate content copied from merchants without original information or meaningful added value."*

The test is **original value**, not disclosure. A page can disclose its affiliate links perfectly and still fail, if what it says about the product could have been assembled from the merchant's own page.

**Audit questions — answer each with evidence from the page:**

| Question | Where to look |
|---|---|
| Does the page contain information the merchant does not publish? | Measurements, failures, costs, duration of use |
| Is there evidence of first-hand use? | Original photographs, own data, specific conditions |
| Is there a stated method? | How it was tested, on what, for how long |
| Are limits admitted? | What was not tested, where the conclusion may not hold |
| Would this page be worth reading with every affiliate link removed? | The decisive question |

**Failure signals:**

- Specifications restated from the merchant with no measurement
- Stock or press images only, no original photography
- Every product reviewed favourably
- No product ever rejected
- "Best X of 2026" with no stated selection method
- Conclusions that would be unchanged if the author had never handled the product

**Report it like this:**

```
[REQUIRED] Thin Affiliation risk — /path/to/post
  Found:     Product claims restated from vendor page; no original
             measurements, no original images, no stated method
  Expected:  Original information or meaningful added value
  Fix:       Add measured results and at least one original image;
             state the test method and its limits
  Source:    https://developers.google.com/search/docs/essentials/spam-policies
```

## Scaled Content Abuse

> *"Generating many pages with little value using AI tools, scraping, or stitching content to manipulate rankings."*

**Note what this does and does not say.** It is not "AI-written content is spam". The policy targets content *at scale* with *little value* produced *to manipulate rankings*. Google's stated line is about the value of the output and the intent, not the tool.

**Audit signals:**

| Signal | Why it matters |
|---|---|
| Many pages published in a short window | Volume is the policy's first word |
| Near-identical structure across posts, differing only in nouns | Template-filling |
| No first-hand specifics — no numbers, dates, versions, failures | The "little value" half |
| Pages that exist to carry a keyword rather than answer something | The "manipulate rankings" half |

A site publishing a small number of long, first-hand, dated posts is not the thing this policy describes — say so explicitly when it is true, rather than leaving the reader worried.

---

## Site Reputation Abuse — when it applies

> *"Publishing third-party pages on an established site with little or no first-party editorial oversight, where the primary purpose is to exploit the host site's ranking signals."*

Enforcement moved from manual-action-only (March 2024) to algorithmic (from the August 2025 spam update).

**Applies to:** guest-post sections sold to third parties, rented subfolders, coupon sections operated by an outside partner.

**Does not apply to:** one author writing about several topics on their own site. Do not report topical breadth as this policy. If topic mix is a concern, it is a topical-authority argument, and it is `NOT-GOOGLE` — Google does not publish a policy against writing about more than one thing.

---

## Keyword Stuffing — the one this skill must not cause

> *"Filling a web page with keywords or numbers in an attempt to manipulate rankings."*

This is why the skill declines keyword-density work. Requests phrased as "optimise this paragraph for <term>" or "increase keyword density" are asking for the behaviour this policy names.

The compliant answer: place relevant terms in **titles, headings, alt text and link text** — the "prominent locations" Google names in Search Essentials — and leave the prose alone.
