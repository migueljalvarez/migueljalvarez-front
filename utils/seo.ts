/**
 * Datos estructurados (schema.org) y entradas de sitemap. Lógica pura: se prueba en tests/seoStructured.test.mjs.
 */
export type BreadcrumbItem = { name: string; path: string }

const absolute = (siteUrl: string, path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl.replace(/\/+$/, '')}${path === '/' ? '' : path}`

/** URL absoluta: una ruta del sitio se completa con el dominio; una URL https (p. ej. R2) se deja tal cual. */
export const absoluteUrl = absolute

/** Migas de pan: la primera es siempre «Inicio». `path` es la ruta pública de cada nivel. */
export const buildBreadcrumbList = (siteUrl: string, items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Inicio', path: '/' }, ...items].map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absolute(siteUrl, item.path)
  }))
})

type ProjectLike = {
  slug?: string
  id: string
  title: string
  description?: string
  ogImage?: string
  url?: string
}

/** Ficha de proyecto como obra del autor (`#person` es el de la portada). Solo incluye lo que existe. */
export const buildProjectSchema = (siteUrl: string, project: ProjectLike) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  url: absolute(siteUrl, `/portafolio/${project.slug || project.id}`),
  author: { '@id': `${siteUrl.replace(/\/+$/, '')}/#person` },
  ...(project.description ? { description: project.description } : {}),
  ...(project.ogImage ? { image: absolute(siteUrl, project.ogImage) } : {}),
  ...(project.url ? { sameAs: [project.url] } : {})
})

/** Fecha `YYYY-MM-DD` válida (la que acepta el sitemap) o null. */
export const sitemapDate = (value: string | undefined | null): string | null =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : null

/** Una entrada `<url>`; `lastmod` solo si hay una fecha real (una inventada empeora la señal). */
export const sitemapUrlEntry = (loc: string, lastmod?: string | null) => {
  const date = sitemapDate(lastmod)
  return `  <url><loc>${loc}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`
}

type ArticleLike = {
  path: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
}

/** Guía como artículo del autor (`#person` es el de la portada). Fechas ISO AAAA-MM-DD. */
export const buildArticleSchema = (siteUrl: string, article: ArticleLike) => {
  const url = absolute(siteUrl, article.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'es',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    author: { '@id': `${siteUrl.replace(/\/+$/, '')}/#person` }
  }
}
