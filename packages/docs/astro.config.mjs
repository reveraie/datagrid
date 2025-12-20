// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
      title: '@reveraie/datagrid',
      customCss: [
        // Path to your Tailwind base styles:
        './src/styles/global.css',
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/reveraie/datagrid' }],
      sidebar: [
          {
              label: 'Guides',
              items: [
                  // Each item here is one entry in the navigation menu.
                  { label: 'Getting Started', slug: 'guides/getting-started' },
              ],
          },
          {
              label: 'Examples',
              autogenerate: { directory: 'examples' },
          },
          {
              label: 'Reference',
              items: [
                  { label: 'API Reference', slug: 'reference' },
                  { label: 'HTML & CSS Reference', slug: 'html-css-reference' },
                ],
          },
      ],
      }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});