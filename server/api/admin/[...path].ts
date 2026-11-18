/**
 * Proxy del panel hacia la API (ver server/utils/adminProxy.ts). Toda la autenticación (contraseña,
 * segundo factor, sesión) la resuelve la API; el sitio solo reenvía y mantiene la cookie del mismo origen.
 */
import { proxyAdminRequest } from '../../utils/adminProxy'

const MAX_BODY_BYTES = 1024 * 1024

export default defineEventHandler(async event => {
  const method = event.method

  // Defensa CSRF adicional (la cookie ya es SameSite=Lax): las operaciones que modifican datos solo se
  // aceptan desde el propio sitio.
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = getRequestHeader(event, 'origin')
    const allowed = new Set([
      getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin,
      String(useRuntimeConfig(event).public.baseUrl || '').replace(/\/+$/, '')
    ])
    if (origin && !allowed.has(origin)) {
      throw createError({ statusCode: 403, statusMessage: 'Origen no permitido' })
    }
  }

  let body: string | undefined
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    body = (await readRawBody(event, 'utf8')) || undefined
    if (body && Buffer.byteLength(body) > MAX_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: 'Cuerpo demasiado grande' })
    }
  }

  const id = getServerSecret('apiAccessClientId', event)
  const secret = getServerSecret('apiAccessClientSecret', event)

  const result = await proxyAdminRequest(
    {
      baseUrl: getServerSecret('apiBaseUrl', event),
      headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
    },
    {
      method,
      segments: (event.context.params?.path ?? '').split('/').filter(Boolean),
      query: getQuery(event) as Record<string, string | string[] | undefined>,
      body,
      cookie: getRequestHeader(event, 'cookie'),
      clientIp: getClientIp(event),
      userAgent: getRequestHeader(event, 'user-agent')
    }
  )

  // El panel nunca se guarda en cachés intermedias ni del navegador.
  setResponseHeader(event, 'Cache-Control', 'no-store')
  for (const cookie of result.setCookies) appendResponseHeader(event, 'set-cookie', cookie)
  setResponseStatus(event, result.status)
  setResponseHeader(event, 'Content-Type', result.contentType)
  return result.status === 204 ? null : result.body
})
