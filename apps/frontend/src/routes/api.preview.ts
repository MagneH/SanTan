import { createFileRoute } from '@tanstack/react-router';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { RouteMethodResult } from '@tanstack/react-start';
import { commitSession, destroySession, getSession } from '@/sessions';
import { client } from '@/sanity/client';

// Defines the /api/preview route with server-side handlers
export const Route = createFileRoute('/api/preview')({
  server: {
    handlers: {
      // Handles GET requests to enable preview mode
      GET: async ({ request }): Promise<RouteMethodResult<any>> => {
        // Ensure the Sanity read token is available
        if (!process.env.SANITY_READ_TOKEN) {
          console.error('[Preview] Missing SANITY_READ_TOKEN environment variable');
          throw new Response('Preview mode missing token', { status: 401 });
        }

        // Create a Sanity client with the preview token
        const clientWithToken = client.withConfig({
          token: process.env.SANITY_READ_TOKEN,
        });

        // Log preview attempt
        const url = new URL(request.url);
        const secret = url.searchParams.get('secret');
        const slug = url.searchParams.get('slug');

        // Validate the secret using Sanity's validatePreviewUrl (for Studio)
        // or fallback to direct secret query (for manual browser URLs)
        let isValid = false;
        let redirectTo = slug || '/';

        // Try Sanity's validatePreviewUrl first (works with Studio Presentation Tool)
        try {
          const validationResult = await validatePreviewUrl(clientWithToken, request.url);
          isValid = validationResult.isValid;
          if (validationResult.redirectTo) {
            redirectTo = validationResult.redirectTo;
          }
        } catch (error) {
          // Fallback: Direct secret query (for manual URLs with ?secret= parameter)
          if (secret) {
            const secretQuery = '*[_type == "sanity.previewUrlSecret" && secret == $secret][0]';
            const secretDoc = await clientWithToken.fetch(secretQuery, { secret });
            isValid = !!secretDoc;
          }
        }

        if (!isValid) {
          throw new Response(
            'Invalid secret. The secret was not found in your Sanity dataset.\n\n' +
              'For Studio users: Access preview through Presentation Tool.\n' +
              'For manual access: Run "npm run get:preview-secret" to get the correct URL.',
            { status: 401 },
          );
        }

        // Get or create a session for preview mode
        const session = await getSession(request);
        session.projectId = client.config().projectId;

        const cookieValue = await commitSession(session);

        // Return a proper HTTP redirect with Set-Cookie header
        const targetUrl = redirectTo || '/';

        return new Response(null, {
          status: 302,
          headers: {
            Location: targetUrl,
            'Set-Cookie': cookieValue,
          },
        });
      },
      // Handles POST requests to disable preview mode
      POST: ({ request }) => {
        // Only allow POST requests
        if (request.method !== 'POST') {
          throw new Response('Method not allowed', { status: 405 });
        }

        // Destroy the preview session and clear the cookie
        const newCookieValue = destroySession();

        // Return a proper HTTP redirect with Set-Cookie header to clear the cookie
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
            'Set-Cookie': newCookieValue,
          },
        });
      },
    },
  },
});
