import type { DocumentActionComponent } from 'sanity';
import { useClient } from 'sanity';

import { computeFullSlugRecursive } from '../utils/computeFullSlugRecursive';
import { updateChildrenRecursive } from '../utils/updateChildrenRecursive';

const DEBUG = process.env.NODE_ENV === 'development';

function log(...args: any[]) {
  if (DEBUG) console.log(...args);
}

interface DocumentWithSlug {
  _id: string;
  slug?: { current?: string };
  parent?: { _ref?: string };
}

/**
 * Publish action that recomputes fullSlug for this document and all descendants.
 * Always uses the latest slug (draft if available).
 */
export const fullSlugPublishAction =
  (originalPublishAction: DocumentActionComponent): DocumentActionComponent =>
  (props) => {
    const client = useClient({ apiVersion: '2023-10-22' });
    const { id, onComplete, type } = props;
    const originalResult = originalPublishAction(props);

    return {
      ...originalResult,
      label: 'Publish (update fullSlug tree)',
      onHandle: async () => {
        const startTime = Date.now();
        log(`🟢 Running fullSlugPublishAction for "${type}" (${id})`);

        try {
          const cache = new Map<string, string | null>();

          // 1️��� Try to get the freshest version (draft if it exists)
          let doc: DocumentWithSlug | null = null;
          let isDraft = false;

          try {
            doc = await client.fetch<DocumentWithSlug | null>(`*[_id == "drafts." + $id][0]{_id, slug, parent}`, {
              id,
            });
            if (doc) {
              isDraft = true;
              log(`📄 Using draft version for slug computation`, doc);
            }
          } catch (error) {
            log(`Failed to fetch draft for ${id}:`, error);
          }

          if (!doc) {
            log(`📄 No draft found, checking for published version...`);
            try {
              doc = await client.fetch<DocumentWithSlug | null>(`*[_id == $id][0]{_id, slug, parent}`, { id });
              if (doc) {
                log(`📄 Using published version for slug computation`, doc);
              }
            } catch (error) {
              log(`Failed to fetch published document ${id}:`, error);
            }
          }

          if (!doc || !doc.slug?.current) {
            const errorMsg = `❌ Cannot compute fullSlug: document ${id} has no slug`;
            console.error(errorMsg);
            onComplete?.();
            throw new Error(`Document ${id} must have a slug before publishing`);
          }

          log(`📋 Document data before publish:`, {
            id,
            isDraft,
            slug: doc.slug?.current,
            parent: doc.parent?._ref,
          });

          // 2️⃣ Perform the normal publish first
          if (originalResult?.onHandle) {
            await originalResult.onHandle();
            log(`✅ Document ${id} published successfully`);

            // Wait a moment for the publish to propagate
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // 3️⃣ Compute and patch this document's fullSlug
          const fullSlug = await computeFullSlugRecursive(
            client,
            id,
            { cache, maxDepth: 4 },
            doc.slug?.current,
            doc.parent?._ref,
          );

          if (fullSlug) {
            log(`📦 Computed fullSlug for ${type} (${id}): ${fullSlug}`);

            // Update published document
            await client.patch(id).set({ fullSlug }).commit();
            log(`✅ Updated published ${type} (${id})`);

            // Try to update draft if it still exists (it usually won't after publish)
            // This is expected behavior - the draft is deleted when publishing
            try {
              await client.patch(`drafts.${id}`).set({ fullSlug }).commit();
              log(`✅ Updated draft ${type} (${id}) - draft still existed`);
              // eslint-disable-next-line typescript/no-unused-vars
            } catch (error) {
              // This is normal - draft is deleted after publish, so this will usually "fail"
              // We catch silently and don't log anything since it's expected behavior
              // Only log in debug mode for troubleshooting
              log(`Draft ${id} no longer exists (normal - it was published and deleted)`);
            }
          } else {
            console.warn(`⚠️ Could not compute fullSlug for ${type} (${id})`);
          }

          // 4️⃣ Recursively update all descendants
          try {
            await updateChildrenRecursive(client, id, cache, type);
            log(`✅ Updated descendant fullSlugs for ${type} ${id}`);
          } catch (error) {
            console.error(`❌ Failed to update children for ${id}:`, error);
          }

          const duration = Date.now() - startTime;
          log(`🎉 fullSlugPublishAction completed for ${id} in ${duration}ms`);

          onComplete?.();
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`❌ Error in fullSlugPublishAction for ${id} after ${duration}ms:`, error);

          onComplete?.();
          throw error;
        }
      },
    };
  };
