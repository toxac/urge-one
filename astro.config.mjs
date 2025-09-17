// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import solidJs from '@astrojs/solid-js';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
  integrations: [solidJs(), sitemap(), mdx(), icon()]
});