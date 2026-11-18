import { z } from 'zod'
import { zodErrors } from './schemas.ts'
import { amount, date, hoursProgress, optionalText, text, type Result } from './projects.ts'

/**
 * Lógica pura (sin Nuxt) de Equipo y pagos. Las reglas repiten las de los DTO de la API
 * (`team.dto.ts`): lo que aquí es válido, la API lo acepta. Importes siempre en USD; la TRM es COP por USD.
 */

export const TEAM_LIMITS = {
  name: 100,
  email: 254,
  role: 100,
  responsibilities: 1000,
  rateUsd: 99_999_999.99,
  agreedHours: 999_999.99,
  entryHours: 24,
  note: 300,
  paymentUsd: 1_000_000_000,
  trm: 1_000_000
} as const

export type TeamMemberRecord = {
  id: string
  name: string
  email: string
  role: string
  responsibilities: string
  rateUsd: number
  active: boolean
  hours: number
  earnedUsd: number
  paidUsd: number
  dueUsd: number
  createdAt: string
  updatedAt: string
}

export type AssignmentRecord = {
  id: string
  memberId: string
  projectId: string
  agreedHours: number
  usedHours: number
  exceeded: boolean
  createdAt: string
}

export type TimeEntryRecord = {
  id: string
  memberId: string
  projectId: string
  hours: number
  workDate: string
  note: string
  createdAt: string
}

/** Respuesta al registrar horas: el registro y cómo queda la asignación (para avisar del exceso). */
export type TimeEntryCreated = TimeEntryRecord & {
  assignment: { id: string; agreedHours: number; usedHours: number; exceeded: boolean }
}

export type PaymentRecord = {
  id: string
  memberId: string
  amountUsd: number
  trm: number
  amountCop: number
  paidOn: string
  note: string
  createdAt: string
}

export type TrmRecord = { rateDate: string; copPerUsd: number; source: string }

// --- Esquemas -----------------------------------------------------------------------------------

/** Texto vacío = sin valor (el campo es opcional); si hay texto, debe ser un monto válido. */
const optionalAmount = (max: number, message: string) =>
  z
    .literal('')
    .transform(() => undefined)
    .or(amount(max, message))

const memberId = z.string().min(1, 'Elige un colaborador')
const projectId = z.string().min(1, 'Elige un proyecto')

export const memberSchema = z.object({
  name: text(TEAM_LIMITS.name),
  email: z
    .string()
    .trim()
    .max(TEAM_LIMITS.email, `Máximo ${TEAM_LIMITS.email} caracteres`)
    .refine(
      value => value === '' || z.email().safeParse(value).success,
      'Escribe un correo válido'
    ),
  role: text(TEAM_LIMITS.role),
  responsibilities: optionalText(TEAM_LIMITS.responsibilities),
  rateUsd: amount(TEAM_LIMITS.rateUsd, 'La tarifa debe ser mayor que 0'),
  active: z.boolean()
})

export const assignmentSchema = z.object({
  memberId,
  projectId,
  agreedHours: amount(TEAM_LIMITS.agreedHours, 'Las horas deben ser mayores que 0')
})

export const assignmentHoursSchema = assignmentSchema.pick({ agreedHours: true })

export const timeEntrySchema = z.object({
  memberId,
  projectId,
  hours: amount(TEAM_LIMITS.entryHours, 'Las horas deben ser mayores que 0'),
  workDate: date,
  note: optionalText(TEAM_LIMITS.note)
})

export const paymentSchema = z.object({
  memberId,
  amountUsd: amount(TEAM_LIMITS.paymentUsd, 'El monto debe ser mayor que 0'),
  paidOn: date,
  trm: optionalAmount(TEAM_LIMITS.trm, 'La TRM debe ser mayor que 0'),
  note: optionalText(TEAM_LIMITS.note)
})

export const trmSchema = z.object({
  rateDate: date,
  copPerUsd: amount(TEAM_LIMITS.trm, 'La TRM debe ser mayor que 0')
})

export type MemberPayload = z.infer<typeof memberSchema>
export type AssignmentPayload = z.infer<typeof assignmentSchema>
export type AssignmentHoursPayload = z.infer<typeof assignmentHoursSchema>
export type TimeEntryPayload = z.infer<typeof timeEntrySchema>
export type PaymentPayload = z.infer<typeof paymentSchema>
export type TrmPayload = z.infer<typeof trmSchema>

// --- Valores de formulario ----------------------------------------------------------------------

export type MemberFormValues = {
  name: string
  email: string
  role: string
  responsibilities: string
  rateUsd: string
  active: boolean
}
export type AssignmentFormValues = { memberId: string; projectId: string; agreedHours: string }
export type TimeEntryFormValues = {
  memberId: string
  projectId: string
  hours: string
  workDate: string
  note: string
}
export type PaymentFormValues = {
  memberId: string
  amountUsd: string
  paidOn: string
  trm: string
  note: string
}
export type TrmFormValues = { rateDate: string; copPerUsd: string }

