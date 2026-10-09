// 全站文章取数。
//
// 站点有两条线，各自是一个 collection：
//   tools → /tools/<id>/   软件与工具实测
//   setup → /setup/<id>/   自己的硬件
//
// 首页的 Latest 和 RSS 要同时覆盖两条线，所以链接不能再靠调用方拼 ——
// 在这里一次算好 url，否则新增一条线时又会漏。
//
// 注意：各条线的支柱页（/tools/、/setup/）仍然各自只读自己的 collection，
// 不要改成用 getAllPosts()，否则支柱页会互相串内容。

import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'tools'> | CollectionEntry<'setup'>;

/**
 * 新的在前。
 *
 * 必须带次级排序：站内同一天发布了多篇（例如 6 篇都是 2026-10-07），
 * 只比 pubDate 的话并列项的顺序取决于 collection 的返回顺序，
 * 而那个顺序在本地和 Cloudflare 构建机上并不保证一致 ——
 * 结果就是每次部署首页顺序都会跳。用 id 兜底，顺序就完全确定了。
 */
export const byNewest = <T extends { id: string; data: { pubDate: Date } }>(
  a: T,
  b: T
): number =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
  a.id.localeCompare(b.id);

export type Post = {
  entry: PostEntry;
  url: string;
  line: 'tools' | 'setup';
};

const LINES = [
  { collection: 'tools', base: '/tools/' },
  { collection: 'setup', base: '/setup/' },
] as const;

/** 两条线已发布的文章，按 pubDate 倒序（同日按 id 定序）。 */
export async function getAllPosts(): Promise<Post[]> {
  const lines = await Promise.all(
    LINES.map(async ({ collection, base }) => {
      const entries = await getCollection(collection, ({ data }) => !data.draft);
      return entries.map((entry) => ({
        entry,
        url: `${base}${entry.id}/`,
        line: collection,
      }));
    })
  );

  return lines.flat().sort((a, b) => byNewest(a.entry, b.entry));
}
