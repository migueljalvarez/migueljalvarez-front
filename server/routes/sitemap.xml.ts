import { GUIDES } from '~/data/guides'
import { PRIVACY_UPDATED_AT } from '~/data/privacy'
import { TERMS_UPDATED_AT } from '~/data/terms'
import { latestSitemapDay, sitemapDay, sitemapUrlEntry } from '~/utils/seo'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export default defineEventHandler(async event => {
  const baseUrl = String(useRuntimeConfig(event).public.baseUrl || '').replace(/\/+$/, '')

  // Rutas públicas fijas + proyectos con ficha de detalle (los "en desarrollo" no la tienen).
  const projects = await getPortfolioItems()
  // `lastmod` solo donde hay una fecha real: páginas legales, guías y proyectos. La home, «Cómo trabajo» y
  // «Cómo cobro» mezclan código y contenido del panel, así que van sin fecha; una inventada no ayuda.
  const entries: { path: string; lastmod?: string | null }[] = [
    { path: '/' },
    { path: '/como-trabajo' },
    { path: '/como-cobro' },
    { path: '/portafolio', lastmod: latestSitemapDay(projects.map(project => project.updatedAt)) },
    { path: '/privacidad', lastmod: PRIVACY_UPDATED_AT },
    { path: '/terminos-y-condiciones', lastmod: TERMS_UPDATED_AT },
    ...GUIDES.map(guide => ({ path: guide.path, lastmod: guide.updatedAt })),
    ...projects
      .filter(project => project.status !== 'in-development')
      .map(project => ({
        path: `/portafolio/${project.slug || project.id}`,
        lastmod: sitemapDay(project.updatedAt)
      }))
  ]

  const urls = entries
    .map(({ path, lastmod }) =>
      sitemapUrlEntry(escapeXml(`${baseUrl}${path === '/' ? '' : path}`), lastmod)
    )
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
