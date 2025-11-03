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
      // Bundle most things but exclude packages that need Node.js APIs
      noExternal: /^(?!(@tanstack\/router-core|stream|node:)).*$/,
      external: ['@tanstack/router-core', 'stream', 'node:stream', 'node:stream/web', 'node:*', 'fsevents']
    },
    build: {
      rollupOptions: {
        // Externalize Node.js builtins for SSR builds
        external: ['node:stream', 'node:stream/web', 'node:async_hooks', 'path', 'os', 'crypto', 'stream']
      }
    },
    optimizeDeps: {
      include: ['@santan/shared', 'xstate']
    },
    plugins: [
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart({ srcDirectory: 'src' }),
      // Netlify plugin handles SSR deployment
      isProduction ? netlifyPlugin() : null,
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
  });
};
