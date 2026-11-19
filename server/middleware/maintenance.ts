import { checkApi, createApiHealthMonitor, needsHealthCheck } from '../utils/apiHealth'
import { MAINTENANCE_RETRY_SECONDS, maintenanceHtml } from '../utils/maintenancePage'

/**
 * Modo mantenimiento: antes de renderizar una página se comprueba que la API (que alimenta el contenido
 * del sitio desde el panel) responde. Si está caída, se responde 503 con una página de mantenimiento:
 * los buscadores lo tratan como temporal (Retry-After) y nadie ve contenido de respaldo desactualizado.
 * En desarrollo no hace nada: el sitio usa el contenido de respaldo aunque la API local esté caída.
 * En producción, sin API configurada, tampoco hace nada.
 */
const monitor = createApiHealthMonitor({
  check: () => {
    const id = getServerSecret('apiAccessClientId')
    const secret = getServerSecret('apiAccessClientSecret')
    return checkApi({
      baseUrl: getServerSecret('apiBaseUrl'),
      headers: id && secret ? { 'CF-Access-Client-Id': id, 'CF-Access-Client-Secret': secret } : {}
    })
  }
})

export default defineEventHandler(async event => {
  if (import.meta.dev) return

  const { method, path } = event
  const pathname = path.split('?')[0] ?? '/'
  if (!needsHealthCheck(method, pathname, getRequestHeader(event, 'accept') ?? '')) return
  if (await monitor.isUp()) return

  console.warn('[maintenance] la API no responde; se muestra la página de mantenimiento')
  setResponseStatus(event, 503)
  setResponseHeaders(event, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Retry-After': String(MAINTENANCE_RETRY_SECONDS),
    'X-Robots-Tag': 'noindex, nofollow'
  })
  return maintenanceHtml()
})
