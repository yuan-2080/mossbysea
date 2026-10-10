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

// 统计。留空 = 不注入任何脚本，privacy 页会自动改成「本站没有统计」的说法。
//
// 取值：Cloudflare 面板 → Web Analytics → 添加站点 → 复制 beacon token。
// 选它的理由：无 cookie、不做跨站跟踪，正好对上 privacy 页已经写下的措辞，
// 也就不需要同意横幅（GA 会设置 cookie，GDPR 地区必须加横幅，别换）。
export const ANALYTICS: { cfBeaconToken: string } = {
  cfBeaconToken: '',
};

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
