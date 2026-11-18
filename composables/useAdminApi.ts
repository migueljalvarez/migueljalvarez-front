import { AdminApiError, toAdminApiError } from '~/utils/adminApiError'

type Query = Record<string, string | number | boolean | undefined>

/**
 * Cliente del panel hacia la API (a través del proxy `/api/admin/**` del sitio). Un único punto de
 * acceso a datos del panel: las pantallas nunca llaman a `$fetch` directamente.
 *
 * - En SSR reenvía la cookie de sesión de la petición (`useRequestFetch`).
 * - Los errores salen como `AdminApiError` con un mensaje listo para mostrar.
 * - Un 401 en el navegador limpia la sesión y lleva a `/login`.
 */
export const useAdminApi = () => {
  const session = useState<{ email: string } | null>('admin-session', () => null)
  const fetcher = import.meta.server ? useRequestFetch() : $fetch

  const request = async <T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    options: { query?: Query; body?: unknown } = {}
  ): Promise<T> => {
    try {
      return (await fetcher(`/api/admin/${path.replace(/^\/+/, '')}`, {
        method,
        query: options.query,
        body: options.body as Record<string, unknown> | undefined
      })) as T
    } catch (error) {
      const apiError = toAdminApiError(error)
      if (apiError.status === 401 && import.meta.client) {
        session.value = null
        await navigateTo('/login')
      }
      throw apiError
    }
  }

  return {
    get: <T>(path: string, query?: Query) => request<T>('GET', path, { query }),
    post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
    patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
    put: <T>(path: string, body?: unknown) => request<T>('PUT', path, { body }),
    del: <T = void>(path: string) => request<T>('DELETE', path)
  }
}

export { AdminApiError }
