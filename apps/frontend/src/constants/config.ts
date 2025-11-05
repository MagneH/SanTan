// Pagination constants
export const POSTS_PER_PAGE = 6;
export const CATEGORIES_PER_PAGE = 100;

// Preview mode constants
export const PREVIEW_REFETCH_INTERVAL_MS = 2000;

// Image optimization constants
export const DEFAULT_IMAGE_WIDTH = 1140;
export const DEFAULT_IMAGE_HEIGHT = 700;
export const CARD_IMAGE_SIZE = 400;

// Sanity configuration
export const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
export const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET;
export const SANITY_API_VERSION = import.meta.env.VITE_SANITY_API_VERSION;

/**
 * Get the Sanity Studio URL based on environment
 * Priority:
 * 1. Runtime environment variable (injected by server for client-side)
 * 2. Build-time environment variable (VITE_SANITY_STUDIO_URL)
 * 3. Server-side process.env (for SSR)
 * 4. Local development fallback
 */
export function getSanityStudioUrl(): string {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Server-side: Read from process.env (set by Cloud Run)
    const serverStudioUrl =
      process.env.SANITY_STUDIO_URL ||
      process.env.VITE_SANITY_STUDIO_URL;

    if (serverStudioUrl) {
      return serverStudioUrl;
    }
  } else {
    // Client-side: Try runtime injected value first
    if ((window as any).__SANITY_STUDIO_URL__) {
      return (window as any).__SANITY_STUDIO_URL__;
    }

    // Then try build-time env var
    const clientStudioUrl = import.meta.env.VITE_SANITY_STUDIO_URL;
    if (clientStudioUrl) {
      return clientStudioUrl;
    }
  }

  // Fallback to localhost for development
  return 'http://localhost:3333';
}

export const SANITY_STUDIO_URL = getSanityStudioUrl();
