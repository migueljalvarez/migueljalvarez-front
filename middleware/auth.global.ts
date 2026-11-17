// Protege todo /admin: valida la sesión en el servidor (cookie httpOnly firmada), tanto en SSR como
// en la navegación del cliente. Es global para que ninguna página nueva de /admin quede sin guarda.
export default defineNuxtRouteMiddleware(async to => {
  if (to.path !== '/admin' && !to.path.startsWith('/admin/')) return

  const fetcher = useRequestFetch()

  try {
    await fetcher('/api/admin/session')
  } catch {
    return navigateTo('/login')
  }
})
