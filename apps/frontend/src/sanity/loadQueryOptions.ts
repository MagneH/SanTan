// Write a tanstack server function that loads query options from request headers
import { createServerFn } from '@tanstack/react-start';
import type { ClientPerspective } from '@sanity/client';
import { client } from '@/sanity/client.ts';
import { getSession } from '@/sessions';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { apiVersion, dataset, projectId } from '@/sanity/projectDetails.ts';

export const loadQueryOptions = createServerFn({
  method: 'GET',
}).handler(async ({ context }) => {
  const previewSession = await getSession(context.request);
  const isPreview = previewSession.projectId === client.config().projectId;

  if (isPreview && !process.env.SANITY_READ_TOKEN) {
    throw new Error(
      `Cannot activate preview mode without a "SANITY_READ_TOKEN" token in your environment variables. \n\n
      Create one with "Viewer" permissions at\n\n
      https://sanity.io/manage/project/${client.config().projectId}/api#tokens`,
    );
  }

  return {
    isPreviewMode: isPreview,
    options: {
      ssr: true,
      projectId,
      dataset,
      apiVersion,
      filterResponse: false,
      token: isPreview ? process.env.SANITY_READ_TOKEN : undefined,
      perspective: isPreview ? ('drafts' as ClientPerspective) : ('published' as ClientPerspective),
      stega: isPreview ? { enabled: true, studioUrl: STUDIO_BASEPATH } : undefined,
    },
  } as const;
});
