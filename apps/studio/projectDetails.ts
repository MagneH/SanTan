// Studio runs in browser via Vite, which uses import.meta.env
// In production, Vite replaces import.meta.env.* at build time
// If they're not set during build, they become undefined at runtime

// Helper to safely get env value
const getEnvValue = (viteKey: string, processKey: string, fallback: string): string => {
  // Try import.meta.env first (Vite - available at build time)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteValue = import.meta.env[viteKey];
    if (viteValue && typeof viteValue === 'string' && viteValue.length > 0) {
      return viteValue;
    }
  }

  // Try process.env (Node.js context)
  if (typeof process !== 'undefined' && process.env) {
    const processValue = process.env[processKey];
    if (processValue && typeof processValue === 'string' && processValue.length > 0) {
      return processValue;
    }
  }

  // Fallback to hardcoded value
  return fallback;
};

const projectId = getEnvValue('SANITY_STUDIO_PROJECT_ID', 'SANITY_STUDIO_PROJECT_ID', 'qzo347ei');
const dataset = getEnvValue('SANITY_STUDIO_DATASET', 'SANITY_STUDIO_DATASET', 'production');
const apiVersion = getEnvValue('SANITY_STUDIO_API_VERSION', 'SANITY_STUDIO_API_VERSION', '2024-01-01');

export { apiVersion, dataset, projectId };

export const projectDetails = () => ({
  projectId,
  dataset,
  apiVersion,
});
