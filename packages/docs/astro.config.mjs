// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
      title: 'Reveraie DataGrid',
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
                  { label: 'Example 01', slug: 'guides/example' },
              ],
          },
          {
              label: 'Examples',
              autogenerate: { directory: 'examples' },
          },
          {
              label: 'Reference',
              autogenerate: { directory: 'reference' },
          },
      ],
      }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});