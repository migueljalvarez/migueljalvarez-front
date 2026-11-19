/**
 * Límite de intentos en memoria por clave (IP o sesión). Es una defensa básica: en despliegues serverless
 * cada instancia lleva su propio contador. Puro (sin Nitro) para poder probarlo.
 */
export type RateLimiterOptions = { max: number; windowMs: number; maxKeys?: number }

export const createRateLimiter = (options: RateLimiterOptions) => {
  const attempts = new Map<string, number[]>()
  const maxKeys = options.maxKeys ?? 1000

  return {
    /** Registra un intento y devuelve `true` si la clave ya superó el máximo dentro de la ventana. */
    isLimited(key: string, now = Date.now()): boolean {
      const recent = (attempts.get(key) ?? []).filter(time => now - time < options.windowMs)
      if (recent.length >= options.max) {
        attempts.set(key, recent)
        return true
      }
      recent.push(now)
      attempts.set(key, recent)

      // Evita que el mapa crezca sin límite.
      if (attempts.size > maxKeys) {
        for (const [id, times] of attempts) {
          if (times.every(time => now - time >= options.windowMs)) attempts.delete(id)
        }
      }
      return false
    }
  }
}
