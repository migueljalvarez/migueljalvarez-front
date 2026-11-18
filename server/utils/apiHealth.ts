/**
 * Estado de salud de la API para el modo mantenimiento. Puro (sin Nitro) para poder probarlo.
 *
 * - Sin API configurada (desarrollo, previews) el sitio se considera disponible: usa su contenido de respaldo.
 * - Con API configurada, el resultado se guarda unos segundos para no sumar una petición por visita;
 *   un "caída" se guarda menos tiempo para recuperarse rápido.
 * - Peticiones simultáneas comparten una sola comprobación.
 */
export type ApiHealthOptions = {
  baseUrl: string
  headers?: Record<string, string>
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

export const checkApi = async (options: ApiHealthOptions): Promise<boolean> => {
  const base = options.baseUrl.trim().replace(/\/+$/, '')
  if (!base) return true
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await (options.fetchImpl ?? fetch)(`${base}/api/health`, {
        headers: { accept: 'application/json', ...options.headers },
        signal: AbortSignal.timeout(options.timeoutMs ?? 2000),
        redirect: 'manual'
      })
      if (response.ok) return true
    } catch {
      // se reintenta una vez antes de dar la API por caída
    }
  }
  return false
}

export type ApiHealthMonitorOptions = {
  check: () => Promise<boolean>
  upTtlMs?: number
  downTtlMs?: number
  now?: () => number
}

export const createApiHealthMonitor = (options: ApiHealthMonitorOptions) => {
  const now = options.now ?? Date.now
  const upTtl = options.upTtlMs ?? 15_000
  const downTtl = options.downTtlMs ?? 5_000
  let last: { up: boolean; at: number } | null = null
  let pending: Promise<boolean> | null = null

  return {
    async isUp(): Promise<boolean> {
      if (last && now() - last.at < (last.up ? upTtl : downTtl)) return last.up
      pending ??= options
        .check()
        .catch(() => false)
        .then(up => {
          last = { up, at: now() }
          return up
        })
        .finally(() => {
          pending = null
        })
      return pending
    }
  }
}

/** Solo las páginas (HTML) pasan por la comprobación; API, estáticos y rutas técnicas, no. */
export const needsHealthCheck = (method: string, path: string, accept: string): boolean => {
  if (method !== 'GET' && method !== 'HEAD') return false
  if (!accept.includes('text/html')) return false
  if (/^\/(api|_nuxt|__nuxt|_ipx|_fonts|__nuxt_error)(\/|$)/.test(path)) return false
  if (path === '/robots.txt' || path === '/sitemap.xml') return false
  return !/\.[a-z0-9]{2,5}$/i.test(path)
}
