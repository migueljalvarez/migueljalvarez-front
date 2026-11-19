import type { z } from 'zod'

/** Convierte los errores de Zod en un mapa campo → mensaje. */
export const zodErrors = (error: z.ZodError): Record<string, string> => {
  const map: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    if (!map[key]) map[key] = issue.message
  }
  return map
}
