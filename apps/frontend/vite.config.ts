import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';
import type { ConfigEnv } from 'vite';

export default ({ mode }: ConfigEnv) => {
  // Workaround to load secrets since it's broken in Tanstack RC0 (or similar versions)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return defineConfig({
    css: process.env.TAILWIND_DISABLE_LIGHTNINGCSS ? { minify: 'esbuild' } : undefined,
    resolve: {
      alias: {
        '@santan/shared': '/packages/shared/src',
        '@santan/shared/types': '/packages/shared/src/types'
      }
    },
    ssr: {
      noExternal: ['@santan/shared']
    },
    build: {
      rollupOptions: {
        external: []
      }
    },
    optimizeDeps: {
      include: ['@santan/shared', 'xstate']
    },
    plugins: [
      tanstackStart(),
      nitroV2Plugin({
        preset: 'node-server',
        output: { dir: '.output' },
        externals: {
          inline: ['@santan/shared']
        }
      }),
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
  });
};
