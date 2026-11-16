export default defineEventHandler(event => {
  deleteCookie(event, ADMIN_COOKIE, adminCookieOptions)

  return { ok: true }
})
