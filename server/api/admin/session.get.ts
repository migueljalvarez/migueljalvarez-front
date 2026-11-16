export default defineEventHandler(event => {
  const session = getAdminSession(event)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado.' })
  }

  return { authenticated: true, email: session.email }
})
