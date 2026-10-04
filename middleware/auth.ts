export default defineNuxtRouteMiddleware(to => {
  if (process.server) {
    return
  }

  const session = useCookie('admin_session')

  if (to.path.startsWith('/dashboard') && session.value !== 'mock-admin') {
    return navigateTo('/login')
  }
})
