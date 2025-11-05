// Studio runs in browser via Vite, which uses import.meta.env
// Fallback to process.env for build-time/server contexts
const projectId =
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_PROJECT_ID) ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  '88hgbtze'; // Fallback to hardcoded value

const dataset =
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_DATASET) ||
  process.env.SANITY_STUDIO_DATASET ||
  'production'; // Fallback to hardcoded value

const apiVersion =
  (typeof import.meta !== 'undefined' && import.meta.env?.SANITY_STUDIO_API_VERSION) ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2024-01-01'; // Fallback to hardcoded value

export { apiVersion, dataset, projectId };

export const projectDetails = () => ({
  projectId,
  dataset,
  apiVersion,
});
