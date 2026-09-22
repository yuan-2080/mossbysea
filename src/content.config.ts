import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const base = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  // 文章类型决定它在 cluster 里的角色。
  // comparison = 对比测评（联盟网络审核主要看这类，前 10 篇至少 3 篇）
  kind: z.enum(['comparison', 'hands-on', 'guide', 'hardware']),
  tags: z.array(z.string()).default([]),
  // 本文是否包含联盟链接 —— 为 true 时文首自动插入披露条
  affiliate: z.boolean().default(false),
  draft: z.boolean().default(false),
});

const tools = defineCollection({
  loader: glob({ base: './src/content/tools', pattern: '**/*.{md,mdx}' }),
  schema: base,
});

// /setup/ 已建好但未上线，等 /tools/ 满 10 篇再开
const setup = defineCollection({
  loader: glob({ base: './src/content/setup', pattern: '**/*.{md,mdx}' }),
  schema: base,
});

export const collections = { tools, setup };
