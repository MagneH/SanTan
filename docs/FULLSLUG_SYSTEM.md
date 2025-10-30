# FullSlug System Documentation

## Overview

This system automatically computes and maintains hierarchical URL paths (`fullSlug`) for categories and posts based on their parent relationships. For example, a post under `Category > Subcategory > Topic` gets the fullSlug: `category/subcategory/topic/post-title`.

## How It Works

### 1. **Real-time Preview** (Custom Input Component)
- While editing, the `FullSlugInput` component shows a preview of what the fullSlug will be
- Updates automatically as you type or change the parent category
- **Does NOT write to the document** (read-only display)

### 2. **Publish Action** (Actual Update)
- When you click "Publish", the `fullSlugPublishAction` runs
- Computes the fullSlug from the draft's slug and parent
- Writes the fullSlug to the published document
- Recursively updates all child documents

### 3. **Batch Processing** (Performance Optimization)
- Uses Sanity transactions to update multiple documents at once
- Processes children in parallel with concurrency limits
- Caches computed values to avoid redundant calculations

## Key Features

✅ **No Race Conditions** - Computes fullSlug using draft data, not the newly published document  
✅ **Full Ancestor Chain** - Supports unlimited depth (default max: 5 levels)  
✅ **Batch Updates** - Efficiently updates all descendants in one transaction  
✅ **Error Resilience** - Graceful fallbacks when operations fail  
✅ **Development Logging** - Detailed logs in dev, clean production console  
✅ **Type Safety** - Full TypeScript support with proper interfaces  

## Files Structure

```
src/
├── actions/
│   └── fullSlugPublishAction.tsx      # Publish action that updates fullSlug
├── customInputComponents/
│   └── fullSlugInput.tsx              # Read-only preview component
├── hooks/
│   └── useFullSlugComputation.ts      # Reusable computation hook
├── utils/
│   ├── computeFullSlugRecursive.ts    # Core computation logic
│   ├── updateChildrenRecursive.ts     # Batch child updates
│   ├── fullSlugConfig.ts              # Configuration & validation
│   └── fullSlugMonitor.ts             # Performance monitoring
└── schemaTypes/
    ├── category.ts                    # Category schema with fullSlug field
    └── post.ts                        # Post schema with fullSlug field
```

## Configuration

Edit `src/utils/fullSlugConfig.ts` to customize:

```typescript
export const FULL_SLUG_CONFIG = {
  SUPPORTED_TYPES: ['category', 'post'],  // Document types with fullSlug
  MAX_DEPTH: 5,                           // Maximum parent chain depth
  DEBOUNCE_MS: 300,                       // Delay before recomputing preview
  BATCH_CONCURRENCY: 3,                   // Parallel processing limit
  RETRY: {
    MAX_ATTEMPTS: 5,
    DELAY_MS: 400,
  },
};
```

## Usage Examples

### Creating a New Document
1. Create a new post/category
2. Generate the slug (click "Generate" button)
3. (Optional) Select a parent category
4. The fullSlug preview updates automatically
5. Click "Publish" - fullSlug is computed and saved

### Changing Parent Category
1. Edit an existing document
2. Change the parent field
3. The fullSlug preview updates immediately
4. Click "Publish" - the document and ALL its descendants are updated

### Root-Level Documents
- If no parent is set, the fullSlug equals the slug
- Example: slug `technology` → fullSlug `technology`

## Performance Metrics

From your test run:
- **Total time**: ~2.3 seconds for a document with 3-level parent chain
- **Database queries**: 1 query for parent chain (not 3 separate queries)
- **Batch updates**: All children updated in single transaction
- **No race conditions**: 100% success rate on first attempt

## Debugging

### Development Mode
Set `NODE_ENV=development` to enable detailed logging:
```
[computeFullSlug] Computing for docId: ...
[computeFullSlug] Using explicit slug and parent ref, skipping document fetch
[computeFullSlug] Processing parent at depth 0: ...
[computeFullSlug] Final fullSlug: category/subcategory/topic/test
```

