import type { QueryClient } from '@tanstack/react-query';
import type { ClientPerspective, UnfilteredResponseQueryOptions } from '@sanity/client';
import { DOCUMENT_QUERY, documentQuery } from '@/sanity/queries/documentQuery.ts';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { detectPreviewMode, validatePreviewToken } from '@/lib/previewMode';

export const documentLoader = async ({
  context,
  params,
}: {
  params: { _splat: string };
  context: { queryClient: QueryClient; request: Request | null };
}) => {
  // Detect if preview mode is active
  const isPreviewMode = await detectPreviewMode(context.request);
  validatePreviewToken(isPreviewMode);

  const options = {
    filterResponse: false,
    perspective: isPreviewMode ? ('previewDrafts' as ClientPerspective) : ('published' as ClientPerspective),
    ...(isPreviewMode && process.env.SANITY_READ_TOKEN ? { token: process.env.SANITY_READ_TOKEN } : {}),
    ...(isPreviewMode ? { stega: { enabled: true, studioUrl: STUDIO_BASEPATH } } : {}),
  } as UnfilteredResponseQueryOptions;

  const initial = await context.queryClient.ensureQueryData(documentQuery(params._splat, options));

  // Return options without stega to avoid type incompatibility
  const returnOptions = {
    filterResponse: false as const,
    perspective: options.perspective,
    ...(options.token ? { token: options.token } : {}),
  };

  return {
    initial,
    query: DOCUMENT_QUERY,
    params: { fullSlug: params._splat },
    options: returnOptions,
    sanity: { isPreview: isPreviewMode },
  };
};
