---
title: 'Claude Code vs Cursor vs Codex CLI: one real reporting task, three times'
description: 'I took a SQL extraction and report-generation job I actually had to do, ran it once in each of three AI coding tools, and recorded completion, rework rounds, and real elapsed time.'
pubDate: 2026-09-22
kind: comparison
tags: ['AI coding', 'Claude Code', 'Cursor', 'Codex']
affiliate: true
draft: true
---

<!--
═══════════════════════════════════════════════════════════════
  这是模板，不是文章。复制它改名后再写，别直接改这个文件。
  写完后把 frontmatter 的 draft 改成 false 才会上线。

  为什么是这个结构：联盟网络审核时主要看「对比测评」类文章，
  它们判断的是你的站能不能产生 commissionable traffic。
  前 10 篇里至少要有 3 篇是这个结构。
═══════════════════════════════════════════════════════════════
-->

> **Tested** 2026-09-22 · **Versions** Claude Code x.x, Cursor x.x, Codex CLI x.x
> **Machine** macOS 15, M4 Pro, 32 GB

<!-- ↑ 时效标注。这类工具几周一变，没有日期和版本号的测评三个月后就是错的。
     这一条也是 E-E-A-T 信号：说明作者知道自己在测什么。 -->

## The job I gave them

<!-- ═══ 这一节是全文的地基，最不能省 ═══
     写清楚三件事：
     1. 任务是什么（具体到输入输出，不要写「写个脚本」）
     2. 为什么这个任务有代表性
     3. 判定「完成」的标准是什么

     关键：这必须是你本来就要干的活。为写文章造的 demo 会系统性高估工具表现，
     而读者一眼能看出来是 demo。 -->

The task in one sentence: …

What counts as finished:

- [ ] Condition one
- [ ] Condition two
- [ ] Condition three

## The answer, up front

<!-- 读者大部分只看这一段。别把结论藏到文末。 -->

| | Completed | Rework rounds | Elapsed | Cost / mo |
|---|---|---|---|---|
| **Tool A** | | | | |
| **Tool B** | | | | |
| **Tool C** | | | | |

**If your situation looks like mine, pick ×××.** In one line, why: …

**When you'd want a different one:** …

<!-- ↑ 这两句是整篇文章最有价值的部分。
     「A 最好」没信息量，「什么情况下选 A、什么情况下选 B」才有。 -->

## Tool A: …

### Getting it working

<!-- 按时间顺序写你实际做了什么。截图放这里。
     截图必须是你自己的屏幕，不要用官网素材 —— 原创图片是过审的加分项。 -->

### Where it stalled

<!-- ═══ 这一节决定文章可信度 ═══
     只写优点的测评一眼假。把真实卡点写出来：
     - 哪一步它理解错了
     - 我改了几轮才对
     - 有没有它根本做不到的部分 -->

### What it cost

- Subscription:
- Token spend:
- **Hours it cost me:**

<!-- 时间成本通常比订阅费重要一个数量级，但几乎没人写。写了就是差异化。 -->

## Tool B: …

<!-- 同上结构。注意：必须跑同一个任务、同样的判定标准。
     换题目的横向对比是无效的。 -->

## Tool C: …

## Head to head

### Where they actually differ

<div class="table-wrap">

| | Tool A | Tool B | Tool C |
|---|---|---|---|
| Read the task correctly | | | |
| Long-context behaviour | | | |
| Tool calling / MCP | | | |
| Self-correction after an error | | | |
| Time to get productive | | | |

</div>

### What I didn't test

<!-- ═══ 别跳过这节 ═══
     明说边界：我只测了一个任务、一种语言、一个人的工作习惯。
     承认局限会提高可信度，不会降低。
     这也是 Google 的 E-E-A-T 在找的东西。 -->

## Who should buy which

<!-- 按人群给结论，不要给一个笼统的「最佳」。
     例：
     - If you mostly write SQL and data scripts → …
     - If you work inside a large existing codebase → …
     - If you just want to try one without paying → … -->

## I'll retest in three months

<!-- 承诺复测并真的做。同一篇文章更新 updatedDate，
     比新开一篇效果好 —— 页面权重是累积的。 -->

---

<!-- ═══ 联盟链接放置规则 ═══
     1. frontmatter 里 affiliate: true，文首会自动插入披露条
     2. 链接放在「Who should buy which」之后，不要在正文中段反复插
     3. 没实际用过的产品不放链接
     4. 不放「limited time」「only N spots left」这类话术
-->
