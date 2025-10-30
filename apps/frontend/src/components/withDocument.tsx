import { useSuspenseQuery } from '@tanstack/react-query';
import type { ContentSourceMap } from '@sanity/client';
import type { ReactNode } from 'react';
import { useQuery } from '@/sanity/sanity.loader.ts';

interface PreviewProps<T> {
  query: string;
  params: Record<string, string | null>;
  initial: { data: T; sourceMap: ContentSourceMap | undefined } | undefined;
}

interface PublicProps<T> {
  tanstackQuery: any; // Use any here to avoid complex type inference issues with queryOptions
  initial: T | undefined;
}

interface PageComponentProps<T> {
  data: T | undefined | null;
  encodeDataAttribute?: (fieldName: Array<string>) => string | undefined;
}

const withPublishedData = <T,>(PageComponent: (props: PageComponentProps<T>) => ReactNode) => {
  return ({ tanstackQuery }: PublicProps<T>) => {
    const { data } = useSuspenseQuery(tanstackQuery);
    // Safely extract the data from the query result, preserving null
    const componentData = (data as { data: T | null } | null)?.data ?? null;
    return <PageComponent data={componentData} />;
  };
};

const withPreviewData = <T,>(PageComponent: (props: PageComponentProps<T>) => ReactNode) => {
  return ({ query, params, initial }: PreviewProps<T>) => {
    const { data, encodeDataAttribute } = useQuery<T>(
      query,
      params,
      initial
        ? {
            initial: {
              data: initial.data,
              sourceMap: initial.sourceMap,
            },
          }
        : undefined,
    );

    return <PageComponent data={data} encodeDataAttribute={encodeDataAttribute} />;
  };
};

export { withPreviewData, withPublishedData };
