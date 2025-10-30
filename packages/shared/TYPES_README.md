# Shared Package Types

This package contains shared types and utilities used across the monorepo, including auto-generated Sanity Studio types.

## Sanity Types Generation

The Sanity types are automatically generated from the Studio schemas and shared across both `frontend` and `studio` packages.

### Generated Files

- **`sanity.types.ts`** - TypeScript types generated from Sanity Studio schemas
- **`sanityTypeLiterals.ts`** - Enum of all `_type` values extracted from the Sanity types

### How It Works

1. **Types are generated in the Studio package** by running:
   ```bash
   cd apps/studio
   npm run generate-types
   ```

2. **This command does three things:**
   - Extracts the schema to `schema.json`
   - Generates TypeScript types to `packages/shared/src/types/sanity.types.ts`
   - Extracts all `_type` literals to `packages/shared/src/types/sanityTypeLiterals.ts`

3. **Both frontend and studio import from the shared package:**
   ```typescript
   import { sanityTypeLiterals, Post, Category, Author } from '@santan/shared/types';
   ```

### Why This Is Better

**Before (manual copying):**
- ❌ Types duplicated in frontend and studio
- ❌ Manual copy-paste needed after generation
- ❌ Easy to forget to sync types
- ❌ Version drift between packages

**After (shared package):**
- ✅ Single source of truth for types
- ✅ Automatic sharing across packages
- ✅ Always in sync
- ✅ No manual copying needed

### When to Regenerate Types

Run `npm run generate-types` in the studio whenever you:
- Add a new document type
- Modify existing schemas
- Change field definitions
- Update portable text configurations

### Usage Examples

```typescript
// Import specific types
import { Post, Category, Author } from '@santan/shared/types';

// Import type literals enum
import { sanityTypeLiterals } from '@santan/shared/types';

// Use in your code
const docType = sanityTypeLiterals.post; // 'post'

// Type-safe document handling
function handleDocument(doc: Post | Category | Author) {
  switch (doc._type) {
    case sanityTypeLiterals.post:
      // TypeScript knows doc is Post
      break;
    case sanityTypeLiterals.category:
      // TypeScript knows doc is Category
      break;
    case sanityTypeLiterals.author:
      // TypeScript knows doc is Author
      break;
  }
}
```

## Custom Shared Types

You can add custom shared types in `src/types/index.ts`:

```typescript
// Example: Add a shared utility type
export interface ApiResponse<T> {
  data: T;
  error?: string;
  timestamp: string;
}
```

These will be available alongside the generated Sanity types when importing from `@santan/shared/types`.

