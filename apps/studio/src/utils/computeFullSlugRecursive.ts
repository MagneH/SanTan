import type { SanityClient } from '@sanity/client';

interface DocumentWithSlug {
  _id: string;
  slug?: { current?: string };
  parent?: { _ref?: string };
}

const DEBUG = process.env.NODE_ENV === 'development';

function log(...args: any[]) {
  if (DEBUG) console.log(...args);
}

/**
 * Optimized function that fetches the entire parent chain in one query
 * instead of making individual requests for each parent
 */
export async function computeFullSlugRecursive(
  client: SanityClient,
  docId: string,
  options: { maxDepth?: number; cache?: Map<string, string | null> } = {},
  newSlug?: string,
  initialParentRef?: string | null,
): Promise<string | null> {
  const { maxDepth = 4, cache = new Map<string, string | null>() } = options;

  log(`[computeFullSlug] Computing for docId: ${docId}, newSlug: ${newSlug}, initialParentRef: ${initialParentRef}`);

  // Check cache first (but only if we're not overriding values)
  if (cache.has(docId) && newSlug === undefined && initialParentRef === undefined) {
    log(`[computeFullSlug] Returning cached value for ${docId}`);
    return cache.get(docId) ?? null;
  }

  // If we have explicit slug and parent ref, we don't need to fetch the document
  if (newSlug !== undefined && initialParentRef !== undefined) {
    log(`[computeFullSlug] Using explicit slug and parent ref, skipping document fetch`);

    const slugs: string[] = [];

    // Fetch parent chain if parent exists
    if (initialParentRef) {
      try {
        const parentDoc = await client.fetch<any>(
          `*[_id == $id][0]{
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
                parent,
                "greatGrandParent": parent->{ 
                  _id, 
                  slug, 
                  parent 
                } 
              } 
            }
          }`,
          { id: initialParentRef },
        );

        log(`[computeFullSlug] Fetched parent doc:`, JSON.stringify(parentDoc, null, 2));

        // Extract all parents from the nested structure
        let current: any = parentDoc;
        let depth = 0;

        while (current && slugs.length < maxDepth - 1) {
          log(`[computeFullSlug] Processing parent at depth ${depth}:`, current?._id, current?.slug?.current);
          if (current.slug?.current) {
            slugs.unshift(current.slug.current);
          }

          // Traverse to next parent level
          if (current.parentChain) {
            current = current.parentChain;
          } else if (current.grandParent) {
            current = current.grandParent;
          } else if (current.greatGrandParent) {
            current = current.greatGrandParent;
          } else {
            break;
          }
          depth++;
        }
      } catch (error) {
        console.error(`[computeFullSlug] Error fetching parent chain:`, error);
        return null;
      }
    } else {
      log(`[computeFullSlug] No parent (root level)`);
    }

    slugs.push(newSlug);
    const fullSlug = slugs.join('/') || null;
    log(`[computeFullSlug] Final fullSlug: ${fullSlug} (from parts: [${slugs.join(', ')}])`);
    cache.set(docId, fullSlug);
    return fullSlug;
  }

  // Otherwise, fetch the document to get its current state
  try {
    // Single query to get the entire parent chain using GROQ's recursive capabilities
    const document = await client.fetch<any>(
      `*[_id == $docId][0]{
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
            parent,
            "greatGrandParent": parent->{ 
              _id, 
              slug, 
              parent 
            } 
          } 
        }
      }`,
      { docId },
    );

    log(`[computeFullSlug] Fetched document:`, JSON.stringify(document, null, 2));

    if (!document) {
      console.warn(`[computeFullSlug] No document found for ${docId}`);
      cache.set(docId, null);
      return null;
    }

    // Add current document's slug (use newSlug if provided)
    const currentSlug = newSlug !== undefined ? newSlug : document.slug?.current;
    log(
      `[computeFullSlug] Current slug: ${currentSlug} (newSlug: ${newSlug}, document.slug?.current: ${document.slug?.current})`,
    );

    if (!currentSlug) {
      console.warn(`[computeFullSlug] No slug found for ${docId}`);
      cache.set(docId, null);
      return null;
    }

    // Build slug array from ancestors
    const slugs: string[] = [];

    // Handle the case where we have an explicit parent reference override
    let current: any;
    if (initialParentRef !== undefined) {
      log(`[computeFullSlug] Using initialParentRef: ${initialParentRef}`);
      if (initialParentRef) {
        // Fetch the overridden parent and its chain
        const parentDoc = await client.fetch<any>(
          `*[_id == $id][0]{
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
          }`,
          { id: initialParentRef },
        );
        log(`[computeFullSlug] Fetched parent doc:`, JSON.stringify(parentDoc, null, 2));
        current = parentDoc;
      } else {
        log(`[computeFullSlug] No parent (root level)`);
        current = null; // Explicitly no parent
      }
    } else {
      log(`[computeFullSlug] Using document.parentChain`);
      current = document.parentChain;
    }

    // Extract all parents from the nested structure
    let depth = 0;
    while (current && slugs.length < maxDepth - 1) {
      log(`[computeFullSlug] Processing parent at depth ${depth}:`, current?._id, current?.slug?.current);
      if (current.slug?.current) {
        slugs.unshift(current.slug.current);
      }

      // Traverse to next parent level
      if (current.parentChain) {
        current = current.parentChain;
      } else if (current.grandParent) {
        current = current.grandParent;
      } else if (current.greatGrandParent) {
        current = current.greatGrandParent;
      } else {
        break; // No more parents
      }
      depth++;
    }

    slugs.push(currentSlug);

    const fullSlug = slugs.join('/') || null;
    log(`[computeFullSlug] Final fullSlug: ${fullSlug} (from parts: [${slugs.join(', ')}])`);
    cache.set(docId, fullSlug);
    return fullSlug;
  } catch (error) {
    console.error(`[computeFullSlug] Error computing fullSlug for ${docId}:`, error);

    // Fallback to the original iterative approach
    log(`[computeFullSlug] Falling back to iterative approach`);
    return computeFullSlugIterative(client, docId, options, newSlug, initialParentRef);
  }
}

