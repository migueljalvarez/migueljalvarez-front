import type { LeadDetailRecord, LeadNoteRecord, LeadPayload, LeadRecord } from '~/utils/admin/leads'

/** Acceso a los leads del panel (API `/api/admin/leads`). Todo pasa por `useAdminApi`. */
export const useAdminLeads = () => {
  const api = useAdminApi()

  return {
    // La API devuelve como máximo 100 por página; el panel carga la primera (los más recientes).
    list: (query: { limit: number; offset: number; status?: string } = { limit: 100, offset: 0 }) =>
      api.get<{ items: LeadRecord[]; total: number }>('leads', query),
    get: (id: string) => api.get<LeadDetailRecord>(`leads/${id}`),
    create: (payload: LeadPayload) => api.post<LeadRecord>('leads', payload),
    update: (
      id: string,
      payload: Partial<LeadPayload> & Partial<Pick<LeadRecord, 'status' | 'lostReason'>>
    ) => api.patch<LeadRecord>(`leads/${id}`, payload),
    addNote: (id: string, text: string) => api.post<LeadNoteRecord>(`leads/${id}/notes`, { text }),
    convert: (id: string) =>
      api.post<{ clientId: string; lead: LeadRecord }>(`leads/${id}/convert`),
    remove: (id: string) => api.del(`leads/${id}`)
  }
}
