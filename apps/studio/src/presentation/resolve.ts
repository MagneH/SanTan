import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    home: defineLocations({
      select: {
        title: 'title',
        siteTitle: 'siteTitle',
      },
      resolve: (doc) => {
        return {
          locations: [
            {
              title: doc?.title,
              href: '/',
            },
          ],
        };
      },
    }),
    post: defineLocations({
      select: {
        title: 'title',
        fullSlug: 'fullSlug',
        type: '_type',
      },
      resolve: (doc) => {
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/${doc?.fullSlug}`,
            },
          ],
        };
      },
    }),
    category: defineLocations({
      select: {
        title: 'title',
        fullSlug: 'fullSlug',
        type: '_type',
      },
      resolve: (doc) => {
        return {
          locations: [
            {
              title: doc?.title || 'Untitled',
              href: `/${doc?.fullSlug}`,
            },
          ],
        };
      },
    }),
  },
};
