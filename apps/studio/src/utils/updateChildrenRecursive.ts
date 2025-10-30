import type { SanityClient } from '@sanity/client';

import { computeFullSlugRecursive } from './computeFullSlugRecursive';

const DEBUG = process.env.NODE_ENV === 'development';

function log(...args: any[]) {
  if (DEBUG) console.log(...args);
}

interface ChildDocument {
  _id: string;
  _type: string;
  hasDraft: boolean;
  slug?: { current?: string };
  parent?: { _ref?: string };
}

/**
 * Recursively updates fullSlug for all descendants using batch operations for better performance.
 * Processes both published and draft versions efficiently.
 */
export async function updateChildrenRecursive(
  client: SanityClient,
  parentId: string,
  cache: Map<string, string | null>,
  parentType?: string,
  maxDepth = 10,
): Promise<void> {
  if (maxDepth <= 0) return;

  try {
    // Fetch all documents referencing this parent in one query
    const children = await client.fetch<ChildDocument[]>(
      `*[_type in ["category", "post"] && parent._ref == $parentId]{
        _id,
        _type,
        slug,
        parent,
        "hasDraft": defined(*[_id == "drafts." + ^._id][0])
      }`,
      { parentId },
    );

    if (!children?.length) {
      log(`No children found for ${parentType || 'document'} ${parentId}`);
      return;
    }

    log(`Found ${children.length} children for ${parentType || 'document'} ${parentId}`);

    // Prepare batch updates
    const publishedPatches: Array<{ id: string; fullSlug: string; type: string }> = [];
    const draftPatches: Array<{ id: string; fullSlug: string; type: string }> = [];
    const childrenToRecurse: Array<{ id: string; type: string }> = [];

    // Compute fullSlug for all children
    await Promise.all(
      children.map(async (child) => {
        try {
          const { _id, _type, hasDraft } = child;

          const newFullSlug = await computeFullSlugRecursive(client, _id, { cache, maxDepth: 10 });

          if (!newFullSlug) {
            console.warn(`Could not compute fullSlug for ${_type} ${_id}`);
            return;
          }

          // Queue for batch update
          publishedPatches.push({ id: _id, fullSlug: newFullSlug, type: _type });

          if (hasDraft) {
            draftPatches.push({ id: `drafts.${_id}`, fullSlug: newFullSlug, type: _type });
          }

          // Queue for recursive processing
          childrenToRecurse.push({ id: _id, type: _type });
        } catch (error) {
          console.error(`Error processing child ${child._id}:`, error);
        }
      }),
    );

    // Execute batch updates for published documents
    if (publishedPatches.length > 0) {
      try {
        const transaction = client.transaction();
        publishedPatches.forEach(({ id, fullSlug }) => {
          transaction.patch(id, { set: { fullSlug } });
        });

        await transaction.commit();
        log(`✅ Batch updated ${publishedPatches.length} published documents`);

        publishedPatches.forEach(({ id, fullSlug, type }) => {
          log(`  ↳ Updated ${type}: ${id} → ${fullSlug}`);
        });
      } catch (error) {
        console.error('❌ Failed to batch update published documents:', error);

        // Fallback to individual updates
        await fallbackIndividualUpdates(client, publishedPatches, 'published');
      }
    }

    // Execute batch updates for draft documents
    if (draftPatches.length > 0) {
      try {
        const transaction = client.transaction();
        draftPatches.forEach(({ id, fullSlug }) => {
          transaction.patch(id, { set: { fullSlug } });
        });

        await transaction.commit();
        log(`✅ Batch updated ${draftPatches.length} draft documents`);
      } catch (error) {
        log('⚠️ Failed to batch update drafts (some may not exist):', error);

        // Fallback to individual updates for drafts
        await fallbackIndividualUpdates(client, draftPatches, 'draft');
      }
    }

    // Recursively process children in parallel (with concurrency limit)
    const CONCURRENCY_LIMIT = 3; // Prevent overwhelming the API
    for (let i = 0; i < childrenToRecurse.length; i += CONCURRENCY_LIMIT) {
      const batch = childrenToRecurse.slice(i, i + CONCURRENCY_LIMIT);

      await Promise.all(
        batch.map(({ id, type }) =>
          updateChildrenRecursive(client, id, cache, type, maxDepth - 1).catch((error) =>
            console.error(`Failed to update children of ${id}:`, error),
          ),
        ),
      );
    }
  } catch (error) {
    console.error(`Error updating children of ${parentId}:`, error);
    throw error;
  }
}

/**
 * Fallback to individual updates when batch operations fail
 */
async function fallbackIndividualUpdates(
  client: SanityClient,
  patches: Array<{ id: string; fullSlug: string; type: string }>,
  patchType: 'published' | 'draft',
): Promise<void> {
  log(`Falling back to individual updates for ${patches.length} ${patchType} documents`);

  for (const { id, fullSlug, type } of patches) {
    try {
      await client.patch(id).set({ fullSlug }).commit();
      log(`  ↳ Updated ${type}: ${id} → ${fullSlug}`);
    } catch (error) {
      console.error(`  ❌ Failed to update ${type} ${id}:`, error);
    }
  }
}
