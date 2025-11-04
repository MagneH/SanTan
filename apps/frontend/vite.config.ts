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
  const platform = process.env.DEPLOY_TARGET || 'netlify'; // 'netlify' | 'cloudflare'

  return defineConfig({
    plugins: [
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart({ srcDirectory: 'src' }),
      // Only Netlify needs a plugin; Cloudflare uses TanStack Start's default Nitro output
      isProduction && platform === 'netlify' ? netlifyPlugin() : null,
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
    ssr: {
      // Externalize node-only modules for edge compatibility
      noExternal: process.env.DEPLOY_TARGET === 'cloudflare' ? true : undefined,
    },
  });
};
