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
          title: 'Pensjonsbloggen - Din guide til pensjon og økonomi',
        },
        {
          name: 'description',
          content: 'Les de nyeste artiklene om pensjon, økonomi og pensjonssparing i Norge.',
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
