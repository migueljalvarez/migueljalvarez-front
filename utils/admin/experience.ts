import { z } from 'zod'
import { zodErrors } from './schemas.ts'
import { date, optionalText, text } from './projects.ts'

export const EXPERIENCE_KINDS = ['empleo', 'freelance', 'proyecto-personal'] as const
export const EXPERIENCE_KIND_LABEL: Record<(typeof EXPERIENCE_KINDS)[number], string> = {
  empleo: 'Empleo',
  freelance: 'Trabajo independiente',
  'proyecto-personal': 'Proyecto personal'
}

export type ExperienceRecord = {
  id: string
  company: string
  role: string
  kind: (typeof EXPERIENCE_KINDS)[number]
  location: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  achievements: string[]
  technologies: string[]
  evidence: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const achievements = z
  .string()
  .trim()
  .min(1, 'Agrega al menos un logro')
  .max(3000, 'Máximo 3000 caracteres')
  .transform(value =>
    value
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
  )
  .refine(items => items.length <= 30, 'Máximo 30 logros')
  .refine(
    items => items.every(item => item.length <= 500),
    'Cada logro puede tener hasta 500 caracteres'
  )

const technologies = z
  .string()
  .max(2500, 'Máximo 2500 caracteres')
  .transform(value => {
    const seen = new Set<string>()
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => {
        const key = item.toLowerCase()
        if (!item || seen.has(key)) return false
        seen.add(key)
        return true
      })
  })
  .refine(items => items.length <= 40, 'Máximo 40 tecnologías')
  .refine(
    items => items.every(item => item.length <= 60),
    'Cada tecnología puede tener hasta 60 caracteres'
  )

export const experienceSchema = z
  .object({
    company: text(120),
    role: text(120),
    kind: z.enum(EXPERIENCE_KINDS),
    location: optionalText(120),
    startDate: date,
    endDate: z
      .string()
      .refine(value => value === '' || date.safeParse(value).success, 'Fecha inválida'),
    isCurrent: z.boolean(),
    achievements,
    technologies,
    evidence: optionalText(500),
    sortOrder: z.coerce.number().int().min(-1000, 'Mínimo -1000').max(1000, 'Máximo 1000')
  })
  .refine(value => (value.isCurrent ? value.endDate === '' : value.endDate !== ''), {
    path: ['endDate'],
    message: 'Indica la fecha de fin o marca «Trabajo actual»'
  })
  .refine(value => !value.endDate || value.endDate >= value.startDate, {
    path: ['endDate'],
    message: 'La fecha de fin no puede ser anterior a la de inicio'
  })

export type ExperiencePayload = Omit<z.infer<typeof experienceSchema>, 'endDate'> & {
  endDate?: string
}
export type ExperienceFormValues = {
  company: string
  role: string
  kind: (typeof EXPERIENCE_KINDS)[number]
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  achievements: string
  technologies: string
  evidence: string
  sortOrder: string
}

export const emptyExperienceForm = (): ExperienceFormValues => ({
  company: '',
  role: '',
  kind: 'empleo',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  achievements: '',
  technologies: '',
  evidence: '',
  sortOrder: '0'
})

export const experienceFormFromRecord = (item: ExperienceRecord): ExperienceFormValues => ({
  company: item.company,
  role: item.role,
  kind: item.kind,
  location: item.location,
  startDate: item.startDate,
  endDate: item.endDate ?? '',
  isCurrent: item.isCurrent,
  achievements: item.achievements.join('\n'),
  technologies: item.technologies.join(', '),
  evidence: item.evidence,
  sortOrder: String(item.sortOrder)
})

export const validateExperienceForm = (values: ExperienceFormValues) => {
  const result = experienceSchema.safeParse(values)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, errors: zodErrors(result.error) }
}

export const moveExperience = (items: ExperienceRecord[], index: number, direction: -1 | 1) => {
  const target = index + direction
  if (target < 0 || target >= items.length) return null
  const reordered = [...items]
  const current = reordered[index]
  const neighbor = reordered[target]
  if (!current || !neighbor) return null
  reordered[index] = neighbor
  reordered[target] = current
  return reordered.map((item, sortOrder) => ({ ...item, sortOrder }))
}
