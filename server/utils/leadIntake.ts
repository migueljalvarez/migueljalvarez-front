import type { ApiPostResult } from './publicApiClient'

/**
 * Guarda un lead del formulario de contacto en la API (`POST /api/intake/leads`). Es puro (sin Nuxt):
 * recibe el cliente HTTP y la clave, y nunca lanza; devuelve el resultado para que el llamador decida.
 *
 * Solo se reintenta ante fallos transitorios (red, tiempo agotado, 5xx, 429). Un 4xx significa que la API
 * rechazó los datos o la clave: reintentar no sirve. La API es idempotente (mismo correo + mensaje dentro
 * de 24 h devuelve el lead existente con 200), así que un reintento nunca duplica el lead.
 */
export type LeadPayload = {
  name: string
  email: string
  subject: string
  message: string
  consent: true
  consentPolicyVersion: string
}

export type LeadIntakeOutcome =
  | 'saved' // 201: lead creado
  | 'duplicate' // 200: ya existía (reintento): cuenta como guardado
  | 'rejected' // 4xx: la API rechazó la petición (no se reintenta)
  | 'failed' // red/5xx tras agotar los reintentos
  | 'not-configured' // sin API o sin clave: no se intenta

/* eslint-disable no-unused-vars */
export type LeadIntakeClient = {
  configured: boolean
  post: (
    path: string,
    body: unknown,
    headers?: Record<string, string>
  ) => Promise<ApiPostResult<unknown>>
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
export type LeadIntakeOptions = {
  intakeKey: string
  attempts?: number
  /** Espera base entre intentos; se duplica en cada uno (backoff exponencial). */
  delayMs?: number
  sleep?: (ms: number) => Promise<void>
}
/* eslint-enable no-unused-vars */

const RETRYABLE = (status: number) => status === 0 || status === 429 || status >= 500

export const saveLead = async (
  client: LeadIntakeClient,
  payload: LeadPayload,
  options: LeadIntakeOptions
): Promise<LeadIntakeOutcome> => {
  if (!client.configured || !options.intakeKey) return 'not-configured'

  const attempts = options.attempts ?? 3
  const delayMs = options.delayMs ?? 300
  const sleep = options.sleep ?? (ms => new Promise(resolve => setTimeout(resolve, ms)))

  for (let attempt = 0; attempt < attempts; attempt++) {
    const result = await client.post('/api/intake/leads', payload, {
      'x-intake-key': options.intakeKey
    })

    if (result.status === 201) return 'saved'
    if (result.status === 200) return 'duplicate'
    if (!RETRYABLE(result.status)) return 'rejected'
    if (attempt < attempts - 1) await sleep(delayMs * 2 ** attempt)
  }
  return 'failed'
}

export const isLeadStored = (outcome: LeadIntakeOutcome): boolean =>
  outcome === 'saved' || outcome === 'duplicate'
