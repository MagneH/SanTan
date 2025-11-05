# Santan Monorepo

A production-ready monorepo combining a React frontend with Sanity Studio, powered by Turborepo.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.3-red)](https://turbo.build/repo)
[![Node.js](https://img.shields.io/badge/Node.js-≥22_LTS-green)](https://nodejs.org/)

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

- **Node.js** ≥ 22 (LTS)
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

### Deployment Options

#### 🚀 Google Cloud Run (Recommended)

**Quick Start:**
```bash
cd apps/frontend
./deploy.sh production
```

**Full Guide:** See [QUICKSTART_CLOUD_RUN.md](QUICKSTART_CLOUD_RUN.md)

Features:
- ✅ Auto-scaling and load balancing
- ✅ HTTPS out of the box
- ✅ Pay only for what you use
- ✅ ~15 minutes to first deployment

#### 🔄 CI/CD with GitHub Actions

Automatic deployment on every push to `main`:

**Setup:**
```bash
# Run the setup script
./setup-github-ci.sh
```

**Full Guide:** See [GITHUB_CI_SETUP.md](GITHUB_CI_SETUP.md)

Features:
- ✅ Automatic testing and building
- ✅ Deploy on merge to main
- ✅ PR preview deployments
- ✅ Automatic cleanup

#### 🎨 Sanity Studio

Deploy Studio to Sanity's hosting:
```bash
cd apps/studio
npm run deploy
```

Or from root:
```bash
npm run deploy --workspace=@santan/studio
```

#### 📚 Other Platforms

**Frontend (Vercel/Netlify):**
- Root directory: `apps/frontend`
- Build command: `npm run build`
- Output directory: `apps/frontend/.output`

**See [`packages/shared/PRODUCTION_READY.md`](packages/shared/PRODUCTION_READY.md) for additional deployment options.**

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

### Deployment & CI/CD
- **[QUICKSTART_CLOUD_RUN.md](QUICKSTART_CLOUD_RUN.md)** - Quick guide to deploy to Google Cloud Run (~15 min)
- **[CLOUD_RUN_DEPLOYMENT.md](CLOUD_RUN_DEPLOYMENT.md)** - Complete Cloud Run deployment guide with advanced options
- **[GITHUB_CI_SETUP.md](GITHUB_CI_SETUP.md)** - Setup GitHub Actions for automatic testing and deployment
- **[MONOREPO_CI_CD.md](MONOREPO_CI_CD.md)** - How CI/CD handles the monorepo structure (frontend + studio)

### Development
- **[TYPE_MIGRATION.md](TYPE_MIGRATION.md)** - Complete type generation and migration guide
- **[packages/shared/TYPES_README.md](packages/shared/TYPES_README.md)** - Detailed shared package documentation
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Detailed setup instructions

### Content Management
- **[docs/FULLSLUG_SYSTEM.md](docs/FULLSLUG_SYSTEM.md)** - Sanity fullSlug system for hierarchical URLs
- **[docs/INDEX.md](docs/INDEX.md)** - Complete documentation index

### Production
- **[packages/shared/PRODUCTION_READY.md](packages/shared/PRODUCTION_READY.md)** - Production deployment guide for various platforms

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

