// ───────────────────────────────────────────────────────────────
// 全站唯一配置源。改站名 / tagline / 导航都只动这个文件。
// ───────────────────────────────────────────────────────────────
export const SITE = {
  name: 'MossBySea',
  tagline: 'AI and tech, used and logged',
  description:
    'AI coding tools and the hardware behind them: comparisons, buying guides and long-term notes, each labelled with what was used and what was researched.',
  url: 'https://mossbysea.com',
  email: 'hello@mossbysea.com',
  author: 'Moss',
  lang: 'en',
  locale: 'en_US',
} as const;

// 统计。留空 = 不注入任何脚本，privacy 页会自动改成「本站没有统计」的说法。
//
// 取值：Cloudflare 面板 → Web Analytics → 添加站点 → 复制 beacon token。
// 选它的理由：无 cookie、不做跨站跟踪，正好对上 privacy 页已经写下的措辞，
// 也就不需要同意横幅（GA 会设置 cookie，GDPR 地区必须加横幅，别换）。
export const ANALYTICS: { cfBeaconToken: string } = {
  cfBeaconToken: '',
};

// 导航。/setup/ 于 2026-10-15 上线（硬件线已是主线，5 篇 + 计算器）。
export const NAV = [
  { href: '/tools/', label: 'AI Tools' },
  { href: '/setup/', label: 'Setup' },
  { href: '/about/', label: 'About' },
] as const;

export const FOOTER_NAV = [
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/affiliate-disclosure/', label: 'Affiliate Disclosure' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
