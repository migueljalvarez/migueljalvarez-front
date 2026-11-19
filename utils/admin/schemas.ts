import { z } from 'zod'

/** Validación del formulario de solicitud de testimonios, que todavía usa datos de desarrollo. */
const text = (max = 200) =>
  z.string().trim().min(1, 'Obligatorio').max(max, `Máximo ${max} caracteres`)
const optionalText = (max = 2000) => z.string().trim().max(max, `Máximo ${max} caracteres`)
const email = z.string().trim().min(1, 'Obligatorio').pipe(z.email('Correo inválido'))

export const testimonialRequestSchema = z.object({
  clientName: text(100),
  email,
  projectName: optionalText(150),
  message: optionalText(1000)
})

/** Convierte los errores de Zod en un mapa campo → mensaje. */
export const zodErrors = (error: z.ZodError): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!map[key]) map[key] = issue.message
  }
  return map
}
