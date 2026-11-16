// Valida la sesión en el servidor (cookie httpOnly firmada) tanto en SSR como en navegación.
export default defineNuxtRouteMiddleware(async to => {
  if (!to.path.startsWith('/dashboard')) return

  const fetcher = useRequestFetch()

  try {
    await fetcher('/api/admin/session')
  } catch {
    return navigateTo('/login')
  }
})
