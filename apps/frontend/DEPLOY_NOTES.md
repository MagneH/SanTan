# Netlify Deployment Setup

## Løsning

Applikasjonen bruker **TanStack Start** med **Netlify's offisielle plugin** for enkel SSR deployment.

### Viktige filer

#### `vite.config.ts`
```typescript
import netlifyPlugin from '@netlify/vite-plugin-tanstack-start';

export default ({ mode }) => {
  const isProduction = mode === 'production';
  
  return defineConfig({
    plugins: [
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tanstackStart({ srcDirectory: 'src' }),
      // Netlify plugin handles SSR deployment automatically in production
      isProduction ? netlifyPlugin() : null,
      viteReact(),
      tailwindcss(),
      vanillaExtractPlugin(),
      devtools(),
    ],
  });
};
```

#### `src/server.ts`
```typescript
import { createStart } from '@tanstack/react-start';
import { getRouter } from './router';

// createStart takes a function that returns options
export default createStart(() => ({
  getRouter,
}));
```

#### `netlify.toml`
```toml
[build]
command = "npm run build"
publish = "dist/client"

[build.environment]
NODE_VERSION = "24"
SECRETS_SCAN_ENABLED = "false"
```

#### `package.json` scripts
```json
{
  "scripts": {
    "dev": "vite dev --port 3000",
    "prebuild": "cd ../../packages/shared && npm run build",
    "build": "vite build"
  }
}
```

## Hva skjer ved deployment

1. **`npm run build`** kjøres av Netlify
   - `prebuild` bygger shared-pakken først
   - `vite build` bygger client-siden

2. **Netlify plugin** (aktivert kun i production)
   - Bygger SSR bundle automatisk
   - Genererer Netlify Functions
   - Oppretter `_redirects` fil for routing
   - Håndterer alle Node.js builtins korrekt

3. **Output**
   - `dist/client/` → Static assets (CDN)
   - `.netlify/functions/` → Serverless functions (SSR)

## Ingen behov for

- ❌ Custom `netlify/functions/ssr.mjs` (plugin genererer automatisk)
- ❌ Manual redirects i netlify.toml (plugin håndterer via `_redirects`)
- ❌ Custom SSR build scripts (plugin bygger SSR automatisk)
- ❌ Nitro config (plugin bruker Nitro under panseret)
- ❌ Manual Node.js builtins externals (plugin håndterer det)

## Dependencies

### Core
- `@tanstack/react-start` - TanStack Start framework
- `@netlify/vite-plugin-tanstack-start` - Netlify deployment plugin

### Required by dependencies
- `@emotion/is-prop-valid` & `@emotion/unitless` - Brukt av styled-components
- `tslib` - TypeScript runtime library
- `xstate` - Brukt av @sanity/visual-editing

## Secrets Scanning

Secrets scanning er disabled fordi VITE_SANITY_* variabler er public by design:
- `VITE_SANITY_PROJECT_ID` - Public project ID
- `VITE_SANITY_DATASET` - Public dataset name
- `VITE_SANITY_API_VERSION` - Public API version
- `VITE_SANITY_STUDIO_URL` - Public Studio URL

Ekte secrets (kun server-side):
- `SANITY_API_TOKEN`
- `SANITY_READ_TOKEN`
- `SANITY_SESSION_SECRET`

## Monorepo Setup

Frontend er i `apps/frontend/` og avhenger av `packages/shared/` som må bygges først via `prebuild` script.

