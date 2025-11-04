import type { NitroConfig } from 'nitro/types';

export default {
  preset: 'cloudflare-pages',
  compatibilityDate: '2025-11-04',
  output: {
    dir: '.output',
    publicDir: '.output/public',
  },
  rollupConfig: {
    external: [],
  },
} satisfies NitroConfig;

