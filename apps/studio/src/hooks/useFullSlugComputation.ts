import { useCallback, useEffect, useMemo, useState } from 'react';
import { useClient, useFormValue } from 'sanity';

import { computeFullSlugRecursive } from '../utils/computeFullSlugRecursive';

interface UseFullSlugComputationOptions {
  debounceMs?: number;
  maxDepth?: number;
}

interface UseFullSlugComputationResult {
  computed: string | null;
  isComputing: boolean;
  error: string | null;
  recompute: () => Promise<void>;
}

/**
 * Custom hook for computing fullSlug in form contexts
 * Handles debouncing, caching, and error states
 */
export function useFullSlugComputation(options: UseFullSlugComputationOptions = {}): UseFullSlugComputationResult {
  const { debounceMs = 300, maxDepth = 5 } = options;

  const client = useClient({ apiVersion: '2023-10-22' });
  const documentId = useFormValue(['_id']) as string;
  const slugCurrent = useFormValue(['slug', 'current']) as string | undefined;
  const parent = useFormValue(['parent', '_ref']) as string | undefined;

  const [computed, setComputed] = useState<string | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastComputedKey, setLastComputedKey] = useState<string>('');

  // Debounced values
  const [debouncedSlug, setDebouncedSlug] = useState(slugCurrent);
  const [debouncedParent, setDebouncedParent] = useState(parent);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSlug(slugCurrent), debounceMs);
    return () => clearTimeout(timer);
  }, [slugCurrent, debounceMs]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedParent(parent), debounceMs);
    return () => clearTimeout(timer);
  }, [parent, debounceMs]);

  // Computation key for preventing duplicate work
  const computationKey = useMemo(
    () => `${documentId}:${debouncedSlug || ''}:${debouncedParent || 'root'}`,
    [documentId, debouncedSlug, debouncedParent],
  );

  // Recompute function
  const recompute = useCallback(async () => {
    if (!debouncedSlug || !client || computationKey === lastComputedKey) return;

    const cache = new Map<string, string | null>();
    setIsComputing(true);
    setError(null);

    try {
      const newFullSlug = await computeFullSlugRecursive(
        client,
        documentId,
        { cache, maxDepth },
        debouncedSlug,
        debouncedParent ?? null,
      );

      setComputed(newFullSlug);
      setLastComputedKey(computationKey);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to compute fullSlug: ${errorMessage}`);
      console.error('Failed to compute fullSlug:', err);
    } finally {
      setIsComputing(false);
    }
  }, [client, documentId, debouncedSlug, debouncedParent, computationKey, lastComputedKey, maxDepth]);

  // Auto-recompute when dependencies change
  useEffect(() => {
    if (debouncedSlug) {
      recompute();
    } else {
      setComputed(null);
      setIsComputing(false);
      setError(null);
      setLastComputedKey('');
    }
  }, [debouncedSlug, debouncedParent, recompute]);

  return {
    computed,
    isComputing,
    error,
    recompute,
  };
}
