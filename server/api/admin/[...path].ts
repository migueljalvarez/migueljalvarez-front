/**
 * Proxy del panel hacia la API (ver server/utils/adminProxy.ts). Toda la autenticación (contraseña,
 * segundo factor, sesión) la resuelve la API; el sitio solo reenvía y mantiene la cookie del mismo origen.
 */
import {
  isMultipartType,
  MAX_JSON_BYTES,
  MAX_UPLOAD_BYTES,
  proxyAdminRequest
} from '../../utils/adminProxy'

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

  const contentType = getRequestHeader(event, 'content-type')
  let body: string | Uint8Array | undefined
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    if (isMultipartType(contentType)) {
      // Subida de imagen: se lee como bytes, con tope. Exigir Content-Length evita leer un cuerpo sin límite.
      const length = Number(getRequestHeader(event, 'content-length'))
      if (!Number.isFinite(length) || length <= 0) {
        throw createError({ statusCode: 411, statusMessage: 'Se requiere Content-Length' })
      }
      if (length > MAX_UPLOAD_BYTES) {
        throw createError({ statusCode: 413, statusMessage: 'Cuerpo demasiado grande' })
      }
      body = (await readRawBody(event, false)) || undefined
      if (body && body.byteLength > MAX_UPLOAD_BYTES) {
        throw createError({ statusCode: 413, statusMessage: 'Cuerpo demasiado grande' })
      }
    } else {
      const text = (await readRawBody(event, 'utf8')) || undefined
      if (text && Buffer.byteLength(text) > MAX_JSON_BYTES) {
        throw createError({ statusCode: 413, statusMessage: 'Cuerpo demasiado grande' })
      }
      body = text
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
      contentType,
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
