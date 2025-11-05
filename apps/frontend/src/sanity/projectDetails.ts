// Use import.meta.env on client-side (Vite), process.env on server-side (Node/Nitro)
const isServer = typeof window === 'undefined';

const projectId = isServer
  ? (process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID)
  : import.meta.env.VITE_SANITY_PROJECT_ID;

const dataset = isServer
  ? (process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET)
  : import.meta.env.VITE_SANITY_DATASET;

const apiVersion = isServer
  ? (process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION)
  : import.meta.env.VITE_SANITY_API_VERSION;

export { apiVersion, dataset, projectId };
