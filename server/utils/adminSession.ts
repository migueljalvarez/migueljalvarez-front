import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

// Sesión provisional del panel: cookie firmada (HMAC-SHA256) y httpOnly.
// Se reemplazará por Supabase Auth (ver plan en Notion).
export const ADMIN_COOKIE = 'admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

const sign = (value: string, secret: string) =>
  createHmac('sha256', secret).update(value).digest('base64url')

export const safeEqual = (a: string, b: string) => {
  const hashA = createHmac('sha256', 'cmp').update(a).digest()
  const hashB = createHmac('sha256', 'cmp').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export const createSessionToken = (email: string, secret: string) => {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000
  const payload = Buffer.from(JSON.stringify({ email, exp: expiresAt })).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

export const verifySessionToken = (token: string | undefined, secret: string | undefined) => {
  if (!token || !secret) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email: string
      exp: number
    }
    return data.exp > Date.now() ? { email: data.email } : null
  } catch {
    return null
  }
}

export const getAdminSession = (event: H3Event) => {
  return verifySessionToken(
    getCookie(event, ADMIN_COOKIE),
    getServerSecret('adminSessionSecret', event)
  )
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/'
}
