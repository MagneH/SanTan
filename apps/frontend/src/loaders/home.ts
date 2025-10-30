import type { QueryClient } from '@tanstack/react-query';
import type { ClientPerspective, UnfilteredResponseQueryOptions } from '@sanity/client';
import { HOME_QUERY, homeQuery } from '@/sanity/queries/homeQuery.ts';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { detectPreviewMode, validatePreviewToken } from '@/lib/previewMode';

export const homeLoader = async ({
  context,
}: {
  context: { queryClient: QueryClient; request: Request | null; isPreview?: boolean };
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

  const initial = await context.queryClient.ensureQueryData(homeQuery(options));

  // Return options without stega to avoid type incompatibility
  const returnOptions = {
    filterResponse: false as const,
    perspective: options.perspective as ClientPerspective,
    ...(options.token ? { token: options.token } : {}),
  };

  return {
    initial,
    options: returnOptions,
    query: HOME_QUERY,
    params: { lastPublishedAt: null, lastId: null },
    sanity: { isPreview: isPreviewMode },
  };
};
