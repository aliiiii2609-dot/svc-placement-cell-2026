/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST target for recruiter / feedback / alumni form submissions. */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Passcode required to unlock the /admin console. */
  readonly VITE_ADMIN_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
