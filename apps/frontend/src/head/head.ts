import { sanityTypeLiterals } from '@santan/shared/types';
import type { DocumentType } from '@/types/documentType.ts';
import { postMeta } from '@/pages/Post/meta.ts';
import { categoryMeta } from '@/pages/Category/meta.ts';

export const head = (document?: DocumentType, relativeUrl?: string) => {
  if (!document) {
    return {};
  }
  switch (document._type) {
    case sanityTypeLiterals['category']:
      return categoryMeta(document, relativeUrl);

    case sanityTypeLiterals['post']:
      return postMeta(document, relativeUrl);

    default:
      return {
        meta: [],
      };
  }
};
