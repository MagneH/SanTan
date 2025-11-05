import groq from 'groq';
import { queryOptions } from '@tanstack/react-query';
import { sanityTypeLiterals } from '@santan/shared/types';
import type { UnfilteredResponseQueryOptions } from '@sanity/client';
import type { DocumentType } from '@/types/documentType.ts';
import { postZ } from '@/types/post.ts';
import { client } from '@/sanity/client.ts';
import { STUDIO_BASEPATH } from '@/sanity/constants.ts';
import { CATEGORY_QUERY_FIELDS } from '@/sanity/queries/categoryQuery.ts';
import { POST_QUERY_FIELDS } from '@/sanity/queries/postQuery.ts';
import { categoryZ } from '@/types/category.ts';

// GROQ query
export const DOCUMENT_QUERY = groq`*[fullSlug == $fullSlug][0]{
  _id,
  _type,
  ...select(
    _type == "category" => {
      ${CATEGORY_QUERY_FIELDS}
    },
    _type == "post" => {
      ${POST_QUERY_FIELDS}
    }
  )
}`;

// Tanstack Query
export const documentQuery = (fullSlug: string, options: UnfilteredResponseQueryOptions) => {
  return queryOptions({
    queryKey: ['documents', fullSlug, options.perspective || 'published'],
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    queryFn: () =>
      client
        .withConfig({ stega: { enabled: true, studioUrl: STUDIO_BASEPATH }, resultSourceMap: true })
        .fetch<DocumentType>(DOCUMENT_QUERY, { fullSlug }, options)
        .then((res) => {
          // Handle case where document doesn't exist
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!res.result) {
            return {
              data: null,
              sourceMap: undefined,
            };
          }

          switch (res.result._type) {
            case sanityTypeLiterals.post:
              return {
                data: postZ.parse(res.result),
                sourceMap: res.resultSourceMap,
              };
            case sanityTypeLiterals.category:
              try {
                return {
                  data: categoryZ.parse(res.result),
                  sourceMap: res.resultSourceMap,
                };
              } catch (e) {
                console.log(e);
                return {
                  data: null,
                  sourceMap: undefined,
                };
              }
            default:
              return {
                data: null,
                sourceMap: undefined,
              };
          }
        }),
  });
};
