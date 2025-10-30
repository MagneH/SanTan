# Type Generation Migration Guide

## Summary

Sanity types are now generated once in the Studio and automatically shared with the Frontend via the `@santan/shared` package.

---

## What Changed

### Before: Manual Workflow ❌
1. Run `npm run generate-types` in Studio
2. Types generated to `apps/studio/types/`
3. Manually copy `sanity.types.ts` to `apps/frontend/src/types/`
4. Manually copy `sanityTypeLiterals.ts` to `apps/frontend/src/types/`
5. Hope you don't forget to sync them later

### After: Automated Workflow ✅
1. Run `npm run generate-types` in Studio
2. Types generated to `packages/shared/src/types/`
3. Both Frontend and Studio automatically use the same types
4. No manual copying needed - ever!

---

## Migration Checklist

- [x] Updated `sanity-typegen.json` to output to shared package
- [x] Fixed `extractZodLiterals.ts` for ES modules and updated paths
- [x] Updated all imports in Frontend to use `@santan/shared/types`
- [x] Updated imports in Studio to use `@santan/shared/types`
- [x] Removed duplicate type files from Frontend
- [x] Removed duplicate type files from Studio
- [x] Created placeholder files in shared package
- [x] Generated new types successfully (23 types extracted)
- [x] Verified all packages type-check successfully
- [x] Dev servers running and responding correctly
- [x] Created documentation (TYPES_README.md)
- [x] Updated root README.md

---

## For Team Members

### If you pull this update:

1. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

2. **Generate types** (if they're missing):
   ```bash
   cd apps/studio
   npm run generate-types
   ```

3. **Restart your dev servers**:
   ```bash
   npm run dev
   ```

4. **Restart TypeScript server** in your IDE if you see type errors:
   - VS Code: CMD+Shift+P → "TypeScript: Restart TS Server"
   - IntelliJ/WebStorm: Should auto-reload

---

## New Import Pattern

### Before
```typescript
// Frontend
import { sanityTypeLiterals } from '@/types/sanityTypeLiterals';
import type { Post } from '@/types/sanity.types';

// Studio
import { sanityTypeLiterals } from '../../types/sanityTypeLiterals';
```

### After
```typescript
// Frontend AND Studio - same imports!
import { sanityTypeLiterals, Post, Category, Author } from '@santan/shared/types';
```

---

## Files That Were Changed

### Configuration Files
- `apps/studio/sanity-typegen.json`
- `apps/studio/src/scripts/extractZodLiterals.ts`

### Frontend Files
- `apps/frontend/src/pages/Document/Document.tsx`
- `apps/frontend/src/head/head.ts`
- `apps/frontend/src/types/post.ts`
- `apps/frontend/src/sanity/queries/documentQuery.ts`

### Studio Files
- `apps/studio/src/structure/index.ts`

### Shared Package
- `packages/shared/src/index.ts`
- `packages/shared/src/types/index.ts`
- `packages/shared/src/types/sanity.types.ts` (generated)
- `packages/shared/src/types/sanityTypeLiterals.ts` (generated)

### Files Removed
- ❌ `apps/frontend/src/types/sanity.types.ts`
- ❌ `apps/frontend/src/types/sanityTypeLiterals.ts`
- ❌ `apps/studio/types/sanity.types.ts`
- ❌ `apps/studio/types/sanityTypeLiterals.ts`

---

## Benefits

1. **No Manual Copying** - Types automatically available everywhere
2. **Single Source of Truth** - One set of types for the entire monorepo
3. **Type Safety** - Frontend and Studio always use identical types
4. **Less Error-Prone** - Can't forget to sync types
5. **Better DX** - Simpler workflow, fewer steps

---

## Workflow Going Forward

When you modify Sanity schemas:

```bash
# 1. Make your schema changes in apps/studio/src/schemaTypes/

# 2. Generate types
cd apps/studio
npm run generate-types

# 3. That's it! Types are now available everywhere.
```

Both frontend and studio will immediately have access to the updated types.

---

## Troubleshooting

### "Cannot find module '@santan/shared/types'"

The shared package might not be linked. Run:
```bash
npm install
```

### Types are outdated after schema changes

Regenerate them:
```bash
cd apps/studio
npm run generate-types
```

### IDE shows errors but code runs fine

Restart your TypeScript server or reload your IDE.

---

## Questions?

See `packages/shared/TYPES_README.md` for detailed documentation.

