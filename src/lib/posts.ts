// 全站文章取数。
//
// 站点有两条线，各自是一个 collection：
//   tools → /tools/<id>/   软件与工具实测（阶段一）
//   setup → /setup/<id>/   自己的硬件（阶段二起）
//
// 首页的 Latest 和 RSS 要同时覆盖两条线，所以链接不能再靠调用方拼 ——
// 在这里一次算好 url，否则新增一条线时又会漏。
//
// 注意：各条线的支柱页（/tools/、/setup/）仍然各自只读自己的 collection，
// 不要改成用这个函数，否则支柱页会互相串内容。

import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = {
  entry: CollectionEntry<'tools'> | CollectionEntry<'setup'>;
  url: string;
  line: 'tools' | 'setup';
};

const LINES = [
  { collection: 'tools', base: '/tools/' },
  { collection: 'setup', base: '/setup/' },
] as const;

/** 两条线已发布的文章，按 pubDate 倒序。 */
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

  return lines
    .flat()
    .sort((a, b) => b.entry.data.pubDate.valueOf() - a.entry.data.pubDate.valueOf());
}
