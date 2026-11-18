import { z } from 'zod'

export const SUBJECT_LABELS = {
  desarrollo: 'Desarrollo',
  oferta: 'Oferta',
  consulta: 'Consulta',
  soporte: 'Soporte',
  otro: 'Otro'
} as const

/**
 * Cuerpo del formulario de contacto. `consent` debe ser exactamente `true` (autorización previa, expresa
 * e informada, Ley 1581). `website` es el honeypot: oculto para personas; con texto, es un bot.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  subject: z.enum(Object.keys(SUBJECT_LABELS) as [keyof typeof SUBJECT_LABELS]),
  message: z.string().trim().min(1).max(5000),
  consent: z.literal(true),
  website: z.string().max(200).optional()
})

export type ContactInput = z.infer<typeof contactSchema>
