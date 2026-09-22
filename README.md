# MossBySea — 运营手册

一个 Astro 静态站，为通过联盟网络（PartnerBoost / Impact / Amazon Associates）
的 publisher 审核而搭，主题是 AI 工具与工作流实测。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 输出到 dist/
```

---

## 1. 站点配置

全部集中在 `src/consts.ts`，已配置完成：

| 字段 | 当前值 |
|---|---|
| `SITE.name` | `MossBySea` |
| `SITE.url` | `https://mossbysea.com` |
| `SITE.email` | `hello@mossbysea.com` |
| `SITE.author` | `Moss` |

改站名、tagline、导航都只动这一个文件。`public/robots.txt` 里另有一处 sitemap 地址。

> **为什么域名邮箱很重要**：联盟网络审核会检查联系方式。
> `hello@yourdomain.com` 说明你真的拥有这个域名；Gmail 地址显著提高拒绝率。
> Cloudflare Email Routing 可以免费把域名邮箱转发到你的 Gmail。

---

## 2. 阶段规划（别跳步）

### 阶段一：过审（目标 10 篇，全部在 `/tools/`）

**只写 `/tools/`，不要碰 `/setup/`。**

新站的权重有限，把它铺在两个 cluster 上等于两个都不够深。
`/setup/` 的目录和 collection 已经建好但没上线——导航里那一行是注释掉的。

10 篇的构成建议：

| 数量 | `kind` | 说明 |
|---|---|---|
| **≥ 3 篇** | `comparison` | **审核主要看这类**。同任务横向对比。 |
| 3–4 篇 | `hands-on` | 一个真实项目跑通的完整记录，含踩坑 |
| 2–3 篇 | `guide` | 从装到能用的最短路径 |

每篇 800 字以上，**必须有你自己的截图或数据**。

### 阶段二：提交申请

10 篇到位后提交。审核周期参考 5–10 个工作日。

**提交前自检：**

- [ ] 域名是自有域名，不是 `*.pages.dev` 子域
- [ ] HTTPS 正常
- [ ] `/about` `/contact` `/privacy` `/affiliate-disclosure` 四页都能打开
- [ ] `/contact` 上的邮箱是域名邮箱且**真的能收信**（自己发一封测试）
- [ ] ≥ 10 篇已发布（`draft: false`）
- [ ] 其中 ≥ 3 篇是 `comparison`
- [ ] 最近 30 天内有更新
- [ ] `/privacy` 里的统计工具描述与实际使用的一致（见第 5 节）
- [ ] `/affiliate-disclosure` 里已列出实际参与的联盟计划名
- [ ] 至少绑定一个公开社媒账号（加分项）

> **更快的机制学习入口**：先申请 Amazon Associates，门槛最低，
> 通常几天内就能拿到后台，可以直接看到追踪链接、SubID、24 小时归因窗口、
> pending 与 clawback 字段。注意它有「180 天内出 3 单否则关号」的条款。

### 阶段三：拿到后台之后

看实际开放了哪些广告主、佣金率、归因窗口，**再**决定要不要开 `/setup/` 硬件线。
不要提前为一个还没看到的 offer 列表写自己不熟的品类。

开 `/setup/` 时：把 `src/consts.ts` 里 `NAV` 中注释掉的那一行放开，
并新建 `src/pages/setup/index.astro`（照抄 `tools/index.astro` 改即可）。

---

## 3. 写一篇新文章

```bash
cp src/content/tools/_TEMPLATE-comparison.md \
   src/content/tools/claude-code-vs-cursor.md
```

文件名就是 URL：`claude-code-vs-cursor.md` → `/tools/claude-code-vs-cursor/`。
**用英文短横线 slug**，不要用中文文件名。

frontmatter 字段：

```yaml
title: '标题'
description: '一句话摘要，会用在列表页和 <meta description>'
pubDate: 2026-09-22
kind: comparison      # comparison | hands-on | guide | hardware
tags: ['AI 编程']
affiliate: true       # true 时文首自动插入披露条
draft: true           # 改成 false 才上线
```

`_` 开头的文件也会被 glob 读到，所以模板靠 `draft: true` 保持不上线——
复制出去之后记得改。

### 内链是自动的

`/tools/[...slug].astro` 会自动在每篇文末列出同 cluster 的其他 5 篇。
**唯一需要手动做的**：每发一篇，去 `src/pages/tools/index.astro` 确认它被归进了
正确的 `kind` 分组——支柱页向下分发权重靠这个。

---

## 4. 部署到 Cloudflare Pages

**先上线，域名后买。** 写作阶段用免费的 `*.pages.dev`，写到第 7–8 篇再买域名绑上去——
在同一个平台上绑定，内容和构建配置完全不用动，零迁移成本。

> 不要用 `*.github.io`：换域名时要处理跳转和权重转移；而且没有域名就没有域名邮箱，
> 两个弱信号叠加会显著拉低联盟审核通过率。Amazon Associates 的原文要求是
> **"You must own your website"**。

### 4.1 首次上线（免费子域）

1. 在 GitHub 新建一个**空仓库**（public 或 private 都行），然后：

   ```bash
   git remote add origin git@github.com:你的用户名/仓库名.git
   git push -u origin main
   ```

