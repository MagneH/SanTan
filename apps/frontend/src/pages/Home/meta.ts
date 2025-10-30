import type { HomeDocument } from '@/types/home.ts';
import { seo } from '@/lib/seo.ts';

export const homeMeta = (document?: HomeDocument, relativeUrl?: string) => {
  return {
    meta: [
      ...seo({
        title: document?.title || 'TanStack Start Starter',
        description: document?.subTitle || 'A starter template for TanStack Router, React, and Sanity.io',
        relativeUrl: relativeUrl,
      }),
    ],
  };
};
