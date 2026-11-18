/**
 * Reglas puras (sin Nuxt) del acceso de dos pasos al panel: normalización de lo que se escribe,
 * validación en el cliente (mismo formato que acepta la API) y mensajes de error por situación.
 */

/** La sesión pendiente (tras el paso 1) dura 5 minutos en la API. */
export const PENDING_SESSION_MS = 5 * 60 * 1000

export type SecondFactorMode = 'totp' | 'recovery'
export type LoginStep = 'password' | 'code'

/** Solo dígitos, máximo 6. */
export const normalizeTotpInput = (value: string) => value.replace(/\D/g, '').slice(0, 6)

/** Mayúsculas hexadecimales con guion tras el quinto carácter: XXXXX-XXXXX. */
export const normalizeRecoveryInput = (value: string) => {
  const clean = value
    .toUpperCase()
    .replace(/[^0-9A-F]/g, '')
    .slice(0, 10)
  return clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean
}

export const validateCredentials = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {}
  const mail = email.trim()
  if (!mail) errors.email = 'Escribe tu correo.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    errors.email = 'Escribe un correo válido, p. ej. nombre@dominio.co.'
  }
  if (!password) errors.password = 'Escribe tu contraseña.'
  return errors
}

/** Devuelve el mensaje de error del código, o cadena vacía si el formato es correcto. */
export const validateSecondFactor = (mode: SecondFactorMode, value: string): string => {
  if (mode === 'totp') {
    if (!value) return 'Escribe el código de 6 dígitos de tu aplicación.'
    return /^\d{6}$/.test(value) ? '' : 'El código tiene 6 dígitos. Revisa tu aplicación.'
  }
  if (!value) return 'Escribe tu código de recuperación.'
  return /^[0-9A-F]{5}-[0-9A-F]{5}$/.test(value)
    ? ''
    : 'El código de recuperación tiene el formato XXXXX-XXXXX (números y letras de la A a la F).'
}

export const isPendingExpired = (startedAt: number, now = Date.now()) =>
  now - startedAt >= PENDING_SESSION_MS

const NOT_CONNECTED = [0, 502, 503, 504]

/** Mensaje para la persona según el paso y el estado HTTP de la respuesta. */
export const loginErrorMessage = (input: {
  step: LoginStep
  status: number
  expired?: boolean
}): string => {
  const { step, status, expired } = input
  if (NOT_CONNECTED.includes(status)) {
    return 'El panel no está conectado a la API en este momento. Inténtalo de nuevo en unos minutos.'
  }
  if (status === 429) return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
  if (status === 401 && step === 'password') {
    return 'El correo o la contraseña no coinciden. Revísalos e inténtalo de nuevo.'
  }
  if (status === 401) {
    return expired
      ? 'Pasaron más de 5 minutos y el acceso venció. Pulsa «Volver» e inicia sesión de nuevo.'
      : 'El código no es correcto o ya se usó. Revísalo e inténtalo de nuevo; si pasaron más de 5 minutos, pulsa «Volver» e inicia sesión otra vez.'
  }
  return 'No pudimos iniciar sesión. Inténtalo de nuevo.'
}
