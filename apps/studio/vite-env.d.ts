/// <reference types="vite/client" />

// Extend ImportMeta to include Vite's env property
interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID?: string;
  readonly SANITY_STUDIO_DATASET?: string;
  readonly SANITY_STUDIO_API_VERSION?: string;
  readonly SANITY_STUDIO_FRONTEND_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
