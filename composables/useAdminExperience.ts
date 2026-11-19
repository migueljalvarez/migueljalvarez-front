import type { ExperiencePayload, ExperienceRecord } from '~/utils/admin/experience'

/** Experiencia privada del panel. Nunca se consume desde páginas públicas. */
export const useAdminExperience = () => {
  const api = useAdminApi()
  return {
    list: (query: { limit: number; offset: number }) =>
      api.get<{ items: ExperienceRecord[]; total: number }>('experience', query),
    create: (payload: ExperiencePayload) => api.post<ExperienceRecord>('experience', payload),
    update: (id: string, payload: ExperiencePayload) =>
      api.patch<ExperienceRecord>(`experience/${id}`, payload),
    remove: (id: string) => api.del(`experience/${id}`),
    reorder: (id: string, sortOrder: number) =>
      api.patch<ExperienceRecord>(`experience/${id}`, { sortOrder })
  }
}