export const emptyMemberForm = (): MemberFormValues => ({
  name: '',
  email: '',
  role: '',
  responsibilities: '',
  rateUsd: '',
  active: true
})
export const memberFormFromRecord = (member: TeamMemberRecord): MemberFormValues => ({
  name: member.name,
  email: member.email,
  role: member.role,
  responsibilities: member.responsibilities,
  rateUsd: String(member.rateUsd),
  active: member.active
})

export const emptyAssignmentForm = (memberId = '', projectId = ''): AssignmentFormValues => ({
  memberId,
  projectId,
  agreedHours: ''
})
export const emptyTimeEntryForm = (today: string, memberId = ''): TimeEntryFormValues => ({
  memberId,
  projectId: '',
  hours: '',
  workDate: today,
  note: ''
})
/** La TRM del pago arranca con la vigente (si hay); se puede cambiar y queda guardada con el pago. */
export const emptyPaymentForm = (today: string, trm: TrmRecord | null): PaymentFormValues => ({
  memberId: '',
  amountUsd: '',
  paidOn: today,
  trm: trm ? String(trm.copPerUsd) : '',
  note: ''
})
export const emptyTrmForm = (today: string, trm: TrmRecord | null): TrmFormValues => ({
  rateDate: today,
  copPerUsd: trm ? String(trm.copPerUsd) : ''
})

const validate = <T>(schema: z.ZodType<T>, values: unknown): Result<T> => {
  const result = schema.safeParse(values)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: zodErrors(result.error) }
}

export const validateMemberForm = (values: MemberFormValues) => validate(memberSchema, values)
export const validateAssignmentForm = (values: AssignmentFormValues) =>
  validate(assignmentSchema, values)
export const validateAssignmentHours = (values: { agreedHours: string }) =>
  validate(assignmentHoursSchema, values)
export const validateTimeEntryForm = (values: TimeEntryFormValues) =>
  validate(timeEntrySchema, values)
export const validatePaymentForm = (values: PaymentFormValues) => validate(paymentSchema, values)
export const validateTrmForm = (values: TrmFormValues) => validate(trmSchema, values)

// --- Fechas y formatos --------------------------------------------------------------------------

/** Hoy en la zona horaria de quien usa el panel (no en UTC: de noche en Colombia ya sería "mañana"). */
export const localToday = (now: Date = new Date()) => {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export const formatUsd = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
export const formatCop = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
export const formatHours = (value: number) =>
  value.toLocaleString('es-CO', { maximumFractionDigits: 2 })

/** Equivalente en COP, redondeado a pesos como lo calcula la base (round(usd × trm)). */
export const copFromUsd = (usd: number, trm: number) => Math.round(usd * trm)

// --- Cálculos de presentación -------------------------------------------------------------------

/** Total por pagar al equipo (suma de los saldos de la lista cargada). */
export const totalDue = (members: TeamMemberRecord[]) =>
  Math.round(members.reduce((sum, member) => sum + member.dueUsd, 0) * 100) / 100

export const memberNameOf = (members: TeamMemberRecord[], id: string) =>
  members.find(member => member.id === id)?.name ?? '—'

export const projectNameOf = (projects: { id: string; name: string }[], id: string) =>
  projects.find(project => project.id === id)?.name ?? '—'

/** Uso de una asignación: porcentaje sin tope (para ver excesos) y ancho de la barra. */
export const assignmentProgress = (assignment: AssignmentRecord) => {
  const progress = hoursProgress(assignment.usedHours, assignment.agreedHours)
  return { ...progress, over: assignment.exceeded }
}

/** Asignaciones de una persona. */
export const assignmentsOfMember = (assignments: AssignmentRecord[], memberId: string) =>
  assignments.filter(assignment => assignment.memberId === memberId)

/** Asignación de una persona en un proyecto (la API garantiza una sola por pareja). */
export const findAssignment = (
  assignments: AssignmentRecord[],
  memberId: string,
  projectId: string
) =>
  assignments.find(
    assignment => assignment.memberId === memberId && assignment.projectId === projectId
  )

/**
 * ¿Cómo quedaría la asignación si se registran estas horas? Sirve para avisar del exceso antes de
 * guardar (la API lo permite, pero lo marca). `null` si aún no hay asignación o las horas no son un número.
 */
export const projectedUsage = (
  assignment: AssignmentRecord | undefined,
  hours: number
): { used: number; agreed: number; exceeds: boolean } | null => {
  if (!assignment || !Number.isFinite(hours) || hours <= 0) return null
  const used = Math.round((assignment.usedHours + hours) * 100) / 100
  return { used, agreed: assignment.agreedHours, exceeds: used > assignment.agreedHours }
}

/** Etiqueta de estado del colaborador (texto siempre; el color es solo refuerzo). */
export const memberStatusBadge = (member: Pick<TeamMemberRecord, 'active'>) =>
  member.active
    ? ({ label: 'Activo', tone: 'success' } as const)
    : ({ label: 'Inactivo', tone: 'neutral' } as const)
