// 题图解析（全站共用）。
//
// frontmatter 里 hero 存的是相对 content 文件的路径（与正文图片同语法），
// 这里按文件名解析成 ImageMetadata —— zod v4 没有 z.image()，手动桥接。
//
// ⚠️ 必须 eager: true：默认的懒加载 glob 返回的是 () => Promise<module>，
// 直接取 .default 只会得到 undefined（2026-10-15 踩过）。
// ⚠️ glob 路径相对本文件：src/lib 离 assets 只有一级，是 ../assets 不是 ../../。

import type { ImageMetadata } from 'astro';

const heroImages = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/posts/*.{svg,png,jpg,jpeg,webp,avif}',
  { eager: true },
);

export function resolveHero(path?: string): ImageMetadata | undefined {
  if (!path) return undefined;
  const key = `../assets/posts/${path.split('/').pop()}`;
  return heroImages[key]?.default;
}
