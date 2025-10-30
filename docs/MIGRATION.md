# Migration Guide

This document explains what changed when moving to the monorepo structure.

## What Changed

### Directory Structure

**Before:**
```
/code/pensjonsbloggen/     # Frontend repo
/code/sanity/              # Studio repo
```

**After:**
```
/code/pensjonsbloggen-monorepo/
├── apps/
│   ├── frontend/          # Frontend (was pensjonsbloggen/)
│   └── studio/            # Studio (was sanity/)
└── packages/
    └── shared/            # New shared package
```

### Package Names

- **Frontend**: `pensjonsbloggen` → `@pensjonsbloggen/frontend`
- **Studio**: `pensjonsbloggen` → `@pensjonsbloggen/studio`
- **New**: `@pensjonsbloggen/shared` for shared code

### Scripts

Scripts are now standardized across apps:

| Task | Command |
|------|---------|
| Dev (all) | `npm run dev` |
| Dev (frontend) | `npm run dev --workspace=@pensjonsbloggen/frontend` |
| Dev (studio) | `npm run dev --workspace=@pensjonsbloggen/studio` |
| Build (all) | `npm run build` |
| Lint (all) | `npm run lint` |
| Type-check (all) | `npm run type-check` |

### Environment Variables

`.env.local` files should be in:
- `apps/frontend/.env.local` (was at root of pensjonsbloggen/)
- `apps/studio/.env.local` (was at root of sanity/)

## Benefits of Monorepo

1. **Single source of truth**: One repository for all code
2. **Shared types**: Define types once, use everywhere
3. **Atomic commits**: Change frontend and studio together
4. **Faster CI/CD**: Only rebuild what changed (with Turborepo)
5. **Easier onboarding**: Clone once, get everything
6. **Consistent tooling**: Same linting, formatting across apps

## What Stayed the Same

- All your existing code and features
- Environment variable names
- Development workflow (just run from root)
- Build outputs and deployment process

## Git History

The monorepo preserves git history from both repos in their respective directories. If you need the full history:
- Frontend history: Check `apps/frontend/` in git log
- Studio history: Check `apps/studio/` in git log

## Deployment

### Frontend (Vercel/Netlify)

Update your deployment configuration:
- **Root directory**: `apps/frontend`
- **Build command**: `cd ../.. && npm run build --workspace=@pensjonsbloggen/frontend`
- **Output directory**: `apps/frontend/dist` or `apps/frontend/.output`

### Studio (Sanity)

Deploy from the studio directory:
```bash
cd apps/studio
npm run deploy
```

Or from root:
```bash
npm run deploy --workspace=@pensjonsbloggen/studio
```

## Sharing Code Between Apps

Before monorepo, you might have duplicated types. Now:

1. **Define shared types** in `packages/shared/src/types/`
2. **Export them** from `packages/shared/src/index.ts`
3. **Import in apps**:
   ```typescript
   // In frontend or studio
   import { SanityDocument } from '@pensjonsbloggen/shared';
   ```

## Rollback Plan

If you need to go back to separate repos:
1. The original repos still exist at `/code/pensjonsbloggen/` and `/code/sanity/`
2. Or copy from monorepo:
   ```bash
   cp -r apps/frontend /code/pensjonsbloggen-standalone
   cp -r apps/studio /code/sanity-standalone
   ```
3. Update package names back to original in package.json files

## Next Steps

1. ✅ Test that both apps run: `npm run dev`
2. ✅ Verify environment variables are set correctly
3. ✅ Test building: `npm run build`
4. 🔄 Update CI/CD configurations
5. 🔄 Update deployment configurations
6. 🔄 Notify team members of the change
7. 🎉 Start using shared packages for common code!

## Questions?

Refer to:
- `GETTING_STARTED.md` for detailed setup instructions
- `README.md` for quick reference
- Turborepo docs: https://turbo.build/repo/docs

