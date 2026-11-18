import { z } from 'zod'

/**
 * Esquemas de validación de los módulos del panel que aún guardan en memoria (testimonios, equipo,
 * tarifas, experiencia). Leads, clientes y proyectos ya hablan con la API: ver `leads.ts` y `projects.ts`.
 * Mensajes en español.
 */
const text = (max = 200) =>
  z.string().trim().min(1, 'Obligatorio').max(max, `Máximo ${max} caracteres`)
const optionalText = (max = 2000) => z.string().trim().max(max, `Máximo ${max} caracteres`)
const email = z.string().trim().min(1, 'Obligatorio').pipe(z.email('Correo inválido'))
const optionalEmail = z
  .string()
  .trim()
  .refine(value => value === '' || z.email().safeParse(value).success, 'Correo inválido')
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida')
const optionalDate = z
  .string()
  .refine(value => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Fecha inválida')
const positive = (label = 'Debe ser mayor que 0') =>
  z.coerce
    .number({ message: 'Ingresa un número' })
    .positive(label)
    .max(10_000_000, 'Valor demasiado alto')

export const testimonialRequestSchema = z.object({
  clientName: text(100),
  email,
  projectName: optionalText(150),
  message: optionalText(1000)
})

export const teamMemberSchema = z.object({
  name: text(100),
  email: optionalEmail,
  role: text(100),
  responsibilities: optionalText(1000),
  rateUsd: positive('La tarifa debe ser mayor que 0')
})

export const assignmentSchema = z.object({
  memberId: z.string().min(1, 'Elige un colaborador'),
  projectId: z.string().min(1, 'Elige un proyecto'),
  agreedHours: positive('Las horas deben ser mayores que 0')
})

export const timeEntrySchema = z.object({
  memberId: z.string().min(1, 'Elige un colaborador'),
  projectId: z.string().min(1, 'Elige un proyecto'),
  hours: positive('Las horas deben ser mayores que 0').max(24, 'Máximo 24 horas'),
  date,
  note: optionalText(300)
})

export const paymentSchema = z.object({
  memberId: z.string().min(1, 'Elige un colaborador'),
  amountUsd: positive('El monto debe ser mayor que 0'),
  trm: positive('La TRM debe ser mayor que 0'),
  date,
  note: optionalText(300)
})

export const rateSchema = z.object({
  service: text(120),
  rateUsd: positive('La tarifa debe ser mayor que 0'),
  isPublic: z.boolean()
})

export const experienceSchema = z
  .object({
    company: text(120),
    role: text(120),
    startDate: date,
    endDate: optionalDate,
    current: z.boolean(),
    achievements: text(3000),
    technologies: optionalText(300),
    evidence: optionalText(500)
  })
  .refine(value => value.current || value.endDate !== '', {
    path: ['endDate'],
    message: 'Indica la fecha de fin o marca "Trabajo actual"'
  })

export type ExperienceInput = z.infer<typeof experienceSchema>

/** Convierte los errores de Zod en un mapa campo → mensaje. */
export const zodErrors = (error: z.ZodError): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!map[key]) map[key] = issue.message
  }
  return map
}
