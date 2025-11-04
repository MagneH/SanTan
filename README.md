# Santan Monorepo

A production-ready monorepo combining a React frontend with Sanity Studio, powered by Turborepo.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.3-red)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-≥18-green)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Production](#production)
- [Type Generation](#type-generation)
- [Available Commands](#available-commands)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

---

## Overview

This monorepo combines a React frontend and Sanity Studio into a single, optimized workspace with:

✅ **Shared type system** - Auto-generated Sanity types used across both apps  
✅ **Turborepo caching** - Lightning-fast builds with intelligent caching  
✅ **Production-ready** - Properly configured for deployment  
✅ **Type-safe** - Full TypeScript support throughout  
✅ **Hot reloading** - Fast development experience  

### Tech Stack

**Frontend (`apps/frontend`)**
- React 19
- TanStack Router & Query
- Vite 7
- Sanity Client
- Tailwind CSS

**Studio (`apps/studio`)**
- Sanity Studio 4
- Custom schema types
- Document preview

**Shared (`packages/shared`)**
- Auto-generated Sanity types
- Shared utilities
- Type-safe enums

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node.js)
- **Sanity account** with a configured project

### 1. Clone and Install

```bash
cd /path/to/santan-monorepo
npm install
```

### 2. Configure Environment

**Frontend:**
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edit `apps/frontend/.env.local`:
```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
SESSION_SECRET=generate_a_random_secret_here
```

**Studio:**
```bash
cp apps/studio/.env.example apps/studio/.env.local
```

Edit `apps/studio/.env.local`:
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### 3. Start Development

```bash
npm run dev
```

This starts:
- 🌐 **Frontend** at [http://localhost:3000](http://localhost:3000)
- 🎨 **Studio** at [http://localhost:3333](http://localhost:3333)
- 🔧 **Shared package** in watch mode (auto-recompiles on changes)

---

## Project Structure

```
santan-monorepo/
├── apps/
│   ├── frontend/              # React frontend
│   │   ├── src/
│   │   │   ├── routes/       # TanStack Router routes
│   │   │   ├── components/   # React components
│   │   │   ├── sanity/       # Sanity queries and loaders
│   │   │   └── types/        # Frontend-specific types
│   │   ├── .env.local        # Environment variables (not in git)
│   │   └── package.json      # @santan/frontend
│   │
│   └── studio/                # Sanity Studio
│       ├── src/
│       │   ├── schemaTypes/  # Content schemas
│       │   ├── structure/    # Studio structure
│       │   └── scripts/      # Type generation scripts
│       ├── .env.local        # Environment variables (not in git)
│       └── package.json      # @santan/studio
│
├── packages/
│   └── shared/                # Shared package (auto-generated types)
│       ├── src/
│       │   ├── types/
│       │   │   ├── sanity.types.ts       # Generated Sanity types
│       │   │   └── sanityTypeLiterals.ts # Type literal enums
│       │   └── index.ts      # Main export
│       ├── dist/             # Compiled output (generated)
│       └── package.json      # @santan/shared
│
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package with workspaces
├── README.md                  # This file
└── docs/
    ├── TYPE_MIGRATION.md      # Type generation guide
    └── PRODUCTION_READY.md    # Production deployment guide
```

---

## Development

### Run All Apps

```bash
npm run dev
```

Starts all workspaces with hot reloading:
- Frontend dev server
- Studio dev server  
- Shared package in watch mode (auto-rebuilds on changes)

### Run Individual Apps

```bash
# Frontend only
npm run dev --workspace=@santan/frontend

# Studio only
npm run dev --workspace=@santan/studio

# Shared package only (watch mode)
npm run dev --workspace=@santan/shared
```

### Working with Shared Types

The `@santan/shared` package contains auto-generated Sanity types:

```typescript
// Import in Frontend or Studio
import { 
  Post, 
  Category, 
  Author,
  sanityTypeLiterals 
} from '@santan/shared/types';

// Type-safe document checking
if (doc._type === sanityTypeLiterals.post) {
  // TypeScript knows doc is Post type
  console.log(doc.title, doc.slug);
}
```

---

## Production

### Building for Production

```bash
npm run build
```

This builds all packages in the correct order:
1. **Shared package** → Compiles TypeScript to JavaScript
2. **Studio** → Builds Sanity Studio (using shared types)
3. **Frontend** → Builds React app (using shared types)

### Build Output

- **Frontend**: `apps/frontend/.output/` (Nitro/Vite output)
- **Studio**: `apps/studio/dist/` (Sanity Studio build)
- **Shared**: `packages/shared/dist/` (Compiled types)

### Deployment

**Frontend (Vercel/Netlify):**
- Root directory: `apps/frontend`
- Build command: `npm run build`
- Output directory: `apps/frontend/.output` or `apps/frontend/dist`

**Studio (Sanity):**
```bash
cd apps/studio
npm run deploy
```

Or from root:
```bash
npm run deploy --workspace=@santan/studio
```

**See [`packages/shared/PRODUCTION_READY.md`](packages/shared/PRODUCTION_READY.md) for complete deployment guide.**

---

## Type Generation

### When to Regenerate Types

Run type generation whenever you:
- Add a new document type in Sanity Studio
- Modify existing schemas
- Change field definitions
- Update portable text configurations

### Generate Types

```bash
cd apps/studio
npm run generate-types
```

**What this does:**
1. Extracts Sanity schema → `schema.json`
2. Generates TypeScript types → `packages/shared/src/types/sanity.types.ts`
3. Extracts type literals → `packages/shared/src/types/sanityTypeLiterals.ts`

The shared package automatically rebuilds (if dev mode is running), making types instantly available to both Frontend and Studio.

**See [`TYPE_MIGRATION.md`](TYPE_MIGRATION.md) for detailed type generation workflow.**

---

## Available Commands

### Root Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run type-check` | Type check all packages |
| `npm run lint` | Lint all packages |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Clean build artifacts |

### Workspace Commands

Run commands in specific packages:

```bash
# Pattern
npm run <command> --workspace=@santan/<package>

# Examples
npm run dev --workspace=@santan/frontend
npm run build --workspace=@santan/studio
npm run type-check --workspace=@santan/shared
```

---

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed hosting & deployment strategies
- **[apps/frontend/CLOUDFLARE.md](apps/frontend/CLOUDFLARE.md)** - Cloudflare Pages deployment guide
- **[TYPE_MIGRATION.md](TYPE_MIGRATION.md)** - Complete type generation and migration guide
- **[packages/shared/TYPES_README.md](packages/shared/TYPES_README.md)** - Detailed shared package documentation
- **[packages/shared/PRODUCTION_READY.md](packages/shared/PRODUCTION_READY.md)** - Production deployment guide
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Detailed setup instructions
- **[docs/FULLSLUG_SYSTEM.md](docs/FULLSLUG_SYSTEM.md)** - Sanity fullSlug system for hierarchical URLs
- **[docs/INDEX.md](docs/INDEX.md)** - Complete documentation index

---

## Troubleshooting

### Port Already in Use

If ports 3000 or 3333 are in use:

```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3333 | xargs kill -9

# Or kill all dev servers
pkill -f "npm run dev"
```

### Frontend Can't Connect to Sanity

Check your `.env.local` files:
- ✅ `VITE_SANITY_PROJECT_ID` matches your Sanity project
- ✅ `VITE_SANITY_DATASET` is correct (usually "production")
- ✅ `VITE_SANITY_API_VERSION` is valid

### Types Not Updating

1. Regenerate types:
   ```bash
   cd apps/studio
   npm run generate-types
   ```

2. If dev mode is running, shared package should auto-rebuild
3. Otherwise, manually build:
   ```bash
   cd packages/shared
   npm run build
   ```

4. Restart TypeScript server in your IDE:
   - VS Code: `CMD+Shift+P` → "TypeScript: Restart TS Server"
   - WebStorm: Should auto-reload

### "Cannot find module" Errors

Ensure dependencies are installed:
```bash
npm install
```

If issues persist, clean and reinstall:
```bash
npm run clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### Build Errors in Production

Ensure the shared package is built before other packages:
```bash
cd packages/shared && npm run build
cd ../..
npm run build
```

Turborepo should handle this automatically with the `^build` dependency.

---

## Hosting & Deployment Overview (Hosting-Agnostic Template)

This template is designed to be hosting-agnostic. You can deploy the **frontend (SSR)** and **Sanity Studio** using any modern platform that supports:
- Node.js server functions (for SSR) OR edge/serverless runtimes
- Static asset hosting for the built client and Studio bundle

Below are common hosting patterns with concrete examples. Pick the one that best fits your stack.

### 1. Netlify (Example Setup – Two Sites)
Netlify is a good option if you want separate pipelines for frontend and Studio.

| Site | Base Directory | Build Command | Publish Directory | Notes |
|------|----------------|---------------|------------------|-------|
| Frontend | `apps/frontend` | `npm run build:frontend` | `apps/frontend/dist/client` | SSR function auto-generated by TanStack Start plugin (`apps/frontend/.netlify/v1/functions/server.mjs`) |
| Studio | `apps/studio` | `npm run build:studio` or `npm run build` | `apps/studio/dist` | Pure static SPA; can also be deployed via `sanity deploy` |

Add environment variables per site in the Netlify UI (avoid hardcoding secrets). The SSR function directory is auto-created; do **not** commit `.netlify/`.

### 2. Vercel (Frontend + Embedded or Separate Studio)
Two options:
1. Deploy **frontend** as a Vercel project; use adapter via Nitro or TanStack Start default (Vercel build picks up `build` output). Deploy **Studio** separately (another project) or use `sanity deploy`.
2. Embed Studio under a route (e.g. `/studio`) – use dynamic import + route constraint; set `basePath` in `sanity.config.ts` to `/studio`. Add a catch-all route to hand off to `<Studio />`.

Pros: First-class edge functions, automatic streaming for SSR. 
Cons: Embedded mode increases frontend bundle unless aggressively code-split.

### 3. Sanity Managed Hosting for Studio + Any Node Host for Frontend
- Run `sanity deploy` inside `apps/studio` – Studio is available at `https://<project>.sanity.studio`
- Deploy frontend with: Docker, Fly.io, Render, Railway, AWS Lambda / Lambda@Edge, Azure Functions, Cloudflare Workers (with Wrangler + Nitro Cloudflare preset).

### 4. Single Server (Self-Hosted / Docker)
Run both apps behind a reverse proxy:
- Build `apps/frontend` (SSR) → start with `node dist/server/server.js` (or Nitro output)
- Build `apps/studio` → serve static `dist` from Express / Fastify / a static file server under `/studio`
- Use Nginx / Traefik routing: `/studio/*` → static; everything else → SSR handler.

### 5. Edge Runtimes (Cloudflare Workers / Deno Deploy / Bun)
Use Nitro presets or TanStack Start adapter compatibility:
- Ensure you avoid Node-only APIs (replace `node:stream` dependencies if necessary)
- Use `fetch`-based SSR entry and no synchronous filesystem calls.

### Environment Variable Strategy (Generic)
Separate **frontend** and **studio** variables to avoid leaking editing context:

Frontend (public + server):
```
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_STUDIO_URL=https://your-studio-host
SESSION_SECRET=<server secret>
SANITY_READ_TOKEN=<private server token>
SANITY_API_TOKEN=<private server token>
```

Studio:
```
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=
SANITY_STUDIO_API_VERSION=2024-01-01
SANITY_STUDIO_PREVIEW_URL=https://your-frontend-host
SANITY_STUDIO_PREVIEW_SECRET=<generated secret>
```

Portable: Use `.env.local` files during development; inject via host-specific secret managers in production.

### SSR Function / Handler (Generic)
TanStack Start creates an SSR entry with a `fetch` signature. Hosting differences:
- Netlify plugin writes to `.netlify/v1/functions/server.mjs`
- Nitro builds may output `.output/server/index.mjs`
- Vercel expects export from `.output` or framework adapter

Ensure your server entry (`src/server.ts`) exports:
```ts
export default { fetch(request: Request) { /* ... */ } }
```

### Preview & Draft Mode
Enable preview only when all three conditions are met:
1. A valid preview/draft secret or session is present
2. Environment is not production OR explicitly allowed
3. Studio origin is trusted (CORS / overlays origin check)

In production public mode, hide:
- Draft indicators
- Exit preview button
- Overlay debug UI

### Shared Types Synchronization
Keep shared types generation host-agnostic:
```bash
# Regenerate after schema changes
npm run generate-types --workspace=@santan/studio
# Or inside studio folder
cd apps/studio && npm run generate-types
```
Using a `prepare` script in `packages/shared` ensures builds in isolated environments (like separate studio deploy) compile types before consumption.

### Recommended Minimal Deployment Matrix
| Scenario | Frontend Build | Studio Build | When to Pick |
|----------|----------------|--------------|--------------|
| Two-site (Netlify/Vercel) | Independent SSR | Independent Studio | Clear separation of concerns |
| Embedded Studio | SSR + code-split Studio | (None) | Unified domain, editor convenience |
| Managed Studio + Custom Frontend | SSR on Node/Edge | `sanity deploy` | Simplest Studio hosting |
| Single Docker Image | SSR process + static assets | Included in image | Self-host control & version locking |

### Production Hardening Checklist
- ✅ Consolidate error boundaries for SSR streaming
- ✅ Enable CSP & security headers (already via middleware)
- ✅ Monitor bundle sizes (`manualChunks` for large vendor modules)
- ✅ Add logging around preview secret access
- ✅ Use short-lived preview tokens (rotate automatically)

### Troubleshooting (Hosting-Agnostic)
| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| SSR returns 500 | Wrong handler export | Confirm `default.fetch` signature |
| Studio 404 on sub-route | Missing catch-all route or redirect | Add wildcard route or hosting redirect |
| Types undefined | Shared not built | Run shared build or ensure `prepare` runs |
| Overlays not visible | Origin mismatch or stega disabled | Check `allowStudioOrigin` & stega config |
| Preview leaks in prod | Draft mode detection too permissive | Tighten condition & strip preview UI |

### Making It Portable
If switching hosts, you usually only need to change:
- Build command wrapper (workspace vs root)
- Output directory mapping (publish path)
- Functions / server entry directory
- Environment variable injection method

The core application code (routes, loaders, schema, types) remains unchanged.

---
## Updating / Regenerating Types
When schemas change:
```bash
cd apps/studio
npm run generate-types
# (Triggers extraction + regeneration in shared package)
```
If frontend is running dev, it will pick up updated compiled types after shared rebuild.

---
## Troubleshooting (Quick Reference)
| Issue | Symptom | Fix |
|-------|---------|-----|
| Missing SSR Function | "No functions found" / blank page | Ensure functions directory points to `apps/frontend/.netlify/v1/functions` and build ran in production mode |
| Studio build fails: Missing script | `Missing script: "build:studio"` | Add root `build:studio` script or set build command to `npm run build` with base=apps/studio |
| Cannot resolve `@santan/shared/types` | Vite Rollup import error | Build shared first (`npm --workspace=@santan/shared run build`) or rely on `prepare` script; ensure file dependency in Studio `package.json` |
| Secret scanning fails | Build aborts listing env values | Remove actual secret values from code/README; use placeholders; set scanning off temporarily if needed |
| LightningCSS native module error | `Cannot find module lightningcss...` | Rebuild from source (`npm rebuild lightningcss --build-from-source`) or disable LightningCSS (set env `LIGHTNINGCSS_DISABLE=1`) |
| SSR handler missing | Runtime 500 / `SSR handler missing` | Confirm `@netlify/vite-plugin-tanstack-start` is active only in production and `src/server.ts` exports default with `fetch` |
| Shared dist missing in CI | ENOENT for `dist/types/index.js` | Add `"prepare": "npm run build"` in shared; ensure workspace install from repo root |
| Preview indicator visible standalone | Draft mode indicator overlays prod | Only enable visual editing components when preview/draft mode detected; hide Exit Preview outside Studio |

---
## Minimal Frontend Deploy (Netlify)
UI Settings for Frontend Site:
```
Base directory: apps/frontend
Build command: npm run build:frontend
Publish directory: apps/frontend/dist/client
Functions directory (optional): apps/frontend/.netlify/v1/functions
```
Studio Site:
```
Base directory: apps/studio
Build command: npm run build:studio
Publish directory: apps/studio/dist
```

---
## Cleanup Notes
Removed legacy manual SSR wrapper (`netlify/functions/ssr.mjs`). The Netlify Vite plugin now owns server function generation.

Do NOT commit:
- `.netlify/` plugin output
- Actual secret values
- Generated `dist/` contents outside of publish (kept ephemeral)

---
## Future Improvements (Ideas)
- Add automated CI check ensuring shared types compiled before frontend build
- Switch to pnpm for more granular workspace installs
- Introduce Playwright tests for critical SSR routes
- Add code splitting hints (`manualChunks`) to reduce large bundle warnings

---

## Benefits of This Monorepo

### For Development
✅ **Single clone** - Get frontend and studio together  
✅ **Shared types** - Auto-generated, always in sync  
✅ **Fast builds** - Turborepo caches everything  
✅ **Hot reloading** - Changes reflect immediately  
✅ **Type safety** - Full TypeScript support  

### For Production
✅ **Optimized builds** - Only rebuild what changed  
✅ **Type-safe deployments** - Compile-time type checking  
✅ **Atomic commits** - Change frontend and studio together  
✅ **Single source of truth** - One repo, one package.json  

### For Teams
✅ **Easier onboarding** - Clone once, everything works  
✅ **Consistent tooling** - Same linting, formatting, testing  
✅ **Simplified CI/CD** - One pipeline for everything  
✅ **Better collaboration** - See all changes in one place  

---

## Support & Resources

- **Turborepo**: https://turbo.build/repo/docs
- **Sanity**: https://www.sanity.io/docs
- **TanStack Router**: https://tanstack.com/router
- **Vite**: https://vitejs.dev

---

## License

[Your License Here]

---

**Status**: ✅ Production Ready  
**Last Updated**: October 30, 2025
