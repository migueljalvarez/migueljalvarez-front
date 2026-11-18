// Protege todo /admin: valida la sesión con la API (a través del proxy del sitio), tanto en SSR como en
// la navegación del cliente. Es global para que ninguna página nueva de /admin quede sin guarda.
export default defineNuxtRouteMiddleware(async to => {
  if (to.path !== '/admin' && !to.path.startsWith('/admin/')) return

  const session = await useAdminSession().load()
  if (!session) return navigateTo('/login')
})
