export default defineEventHandler(async event => {
  const body = await readBody(event)
  const email = String(body?.email || '').trim()
  const password = String(body?.password || '')

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan credenciales.'
    })
  }

  setCookie(event, 'admin_session', 'mock-admin', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return { ok: true, mode: 'mock' }
})
