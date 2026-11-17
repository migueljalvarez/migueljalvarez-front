// Login provisional con credenciales de entorno (ADMIN_EMAIL / ADMIN_PASSWORD).
// Se reemplazará por Supabase Auth. Si falta configuración, el acceso queda cerrado.
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000
const failures = new Map<string, number[]>()

const recentFailures = (ip: string) => {
  const now = Date.now()
  const recent = (failures.get(ip) ?? []).filter(time => now - time < WINDOW_MS)
  failures.set(ip, recent)
  return recent
}

export default defineEventHandler(async event => {
  const adminEmail = getServerSecret('adminEmail', event)
  const adminPassword = getServerSecret('adminPassword', event)
  const sessionSecret = getServerSecret('adminSessionSecret', event)
  const ip = getClientIp(event)

  if (!adminEmail || !adminPassword || !sessionSecret) {
    console.error('Login admin: faltan ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_SESSION_SECRET')
    throw createError({ statusCode: 503, statusMessage: 'Acceso no disponible.' })
  }

  if (recentFailures(ip).length >= MAX_ATTEMPTS) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos. Inténtalo más tarde.'
    })
  }

  const body = await readBody(event)
  const email = String(body?.email || '')
    .trim()
    .toLowerCase()
  const password = String(body?.password || '')

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan credenciales.' })
  }

  const validEmail = safeEqual(email, adminEmail.trim().toLowerCase())
  const validPassword = safeEqual(password, adminPassword)

  if (!validEmail || !validPassword) {
    recentFailures(ip).push(Date.now())
    throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas.' })
  }

  failures.delete(ip)
  setCookie(event, ADMIN_COOKIE, createSessionToken(email, sessionSecret), {
    ...adminCookieOptions,
    maxAge: ADMIN_SESSION_MAX_AGE
  })

  return { ok: true }
})
