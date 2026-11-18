/**
 * Cliente de solo lectura hacia la API (migueljalvarez-api). Pensado para el servidor del sitio
 * (Nitro): el navegador nunca llama a la API. Es puro (sin Nuxt/Nitro) para poder probarlo.
 *
 * Contrato: `get()` devuelve el JSON o `null` ante CUALQUIER problema (sin configurar, tiempo agotado,
 * error de red, estado distinto de 2xx o JSON inválido). El llamador decide el respaldo: el sitio
 * nunca debe caerse porque la API no responda.
 */
export type PublicApiClientOptions = {
  /** URL base de la API, p. ej. `http://localhost:4000`. Vacía = sin API (siempre `null`). */
  baseUrl: string
  /** Tiempo máximo por petición. */
  timeoutMs?: number
  /** Cabeceras fijas (p. ej. credenciales de servicio de Cloudflare Access). */
  headers?: Record<string, string>
  fetchImpl?: typeof fetch
  /** Para avisar de fallos sin acoplar el cliente a un logger. */
  // eslint-disable-next-line no-unused-vars
  onError?: (path: string, reason: string) => void
}

const DEFAULT_TIMEOUT_MS = 2000

/** Solo se aceptan URLs http(s); cualquier otra cosa se trata como "sin API". */
export const normalizeBaseUrl = (value: string): string | null => {
  const trimmed = value.trim().replace(/\/+$/, '')
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:' ? trimmed : null
  } catch {
    return null
  }
}

export const createPublicApiClient = (options: PublicApiClientOptions) => {
  const baseUrl = normalizeBaseUrl(options.baseUrl)
  const fetchImpl = options.fetchImpl ?? fetch
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS

  return {
    /** ¿Hay una API configurada? */
    configured: baseUrl !== null,

    async get<T>(path: string): Promise<T | null> {
      if (!baseUrl) return null
      try {
        const response = await fetchImpl(`${baseUrl}${path}`, {
          headers: { accept: 'application/json', ...options.headers },
          signal: AbortSignal.timeout(timeoutMs)
        })
        if (!response.ok) {
          options.onError?.(path, `HTTP ${response.status}`)
          return null
        }
        return (await response.json()) as T
      } catch (error) {
        options.onError?.(path, error instanceof Error ? error.name : 'error')
        return null
      }
    }
  }
}