### Production Mode
Only critical errors are logged - clean console for end users.

### Common Issues

**Problem**: "Could not compute fullSlug"  
**Solution**: Ensure the document has a slug before publishing

**Problem**: "Validation failed: fullSlug required"  
**Solution**: This was fixed - fullSlug validation is now removed since it's auto-computed

**Problem**: "Attempted to patch a read-only document"  
**Solution**: This was fixed - the input component no longer tries to write

**Problem**: "Could not update draft ... (likely published)"  
**Solution**: This is **expected behavior**, not an error. When you publish a document, Sanity deletes the draft. The system tries to update both the published version and the draft (to keep them in sync), but the draft no longer exists after publishing. This message has been removed in the latest version - the system now handles this silently.

## Performance Monitoring

In development, check performance metrics:
```typescript
import { fullSlugMonitor } from './utils/fullSlugMonitor';

// View current metrics
console.log(fullSlugMonitor.getMetrics());

// Log detailed report
fullSlugMonitor.logReport();
```

## API Reference

### `computeFullSlugRecursive(client, docId, options, newSlug?, initialParentRef?)`

Computes the full hierarchical slug for a document.

**Parameters:**
- `client` - Sanity client instance
- `docId` - Document ID (published or draft)
- `options.maxDepth` - Maximum parent chain depth (default: 4)
- `options.cache` - Cache map for performance (optional)
- `newSlug` - Override slug value (optional)
- `initialParentRef` - Override parent reference (optional)

**Returns:** `Promise<string | null>` - The computed fullSlug or null

**Example:**
```typescript
const fullSlug = await computeFullSlugRecursive(
  client,
  '123abc',
  { maxDepth: 5 },
  'new-post-slug',
  'parent-category-id'
);
// Returns: "parent/grandparent/new-post-slug"
```

### `updateChildrenRecursive(client, parentId, cache, parentType?, maxDepth?)`

Recursively updates fullSlug for all descendants of a document.

**Parameters:**
- `client` - Sanity client instance
- `parentId` - Parent document ID
- `cache` - Cache map for performance
- `parentType` - Document type name (for logging)
- `maxDepth` - Maximum recursion depth (default: 10)

**Returns:** `Promise<void>`

## Best Practices

1. **Always set a slug before publishing** - The system requires a slug to compute fullSlug
2. **Use meaningful slugs** - They become part of your URLs
3. **Avoid deep nesting** - Maximum 5 levels recommended for SEO and UX
4. **Test in development** - Enable debug logging to verify behavior
5. **Monitor performance** - Use the monitoring utility to track metrics

## Troubleshooting

### Enable Full Debug Mode
```typescript
// In computeFullSlugRecursive.ts, temporarily force debug:
const DEBUG = true; // Change from process.env.NODE_ENV === 'development'
```

### Check Sanity Content Lake
Use Sanity Vision to inspect documents:
```groq
*[_type in ["post", "category"] && defined(slug)]{
  _id,
  slug,
  parent,
  fullSlug
}
```

### Verify Parent Chain
```groq
*[_id == "your-document-id"][0]{
  _id,
  slug,
  parent,
  "parentChain": parent->{
    _id,
    slug,
    parent,
    "grandParent": parent->{
      _id,
      slug,
      parent
    }
  }
}
```

## Migration from Old System

If you had a previous fullSlug implementation:

1. The new system is backward compatible
2. Old fullSlugs are preserved until documents are republished
3. To update all documents at once, republish the root categories
4. Child documents will cascade-update automatically

## Future Enhancements

Possible improvements:
- [ ] GraphQL API for external consumers
- [ ] Webhook notifications when fullSlugs change
- [ ] Automated migration script for bulk updates
- [ ] Admin UI for viewing/debugging fullSlug tree
- [ ] Support for custom slug transformations

## Support

For issues or questions:
1. Check the debug logs in development mode
2. Review this documentation
3. Inspect the browser console for errors
4. Use Sanity Vision to query your data directly

---

**Last Updated**: October 29, 2025  
**System Version**: 2.0 (Optimized with conditional logging)
