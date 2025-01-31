// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax';


import tailwind from "@astrojs/tailwind";

export const SiteURL = import.meta.env.PROD ? import.meta.env.VITE_PROD_URL : import.meta.env.VITE_DEV_URL;

// https://astro.build/config
export default defineConfig({
  site: 'https://lshtar13.github.io',
  integrations: [mdx(), sitemap(), tailwind(), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    rehypePlugins: [rehypeMathjax],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
      themes: {
        light: 'catppuccin-mocha',
        dark: 'catppuccin-latte',
      },
    }
  },
});


