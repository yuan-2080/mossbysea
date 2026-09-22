// ───────────────────────────────────────────────────────────────
// 全站唯一配置源。换域名 / 改站名 只动这个文件。
// 部署前必改：url、email
// ───────────────────────────────────────────────────────────────
export const SITE = {
  name: 'Runbook',
  // 中文副标题，出现在首页和 <meta description>
  tagline: '用 AI 工具真实干活的记录',
  description:
    '记录用 AI 编程与 Agent 工具完成真实工作的过程：实测、对比、踩坑，以及支撑这套工作流的硬件环境。',
  // ⚠️ 部署前替换成你的真实域名（不带结尾斜杠）
  url: 'https://REPLACE-ME.com',
  // ⚠️ 用域名邮箱，不要用 Gmail —— 联盟网络审核会看
  email: 'hello@REPLACE-ME.com',
  author: 'Yuan',
  lang: 'zh-CN',
  locale: 'zh_CN',
} as const;

// 导航。/setup/ 暂不上线（见 README「阶段规划」），
// 等 /tools/ 满 10 篇后把下面这行的注释去掉。
export const NAV = [
  { href: '/tools/', label: 'AI 工具' },
  // { href: '/setup/', label: '工作流环境' },
  { href: '/about/', label: '关于' },
] as const;

export const FOOTER_NAV = [
  { href: '/about/', label: '关于' },
  { href: '/contact/', label: '联系' },
  { href: '/affiliate-disclosure/', label: '联盟披露' },
  { href: '/privacy/', label: '隐私政策' },
  { href: '/rss.xml', label: 'RSS' },
] as const;
