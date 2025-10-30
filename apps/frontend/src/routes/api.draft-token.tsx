import { createFileRoute } from '@tanstack/react-router';
import { getSession } from '@/sessions';
import { client } from '@/sanity/client';

// Provides a draft token for live mode on the client
export const Route = createFileRoute('/api/draft-token')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Verify the user has an active preview session
        const session = await getSession(request);

        if (process.env.NODE_ENV !== 'production') {
          console.log('[DraftToken] Request received:', {
            hasSession: !!session.projectId,
            sessionProjectId: session.projectId,
            expectedProjectId: client.config().projectId,
            hasToken: !!process.env.SANITY_READ_TOKEN,
          });
        }

        if (!session.projectId || session.projectId !== client.config().projectId) {
          console.warn('[DraftToken] Unauthorized: Not in preview mode');
          return new Response(JSON.stringify({ error: 'Not in preview mode' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Only provide token if in preview mode and token exists
        if (!process.env.SANITY_READ_TOKEN) {
          console.error('[DraftToken] Token not configured in environment');
          return new Response(JSON.stringify({ error: 'Token not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log('[DraftToken] Returning token for preview mode');
        }

        // Return the token
        return new Response(JSON.stringify({ token: process.env.SANITY_READ_TOKEN }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  },
});
