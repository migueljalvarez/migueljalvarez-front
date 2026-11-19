import { z } from 'zod'

/**
 * Reglas del testimonio que escribe el cliente desde el enlace único. Puro (sin Nuxt ni Nitro): lo usan
 * el formulario público (validación al enviar) y el servidor (validación antes de llamar a la API, que
 * vuelve a validar). Repite las del DTO de la API (`SubmitTestimonialDto`).
 */
export const TESTIMONIAL_ANSWER_MIN = 10
export const TESTIMONIAL_ANSWER_MAX = 3000

/** Texto plano: la API también rechaza `<` y `>` para que nunca se guarde HTML. */
const plain = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .regex(/^[^<>]*$/, 'No se permiten los caracteres < ni >')

/** Campo opcional: la cadena vacía equivale a no enviarlo. */
const optionalPlain = (max: number) =>
  plain(max)
    .optional()
    .transform(value => (value ? value : undefined))

export const testimonialSubmissionSchema = z.object({
  answer: plain(TESTIMONIAL_ANSWER_MAX).min(
    TESTIMONIAL_ANSWER_MIN,
    `Cuéntame un poco más: escribe al menos ${TESTIMONIAL_ANSWER_MIN} caracteres`
  ),
  authorName: optionalPlain(100),
  authorRole: optionalPlain(120),
  authorCompany: optionalPlain(120),
  consentPublish: z.literal(true, { message: 'Debes autorizar la publicación para enviarlo' })
})

export type TestimonialSubmission = z.infer<typeof testimonialSubmissionSchema>

export type TestimonialFormValues = {
  answer: string
  authorName: string
  authorRole: string
  authorCompany: string
  consentPublish: boolean
}

export const emptyTestimonialForm = (): TestimonialFormValues => ({
  answer: '',
  authorName: '',
  authorRole: '',
  authorCompany: '',
  consentPublish: false
})

export type TestimonialFormResult =
  | { ok: true; data: TestimonialSubmission; errors: Record<string, never> }
  | { ok: false; errors: Record<string, string> }

/** Valida el formulario público; `errors` trae el primer mensaje por campo. */
export const validateTestimonialForm = (values: TestimonialFormValues): TestimonialFormResult => {
  const result = testimonialSubmissionSchema.safeParse(values)
  if (result.success) return { ok: true, data: result.data, errors: {} }
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!errors[key]) errors[key] = issue.message
  }
  return { ok: false, errors }
}

/** Datos mínimos que entrega el servidor para mostrar el formulario (sin correo ni identificadores). */
export type PublicTestimonialForm = {
  clientName: string
  projectName: string
  message: string
  expiresAt: string
}

export type TestimonialPhase = 'invalid' | 'limited' | 'unavailable'

/** Fase de la página según el estado HTTP del servidor: 404 = enlace no válido, 429 = demasiados intentos. */
export const phaseFromStatus = (status: number | undefined): TestimonialPhase => {
  if (status === 404 || status === 410 || status === 400) return 'invalid'
  if (status === 429) return 'limited'
  return 'unavailable'
}
