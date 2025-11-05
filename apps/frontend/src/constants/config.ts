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
 * 1. Explicit VITE_SANITY_STUDIO_URL (for overrides)
 * 2. Cloud Run hosting (santan-studio service)
 * 3. Local development fallback
 */
export function getSanityStudioUrl(): string {
  // Allow explicit override via env var
  const explicitUrl = import.meta.env.VITE_SANITY_STUDIO_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  // In production, use self-hosted Studio on Cloud Run
  // This will be set via environment variable during deployment
  if (import.meta.env.PROD) {
    // Will be injected during build/deployment
    const productionStudioUrl = import.meta.env.VITE_SANITY_STUDIO_URL;
    if (productionStudioUrl) {
      return productionStudioUrl;
    }
    // Fallback to expected Cloud Run URL pattern
    // You should set VITE_SANITY_STUDIO_URL explicitly in production
    console.warn('VITE_SANITY_STUDIO_URL not set in production. Please configure it in deployment.');
  }

  // Fallback to localhost for development
  return 'http://localhost:3333';
}

export const SANITY_STUDIO_URL = getSanityStudioUrl();

