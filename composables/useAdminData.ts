import { ADMIN_API_CONNECTED } from '~/constants/admin'
import { buildSampleData, USE_ADMIN_SAMPLES } from '~/constants/admin.samples'
import type {
  AdminData,
  Assignment,
  Experience,
  Payment,
  Rate,
  TeamMember,
  TestimonialRequest,
  TestimonialRequestStatus,
  TimeEntry
} from '~/types/admin'

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const today = () => new Date().toISOString().slice(0, 10)

/**
 * Capa de datos en memoria de los módulos del panel que aún no hablan con la API (testimonios, equipo,
 * tarifas, experiencia). Leads, clientes y proyectos ya usan la API: `useAdminLeads` y `useAdminProjects`.
 * HOY guarda en memoria (se pierde al recargar) y solo se puede escribir en
 * desarrollo con datos de ejemplo. Cuando exista la API, solo cambia el interior de estas funciones
 * (cada acción pasará a llamar a un endpoint documentado en docs/openapi.yaml); las pantallas no cambian.
 */
export const useAdminData = () => {
  const data = useState<AdminData>('admin-data', () => buildSampleData())

  /** ¿Se pueden guardar cambios? (en producción, solo cuando la API esté conectada). */
  const canWrite = USE_ADMIN_SAMPLES || ADMIN_API_CONNECTED
  const persistence: 'memoria' | 'api' | 'ninguna' = ADMIN_API_CONNECTED
    ? 'api'
    : USE_ADMIN_SAMPLES
      ? 'memoria'
      : 'ninguna'

  // --- Testimonios
  const addTestimonialRequest = (
    input: Pick<TestimonialRequest, 'clientName' | 'email' | 'projectName' | 'message'>
  ) => {
    const request: TestimonialRequest = {
      ...input,
      id: newId(),
      status: 'enviada',
      createdAt: today()
    }
    data.value.testimonials.unshift(request)
    return request
  }
  const setTestimonialStatus = (id: string, status: TestimonialRequestStatus) => {
    const item = data.value.testimonials.find(entry => entry.id === id)
    if (item) item.status = status
  }

  // --- Equipo, horas y pagos
  const addMember = (input: Omit<TeamMember, 'id'>) => {
    const member = { ...input, id: newId() }
    data.value.team.push(member)
    return member
  }
  const addAssignment = (input: Omit<Assignment, 'id'>) => {
    data.value.assignments.push({ ...input, id: newId() })
  }
  const addTimeEntry = (input: Omit<TimeEntry, 'id'>) => {
    data.value.timeEntries.unshift({ ...input, id: newId() })
  }
  const addPayment = (input: Omit<Payment, 'id'>) => {
    data.value.payments.unshift({ ...input, id: newId() })
  }

  // --- Tarifas
  const addRate = (input: Omit<Rate, 'id'>) => {
    data.value.rates.push({ ...input, id: newId() })
  }
  const removeRate = (id: string) => {
    data.value.rates = data.value.rates.filter(item => item.id !== id)
  }

  // --- Experiencia
  const addExperience = (input: Omit<Experience, 'id'>) => {
    data.value.experiences.unshift({ ...input, id: newId() })
  }
  const removeExperience = (id: string) => {
    data.value.experiences = data.value.experiences.filter(item => item.id !== id)
  }

  // --- Cálculos de apoyo
  const memberName = (id: string) => data.value.team.find(item => item.id === id)?.name ?? '—'
  const projectName = (id: string) => data.value.projects.find(item => item.id === id)?.name ?? '—'

  const hoursByProject = (projectId: string) =>
    data.value.timeEntries
      .filter(entry => entry.projectId === projectId)
      .reduce((sum, entry) => sum + entry.hours, 0)

  /** Saldo por pagar a un colaborador en USD: horas × tarifa − pagos registrados. */
  const memberBalance = (memberId: string) => {
    const member = data.value.team.find(item => item.id === memberId)
    if (!member) return { earned: 0, paid: 0, due: 0, hours: 0 }
    const hours = data.value.timeEntries
      .filter(entry => entry.memberId === memberId)
      .reduce((sum, entry) => sum + entry.hours, 0)
    const earned = hours * member.rateUsd
    const paid = data.value.payments
      .filter(payment => payment.memberId === memberId)
      .reduce((sum, payment) => sum + payment.amountUsd, 0)
    return { earned, paid, due: Math.max(earned - paid, 0), hours }
  }

  return {
    data,
    canWrite,
    persistence,
    addTestimonialRequest,
    setTestimonialStatus,
    addMember,
    addAssignment,
    addTimeEntry,
    addPayment,
    addRate,
    removeRate,
    addExperience,
    removeExperience,
    memberName,
    projectName,
    hoursByProject,
    memberBalance
  }
}
