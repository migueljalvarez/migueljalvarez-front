export default defineEventHandler(event => {
  setCookie(event, 'admin_session', '', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  })

  return { ok: true }
})
