// Use import.meta.env on client-side (Vite), process.env on server-side (Node/Nitro)
const isServer = typeof window === 'undefined';

// Fallback values for production
const FALLBACK_PROJECT_ID = '88hgbtze';
const FALLBACK_DATASET = 'production';
const FALLBACK_API_VERSION = '2024-01-01';

const projectId = isServer
  ? (process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || FALLBACK_PROJECT_ID)
  : (import.meta.env.VITE_SANITY_PROJECT_ID || FALLBACK_PROJECT_ID);

const dataset = isServer
  ? (process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || FALLBACK_DATASET)
  : (import.meta.env.VITE_SANITY_DATASET || FALLBACK_DATASET);

const apiVersion = isServer
  ? (process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || FALLBACK_API_VERSION)
  : (import.meta.env.VITE_SANITY_API_VERSION || FALLBACK_API_VERSION);

export { apiVersion, dataset, projectId };
