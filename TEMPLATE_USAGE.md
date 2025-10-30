# Using This Template

This is a production-ready monorepo template for building a React frontend with Sanity Studio CMS.

## 🚀 Getting Started

### 1. Clone or Copy This Template

```bash
# Clone to your new project
git clone <this-repo> my-project
cd my-project

# Or copy the folder
cp -r santan my-project
cd my-project
```

### 2. Customize Package Names

Replace `@santan` with your project name in the following files:

**Root:**
- `package.json` - Change `name` to `your-project-monorepo`

**Apps:**
- `apps/frontend/package.json` - Change `name` to `@your-project/frontend`
- `apps/studio/package.json` - Change `name` to `@your-project/studio`

**Packages:**
- `packages/shared/package.json` - Change `name` to `@your-project/shared`

**Documentation:**
- Update references in `README.md`, `GETTING_STARTED.md`, etc.

**Workspace File:**
- Rename `santan.code-workspace` to `your-project.code-workspace`

### 3. Update Import Statements

Search and replace `@santan/shared` with `@your-project/shared` in:
- `apps/frontend/src/**/*.{ts,tsx}`
- `apps/studio/src/**/*.ts`

```bash
# Using grep and sed (macOS/Linux)
find apps -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' 's/@santan\/shared/@your-project\/shared/g' {} +
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment Variables

**Frontend (`apps/frontend/.env.local`):**
```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
VITE_SANITY_USE_CDN=true

# For preview mode (optional)
SANITY_API_TOKEN=your_token
SANITY_PREVIEW_SECRET=your_secret
```

**Studio (`apps/studio/.env.local`):**
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### 6. Start Development

```bash
npm run dev
```

This starts:
- Frontend at http://localhost:3000
- Studio at http://localhost:3333

### 7. Customize Content Schemas

Edit Sanity schemas in `apps/studio/src/schemaTypes/` to match your content needs, then regenerate types:

```bash
cd apps/studio
npm run generate-types
```

## 📦 What's Included

### Frontend (`apps/frontend`)
- ⚡ Vite 7
- ⚛️ React 19
- 🔀 TanStack Router v2
- 🎨 Tailwind CSS v4
- 🔍 TypeScript
- 📦 Sanity Client integration

### Studio (`apps/studio`)
- 🎨 Sanity Studio v4
- 📝 Custom schema types
- 🔄 Automatic type generation
- 👁️ Document preview

### Shared (`packages/shared`)
- 📘 Auto-generated Sanity types
- 🔧 Shared utilities
- ♻️ Type-safe enums

### Infrastructure
- 🏗️ Turborepo for build orchestration
- 📦 npm workspaces
- 🔄 Hot module reloading
- ⚡ Optimized caching

## 🛠️ Available Commands

```bash
# Development
npm run dev                      # Start all apps
npm run dev --workspace=@santan/frontend
npm run dev --workspace=@santan/studio

# Building
npm run build                    # Build all apps
npm run build --workspace=@santan/frontend
npm run build --workspace=@santan/studio

# Type Checking
npm run type-check               # Check all packages

# Linting & Formatting
npm run lint                     # Lint all code
npm run format                   # Format with Prettier

# Cleanup
npm run clean                    # Remove build artifacts
```

## 📖 Documentation

- **[README.md](README.md)** - Full documentation
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Detailed setup guide
- **[TYPE_MIGRATION.md](TYPE_MIGRATION.md)** - Type generation workflow
- **[docs/MIGRATION.md](docs/MIGRATION.md)** - Monorepo structure explanation

## 🎯 Key Features

✅ **Shared Type System** - Define Sanity types once, use everywhere
✅ **Fast Builds** - Turborepo caching and incremental builds
✅ **Type Safety** - Full TypeScript support throughout
✅ **Hot Reloading** - Fast development experience
✅ **Production Ready** - Configured for deployment

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or any Node.js hosting:
- **Root directory**: `apps/frontend`
- **Build command**: `npm run build`
- **Output directory**: `apps/frontend/.output` or `apps/frontend/dist`

### Studio
Deploy to Sanity hosting:
```bash
cd apps/studio
npm run deploy
```

## 📝 Customization Checklist

- [ ] Update package names in all `package.json` files
- [ ] Replace `@santan/shared` imports with your package name
- [ ] Rename workspace file
- [ ] Update `README.md` and documentation
- [ ] Configure environment variables
- [ ] Customize Sanity schemas
- [ ] **Replace branded assets** (see `apps/frontend/public/REPLACE_ASSETS.md`)
  - [ ] favicon.svg, favicon.ico, favicon-96x96.png
  - [ ] apple-touch-icon.png
  - [ ] web-app-manifest icons (192x192, 512x512)
  - [ ] headerart.svg
  - [ ] Update site.webmanifest name fields
- [ ] Update branding and styling
- [ ] Configure deployment settings
- [ ] Remove template files (`TEMPLATE_USAGE.md`, `TEMPLATE_READY.md`)

## 💡 Tips

1. **Keep types in sync**: Always run `npm run generate-types` in Studio after schema changes
2. **Use workspaces**: Run commands on specific packages with `--workspace=@your-project/package`
3. **Leverage Turborepo**: Builds are cached - only changed packages rebuild
4. **Shared code**: Put common utilities in `packages/shared/src/`

## 🆘 Need Help?

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [TanStack Router Docs](https://tanstack.com/router)
- [Vite Docs](https://vite.dev/)

---

Happy building! 🎉

