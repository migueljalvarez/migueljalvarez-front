export default defineEventHandler(event => {
  const baseUrl = String(useRuntimeConfig(event).public.baseUrl || '').replace(/\/+$/, '')
  const isLocal = !baseUrl || /localhost|127\.0\.0\.1/.test(baseUrl)

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')

  // En desarrollo o sin URL pública configurada no se indexa nada.
  if (isLocal) {
    return 'User-agent: *\nDisallow: /\n'
  }

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /testimonio/',
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    ''
  ].join('\n')
})
