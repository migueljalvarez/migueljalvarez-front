import { createPublicApiClient } from '../utils/publicApiClient'
import { createRateLimiter } from '../utils/rateLimit'
import {
  forwardTrack,
  hashIp,
  isKnownBot,
  MAX_TRACK_BODY_BYTES,
  parseTrackBody,
  TRACK_RATE
} from '../utils/track'

const limiter = createRateLimiter({ ...TRACK_RATE, maxKeys: 5000 })

/**
 * Conteo anónimo de clics. Es de mejor esfuerzo: salvo cuerpo inválido (400), demasiado grande (413) o
 * exceso de frecuencia (429), siempre responde 204, tanto si registra como si ignora (bot) o si la API no está configurada, falla o tarda más de 2 s. Nunca registra datos ni
 * errores internos.
 */
export default defineEventHandler(async event => {
  const done = () => {
    setResponseStatus(event, 204)
    return null
  }

  // Rastreadores conocidos: se ignoran sin guardar el user agent.
  if (isKnownBot(getRequestHeader(event, 'user-agent'))) return done()

  const declared = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (declared > MAX_TRACK_BODY_BYTES) throw createError({ statusCode: 413 })
  const raw = (await readRawBody(event, 'utf8')) ?? ''
  if (raw.length > MAX_TRACK_BODY_BYTES) throw createError({ statusCode: 413 })

  // La clave del límite es un HMAC de la IP con una sal por proceso: la IP no se guarda.
  if (limiter.isLimited(hashIp(getClientIp(event)))) throw createError({ statusCode: 429 })

  const payload = parseTrackBody(raw)
  if (!payload) throw createError({ statusCode: 400, statusMessage: 'Solicitud no válida' })

  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)
  const client = createPublicApiClient({
    baseUrl: getServerSecret('apiBaseUrl', event),
    timeoutMs: 2000,
    headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
  })
  await forwardTrack(client, payload, getServerSecret('intakeApiKey', event))
  return done()
})
