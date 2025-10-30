# Getting Started with Santan Monorepo

This guide provides step-by-step instructions for setting up and running the monorepo. For a complete overview, see [README.md](README.md).

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** >= 18 ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Sanity account** with a configured project ([Sign up](https://www.sanity.io/))
- ✅ **Git** installed

---

## Step 1: Clone or Navigate to the Repository

```bash
cd /path/to/santan-monorepo
```

---

## Step 2: Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

This installs dependencies for:
- Root workspace
- Frontend app
- Studio app
- Shared package

**Expected output**: `audited 2288 packages`

---

## Step 3: Configure Environment Variables

### Frontend Environment

1. Copy the example file:
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   ```

2. Edit `apps/frontend/.env.local`:
   ```env
   # Sanity Configuration
   VITE_SANITY_PROJECT_ID=your_project_id_here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   
   # Session Secret (generate a random string)
   SESSION_SECRET=your_random_secret_here
   ```

   **Where to find your Sanity credentials:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Select your project
   - Find Project ID in the project settings

### Studio Environment

1. Copy the example file:
   ```bash
   cp apps/studio/.env.example apps/studio/.env.local
   ```

2. Edit `apps/studio/.env.local`:
   ```env
   # Sanity Configuration
   SANITY_STUDIO_PROJECT_ID=your_project_id_here
   SANITY_STUDIO_DATASET=production
   ```

   **Use the same values as the frontend.**

---

## Step 4: Generate Sanity Types

Before running the apps for the first time, generate TypeScript types from your Sanity schemas:

```bash
cd apps/studio
npm run generate-types
cd ../..
```

**What this does:**
- Extracts your Sanity schema
- Generates TypeScript types
- Creates type literal enums
- Outputs to `packages/shared/src/types/`

**Expected output**: 
```
✓ Extracted schema to schema.json
✓ Generated TypeScript types for X schema types
Extracted X types to sanityTypeLiterals.ts
```

---

## Step 5: Start Development Servers

Start all apps in development mode:

```bash
npm run dev
```

**This starts:**
- 🌐 **Frontend** at [http://localhost:3000](http://localhost:3000)
- 🎨 **Studio** at [http://localhost:3333](http://localhost:3333)
- 🔧 **Shared package** in watch mode (auto-recompiles)

**You should see:**
```
• Packages in scope: @santan/frontend, @santan/shared, @santan/studio
• Running dev in 3 packages
```

---

## Step 6: Verify Everything Works

### Check Frontend
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Troubleshooting:**
- If you see a 500 error, check the terminal for error messages
- Ensure your `.env.local` files are configured correctly
- Verify Sanity project ID matches your project

### Check Studio
Open [http://localhost:3333](http://localhost:3333) in your browser.

**You should see:**
- Sanity Studio login screen
- Your content types in the sidebar (after logging in)

**Troubleshooting:**
- If port 3333 is in use, Sanity will suggest another port
- Check that your Sanity project ID is correct

---

## Common Tasks

### Running Individual Apps

**Frontend only:**
```bash
npm run dev --workspace=@santan/frontend
```

**Studio only:**
```bash
npm run dev --workspace=@santan/studio
```

**Shared package only (watch mode):**
```bash
npm run dev --workspace=@santan/shared
```

### Building for Production

Build all apps:
```bash
npm run build
```

Build individual apps:
```bash
npm run build --workspace=@santan/frontend
npm run build --workspace=@santan/studio
```

### Type Checking

Check types across all packages:
```bash
npm run type-check
```

### Linting

Lint all code:
```bash
npm run lint
```

### Formatting

Format all code with Prettier:
```bash
npm run format
```

### Cleaning Build Artifacts

Remove all build outputs:
```bash
npm run clean
```

---

## Working with Sanity Content

### Adding New Content Types

1. **Create schema in Studio:**
   ```bash
   cd apps/studio
   # Edit files in src/schemaTypes/
   ```

2. **Generate types:**
   ```bash
   npm run generate-types
   ```

3. **Use types in Frontend:**
   ```typescript
   import { YourNewType } from '@santan/shared/types';
   ```

### Querying Content in Frontend

```typescript
import { sanityClient } from '@/sanity/client';
import { Post } from '@santan/shared/types';

const posts = await sanityClient.fetch<Post[]>(`
  *[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt
  }
`);
```

---

## Project Structure Overview

```
santan-monorepo/
├── apps/
│   ├── frontend/              # React app
│   │   ├── src/
│   │   │   ├── routes/       # TanStack Router pages
│   │   │   ├── components/   # React components
│   │   │   └── sanity/       # Sanity queries
│   │   └── .env.local        # ⚠️ Your config (not in git)
│   │
│   └── studio/                # Sanity Studio
│       ├── src/
│       │   ├── schemaTypes/  # Content schemas
│       │   └── structure/    # Studio customization
│       └── .env.local        # ⚠️ Your config (not in git)
│
├── packages/
│   └── shared/                # Shared types
│       ├── src/types/        # Generated Sanity types
│       └── dist/             # Compiled output
│
└── docs/                      # Documentation
```

---

## Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or kill all dev servers
pkill -f "npm run dev"

# Then restart
npm run dev
```

### Sanity Connection Failed

**Error:** `Failed to fetch data from Sanity`

**Checklist:**
- ✅ Verify `VITE_SANITY_PROJECT_ID` in `.env.local`
- ✅ Ensure dataset exists in your Sanity project
- ✅ Check API version is valid (format: YYYY-MM-DD)
- ✅ Verify you have content in your dataset

### Types Not Found

**Error:** `Cannot find module '@santan/shared/types'`

**Solution:**
```bash
# Generate types
cd apps/studio
npm run generate-types

# Build shared package
cd ../../packages/shared
npm run build

# Restart dev servers
cd ../..
npm run dev
```

### Module Resolution Errors

**Error:** `Cannot find module 'X'`

**Solution:**
```bash
# Clean and reinstall
npm run clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### TypeScript Errors in IDE

**Issue:** IDE shows errors but code runs fine

**Solution:**
- Restart TypeScript server:
  - **VS Code:** `CMD+Shift+P` → "TypeScript: Restart TS Server"
  - **WebStorm:** Invalidate caches and restart
- Close and reopen the project
- Reload window

---

## Next Steps

Now that you're set up:

1. **Explore the Frontend** - Check out `apps/frontend/src/routes/`
2. **Customize Studio** - Edit schemas in `apps/studio/src/schemaTypes/`
3. **Add Content** - Create content in Studio at [http://localhost:3333](http://localhost:3333)
4. **Share Types** - Add custom types to `packages/shared/src/types/`
5. **Read Documentation** - Check [docs/INDEX.md](docs/INDEX.md) for all guides

---

## Additional Resources

- **[README.md](README.md)** - Complete project overview
- **[TYPE_MIGRATION.md](TYPE_MIGRATION.md)** - Type generation guide
- **[docs/INDEX.md](docs/INDEX.md)** - Documentation index
- **[packages/shared/TYPES_README.md](packages/shared/TYPES_README.md)** - Shared package docs
- **[packages/shared/PRODUCTION_READY.md](packages/shared/PRODUCTION_READY.md)** - Production guide

---

## Support

### Turborepo
- Documentation: https://turbo.build/repo/docs
- Issues: https://github.com/vercel/turbo/issues

### Sanity
- Documentation: https://www.sanity.io/docs
- Community: https://slack.sanity.io

### TanStack Router
- Documentation: https://tanstack.com/router
- GitHub: https://github.com/TanStack/router

---

**Welcome to the Santan Monorepo! Happy coding! 🚀**

## Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node.js)
- **Sanity account** with a configured project

## Initial Setup

### 1. Copy Environment Files

**Frontend:**
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

Edit `apps/frontend/.env.local` and add your Sanity configuration:
```env
VITE_SANITY_PROJECT_ID=your_actual_project_id
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
SANITY_STUDIO_PROJECT_ID=your_actual_project_id
SANITY_STUDIO_DATASET=production
```

### 2. Install Dependencies

From the root of the monorepo:
```bash
npm install
```

This will install dependencies for all apps and packages.

## Development

### Run Both Apps

Start both the frontend and studio in development mode:
```bash
npm run dev
```

This will start:
- **Frontend** at http://localhost:3000
- **Studio** at http://localhost:3333 (default Sanity port)

### Run Individual Apps

**Frontend only:**
```bash
npm run dev --workspace=@santan/frontend
```

**Studio only:**
```bash
npm run dev --workspace=@santan/studio
```

## Building

Build all apps for production:
```bash
npm run build
```

Build individual apps:
```bash
npm run build --workspace=@santan/frontend
npm run build --workspace=@santan/studio
```

## Other Commands

### Linting
```bash
npm run lint                                  # Lint all apps
npm run lint --workspace=@santan/frontend # Lint frontend only
```

### Type Checking
```bash
npm run type-check                                  # Type check all apps
npm run type-check --workspace=@santan/frontend # Type check frontend only
```

### Formatting
```bash
npm run format                                  # Format all apps
npm run format --workspace=@santan/frontend # Format frontend only
```

### Cleaning
```bash
npm run clean # Clean build artifacts from all apps
```

## Project Structure

```
santan-monorepo/
├── apps/
│   ├── frontend/           # React frontend with TanStack Router
│   │   ├── src/
│   │   ├── public/
│   │   ├── .env.local      # Your environment variables (not in git)
│   │   └── package.json
│   └── studio/             # Sanity Studio
│       ├── src/
│       ├── .env.local      # Your environment variables (not in git)
│       └── package.json
├── packages/
│   └── shared/             # Shared types and utilities
│       ├── src/
│       └── package.json
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json with workspaces
└── README.md
```

## Working with the Shared Package

The `@santan/shared` package contains types and utilities shared between apps.

To add shared types:
1. Add them to `packages/shared/src/types/`
2. Export them from `packages/shared/src/index.ts`
3. Use them in your apps:
   ```typescript
   import { SanityDocument } from '@santan/shared';
   ```

## Turborepo Benefits

- **Incremental builds**: Only rebuilds what changed
- **Remote caching**: Share build cache across team (when configured)
- **Parallel execution**: Runs tasks across packages in parallel
- **Task dependencies**: Automatically runs dependent tasks in order

## Troubleshooting

### "Command not found: turbo"
Run `npm install` from the root to install Turborepo.

### Frontend can't connect to Sanity
Check your `.env.local` files and ensure:
- `VITE_SANITY_PROJECT_ID` matches your Sanity project
- `VITE_SANITY_DATASET` is correct (usually "production")

### Port already in use
If port 3000 or 3333 is already in use, you can change them:
- Frontend: Edit the `dev` script in `apps/frontend/package.json`
- Studio: Sanity will automatically suggest another port

## Migration from Separate Repos

If you're migrating from separate repositories:
1. Your existing `.env.local` files should be copied to the respective app directories
2. Git history is preserved in the copied directories
3. You can keep the old repos as backup or archive them

## Next Steps

- Configure Sanity Studio content types in `apps/studio/`
- Add new routes in `apps/frontend/src/routes/`
- Share types between apps using `packages/shared/`
- Set up deployment (Vercel, Netlify, etc.)

## Support

For issues specific to:
- **Turborepo**: https://turbo.build/repo/docs
- **Sanity**: https://www.sanity.io/docs
- **TanStack Router**: https://tanstack.com/router

