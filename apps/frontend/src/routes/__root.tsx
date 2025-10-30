import { createRootRouteWithContext } from '@tanstack/react-router';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';
import { globalLayoutLoader } from '@/loaders/globalLayoutLoader.ts';
import { GlobalLayout } from '@/components/GlobalLayout/GlobalLayout.tsx';

interface MyRouterContext {
  queryClient: QueryClient;
  request: Request | null;
  isPreview?: boolean; // Preview state from root loader
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Santan App - Your Content Platform',
        },
        {
          name: 'description',
          content: 'Your content platform built with React, Sanity, and TanStack Router.',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    };
  },
  loader: globalLayoutLoader,
  shellComponent: GlobalLayout,
});
