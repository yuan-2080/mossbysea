// ───────────────────────────────────────────────────────────────
// 全站唯一配置源。改站名 / tagline / 导航都只动这个文件。
// ───────────────────────────────────────────────────────────────
export const SITE = {
  name: 'MossBySea',
  tagline: 'Testing AI tools on real work',
  description:
    'Hands-on records of using AI coding and agent tools to finish actual work: head-to-head comparisons, what broke, and the hardware behind the workflow.',
  url: 'https://mossbysea.com',
  email: 'hello@mossbysea.com',
  author: 'Moss',
  lang: 'en',
  locale: 'en_US',
} as const;

// 导航。/setup/ 暂不上线（见 README「阶段规划」），
// 等 /tools/ 满 10 篇后把下面这行的注释去掉。
export const NAV = [
  { href: '/tools/', label: 'AI Tools' },
  // { href: '/setup/', label: 'Workflow Setup' },
  { href: '/about/', label: 'About' },
] as const;

export const FOOTER_NAV = [
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/affiliate-disclosure/', label: 'Affiliate Disclosure' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
