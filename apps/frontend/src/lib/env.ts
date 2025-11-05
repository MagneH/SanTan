import { z } from 'zod';

const isServer = typeof window === 'undefined';

// Client-side env schema (using VITE_ prefix)
// In production, these might not be available via import.meta.env, so we make them optional
const clientEnvSchema = z.object({
  VITE_SANITY_PROJECT_ID: z.string().optional(),
  VITE_SANITY_DATASET: z.string().optional(),
  VITE_SANITY_API_VERSION: z.string().optional(),
  VITE_SANITY_STUDIO_URL: z.string().url().optional(),
  VITE_BASE_PATH: z.string().optional(),
});

// Server-side env schema (no prefix + private vars)
const serverEnvSchema = z.object({
  SANITY_PROJECT_ID: z.string().optional(), // Allow fallback
  SANITY_DATASET: z.string().optional(), // Allow fallback
  SANITY_API_VERSION: z.string().optional(), // Allow fallback
  SANITY_STUDIO_URL: z.string().optional(),
  SANITY_READ_TOKEN: z.string().optional(),
  SANITY_SESSION_SECRET: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Fallback values for production
const FALLBACK_PROJECT_ID = '88hgbtze';
const FALLBACK_DATASET = 'production';
const FALLBACK_API_VERSION = '2024-01-01';

export type Env = {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_VERSION: string;
  SANITY_STUDIO_URL?: string;
  SANITY_READ_TOKEN?: string;
  SANITY_SESSION_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
};

function validateEnv(): Env {
  try {
    if (isServer) {
      // Server-side: validate server vars
      const serverVars = serverEnvSchema.parse(process.env);

      // Use SANITY_ prefix first (set by Cloud Run), then VITE_ prefix, then fallback
      const projectId =
        process.env.SANITY_PROJECT_ID ||
        process.env.VITE_SANITY_PROJECT_ID ||
        FALLBACK_PROJECT_ID;

      const dataset =
        process.env.SANITY_DATASET ||
        process.env.VITE_SANITY_DATASET ||
        FALLBACK_DATASET;

      const apiVersion =
        process.env.SANITY_API_VERSION ||
        process.env.VITE_SANITY_API_VERSION ||
        FALLBACK_API_VERSION;

      const studioUrl =
        process.env.SANITY_STUDIO_URL ||
        process.env.VITE_SANITY_STUDIO_URL;

      return {
        SANITY_PROJECT_ID: projectId,
        SANITY_DATASET: dataset,
        SANITY_API_VERSION: apiVersion,
        SANITY_STUDIO_URL: studioUrl,
        SANITY_READ_TOKEN: serverVars.SANITY_READ_TOKEN,
        SANITY_SESSION_SECRET: serverVars.SANITY_SESSION_SECRET || '',
        NODE_ENV: serverVars.NODE_ENV,
      };
    } else {
      // Client-side: validate client vars (from import.meta.env)
      const clientVars = clientEnvSchema.parse({
        VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID,
        VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET,
        VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION,
        VITE_SANITY_STUDIO_URL: import.meta.env.VITE_SANITY_STUDIO_URL,
        VITE_BASE_PATH: import.meta.env.VITE_BASE_PATH,
      });

      // In production builds, import.meta.env might be empty, so use fallbacks
      const projectId = clientVars.VITE_SANITY_PROJECT_ID || FALLBACK_PROJECT_ID;
      const dataset = clientVars.VITE_SANITY_DATASET || FALLBACK_DATASET;
      const apiVersion = clientVars.VITE_SANITY_API_VERSION || FALLBACK_API_VERSION;

      return {
        SANITY_PROJECT_ID: projectId,
        SANITY_DATASET: dataset,
        SANITY_API_VERSION: apiVersion,
        SANITY_STUDIO_URL: clientVars.VITE_SANITY_STUDIO_URL,
        SANITY_READ_TOKEN: undefined,
        SANITY_SESSION_SECRET: '', // Not available on client
        NODE_ENV: (import.meta.env.MODE || 'production') as 'development' | 'production' | 'test',
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n  ');
      console.warn(`Environment variable validation warning:\n  ${missingVars}`);

      // Return fallback values instead of throwing
      return {
        SANITY_PROJECT_ID: FALLBACK_PROJECT_ID,
        SANITY_DATASET: FALLBACK_DATASET,
        SANITY_API_VERSION: FALLBACK_API_VERSION,
        SANITY_STUDIO_URL: undefined,
        SANITY_READ_TOKEN: undefined,
        SANITY_SESSION_SECRET: '',
        NODE_ENV: 'production',
      };
    }
    throw error;
  }
}

export const env = validateEnv();
