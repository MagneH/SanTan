import { createClient } from '@sanity/client';
import { loadQuery } from '@sanity/react-loader';
import { setServerClient } from '@/sanity/sanity.loader.ts';

export const sanityLoaderServer = () => {
  const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.VITE_SANITY_DATASET,
    useCdn: true,
    apiVersion: process.env.VITE_SANITY_API_VERSION,
    token: process.env.SANITY_READ_TOKEN,
    stega: {
      enabled: true,
      studioUrl: 'http://localhost:3333', // Adjust this to your studio URL
    },
  });
  setServerClient(client);
  return loadQuery;
};
