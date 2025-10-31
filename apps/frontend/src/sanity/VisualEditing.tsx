import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@sanity/client';
import { enableVisualEditing } from '@sanity/visual-editing';
import { useRouter } from '@tanstack/react-router';
import type { SanityClient } from '@sanity/client';
import type { HistoryAdapter, HistoryAdapterNavigate } from '@sanity/visual-editing';

import { useLiveMode } from '@/sanity/sanity.loader';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { env } from '@/lib/env';

/**
 * Inner component that activates live mode and visual editing.
 * Only rendered when client with token is ready.
 */
function VisualEditingInner({ client }: { client: SanityClient }) {
  const router = useRouter();
  const routerRef = useRef(router);
  const navigateRef = useRef<HistoryAdapterNavigate | undefined>(undefined);

  // Keep router ref up to date
  routerRef.current = router;

  // Create history adapter for syncing navigation between Studio and app
  const history: HistoryAdapter = useMemo(
    () => ({
      // Subscribe function to handle navigation changes from Studio
      subscribe(navigate) {
        navigateRef.current = navigate;
        return () => {
          navigateRef.current = undefined;
        };
      },

      // Update function to handle different types of history updates from Studio
      update(update) {
        switch (update.type) {
          case 'push':
            return routerRef.current.navigate({ to: update.url });
          case 'pop':
            return routerRef.current.history.back();
          case 'replace':
            return routerRef.current.navigate({ to: update.url, replace: true });
          default:
            throw new Error(`Unknown update type: ${(update as any).type}`);
        }
      },
    }),
    [],
  );

  // Activate live mode for real-time content updates
  useLiveMode({
    client,
    allowStudioOrigin: env.SANITY_STUDIO_URL || STUDIO_BASEPATH,
  });

  // Set up visual editing overlays and Studio connection with history adapter
  useEffect(() => {
    const cleanup = enableVisualEditing({
      history,
      refresh: async (payload) => {
        if (payload.source === 'mutation') {
          await router.invalidate();
        }
      },
      zIndex: 999999,
    });

    return () => cleanup();
  }, [router, history]);

  // Sync navigation changes from app to Studio
  useEffect(() => {
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    if (navigateRef.current) {
      navigateRef.current({
        type: 'push',
        url: currentUrl,
      });
    }
  }, [router.state.location.pathname, router.state.location.search, router.state.location.hash]);

  return null;
}

/**
 * VisualEditing component for Sanity Studio integration.
 * Fetches draft token, creates client, and enables live preview mode.
 */
export function VisualEditing(): React.ReactElement | null {
  const [liveClient, setLiveClient] = useState<SanityClient | undefined>();

  // Fetch token and create client on mount
  useEffect(() => {
    const fetchTokenAndSetupClient = async () => {
      try {
        const response = await fetch('/api/draft-token');

        if (response.ok) {
          const { token } = await response.json();

          if (token) {
            const client = createClient({
              projectId: env.SANITY_PROJECT_ID,
              dataset: env.SANITY_DATASET,
              useCdn: false,
              apiVersion: env.SANITY_API_VERSION,
              perspective: 'previewDrafts',
              token,
              stega: {
                enabled: true,
                studioUrl: env.SANITY_STUDIO_URL || STUDIO_BASEPATH,
              },
            });

            setLiveClient(client);
          }
        } else {
          console.warn('[VisualEditing] Could not fetch draft token:', response.status);
        }
      } catch (error) {
        console.error('[VisualEditing] Failed to fetch draft token:', error);
      }
    };

    fetchTokenAndSetupClient();
  }, []);

  // Wait for client to be ready before rendering
  if (!liveClient) {
    return null;
  }

  return <VisualEditingInner client={liveClient} />;
}

export default VisualEditing;
