import { ADMIN_API_CONNECTED } from '~/constants/admin'
import { buildSampleData, USE_ADMIN_SAMPLES } from '~/constants/admin.samples'
import type { LeadStatus } from '~/constants/admin'
import type {
  AdminData,
  Assignment,
  Client,
  Experience,
  Lead,
  Payment,
  Policy,
  Project,
  Rate,
  TeamMember,
  TestimonialRequest,
  TestimonialRequestStatus,
  TimeEntry
} from '~/types/admin'

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const today = () => new Date().toISOString().slice(0, 10)

/**
 * Capa de datos del panel. HOY guarda en memoria (se pierde al recargar) y solo se puede escribir en
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

  // --- Leads
  const addLead = (input: Omit<Lead, 'id' | 'status' | 'lostReason' | 'createdAt' | 'notes'>) => {
    const lead: Lead = {
      ...input,
      id: newId(),
      status: 'nuevo',
      lostReason: '',
      createdAt: today(),
      notes: []
    }
    data.value.leads.unshift(lead)
    return lead
  }
  const setLeadStatus = (id: string, status: LeadStatus, lostReason = '') => {
    const lead = data.value.leads.find(item => item.id === id)
    if (!lead) return
    lead.status = status
    lead.lostReason = status === 'perdido' ? lostReason : ''
  }
  const updateLeadAction = (id: string, nextAction: string, nextActionDate: string) => {
    const lead = data.value.leads.find(item => item.id === id)
    if (lead) Object.assign(lead, { nextAction, nextActionDate })
  }
  const addLeadNote = (id: string, text: string) => {
    data.value.leads.find(item => item.id === id)?.notes.unshift({ id: newId(), text, at: today() })
  }
  const removeLead = (id: string) => {
    data.value.leads = data.value.leads.filter(item => item.id !== id)
  }

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

  // --- Clientes y proyectos
  const addClient = (input: Omit<Client, 'id'>) => {
    const client = { ...input, id: newId() }
    data.value.clients.push(client)
    return client
  }
  const addProject = (input: Omit<Project, 'id'>) => {
    const project = { ...input, id: newId() }
    data.value.projects.unshift(project)
    return project
  }
  const setProjectStatus = (id: string, status: string) => {
    const project = data.value.projects.find(item => item.id === id)
    if (project) project.status = status
  }
  const removeProject = (id: string) => {
    data.value.projects = data.value.projects.filter(item => item.id !== id)
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

  // --- Políticas y tarifas
  const addRate = (input: Omit<Rate, 'id'>) => {
    data.value.rates.push({ ...input, id: newId() })
  }
  const removeRate = (id: string) => {
    data.value.rates = data.value.rates.filter(item => item.id !== id)
  }
  const addPolicy = (input: Omit<Policy, 'id'>) => {
    data.value.policies.push({ ...input, id: newId() })
  }
  const togglePolicyPublic = (id: string) => {
    const policy = data.value.policies.find(item => item.id === id)
    if (policy) policy.isPublic = !policy.isPublic
  }
  const removePolicy = (id: string) => {
    data.value.policies = data.value.policies.filter(item => item.id !== id)
  }

  // --- Experiencia
  const addExperience = (input: Omit<Experience, 'id'>) => {
    data.value.experiences.unshift({ ...input, id: newId() })
  }
  const removeExperience = (id: string) => {
    data.value.experiences = data.value.experiences.filter(item => item.id !== id)
  }

  // --- Cálculos de apoyo
  const clientName = (id: string) => data.value.clients.find(item => item.id === id)?.name ?? '—'
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
    addLead,
    setLeadStatus,
    updateLeadAction,
    addLeadNote,
    removeLead,
    addTestimonialRequest,
    setTestimonialStatus,
    addClient,
    addProject,
    setProjectStatus,
    removeProject,
    addMember,
    addAssignment,
    addTimeEntry,
    addPayment,
    addRate,
    removeRate,
    addPolicy,
    togglePolicyPublic,
    removePolicy,
    addExperience,
    removeExperience,
    clientName,
    memberName,
    projectName,
    hoursByProject,
    memberBalance
  }
}
