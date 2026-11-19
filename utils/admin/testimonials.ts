import { z } from 'zod'
import { formatLeadDate, type LeadTone } from './leads.ts'
import { zodErrors } from './schemas.ts'

/**
 * Lógica pura (sin Nuxt) de la pantalla de testimonios del panel. Las reglas repiten las de los DTO de la
 * API (`testimonials.dto.ts`): lo que aquí es válido, la API lo acepta. El token nunca forma parte del
 * registro de la lista: solo llega al crear o renovar, dentro del enlace (`TestimonialSendResponse`).
 */
export const TESTIMONIAL_STATUSES = [
  'enviada',
  'abierta',
  'respondida',
  'aprobada',
  'rechazada',
  'expirada'
] as const
export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number]

export const TESTIMONIAL_STATUS_LABEL: Record<TestimonialStatus, string> = {
  enviada: 'Enviada',
  abierta: 'Abierta',
  respondida: 'Respondida',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  expirada: 'Expirada'
}

export const TESTIMONIAL_LIMITS = {
  clientName: 100,
  email: 254,
  projectName: 150,
  message: 1000,
  publishedText: 3000,
  authorRole: 120,
  authorCompany: 120
} as const

export const TESTIMONIAL_PAGE_SIZE = 20
export const DEFAULT_EXPIRES_IN_DAYS = 14

export type TestimonialRecord = {
  id: string
  clientId: string | null
  clientName: string
  email: string
  projectName: string
  message: string
  status: TestimonialStatus
  expiresAt: string
  sentAt: string
  openedAt: string | null
  answeredAt: string | null
  /** Texto original del cliente (inmutable). */
  answer: string | null
  /** Texto editado; si es null se publica `answer`. */
  publishedText: string | null
  authorRole: string
  authorCompany: string
  consentPublish: boolean
  createdAt: string
  updatedAt: string
}

export type TestimonialMailStatus = 'sent' | 'not-configured' | 'failed'

/** Respuesta de `POST /api/admin/testimonial-requests/send`. `link` solo viaja si el correo no salió. */
export type TestimonialSendResponse = {
  request: TestimonialRecord
  mail: TestimonialMailStatus
  link?: string
  notice: string
}

export const TESTIMONIAL_FILTER_OPTIONS: { value: TestimonialStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  ...TESTIMONIAL_STATUSES.map(value => ({ value, label: TESTIMONIAL_STATUS_LABEL[value] }))
]

const STATUS_TONE: Record<TestimonialStatus, LeadTone> = {
  enviada: 'neutral',
  abierta: 'info',
  respondida: 'warning',
  aprobada: 'success',
  rechazada: 'neutral',
  expirada: 'neutral'
}

/** Etiqueta de estado: siempre con texto (el color nunca es lo único que distingue). */
export const testimonialStatusBadge = (
  status: TestimonialStatus
): { label: string; tone: LeadTone } => ({
  label: TESTIMONIAL_STATUS_LABEL[status] ?? status,
  tone: STATUS_TONE[status] ?? 'neutral'
})

// --- Lista y paginación ---------------------------------------------------------------------------

export type TestimonialFilter = TestimonialStatus | 'all'

export const buildListQuery = (
  filter: TestimonialFilter,
  page: number,
  pageSize = TESTIMONIAL_PAGE_SIZE
): { limit: number; offset: number; status?: TestimonialStatus } => ({
  limit: pageSize,
  offset: Math.max(0, page - 1) * pageSize,
  ...(filter === 'all' ? {} : { status: filter })
})

export const pageInfo = (total: number, page: number, pageSize = TESTIMONIAL_PAGE_SIZE) => {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), pages)
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1
  return {
    page: current,
    pages,
    from,
    to: Math.min(total, current * pageSize),
    hasPrev: current > 1,
    hasNext: current < pages
  }
}

// --- Vencimiento y acciones disponibles -----------------------------------------------------------

/** Solo se renueva lo que no tiene respuesta (la API responde 409 si ya fue respondida). */
export const canRenew = (record: Pick<TestimonialRecord, 'status'>) =>
  record.status === 'enviada' || record.status === 'abierta' || record.status === 'expirada'

/** Se revisa lo que ya tiene respuesta; se puede cambiar una decisión (p. ej. despublicar). */
export const canReview = (record: Pick<TestimonialRecord, 'status'>) =>
  record.status === 'respondida' || record.status === 'aprobada' || record.status === 'rechazada'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Texto de vencimiento de una solicitud SIN respuesta. Para las respondidas el plazo ya no importa
 * (devuelve `null`). `expired` deja claro cuándo el enlace ya no sirve.
 */
export const expiryInfo = (
  record: Pick<TestimonialRecord, 'status' | 'expiresAt'>,
  now: Date = new Date()
): { label: string; expired: boolean } | null => {
  if (!canRenew(record)) return null
  const date = formatLeadDate(record.expiresAt)
  const expiresAt = new Date(record.expiresAt).getTime()
  if (Number.isNaN(expiresAt)) return null

  const expired = record.status === 'expirada' || expiresAt <= now.getTime()
  if (expired) return { label: `Expiró el ${date}`, expired: true }

  const days = Math.ceil((expiresAt - now.getTime()) / DAY_MS)
  const when = days <= 1 ? 'vence hoy o mañana' : `quedan ${days} días`
  return { label: `Vence el ${date} (${when})`, expired: false }
}

