import type { H3Event } from 'h3'
import type { FeedbackQuery } from '../../utils/despensa'
import { callDespensa, normalizeDespensaBase, type DespensaPath } from './despensa'
import { proxyAdminRequest } from './adminProxy'

/**
 * Comprobaciones comunes de las rutas `/api/admin/despensa/*`: sesión de administrador y llamada a Mi Despensa
 * (o a los datos simulados en desarrollo). Nunca devuelve ni registra la llave.
 */

/** Exige una sesión de administrador válida (se comprueba en la API propia con la cookie del panel). */
export const requireAdminSession = async (event: H3Event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)
  const reply = await proxyAdminRequest(
    {
      baseUrl: getServerSecret('apiBaseUrl', event),
      headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
    },
    {
      method: 'GET',
      segments: ['session'],
      cookie: getRequestHeader(event, 'cookie'),
      clientIp: getClientIp(event),
      userAgent: getRequestHeader(event, 'user-agent')
    }
  )
  if (reply.status === 401 || reply.status === 403) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Tu sesión terminó. Inicia sesión de nuevo.'
    })
  }
  if (reply.status !== 200) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'El panel no puede conectarse con el servidor ahora. Inténtalo de nuevo.'
    })
  }
}

/**
 * Llama a Mi Despensa. En DESARROLLO, sin variables configuradas (o con `MI_DESPENSA_MOCK=true`), responde con datos
 * simulados y `simulated: true`; en producción esa rama no existe y sin configuración devuelve el error `config`.
 */
export const callDespensaFromEvent = async (
  event: H3Event,
  path: DespensaPath,
  query: FeedbackQuery | undefined
) => {
  const rawUrl = getServerSecret('miDespensaApiUrl', event)
  const adminKey = getServerSecret('miDespensaAdminKey', event)

  if (import.meta.dev && (process.env.MI_DESPENSA_MOCK === 'true' || !rawUrl || !adminKey)) {
    const mock = await import('./despensaMock')
    return {
      simulated: true,
      result: {
        ok: true as const,
        data:
          path === '/ping' ? mock.simulatedPing() : mock.simulatedFeedback(query as FeedbackQuery)
      }
    }
  }

  const result = await callDespensa(
    { baseUrl: normalizeDespensaBase(rawUrl) ?? '', adminKey },
    path,
    query
  )
  return { simulated: false, result }
}
