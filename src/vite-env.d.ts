/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NASA_API_KEY: string;
  readonly VITE_NASA_DATA_ENDPOINT: string;
  readonly VITE_ENABLE_LIVE_NASA_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
