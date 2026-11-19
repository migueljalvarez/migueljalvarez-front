/**
 * Errores de la API del panel, normalizados para la interfaz. Puro (sin Nuxt) para poder probarlo.
 * La API responde con `{ statusCode, statusMessage, message }`; el mensaje de la API ya está en español
 * y es específico en las validaciones (400/409), así que se muestra tal cual en esos casos.
 */
export class AdminApiError extends Error {
  readonly status: number
  /** Mensaje original de la API (ya en español), aunque `message` sea genérico; no se muestra tal cual. */
  readonly detail?: string

  constructor(status: number, message: string, detail?: string) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.detail = detail
  }
}

const GENERIC: Record<number, string> = {
  401: 'Tu sesión terminó. Inicia sesión de nuevo.',
  403: 'No tienes permiso para esta acción.',
  404: 'No encontramos lo que buscas. Puede que ya se haya eliminado.',
  413: 'El contenido es demasiado grande.',
  429: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  503: 'El panel no puede conectarse con el servidor ahora. Inténtalo de nuevo en unos minutos.'
}

const FALLBACK = 'Algo salió mal. Inténtalo de nuevo.'

type FetchErrorLike = {
  statusCode?: number
  status?: number
  data?: { message?: unknown } | null
  message?: string
}

const text = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    const joined = value.filter(item => typeof item === 'string').join(' · ')
    return joined || undefined
  }
  return undefined
}

/**
 * Convierte el error de `$fetch` en un `AdminApiError` con un mensaje apto para la persona.
 * - 400 / 409 / 422: mensaje específico de la API (qué campo o regla falló).
 * - 5xx y sin respuesta: mensaje genérico (nunca detalles internos).
 */
export const toAdminApiError = (error: unknown): AdminApiError => {
  if (error instanceof AdminApiError) return error

  const source = (error ?? {}) as FetchErrorLike
  const status = source.statusCode ?? source.status ?? 0
  const apiMessage = text(source.data?.message)

  if ((status === 400 || status === 409 || status === 422) && apiMessage) {
    return new AdminApiError(status, apiMessage)
  }
  if (status >= 500 && status !== 503) return new AdminApiError(status, FALLBACK, apiMessage)
  if (status === 0) return new AdminApiError(0, GENERIC[503])
  return new AdminApiError(status, GENERIC[status] ?? FALLBACK, apiMessage)
}