2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选中仓库，构建设置：

   | 项 | 值 |
   |---|---|
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | 留空（仓库根就是站点根） |

   Node 版本由仓库里的 `.node-version` 文件指定（当前为 `22`），不用在面板里设。

4. Save and Deploy。之后**推送到 `main` 即自动部署**。

站点会上线在 `你的项目名.pages.dev`。

> 不想连 GitHub 也可以直接上传：`npm run deploy`（走 `npx wrangler pages deploy dist`，
> 首次会让你登录授权）。但 Git 集成更省事，推荐。

### 4.2 买了域名之后

1. 域名 DNS 托管到 Cloudflare（注册商处改 NS，或直接在 Cloudflare Registrar 注册）
2. Pages 项目 → **Custom domains** → **Set up a custom domain** → 填你的域名
3. HTTPS 证书 Cloudflare 自动签发，等几分钟即可
4. 回来改 `src/consts.ts` 和 `public/robots.txt` 里的三处占位符（见第 1 节）并推送

### 4.3 配域名邮箱（联盟审核必需）

**收信** —— Cloudflare Email Routing，免费，5 分钟：

1. Cloudflare Dashboard → 选中域名 → 左侧 **Email** → **Email Routing** → Get started
2. 按提示让 Cloudflare 自动添加 MX 和 SPF 记录
3. **Destination addresses** → 填你的 Gmail → 去 Gmail 点验证链接
4. **Routing rules** → 建 `hello@你的域名` → 指向该 Gmail
5. 再开一个 **Catch-all** 也指向 Gmail，拼错的地址就不会丢
6. **自己发一封测试信确认能收到**

> Cloudflare Email Routing **只能收，不能用你的域名发信**。
> 免费额度：200 个自定义地址 + 200 个目标地址，转发量不限。

**发信**（可选，想用自己域名回信时再配）：

1. 注册一个 SMTP 中继拿凭证 —— Brevo（免费 300 封/天）或 Resend（免费 3000 封/月）
2. Gmail → 设置 → **账号和导入** → **"用这个地址发送邮件"** → 填中继商给的
   SMTP 主机 / 端口 / 用户名 / 密码
3. 按中继商文档在 Cloudflare DNS 加 **DKIM** 和 **DMARC** 记录（SPF 第一步已加）
4. 用 [mail-tester.com](https://www.mail-tester.com/) 发一封测分，低于 8 分就按它的提示修

没配 DKIM/DMARC 的话，你发出去的信大概率进对方垃圾箱。

### 4.4 访问统计

Cloudflare Pages 项目里直接开 **Web Analytics** 即可——无 cookie、不跨站追踪，
与 `src/pages/privacy.astro` 当前的描述一致。**换成 Google Analytics 必须改隐私政策**
（见第 5 节）。

---

## 5. 统计工具：先决定，再改 privacy 页

`src/pages/privacy.astro` 当前描述的是**无 cookie、不跨站追踪**的统计方案。
这对应：

- **Cloudflare Web Analytics**（免费，和托管在一起，最省事）
- Plausible / Umami

如果你改用 **Google Analytics**，必须重写 privacy 页那一段——
GA 会设置 cookie、做跨站追踪，在 GDPR 地区还需要 Cookie 同意横幅。
文件里有 `⚠️` 注释标出了具体位置。

**隐私政策与实际行为不一致，是联盟网络拒绝申请的常见原因之一。**

---

## 6. 内容边界（这条影响 SEO，别忽略）

判断一篇文章该不该写，用**读者重叠度**，不是品类：

> 读了 A 文章的人，会不会自然想读 B 文章？

| | 判断 |
|---|---|
| AI 编程工具测评 → AI 工作流的桌面配置 | ✅ 同一拨人，安全 |
| MCP 接入踩坑 → 跑本地模型的迷你主机选型 | ✅ 安全 |
| AI 工具测评 → 户外电源 / 露营装备 | ❌ 两拨人，这是真的主题稀释 |
| AI 工具测评 → 与本职工作相关的行业内容 | ❌ 主题稀释，且存在利益冲突 |

**关于第四条**：本站与作者雇主无关，不写与本职工作所在行业相关的产品。
这一点已写进 `/about` 和 `/contact`，别破例。

以后想写完全不同的主题——开第二个站，别混在这里。
最坏的情况是第二个主题写到 5–10 篇但没到深度，那会拖累整站。

---

## 7. 目录结构

```
src/
├── consts.ts                 ← 全站配置，改域名只动这里
├── content.config.ts         ← frontmatter schema
├── content/
│   ├── tools/                ← 阶段一，全部文章放这
│   │   └── _TEMPLATE-comparison.md
│   └── setup/                ← 阶段三再用，现在留空
├── pages/
│   ├── index.astro           ← 首页
│   ├── about.astro           ← ┐
│   ├── contact.astro         ← │ 审核必备四页
│   ├── privacy.astro         ← │
│   ├── affiliate-disclosure.astro ← ┘
│   ├── rss.xml.js
│   └── tools/
│       ├── index.astro       ← 支柱页 (pillar)
│       └── [...slug].astro   ← 文章页
├── layouts/{Base,Post}.astro
├── components/{Header,Footer,AffiliateNotice}.astro
└── styles/global.css
```
