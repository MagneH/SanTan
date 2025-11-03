import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import netlifyPlugin from '@netlify/vite-plugin-tanstack-start';
import type { ConfigEnv } from 'vite';

export default ({ mode }: ConfigEnv) => {
  // Workaround to load secrets since it's broken in Tanstack RC0 (or similar versions)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  const isProduction = mode === 'production';

  return defineConfig({
    ssr: {
      noExternal: true, // Bundle everything except externals below
      external: ['stream', 'node:stream', 'node:*', 'fsevents']
    },
    optimizeDeps: {
      include: ['@santan/shared', 'xstate']
    },
    plugins: [
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart({ srcDirectory: 'src' }),
      // Netlify plugin handles SSR deployment
      isProduction ? netlifyPlugin() : null,
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
  });
};