/**
 * Fallback iterative approach (your original logic) for when the optimized query fails
 */
async function computeFullSlugIterative(
  client: SanityClient,
  docId: string,
  options: { maxDepth?: number; cache?: Map<string, string | null> } = {},
  newSlug?: string,
  initialParentRef?: string | null,
): Promise<string | null> {
  const { maxDepth = 4, cache = new Map<string, string | null>() } = options;
  const visited = new Set<string>();

  const slugs: string[] = [];
  let currentId: string | undefined = docId;
  let depth = 0;
  let isFirst = true;
  let nextParentRef: string | undefined | null = initialParentRef;

  while (currentId && depth < maxDepth) {
    if (visited.has(currentId)) break;
    visited.add(currentId);

    if (cache.has(currentId)) {
      const cached = cache.get(currentId);
      if (cached) slugs.unshift(cached);
      break;
    }

    try {
      const doc = await client.fetch<DocumentWithSlug>(`*[_id == $id][0]{_id, slug, parent}`, { id: currentId });

      if (!doc) break;

      const slugValue = isFirst && newSlug !== undefined ? newSlug : doc.slug?.current || '';
      slugs.unshift(slugValue);

      // Determine the next parent
      if (isFirst && initialParentRef !== undefined) {
        currentId = nextParentRef || undefined;
      } else {
        currentId = doc.parent?._ref;
      }

      depth++;
      isFirst = false;
    } catch (error) {
      console.error(`Error fetching document ${currentId}:`, error);
      break;
    }
  }

  const fullSlug = slugs.join('/') || null;
  cache.set(docId, fullSlug);
  return fullSlug;
}
