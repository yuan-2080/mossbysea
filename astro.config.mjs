import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE } from './src/consts.ts';

export default defineConfig({
  site: SITE.url,
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
