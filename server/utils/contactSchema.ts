import { z } from 'zod'

export const SUBJECT_LABELS = {
  desarrollo: 'Quiero construir algo',
  oferta: 'Oferta',
  consulta: 'Necesito decidir antes de invertir',
  soporte: 'Quiero mejorar algo que ya tengo',
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

/**
 * Constancia de la autorización para el correo del contacto: si la API falla y el lead no se guarda, el correo
 * es la única prueba. La versión de la política y la fecha las pone el servidor, no el navegador.
 */
export const consentRecord = (policyVersion: string, sentAt: Date) =>
  `Autorizó el tratamiento de sus datos (Ley 1581). Política vigente: ${policyVersion}. Enviado: ${sentAt.toISOString()}.`
