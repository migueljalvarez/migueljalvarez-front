import { createHmac, randomBytes } from 'node:crypto'
import { z } from 'zod'
import {
  FORM_SUBMIT_OK,
  MAX_TRACK_BODY_BYTES,
  PAGE_PATH_PATTERN,
  REFERRER_HOST_PATTERN,
  SLUG_PATTERN,
  TRACK_BUTTON_IDS,
  TRACK_EVENT_IDS,
  TRACK_SLUG_IDS,
  UTM_PATTERN,
  type TrackEventId
} from '../../constants/track.ts'
import type { ApiPostResult } from './publicApiClient'

/**
 * Conteo anónimo de clics (`POST /api/track`). Lógica pura (sin Nitro) para poder probarla. No se guarda
 * ninguna IP, user agent ni dato de la persona: la IP solo sirve (con HMAC y sal por proceso) como clave
 * del límite de frecuencia, en memoria.
 */

export {
  FORM_SUBMIT_OK,
  MAX_TRACK_BODY_BYTES,
  PAGE_PATH_PATTERN,
  REFERRER_HOST_PATTERN,
  SLUG_PATTERN,
  TRACK_BUTTON_IDS,
  TRACK_EVENT_IDS,
  TRACK_SLUG_IDS,
  UTM_PATTERN
}
export type { TrackEventId }

/** Cuerpo estricto: un campo extra o un tipo distinto lo invalida entero. */
export const trackSchema = z
  .strictObject({
    eventId: z.enum(TRACK_EVENT_IDS),
    slug: z.string().regex(SLUG_PATTERN).optional(),
    pagePath: z.string().regex(PAGE_PATH_PATTERN),
    utmSource: z.string().regex(UTM_PATTERN).optional(),
    utmCampaign: z.string().regex(UTM_PATTERN).optional(),
    referrerHost: z.string().regex(REFERRER_HOST_PATTERN).optional(),
    device: z.enum(['mobile', 'desktop'])
  })
  .refine(value => TRACK_SLUG_IDS.includes(value.eventId) === (value.slug !== undefined))

export type TrackPayload = z.infer<typeof trackSchema>

/** Texto JSON → carga válida, o `null` (JSON roto, campos extra, tipos raros, ID fuera de la lista...). */
export const parseTrackBody = (raw: string): TrackPayload | null => {
  if (!raw || new TextEncoder().encode(raw).length > MAX_TRACK_BODY_BYTES) return null
  try {
    const parsed = trackSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

// Rastreadores y herramientas automáticas comunes. Sin user agent también se trata como bot (los
// navegadores siempre lo envían). El user agent nunca se guarda.
const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|facebookexternalhit|embedly|preview|monitor|uptime|pingdom|python-requests|curl\/|wget|httpclient|go-http-client|axios|node-fetch|java\/|phantomjs|puppeteer|playwright/i

export const isKnownBot = (userAgent: string | undefined): boolean =>
  !userAgent || BOT_PATTERN.test(userAgent)

/** Sal aleatoria por proceso: la clave del límite no se puede reconstruir fuera de él. */
const PROCESS_SALT = randomBytes(16)

/** HMAC de la IP (nunca la IP en claro) para usarla como clave del límite de frecuencia. */
export const hashIp = (ip: string, salt: Uint8Array = PROCESS_SALT): string =>
  createHmac('sha256', salt).update(ip).digest('hex')

/** 30 eventos por minuto y por IP. */
export const TRACK_RATE = { max: 30, windowMs: 60_000 } as const

/* eslint-disable no-unused-vars */
export type TrackClient = {
  configured: boolean
  post: (
    path: string,
    body: unknown,
    headers?: Record<string, string>
  ) => Promise<ApiPostResult<unknown>>
}
/* eslint-enable no-unused-vars */

/**
 * Reenvía el clic a la API. Nunca lanza ni reintenta: el conteo es de mejor esfuerzo. Devuelve si la API
 * lo aceptó (204) para poder probarlo; el llamador responde 204 igualmente.
 */
export const forwardTrack = async (
  client: TrackClient,
  payload: TrackPayload,
  intakeKey: string
): Promise<boolean> => {
  if (!client.configured || !intakeKey) return false
  try {
    const result = await client.post('/api/intake/events', payload, { 'x-intake-key': intakeKey })
    return result.status === 204
  } catch {
    return false
  }
}
