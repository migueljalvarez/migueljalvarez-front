import type { H3Event } from 'h3'

// Secretos del servidor. NO se leen de process.env en nuxt.config.ts porque Nuxt los "hornea" dentro del
// build (.output). Aquí se leen en ejecución: primero la variable estándar de Nuxt (NUXT_<CLAVE>, que
// sobrescribe runtimeConfig) y, como respaldo, el nombre clásico (p. ej. RESEND_API_KEY del .env).
export type ServerSecretKey =
  | 'resendApiKey'
  | 'mailFrom'
  | 'mailTo'
  | 'adminEmail'
  | 'adminPassword'
  | 'adminSessionSecret'
  | 'firebaseProjectId'
  | 'firebaseClientEmail'
  | 'firebasePrivateKey'

const LEGACY_ENV: Record<ServerSecretKey, string> = {
  resendApiKey: 'RESEND_API_KEY',
  mailFrom: 'MAIL_FROM',
  mailTo: 'MAIL_TO',
  adminEmail: 'ADMIN_EMAIL',
  adminPassword: 'ADMIN_PASSWORD',
  adminSessionSecret: 'ADMIN_SESSION_SECRET',
  firebaseProjectId: 'FIREBASE_PROJECT_ID',
  firebaseClientEmail: 'FIREBASE_CLIENT_EMAIL',
  firebasePrivateKey: 'FIREBASE_PRIVATE_KEY'
}

export const getServerSecret = (key: ServerSecretKey, event?: H3Event): string => {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
  const fromConfig = (config as unknown as Record<string, unknown>)[key]

  return String(fromConfig || process.env[LEGACY_ENV[key]] || '')
}
