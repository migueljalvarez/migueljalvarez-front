/**
 * Defensa CSRF adicional (la cookie de sesión ya es SameSite=Lax) para las operaciones que modifican
 * datos: si la petición trae `Origin`, debe ser el del propio sitio (o la URL pública configurada).
 * Misma regla que el proxy del panel. Puro (sin Nitro).
 */
export const isAllowedOrigin = (origin: string | undefined, allowed: string[]): boolean => {
  if (!origin) return true
  return new Set(allowed.map(value => value.replace(/\/+$/, '')).filter(Boolean)).has(origin)
}
