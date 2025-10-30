import urlBuilder from '@sanity/image-url';
import type { PostDocument } from '@/types/post.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';
import { seo } from '@/lib/seo.ts';

export const postMeta = (document: PostDocument, relativeUrl?: string) => {
  const src = document.mainImage
    ? urlBuilder({ projectId, dataset }).image(document.mainImage).height(300).fit('max').auto('format').url()
    : undefined;
  return {
    meta: [
      ...seo({
        title: document.title || 'TanStack Start Starter',
        description: document.seo?.description || 'A starter template for TanStack Router, React, and Sanity.io',
        image: src,
        relativeUrl: relativeUrl,
        keywords: document.seo?.keywords,
      }),
    ],
  };
};
