import { parseClicksSummary, type ClickRange, type ClicksSummary } from '~/utils/admin/analytics'
import { toAdminApiError } from '~/utils/adminApiError'

export type ClicksResult = { summary: ClicksSummary | null; error: string }

/**
 * Clics por botón del Resumen (API `/api/admin/analytics/clicks`, solo agregados). Se carga por separado
 * del resto de indicadores: tiene su propio estado de carga y de error (con reintento).
 */
export const useAdminClicks = (range: Ref<ClickRange>) => {
  const api = useAdminApi()

  return useLazyAsyncData<ClicksResult>(
    'admin-overview-clicks',
    async () => {
      try {
        const data = await api.get<unknown>('analytics/clicks', { range: range.value })
        const summary = parseClicksSummary(data)
        return summary
          ? { summary, error: '' }
          : { summary: null, error: 'La respuesta de la API no tiene el formato esperado.' }
      } catch (error) {
        return { summary: null, error: toAdminApiError(error).message }
      }
    },
    { watch: [range] }
  )
}
