import { enableVisualEditing } from '@sanity/visual-editing';
import { useEffect, useState } from 'react';
import { createClient } from '@sanity/client';
import { useRouter } from '@tanstack/react-router';
import { useLiveMode } from '@/sanity/sanity.loader';
import { env } from '@/lib/env';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';

/**
 * Inner component that activates live mode and visual editing.
 * Only rendered when client with token is ready.
 */
function VisualEditingInner({ client }: { client: ReturnType<typeof createClient> }) {
  const router = useRouter();

  // Activate live mode for real-time content updates
  useLiveMode({
    client,
    allowStudioOrigin: env.SANITY_STUDIO_URL || STUDIO_BASEPATH,
  });

  // Set up visual editing overlays and Studio connection
  useEffect(() => {
    const cleanup = enableVisualEditing({
      refresh: async (payload) => {
        if (payload.source === 'mutation') {
          await router.invalidate();
        }
      },
      zIndex: 999999,
    });

    return () => cleanup();
  }, [router]);

  return null;
}

/**
 * VisualEditing component for Sanity Studio integration.
 * Fetches draft token, creates client, and enables live preview mode.
 */
export function VisualEditing(): React.ReactElement | null {
  const [liveClient, setLiveClient] = useState<ReturnType<typeof createClient> | undefined>();

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
