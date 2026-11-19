import type { RatePayload, RateRecord } from '~/utils/admin/rates'

/** Tarifas privadas del panel. Todo el acceso pasa por el proxy de `useAdminApi`. */
export const useAdminRates = () => {
  const api = useAdminApi()
  return {
    list: (query: { limit: number; offset: number }) =>
      api.get<{ items: RateRecord[]; total: number }>('rates', query),
    create: (payload: RatePayload) => api.post<RateRecord>('rates', payload),
    update: (id: string, payload: RatePayload) => api.patch<RateRecord>(`rates/${id}`, payload),
    remove: (id: string) => api.del(`rates/${id}`)
  }
}
