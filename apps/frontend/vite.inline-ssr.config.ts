import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    ssr: 'src/server.ts', // endret fra src/entry.server.ts
    outDir: 'dist/server',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      output: { entryFileNames: 'entry.mjs' }
    }
  },
  plugins: [viteTsConfigPaths({ projects: ['./tsconfig.json'] }), react()],
})
