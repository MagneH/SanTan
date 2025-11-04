import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'cloudflare-pages',
    compatibilityDate: '2025-11-04',
  },
});

