import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { ConfigEnv } from 'vite';

export default ({ mode }: ConfigEnv) => {
  // Workaround to load secrets since it's broken in Tanstack RC0 (or similar versions)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return defineConfig({
    define: {
      // Prevent Vite from inlining env vars - keep them as process.env references
      'import.meta.env.VITE_SANITY_PROJECT_ID': JSON.stringify(undefined),
      'import.meta.env.VITE_SANITY_DATASET': JSON.stringify(undefined),
      'import.meta.env.VITE_SANITY_API_VERSION': JSON.stringify(undefined),
      'import.meta.env.VITE_SANITY_STUDIO_URL': JSON.stringify(undefined),
    },
    envPrefix: [], // Prevent Vite from processing VITE_ prefixed vars
    ssr: {
      noExternal: true, // Bundle everything for Netlify Functions
      external: ['node:*', 'fsevents']
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.mjs'
        }
      }
    },
    optimizeDeps: {
      include: ['@santan/shared', 'xstate']
    },
    plugins: [
      tanstackStart(),
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
  });
};
