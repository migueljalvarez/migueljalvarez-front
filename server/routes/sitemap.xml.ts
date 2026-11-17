import { PORTFOLIO_PROJECTS } from '~/constants/portfolio'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export default defineEventHandler(event => {
  const baseUrl = String(useRuntimeConfig(event).public.baseUrl || '').replace(/\/+$/, '')

  // Rutas públicas fijas + proyectos con ficha de detalle (los "en desarrollo" no la tienen).
  const paths = [
    '/',
    '/como-trabajo',
    '/portafolio',
    ...PORTFOLIO_PROJECTS.filter(project => project.status !== 'in-development').map(
      project => `/portafolio/${project.slug || project.id}`
    )
  ]

  const urls = paths
    .map(path => `  <url><loc>${escapeXml(`${baseUrl}${path === '/' ? '' : path}`)}</loc></url>`)
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
