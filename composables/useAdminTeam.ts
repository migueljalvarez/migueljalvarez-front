import type {
  AssignmentHoursPayload,
  AssignmentPayload,
  AssignmentRecord,
  MemberPayload,
  PaymentPayload,
  PaymentRecord,
  TeamMemberRecord,
  TimeEntryCreated,
  TimeEntryPayload,
  TimeEntryRecord,
  TrmPayload,
  TrmRecord
} from '~/utils/admin/team'

type Page<T> = { items: T[]; total: number }

/**
 * Acceso a Equipo y pagos del panel (API `/api/admin/team`, `/assignments`, `/time-entries`,
 * `/payments` y `/trm`). Todo pasa por `useAdminApi`.
 */
export const useAdminTeam = () => {
  const api = useAdminApi()
  // La API devuelve como máximo 100 por página; el panel carga la primera (los más recientes).
  const first = { limit: 100, offset: 0 }

  return {
    listMembers: (query = first) => api.get<Page<TeamMemberRecord>>('team', query),
    createMember: (payload: MemberPayload) => api.post<TeamMemberRecord>('team', payload),
    updateMember: (id: string, payload: Partial<MemberPayload>) =>
      api.patch<TeamMemberRecord>(`team/${id}`, payload),
    removeMember: (id: string) => api.del(`team/${id}`),

    listAssignments: () => api.get<Page<AssignmentRecord>>('assignments', first),
    createAssignment: (payload: AssignmentPayload) =>
      api.post<AssignmentRecord>('assignments', payload),
    updateAssignment: (id: string, payload: AssignmentHoursPayload) =>
      api.patch<AssignmentRecord>(`assignments/${id}`, payload),
    removeAssignment: (id: string) => api.del(`assignments/${id}`),

    listTimeEntries: () => api.get<Page<TimeEntryRecord>>('time-entries', first),
    createTimeEntry: (payload: TimeEntryPayload) =>
      api.post<TimeEntryCreated>('time-entries', payload),
    removeTimeEntry: (id: string) => api.del(`time-entries/${id}`),

    listPayments: () => api.get<Page<PaymentRecord>>('payments', first),
    createPayment: (payload: PaymentPayload) => api.post<PaymentRecord>('payments', payload),

    getTrm: () => api.get<TrmRecord>('trm'),
    setTrm: (payload: TrmPayload) => api.put<TrmRecord>('trm', payload)
  }
}
