/// <reference types="vite/client" />

// Optional: declare your env vars for better type safety
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CSE_API_KEY: string;
  readonly VITE_GOOGLE_CSE_CX_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
