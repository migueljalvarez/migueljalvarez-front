import { z } from 'zod'
import { LEAD_STATUSES, type LeadStatus } from '../../constants/admin.ts'
import { zodErrors } from './schemas.ts'

/**
 * Lógica pura (sin Nuxt) de la pantalla de leads del panel. Las reglas repiten las de los DTO de la
 * API (`leads.dto.ts`): lo que aquí es válido, la API lo acepta.
 */

export const LEAD_SUBJECTS = ['desarrollo', 'oferta', 'consulta', 'soporte', 'otro'] as const
export const LEAD_ORIGINS = ['formulario', 'whatsapp', 'linkedin', 'referido', 'otro'] as const

export const LEAD_SUBJECT_LABEL: Record<LeadSubject, string> = {
  desarrollo: 'Construir algo',
  oferta: 'Oferta',
  consulta: 'Decidir antes de invertir',
  soporte: 'Mejorar algo existente',
  otro: 'Otro'
}

export const LEAD_ORIGIN_LABEL: Record<LeadOrigin, string> = {
  formulario: 'Formulario',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  referido: 'Referido',
  otro: 'Otro'
}

export const LEAD_LIMITS = {
  name: 100,
  phone: 30,
  message: 5000,
  nextAction: 200,
  lostReason: 500,
  note: 2000
} as const

export type { LeadStatus }
export type LeadSubject = (typeof LEAD_SUBJECTS)[number]
export type LeadOrigin = (typeof LEAD_ORIGINS)[number]

export type LeadRecord = {
  id: string
  name: string
  email: string
  phone: string
  subject: LeadSubject
  origin: LeadOrigin
  status: LeadStatus
  message: string
  lostReason: string
  nextAction: string
  /** YYYY-MM-DD o cadena vacía. */
  nextActionDate: string
  consentAt: string | null
  consentPolicyVersion: string | null
  clientId: string | null
  createdAt: string
  updatedAt: string
}

export type LeadNoteRecord = { id: string; text: string; at: string }
export type LeadDetailRecord = LeadRecord & { notes: LeadNoteRecord[] }

export const LEAD_SUBJECT_OPTIONS = LEAD_SUBJECTS.map(value => ({
  value,
  label: LEAD_SUBJECT_LABEL[value]
}))
export const LEAD_ORIGIN_OPTIONS = LEAD_ORIGINS.map(value => ({
  value,
  label: LEAD_ORIGIN_LABEL[value]
}))
export const LEAD_STATUS_OPTIONS = LEAD_STATUSES.map(({ value, label }) => ({ value, label }))

// --- Formulario (alta y edición de datos) -------------------------------------------------------

const text = (max: number) =>
  z.string().trim().min(1, 'Obligatorio').max(max, `Máximo ${max} caracteres`)
