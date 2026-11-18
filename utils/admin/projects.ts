import { z } from 'zod'
import { zodErrors } from './schemas.ts'

/**
 * Lógica pura (sin Nuxt) de clientes y proyectos del panel. Las reglas repiten las de los DTO de la
 * API (`clients.dto.ts`, `projects.dto.ts`): lo que aquí es válido, la API lo acepta.
 */

export const PROJECT_STATUSES = ['planificado', 'en-curso', 'pausado', 'entregado'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planificado: 'Planificado',
  'en-curso': 'En curso',
  pausado: 'Pausado',
  entregado: 'Entregado'
}

export const PROJECT_STATUS_OPTIONS = PROJECT_STATUSES.map(value => ({
  value,
  label: PROJECT_STATUS_LABEL[value]
}))

export const CLIENT_LIMITS = { name: 120, email: 254, company: 120, notes: 2000 } as const
export const PROJECT_LIMITS = {
  name: 150,
  rateUsd: 99_999_999.99,
  budgetHours: 999_999.99
} as const

export type ClientRecord = {
  id: string
  name: string
  email: string
  company: string
  notes: string
  projectsCount: number
  createdAt: string
  updatedAt: string
}

export type ProjectRecord = {
  id: string
  clientId: string
  name: string
  status: ProjectStatus
  rateUsd: number
  budgetHours: number
  startDate: string
  deadline: string
  publishable: boolean
  usedHours: number
  usedPercent: number
  createdAt: string
  updatedAt: string
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const text = (max: number) =>
  z.string().trim().min(1, 'Obligatorio').max(max, `Máximo ${max} caracteres`)
const optionalText = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`)

/** Fecha real de calendario: rechaza formatos libres y días inexistentes (30 de febrero). */
const date = z
  .string()
  .regex(DATE_RE, 'Fecha inválida')
  .refine(value => {
    const parsed = new Date(`${value}T00:00:00Z`)
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
  }, 'Fecha inválida')

const twoDecimals = (value: number) => Math.abs(Math.round(value * 100) / 100 - value) < 1e-9

const amount = (max: number, emptyMessage: string) =>
  z
    .string()
    .trim()
    .min(1, 'Obligatorio')
    .pipe(
      z.coerce
        .number({ message: 'Ingresa un número' })
        .positive(emptyMessage)
        .max(max, 'Valor demasiado alto')
        .refine(twoDecimals, 'Máximo 2 decimales')
    )

// --- Clientes -----------------------------------------------------------------------------------

export const clientSchema = z.object({
  name: text(CLIENT_LIMITS.name),
  email: z
    .string()
    .trim()
    .max(CLIENT_LIMITS.email, `Máximo ${CLIENT_LIMITS.email} caracteres`)
    .refine(
      value => value === '' || z.email().safeParse(value).success,
      'Escribe un correo válido'
    ),
  company: optionalText(CLIENT_LIMITS.company),
  notes: optionalText(CLIENT_LIMITS.notes)
})

export type ClientFormValues = { name: string; email: string; company: string; notes: string }
export type ClientPayload = z.infer<typeof clientSchema>

export const emptyClientForm = (): ClientFormValues => ({
  name: '',
  email: '',
  company: '',
  notes: ''
})

export const clientFormFromRecord = (client: ClientRecord): ClientFormValues => ({
  name: client.name,
  email: client.email,
  company: client.company,
  notes: client.notes
})

// --- Proyectos ----------------------------------------------------------------------------------

export const projectSchema = z
  .object({
    name: text(PROJECT_LIMITS.name),
    clientId: z.string().min(1, 'Elige un cliente'),
    status: z.enum(PROJECT_STATUSES, { message: 'Elige un estado' }),
    rateUsd: amount(PROJECT_LIMITS.rateUsd, 'La tarifa debe ser mayor que 0'),
    budgetHours: amount(PROJECT_LIMITS.budgetHours, 'Las horas deben ser mayores que 0'),
    startDate: date,
    deadline: date,
    publishable: z.boolean()
  })
  .refine(value => value.deadline >= value.startDate, {
    path: ['deadline'],
    message: 'El deadline no puede ser anterior al inicio'
  })

/** Valores del formulario: los montos se escriben como texto y salen como número. */
export type ProjectFormValues = {
  name: string
  clientId: string
  status: string
  rateUsd: string
  budgetHours: string
  startDate: string
  deadline: string
  publishable: boolean
}
export type ProjectPayload = z.infer<typeof projectSchema>

export const emptyProjectForm = (today: string, clientId = ''): ProjectFormValues => ({
  name: '',
  clientId,
  status: 'planificado',
  rateUsd: '',
  budgetHours: '',
  startDate: today,
  deadline: '',
  publishable: false
})

export const projectFormFromRecord = (project: ProjectRecord): ProjectFormValues => ({
  name: project.name,
  clientId: project.clientId,
  status: project.status,
  rateUsd: String(project.rateUsd),
  budgetHours: String(project.budgetHours),
  startDate: project.startDate,
  deadline: project.deadline,
  publishable: project.publishable
})

type Result<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> }

export const validateClientForm = (values: ClientFormValues): Result<ClientPayload> => {
  const result = clientSchema.safeParse(values)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: zodErrors(result.error) }
}

export const validateProjectForm = (values: ProjectFormValues): Result<ProjectPayload> => {
  const result = projectSchema.safeParse(values)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: zodErrors(result.error) }
}

// --- Presentación ---------------------------------------------------------------------------------

/** Etiqueta de estado del proyecto: siempre con texto, el color es solo refuerzo. */
export const projectStatusBadge = (
  status: ProjectStatus
): { label: string; tone: 'success' | 'neutral' | 'warning' | 'info' } => ({
  label: PROJECT_STATUS_LABEL[status] ?? status,
  tone:
    (
      {
        planificado: 'info',
        'en-curso': 'success',
        pausado: 'warning',
        entregado: 'neutral'
      } as const
    )[status] ?? 'neutral'
})

export const formatProjectDate = (day: string) =>
  DATE_RE.test(day)
    ? new Date(`${day}T12:00:00`).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '—'

/** Indicador de deadline: entregado, vencido, cercano (≤ 14 días) o en plazo. */
export const deadlineInfo = (
  deadline: string,
  status: ProjectStatus,
  now: Date = new Date()
): { text: string; tone: 'success' | 'danger' | 'warning' | 'muted' } => {
  if (status === 'entregado') return { text: 'Entregado', tone: 'success' }
  if (!DATE_RE.test(deadline)) return { text: '', tone: 'muted' }
  const days = Math.round((new Date(`${deadline}T12:00:00`).getTime() - now.getTime()) / 86_400_000)
  if (days < 0) return { text: `Vencido hace ${-days} d`, tone: 'danger' }
  if (days === 0) return { text: 'Vence hoy', tone: 'warning' }
  if (days <= 14) return { text: `Faltan ${days} d`, tone: 'warning' }
  return { text: `Faltan ${days} d`, tone: 'muted' }
}

/** Porcentaje de horas usadas (sin tope, para ver excesos) y el ancho de la barra (tope 100). */
export const hoursProgress = (usedHours: number, budgetHours: number) => {
  const percent = budgetHours > 0 ? Math.round((usedHours / budgetHours) * 100) : 0
  return { percent, bar: Math.min(percent, 100), over: percent > 100 }
}

export type ProjectFilter = ProjectStatus | 'all'

export const filterProjects = (projects: ProjectRecord[], status: ProjectFilter) =>
  status === 'all' ? projects : projects.filter(project => project.status === status)

export const countProjects = (projects: ProjectRecord[], status: ProjectFilter) =>
  filterProjects(projects, status).length

/** Nombre del cliente de un proyecto (o raya si ya no está en la lista cargada). */
export const clientNameOf = (clients: ClientRecord[], clientId: string) =>
  clients.find(client => client.id === clientId)?.name ?? '—'
