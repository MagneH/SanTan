import { PREVIEW_SESSION_NAME, getSession } from '@/sessions';
import { client } from '@/sanity/client';
import { isServer } from '@/lib/isServer';

/**
 * Detects if the current request is in preview mode.
 * Checks URL parameters, iframe context, and session cookies.
 *
 * @param request - The incoming request object (only available server-side)
 * @returns Promise<boolean> indicating if preview mode is active
 */
export async function detectPreviewMode(request: Request | null): Promise<boolean> {
  let isPreviewMode = false;

  if (isServer) {
    // Server-side: check request headers
    if (request) {
      // Check URL parameters for preview indicators
      const url = new URL(request.url);
      const previewParam = url.searchParams.get('preview');
      const perspectiveParam = url.searchParams.get('perspective');

      // Check if loaded in iframe from Sanity Studio (check referer or specific headers)
      const referer = request.headers.get('referer') || '';
      const secFetchDest = request.headers.get('sec-fetch-dest') || '';
      const isInIframe = secFetchDest === 'iframe' || referer.includes('sanity.studio');

      // Sanity Studio sends 'perspective' parameter (previewDrafts or published)
      const hasPerspectiveParam = perspectiveParam === 'previewDrafts' || perspectiveParam === 'drafts';

      if (previewParam === 'true' || isInIframe || hasPerspectiveParam) {
        isPreviewMode = true;
      } else {
        const previewSession = await getSession(request);
        isPreviewMode = previewSession.projectId === client.config().projectId;
      }
    }
  } else {
    // Client-side: check document.cookie
    if (typeof document !== 'undefined') {
      isPreviewMode = document.cookie.includes(`${PREVIEW_SESSION_NAME}=`);

      // Also check URL parameters on client side
      const urlParams = new URLSearchParams(window.location.search);
      const perspectiveParam = urlParams.get('perspective');
      const hasPerspectiveParam = perspectiveParam === 'previewDrafts' || perspectiveParam === 'drafts';

      if (hasPerspectiveParam) {
        isPreviewMode = true;
      }
    }
  }

  return isPreviewMode;
}

/**
 * Validates that the SANITY_READ_TOKEN is available when preview mode is active on the server.
 * Throws an error if the token is missing.
 *
 * @param isPreviewMode - Whether preview mode is active
 * @throws Error if preview mode is active but token is missing
 */
export function validatePreviewToken(isPreviewMode: boolean): void {
  if (isServer && isPreviewMode && !process.env.SANITY_READ_TOKEN) {
    throw new Error(`Cannot activate preview mode without a "SANITY_READ_TOKEN" token in your environment variables.`);
  }
}