const optionalText = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`)
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const leadSchema = z.object({
  name: text(LEAD_LIMITS.name),
  email: z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .max(254, 'Máximo 254 caracteres')
    .pipe(z.email('Escribe un correo válido')),
  phone: optionalText(LEAD_LIMITS.phone),
  subject: z.enum(LEAD_SUBJECTS, { message: 'Elige un asunto' }),
  origin: z.enum(LEAD_ORIGINS, { message: 'Elige un origen' }),
  message: optionalText(LEAD_LIMITS.message),
  nextAction: optionalText(LEAD_LIMITS.nextAction),
  nextActionDate: z.string().refine(value => value === '' || DATE_RE.test(value), 'Fecha inválida')
})

export type LeadFormValues = {
  name: string
  email: string
  phone: string
  subject: string
  origin: string
  message: string
  nextAction: string
  nextActionDate: string
}

export type LeadPayload = z.infer<typeof leadSchema>

export const emptyLeadForm = (): LeadFormValues => ({
  name: '',
  email: '',
  phone: '',
  subject: '',
  origin: 'referido',
  message: '',
  nextAction: '',
  nextActionDate: ''
})

export const leadFormFromRecord = (lead: LeadRecord): LeadFormValues => ({
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  subject: lead.subject,
  origin: lead.origin,
  message: lead.message,
  nextAction: lead.nextAction,
  nextActionDate: lead.nextActionDate
})

export type ValidationResult<T> =
  | { ok: true; data: T; errors: Record<string, never> }
  | { ok: false; errors: Record<string, string> }

export const validateLeadForm = (values: LeadFormValues): ValidationResult<LeadPayload> => {
  const result = leadSchema.safeParse(values)
  return result.success
    ? { ok: true, data: result.data, errors: {} }
    : { ok: false, errors: zodErrors(result.error) }
}

// --- Etapa del pipeline ---------------------------------------------------------------------------

export const LOST_REASON_MESSAGE = 'Indica el motivo para marcarlo como perdido'

/** Cuerpo del PATCH al cambiar de etapa. "Perdido" exige un motivo; las demás etapas lo limpian. */
export const buildStagePayload = (
  status: LeadStatus,
  lostReason: string
):
  { ok: true; data: { status: LeadStatus; lostReason: string } } | { ok: false; error: string } => {
  const reason = lostReason.trim()
  if (status === 'perdido') {
    if (!reason) return { ok: false, error: LOST_REASON_MESSAGE }
    if (reason.length > LEAD_LIMITS.lostReason) {
      return { ok: false, error: `Máximo ${LEAD_LIMITS.lostReason} caracteres` }
    }
    return { ok: true, data: { status, lostReason: reason } }
  }
  return { ok: true, data: { status, lostReason: '' } }
}

export const buildActionPayload = (
  nextAction: string,
  nextActionDate: string
):
  | { ok: true; data: { nextAction: string; nextActionDate: string } }
  | { ok: false; error: string } => {
  const action = nextAction.trim()
  if (action.length > LEAD_LIMITS.nextAction) {
    return { ok: false, error: `Máximo ${LEAD_LIMITS.nextAction} caracteres` }
  }
  if (nextActionDate !== '' && !DATE_RE.test(nextActionDate)) {
    return { ok: false, error: 'Fecha inválida' }
  }
  return { ok: true, data: { nextAction: action, nextActionDate } }
}

export const validateNote = (
  value: string
): { ok: true; text: string } | { ok: false; error: string } => {
  const note = value.trim()
  if (!note) return { ok: false, error: 'Escribe la nota' }
  if (note.length > LEAD_LIMITS.note) {
    return { ok: false, error: `Máximo ${LEAD_LIMITS.note} caracteres` }
  }
  return { ok: true, text: note }
}

// --- Lista: filtros, conteos y presentación ------------------------------------------------------

export type LeadFilter = LeadStatus | 'all'

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export const filterLeads = (leads: LeadRecord[], status: LeadFilter, search: string) => {
  const query = normalize(search.trim())
  return leads.filter(
    lead =>
      (status === 'all' || lead.status === status) &&
      (!query ||
        normalize(
          `${lead.name} ${lead.email} ${lead.phone} ${LEAD_SUBJECT_LABEL[lead.subject]}`
        ).includes(query))
  )
}

export const countLeads = (leads: LeadRecord[], status: LeadFilter) =>
  status === 'all' ? leads.length : leads.filter(lead => lead.status === status).length

export type LeadTone = 'success' | 'neutral' | 'warning' | 'info'

const STATUS_TONE: Record<LeadStatus, LeadTone> = {
  nuevo: 'info',
  contactado: 'warning',
  reunion: 'info',
  propuesta: 'warning',
  ganado: 'success',
  perdido: 'neutral'
}

/** Etiqueta de etapa: siempre con texto (el color nunca es lo único que distingue). */
export const leadStatusBadge = (status: LeadStatus): { label: string; tone: LeadTone } => ({
  label: LEAD_STATUSES.find(item => item.value === status)?.label ?? status,
  tone: STATUS_TONE[status] ?? 'neutral'
})

/** Fecha de calendario (YYYY-MM-DD) como "18 nov"; vacío → raya. */
export const formatLeadDay = (day: string) =>
  DATE_RE.test(day)
    ? new Date(`${day}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
    : '—'

/** Instante ISO como "18 nov 2026" en hora de Colombia (igual en servidor y navegador). */
export const formatLeadDate = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Bogota'
      })
}
