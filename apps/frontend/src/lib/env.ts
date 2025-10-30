import { z } from 'zod';

const isServer = typeof window === 'undefined';

// Client-side env schema (using VITE_ prefix)
const clientEnvSchema = z.object({
  VITE_SANITY_PROJECT_ID: z.string().min(1, 'VITE_SANITY_PROJECT_ID is required'),
  VITE_SANITY_DATASET: z.string().min(1, 'VITE_SANITY_DATASET is required'),
  VITE_SANITY_API_VERSION: z.string().min(1, 'VITE_SANITY_API_VERSION is required'),
  VITE_SANITY_STUDIO_URL: z.string().url().optional(),
  VITE_BASE_PATH: z.string().optional(),
});

// Server-side env schema (no prefix + private vars)
const serverEnvSchema = z.object({
  SANITY_READ_TOKEN: z.string().optional(),
  SANITY_SESSION_SECRET: z.string().min(1, 'SANITY_SESSION_SECRET is required for preview mode'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Combined schema for type inference
// const fullEnvSchema = clientEnvSchema.merge(serverEnvSchema);

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

      return {
        SANITY_PROJECT_ID: process.env.VITE_SANITY_PROJECT_ID!,
        SANITY_DATASET: process.env.VITE_SANITY_DATASET!,
        SANITY_API_VERSION: process.env.VITE_SANITY_API_VERSION!,
        SANITY_STUDIO_URL: process.env.VITE_SANITY_STUDIO_URL,
        SANITY_READ_TOKEN: serverVars.SANITY_READ_TOKEN,
        SANITY_SESSION_SECRET: serverVars.SANITY_SESSION_SECRET,
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

      return {
        SANITY_PROJECT_ID: clientVars.VITE_SANITY_PROJECT_ID,
        SANITY_DATASET: clientVars.VITE_SANITY_DATASET,
        SANITY_API_VERSION: clientVars.VITE_SANITY_API_VERSION,
        SANITY_STUDIO_URL: clientVars.VITE_SANITY_STUDIO_URL,
        SANITY_READ_TOKEN: undefined,
        SANITY_SESSION_SECRET: '', // Not available on client
        NODE_ENV: import.meta.env.MODE as 'development' | 'production' | 'test',
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n  ');
      throw new Error(`Environment variable validation failed:\n  ${missingVars}\n\nPlease check your .env file.`);
    }
    throw error;
  }
}

export const env = validateEnv();