// --- Formulario: nueva solicitud ------------------------------------------------------------------

export type RequestFormValues = {
  clientId: string
  clientName: string
  email: string
  projectName: string
  message: string
  expiresInDays: string
}

export const emptyRequestForm = (): RequestFormValues => ({
  clientId: '',
  clientName: '',
  email: '',
  projectName: '',
  message: '',
  expiresInDays: String(DEFAULT_EXPIRES_IN_DAYS)
})

const optionalText = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`)

export const requestSchema = z.object({
  clientId: z.string().trim(),
  clientName: z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .max(TESTIMONIAL_LIMITS.clientName, `Máximo ${TESTIMONIAL_LIMITS.clientName} caracteres`),
  email: z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .max(TESTIMONIAL_LIMITS.email, `Máximo ${TESTIMONIAL_LIMITS.email} caracteres`)
    .pipe(z.email('Escribe un correo válido, p. ej. nombre@dominio.co')),
  projectName: optionalText(TESTIMONIAL_LIMITS.projectName),
  message: optionalText(TESTIMONIAL_LIMITS.message),
  expiresInDays: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Escribe un número de días')
    .transform(Number)
    .pipe(z.number().int().min(1, 'Mínimo 1 día').max(60, 'Máximo 60 días'))
})

export type RequestPayload = {
  mode: 'create'
  clientId?: string
  clientName: string
  email: string
  projectName?: string
  message?: string
  expiresInDays: number
}

export type ValidationResult<T> =
  | { ok: true; data: T; errors: Record<string, never> }
  | { ok: false; errors: Record<string, string> }

/** Valida y arma el cuerpo para el envío: los opcionales vacíos no viajan. */
export const validateRequestForm = (
  values: RequestFormValues
): ValidationResult<RequestPayload> => {
  const result = requestSchema.safeParse(values)
  if (!result.success) return { ok: false, errors: zodErrors(result.error) }
  const { clientId, clientName, email, projectName, message, expiresInDays } = result.data
  return {
    ok: true,
    errors: {},
    data: {
      mode: 'create',
      ...(clientId ? { clientId } : {}),
      clientName,
      email,
      ...(projectName ? { projectName } : {}),
      ...(message ? { message } : {}),
      expiresInDays
    }
  }
}

/** Datos de un cliente existente para precargar nombre y correo (si el cliente tiene correo). */
export const prefillFromClient = (
  client: { id: string; name: string; email: string } | undefined
): Pick<RequestFormValues, 'clientId' | 'clientName' | 'email'> =>
  client
    ? { clientId: client.id, clientName: client.name, email: client.email }
    : { clientId: '', clientName: '', email: '' }

// --- Revisión: aprobar o rechazar -----------------------------------------------------------------

export type ReviewFormValues = {
  publishedText: string
  authorRole: string
  authorCompany: string
}

export const reviewFormFromRecord = (record: TestimonialRecord): ReviewFormValues => ({
  publishedText: record.publishedText ?? record.answer ?? '',
  authorRole: record.authorRole,
  authorCompany: record.authorCompany
})

const plain = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .regex(/^[^<>]*$/, 'No se permiten los caracteres < ni >')

const reviewSchema = z.object({
  publishedText: plain(TESTIMONIAL_LIMITS.publishedText),
  authorRole: plain(TESTIMONIAL_LIMITS.authorRole),
  authorCompany: plain(TESTIMONIAL_LIMITS.authorCompany)
})

export type ReviewPayload = {
  decision: 'approve' | 'reject'
  publishedText?: string
  authorRole?: string
  authorCompany?: string
}

export const NO_CONSENT_MESSAGE =
  'El cliente no autorizó la publicación: no se puede aprobar, solo rechazar.'

/**
 * Cuerpo del POST /review. Aprobar exige texto y consentimiento de publicación; si el texto editado es
 * igual al original se envía vacío (= publicar el original). Rechazar solo envía la decisión.
 */
export const buildReviewPayload = (
  decision: 'approve' | 'reject',
  values: ReviewFormValues,
  record: Pick<TestimonialRecord, 'answer' | 'consentPublish'>
): ValidationResult<ReviewPayload> => {
  if (decision === 'reject') return { ok: true, errors: {}, data: { decision } }

  if (!record.consentPublish) return { ok: false, errors: { _: NO_CONSENT_MESSAGE } }
  const result = reviewSchema.safeParse(values)
  if (!result.success) return { ok: false, errors: zodErrors(result.error) }

  const { publishedText, authorRole, authorCompany } = result.data
  if (!publishedText) return { ok: false, errors: { publishedText: 'Obligatorio para publicar' } }
  return {
    ok: true,
    errors: {},
    data: {
      decision,
      publishedText: publishedText === (record.answer ?? '').trim() ? '' : publishedText,
      authorRole,
      authorCompany
    }
  }
}

/** Texto que verá el público: el editado si existe; si no, el original. */
export const publicText = (record: Pick<TestimonialRecord, 'answer' | 'publishedText'>) =>
  record.publishedText || record.answer || ''
