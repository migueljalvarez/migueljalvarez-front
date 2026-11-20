import { buildBreadcrumbList, type BreadcrumbItem } from '~/utils/seo'

const DEFAULT_OG_IMAGE = '/og-image.jpg'

/** URL base del sitio sin barra final. Viene de NUXT_PUBLIC_BASE_URL (igual en servidor y cliente). */
export const useSiteUrl = () => {
  const baseUrl = String(useRuntimeConfig().public.baseUrl || 'http://localhost:3000')
  return baseUrl.replace(/\/+$/, '')
}

type PageSeoOptions = {
  title: string
  description: string
  /** Ruta canónica, p. ej. '/portafolio'. */
  path: string
  /** Ruta o URL absoluta de la imagen para redes. */
  image?: string
  imageAlt?: string
  noindex?: boolean
}

/**
 * Metadatos por página: título, descripción, canonical, Open Graph y Twitter.
 * Usa siempre la URL base de la configuración (sin `window`) para evitar desajustes entre SSR y cliente.
 */
export const usePageSeo = (options: PageSeoOptions) => {
  const siteUrl = useSiteUrl()
  const url = `${siteUrl}${options.path === '/' ? '' : options.path}`
  const image = options.image ?? DEFAULT_OG_IMAGE
  const imageUrl = /^https?:\/\//.test(image) ? image : `${siteUrl}${image}`

  useSeoMeta({
    title: options.title,
    description: options.description,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow',
    ogType: 'website',
    ogLocale: 'es_CO',
    ogSiteName: 'Miguel Álvarez',
    ogTitle: options.title,
    ogDescription: options.description,
    ogUrl: url,
    ogImage: imageUrl,
    ogImageAlt: options.imageAlt ?? 'Miguel Álvarez, desarrollo de software',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: imageUrl
  })

  useHead({
    link: [{ rel: 'canonical', href: url }]
  })
}

/** Migas de pan en JSON-LD para una página interior (la portada ya lleva sus propios datos). */
export const useBreadcrumbJsonLd = (items: BreadcrumbItem[]) => {
  const siteUrl = useSiteUrl()
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(buildBreadcrumbList(siteUrl, items))
      }
    ]
  })
}
