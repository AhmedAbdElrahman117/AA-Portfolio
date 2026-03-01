// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // PERF: Minify HTML output — removes whitespace, comments, collapses attributes
  compressHTML: true,

  build: {
    // PERF: Let Astro decide whether to inline small stylesheets (critical CSS)
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // PERF: Enable CSS code splitting for smaller initial payloads
      cssCodeSplit: true,
    },
  },

  integrations: [react()],
});