/**
 * Configuration for fullSlug functionality
 */
export const FULL_SLUG_CONFIG = {
  // Document types that support fullSlug
  SUPPORTED_TYPES: ['category', 'post'] as const,

  // Maximum depth for parent chain traversal
  MAX_DEPTH: 5,

  // Debounce delay for real-time computation (ms)
  DEBOUNCE_MS: 300,

  // Concurrency limit for batch operations
  BATCH_CONCURRENCY: 3,

  // Retry configuration for publish actions
  RETRY: {
    MAX_ATTEMPTS: 5,
    DELAY_MS: 400,
  },

  // GROQ queries
  QUERIES: {
    DRAFT_WITH_PARENT: `*[_id == "drafts." + $id][0]{_id, slug, parent}`,
    PUBLISHED_WITH_PARENT: `*[_id == $id][0]{_id, slug, parent}`,
    CHILDREN_WITH_DRAFTS: `*[_type in $types && parent._ref == $parentId]{
      _id,
      _type,
      slug,
      parent,
      "hasDraft": defined(*[_id == "drafts." + ^._id][0])
    }`,
    PARENT_CHAIN: `*[_id == $docId][0]{
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
  },
} as const;

export type SupportedDocumentType = (typeof FULL_SLUG_CONFIG.SUPPORTED_TYPES)[number];

/**
 * Check if a document type supports fullSlug functionality
 */
export function isFullSlugSupported(type: string): type is SupportedDocumentType {
  return FULL_SLUG_CONFIG.SUPPORTED_TYPES.includes(type as SupportedDocumentType);
}

/**
 * Validate fullSlug format
 */
export function validateFullSlug(fullSlug: string): { valid: boolean; error?: string } {
  if (!fullSlug) {
    return { valid: false, error: 'Full slug cannot be empty' };
  }

  if (fullSlug.startsWith('/') || fullSlug.endsWith('/')) {
    return { valid: false, error: 'Full slug cannot start or end with "/" ' };
  }

  if (fullSlug.includes('//')) {
    return { valid: false, error: 'Full slug cannot contain consecutive slashes' };
  }

  const invalidChars = fullSlug.match(/[^a-z0-9\-/]/g);
  if (invalidChars) {
    return {
      valid: false,
      error: `Full slug contains invalid characters: ${invalidChars.join(', ')}`,
    };
  }

  const segments = fullSlug.split('/');
  const emptySegments = segments.filter((segment) => !segment);
  if (emptySegments.length > 0) {
    return { valid: false, error: 'Full slug contains empty segments' };
  }

  if (segments.length > FULL_SLUG_CONFIG.MAX_DEPTH) {
    return {
      valid: false,
      error: `Full slug exceeds maximum depth of ${FULL_SLUG_CONFIG.MAX_DEPTH}`,
    };
  }

  return { valid: true };
}
