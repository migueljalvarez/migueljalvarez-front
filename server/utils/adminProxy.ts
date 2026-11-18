import { normalizeBaseUrl } from './publicApiClient.ts'

/**
 * Proxy del panel hacia la API (`/api/admin/**` del sitio → `/api/admin/**` de migueljalvarez-api).
 * El navegador solo habla con el sitio (mismo origen): la cookie de sesión es del sitio, no hay CORS y
 * las credenciales de servicio de Cloudflare Access nunca salen del servidor. Es puro (sin Nitro) para
 * poder probarlo.
 *
 * Seguridad:
 * - Solo se aceptan métodos y segmentos de ruta conocidos: la ruta del navegador nunca puede salir del
 *   prefijo `/api/admin/` de la API (sin `..`, sin barras, sin esquemas).
 * - Solo viaja la cookie `admin_session` (no se reenvían las demás cookies del sitio).
 * - La IP real del visitante se envía en `x-client-ip` (la API la usa para limitar intentos).
 */
export const ALLOWED_METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] as const
export type AdminProxyMethod = (typeof ALLOWED_METHODS)[number]

export const SESSION_COOKIE = 'admin_session'
const SEGMENT = /^[A-Za-z0-9._~-]{1,100}$/
const MAX_USER_AGENT = 300

export type AdminProxyOptions = {
  baseUrl: string
  timeoutMs?: number
  /** Cabeceras fijas (p. ej. credenciales de servicio de Cloudflare Access). */
  headers?: Record<string, string>
  fetchImpl?: typeof fetch
}

export type AdminProxyRequest = {
  method: string
  segments: string[]
  query?: Record<string, string | string[] | undefined>
  /** Cuerpo JSON ya leído (texto). */
  body?: string
  /** Cabecera `cookie` completa de la petición del navegador. */
  cookie?: string
  clientIp: string
  userAgent?: string
}

export type AdminProxyResponse = {
  status: number
  body: string
  contentType: string
  setCookies: string[]
}

const jsonError = (status: number, statusMessage: string, message: string): AdminProxyResponse => ({
  status,
  contentType: 'application/json',
  setCookies: [],
  body: JSON.stringify({ statusCode: status, statusMessage, message })
})

/** Valor de la cookie de sesión dentro de una cabecera `cookie`, o `undefined`. */
export const extractSessionCookie = (header: string | undefined): string | undefined => {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === SESSION_COOKIE) return rest.join('=') || undefined
  }
  return undefined
}

export const isSafeSegments = (segments: string[]): boolean =>
  segments.length > 0 && segments.every(segment => SEGMENT.test(segment) && segment !== '..')

export const proxyAdminRequest = async (
  options: AdminProxyOptions,
  request: AdminProxyRequest
): Promise<AdminProxyResponse> => {
  const baseUrl = normalizeBaseUrl(options.baseUrl)
  if (!baseUrl) {
    return jsonError(503, 'Service Unavailable', 'El panel no está conectado a la API.')
  }

  const method = request.method.toUpperCase()
  if (!(ALLOWED_METHODS as readonly string[]).includes(method)) {
    return jsonError(405, 'Method Not Allowed', 'Método no permitido.')
  }
  if (!isSafeSegments(request.segments)) {
    return jsonError(404, 'Not Found', 'Recurso no encontrado.')
  }

  const url = new URL(`${baseUrl}/api/admin/${request.segments.join('/')}`)
  for (const [key, value] of Object.entries(request.query ?? {})) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      url.searchParams.append(key, item)
    }
  }

  const session = extractSessionCookie(request.cookie)
  const headers: Record<string, string> = {
    accept: 'application/json',
    'x-client-ip': request.clientIp.slice(0, 64),
    ...(request.userAgent ? { 'user-agent': request.userAgent.slice(0, MAX_USER_AGENT) } : {}),
    ...(session ? { cookie: `${SESSION_COOKIE}=${session}` } : {}),
    ...(request.body ? { 'content-type': 'application/json' } : {}),
    ...options.headers
  }

  try {
    const response = await (options.fetchImpl ?? fetch)(url, {
      method,
      headers,
      body: request.body || undefined,
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
      redirect: 'manual'
    })
    return {
      status: response.status,
      contentType: response.headers.get('content-type') ?? 'application/json',
      setCookies: response.headers.getSetCookie?.() ?? [],
      body: await response.text()
    }
  } catch {
    return jsonError(
      503,
      'Service Unavailable',
      'El servicio no está disponible. Inténtalo de nuevo en unos minutos.'
    )
  }
}
