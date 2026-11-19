import type {
  ClientPayload,
  ClientRecord,
  ProjectPayload,
  ProjectRecord
} from '~/utils/admin/projects'

/** Acceso a clientes y proyectos del panel (API `/api/admin/clients` y `/projects`). */
export const useAdminProjects = () => {
  const api = useAdminApi()

  return {
    // La API devuelve como máximo 100 por página; el panel carga la primera.
    listClients: () =>
      api.get<{ items: ClientRecord[]; total: number }>('clients', { limit: 100, offset: 0 }),
    listProjects: (
      query: { limit: number; offset: number; status?: string } = { limit: 100, offset: 0 }
    ) => api.get<{ items: ProjectRecord[]; total: number }>('projects', query),
    createClient: (payload: ClientPayload) => api.post<ClientRecord>('clients', payload),
    updateClient: (id: string, payload: ClientPayload) =>
      api.patch<ClientRecord>(`clients/${id}`, payload),
    removeClient: (id: string) => api.del(`clients/${id}`),
    createProject: (payload: ProjectPayload) => api.post<ProjectRecord>('projects', payload),
    updateProject: (id: string, payload: Partial<ProjectPayload>) =>
      api.patch<ProjectRecord>(`projects/${id}`, payload),
    removeProject: (id: string) => api.del(`projects/${id}`)
  }
}
