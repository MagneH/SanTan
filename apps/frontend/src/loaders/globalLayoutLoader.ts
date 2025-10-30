import type { QueryClient } from '@tanstack/react-query';
import { detectPreviewMode } from '@/lib/previewMode';

export const globalLayoutLoader = async ({
  context,
}: {
  context: { queryClient: QueryClient; request: Request | null };
}) => {
  // Detect if preview mode is active
  const isPreviewMode = await detectPreviewMode(context.request);

  return {
    sanity: { isPreview: isPreviewMode },
  };
};
