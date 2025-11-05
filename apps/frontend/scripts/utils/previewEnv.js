// Shared utility for loading environment variables and resolving Sanity preview tokens
// Usage in scripts:
//   import { loadPreviewEnvironment, getSanityClientConfig } from './utils/previewEnv.js'
//   const { token } = loadPreviewEnvironment()
//   const client = createClient({ ...getSanityClientConfig(), token, useCdn: false })

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

export function loadPreviewEnvironment(options = {}) {
  const debug = options.debug ?? process.env.PREVIEW_SECRET_DEBUG === '1';
  const cwd = process.cwd();
  // Use URL to resolve script directory (works with ESM)
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const appDir = path.resolve(scriptDir, '..'); // scripts directory is parent of utils

  const candidateFiles = [
    // Root-level env files
    path.join(cwd, '.env.local'),
    path.join(cwd, '.env'),
    // App-level env files when running from root
    path.join(cwd, 'apps', 'frontend', '.env.local'),
    path.join(cwd, 'apps', 'frontend', '.env'),
    // Relative to script directory (if invoked directly inside app)
    path.join(appDir, '.env.local'),
    path.join(appDir, '.env'),
  ];

  const loadedFiles = [];
  for (const file of candidateFiles) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
      loadedFiles.push(file);
    }
  }

  // Pick first available token (Editor token should ideally be first)
  const tokenCandidates = [
    process.env.SANITY_API_TOKEN, // preferred (Editor/Admin)
    process.env.SANITY_READ_TOKEN, // may also be Editor
    process.env.SANITY_STUDIO_API_TOKEN,
    process.env.VITE_SANITY_API_TOKEN,
    process.env.VITE_SANITY_READ_TOKEN,
  ].filter(Boolean);

  const token = tokenCandidates[0];

  if (debug) {
    console.log('[preview-env] Loaded env files:', loadedFiles.length ? loadedFiles : '(none)');
    console.log('[preview-env] Token candidates found:', tokenCandidates.length);
    console.log('[preview-env] Using token:', token ? 'present' : 'NONE');
  }

  return { loadedFiles, token };
}

export function getSanityClientConfig() {
  return {
    projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  };
}

export function ensureTokenOrExit(token, purpose = 'This operation') {
  if (!token) {
    console.error('❌ ' + purpose + ' requires a token (SANITY_API_TOKEN or SANITY_READ_TOKEN).');
    console.error('Set one of these in your env file (repo root .env.local or apps/frontend/.env.local) or pass inline:');
    console.error('  SANITY_API_TOKEN=xxxx npm --prefix apps/frontend run <script>');
    process.exit(1);
  }
}

