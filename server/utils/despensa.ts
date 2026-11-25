/**
 * Cliente de la API de administración de Mi Despensa (solo lectura). Puro (sin Nitro) para poder probarlo.
 *
 * Seguridad:
 * - La llave (`x-admin-key`) solo existe en el servidor: viene de una variable de entorno, viaja únicamente en
 *   la cabecera hacia esa API y nunca se escribe en respuestas, mensajes de error ni registros.
 * - No sigue redirecciones (la llave no debe acompañar a una petición a otro destino) y acepta solo https
 *   (http solo hacia localhost, para pruebas).
 * - Las rutas son fijas: el navegador no puede elegir a qué punto de la API se llama.
 */
export type DespensaPath = '/ping' | '/feedback'

export type DespensaFailureCode = 'config' | 'key' | 'off' | 'rate' | 'bad' | 'down'

export type DespensaFailure = {
  ok: false
  code: DespensaFailureCode
  /** Estado HTTP con el que responde el sitio. 401 se evita a propósito: el panel lo toma por sesión vencida. */
  httpStatus: number
  message: string
}

export type DespensaResult = { ok: true; data: unknown } | DespensaFailure

export const FAILURES: Record<DespensaFailureCode, Omit<DespensaFailure, 'ok' | 'code'>> = {
  config: {
    httpStatus: 503,
    message:
      'Falta configurar la conexión con Mi Despensa en el servidor (MI_DESPENSA_API_URL y MI_DESPENSA_ADMIN_KEY).'
  },
  key: {
    httpStatus: 502,
    message:
      'Mi Despensa rechazó la llave: no coincide con la que tiene su servidor (ADMIN_API_KEY). Revisa MI_DESPENSA_ADMIN_KEY.'
  },
  off: {
    httpStatus: 502,
    message:
      'La API de administración de Mi Despensa está apagada o la dirección es incorrecta. Si es nueva, comprueba que su servidor ya tiene ADMIN_API_KEY.'
  },
  rate: {
    httpStatus: 429,
    message:
      'Demasiadas consultas seguidas a Mi Despensa (máximo 30 por minuto). Espera un momento.'
  },
  bad: { httpStatus: 400, message: 'Mi Despensa no aceptó el filtro o la paginación.' },
  down: {
    httpStatus: 503,
    message: 'No se pudo conectar con Mi Despensa. Inténtalo de nuevo en un momento.'
  }
}

const failure = (code: DespensaFailureCode): DespensaFailure => ({
  ok: false,
  code,
  ...FAILURES[code]
})

/** Estado de la API de Mi Despensa → error del panel. */
export const failureFromStatus = (status: number): DespensaFailure => {
  if (status === 401 || status === 403) return failure('key')
  if (status === 404) return failure('off')
  if (status === 429) return failure('rate')
  if (status === 400) return failure('bad')
  return failure('down')
}

/**
 * Normaliza la dirección configurada. Acepta el servidor (`https://api-despensa-dev.micomodoro.com`) o la base
 * completa (`…/api/v1/admin`) y devuelve siempre la base completa, sin barra final; `null` si no es válida.
 */
export const normalizeDespensaBase = (raw: string): string | null => {
  const text = (raw ?? '').trim()
  if (!text) return null
  let url: URL
  try {
    url = new URL(text)
  } catch {
    return null
  }
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) return null
  if (url.username || url.password) return null
  const path = url.pathname.replace(/\/+$/, '')
  return `${url.origin}${path.endsWith('/api/v1/admin') ? path : `${path}/api/v1/admin`}`
}

export type DespensaClientOptions = {
  baseUrl: string
  adminKey: string
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

export const callDespensa = async (
  options: DespensaClientOptions,
  path: DespensaPath,
  query: Record<string, string | number | undefined> = {}
): Promise<DespensaResult> => {
  const base = normalizeDespensaBase(options.baseUrl)
  if (!base || !options.adminKey) return failure('config')

  const url = new URL(`${base}${path}`)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  try {
    const response = await (options.fetchImpl ?? fetch)(url, {
      method: 'GET',
      headers: { 'x-admin-key': options.adminKey, accept: 'application/json' },
      redirect: 'error',
      signal: AbortSignal.timeout(options.timeoutMs ?? 8000)
    })
    if (response.status !== 200) return failureFromStatus(response.status)
    const body = (await response.json()) as { success?: unknown; data?: unknown } | null
    if (!body || body.success !== true) return failure('down')
    return { ok: true, data: body.data }
  } catch {
    // Red, tiempo agotado, redirección o cuerpo que no es JSON: nunca se muestra el detalle (podría nombrar la URL).
    return failure('down')
  }
}
