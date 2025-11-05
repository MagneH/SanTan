import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    ssr: 'src/entry.server.ts',
    outDir: 'dist/server',
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'entry.mjs'
      }
    }
  },
  plugins: [viteTsConfigPaths({ projects: ['./tsconfig.json'] }), react()],
})
