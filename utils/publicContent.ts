import type { AboutContent, AboutImage } from '~/types/about'
import type { PortfolioType, SocialMediaType } from '~/types/common'
import type { PortfolioCardProject } from '~/types/portfolio'

/**
 * Forma de las respuestas públicas de la API (migueljalvarez-api, docs/openapi-panel.yaml) y su
 * conversión a los tipos del sitio. Funciones puras, sin Nuxt, para poder probarlas.
 */

export type ApiPortfolioEntry = {
  slug: string
  title: string
  type: 'client' | 'product'
  status: 'published' | 'in-development'
  description: string
  role?: string
  year?: string
  duration?: string
  problem?: string
  decision?: string
  result?: string
  highlights: { value: string; label: string }[]
  scope: string[]
  technologies: string[]
  coverImage: string
  ogImage?: string
  url?: string
  featured: boolean
  audience?: string
  tags: string[]
  gallery: { src: string; alt: string; caption?: string }[]
}

export type ApiSocialLink = { name: string; url: string; icon: string }
export type ApiPolicy = { title: string; body: string }

/** Bloque de política que muestra `/como-trabajo`. */
export type PolicyBlock = { id: string; title: string; body: string }

/** Etiqueta de presentación que usa la ficha de detalle. */
const PORTFOLIO_TYPE_LABEL: Record<ApiPortfolioEntry['type'], string> = {
  product: 'Producto propio',
  client: 'Cliente'
}

/** Las listas vacías y los textos vacíos se omiten: la interfaz solo muestra lo que tiene contenido. */
export const mapApiPortfolioEntry = (entry: ApiPortfolioEntry): PortfolioType => ({
  id: entry.slug,
  slug: entry.slug,
  title: entry.title,
  type: entry.type,
  portfolioType: PORTFOLIO_TYPE_LABEL[entry.type],
  status: entry.status,
  description: entry.description,
  role: entry.role,
  year: entry.year,
  duration: entry.duration,
  problem: entry.problem,
  decision: entry.decision,
  result: entry.result,
  highlights: entry.highlights.length > 0 ? entry.highlights : undefined,
  scope: entry.scope.length > 0 ? entry.scope : undefined,
  technologies: entry.technologies,
  urlImage: entry.coverImage,
  ogImage: entry.ogImage,
  url: entry.url,
  gallery: entry.gallery.length > 0 ? entry.gallery : undefined,
  tags: entry.tags,
  audience: entry.audience
})

export const mapApiSocialLink = (link: ApiSocialLink): SocialMediaType => ({
  name: link.name,
  link: link.url,
  icon: link.icon
})

/** Identificador estable para la clave de lista: título normalizado (la API no expone ids de política). */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const mapApiPolicy = (policy: ApiPolicy, index: number): PolicyBlock => ({
  id: `${index}-${slugify(policy.title)}`,
  title: policy.title,
  body: policy.body
})

/**
 * Tarjeta del portafolio (home y /portafolio). Las etiquetas y el público objetivo vienen de la ficha;
 * sin ficha de detalle mientras el proyecto está en desarrollo (no hay contenido real que mostrar).
 */
export const toPortfolioCardProject = (
  item: PortfolioType,
  options: { primary?: boolean } = {}
): PortfolioCardProject => {
  const slug = item.slug || item.id
  return {
    id: item.id,
    slug,
    title: item.title,
    description: item.description,
    type: item.type === 'client' ? 'client' : 'product',
    tags: item.tags ?? [],
    audience: item.audience ?? '',
    image: item.urlImage,
    href: item.status === 'in-development' ? '' : `/portafolio/${slug}`,
    primary: options.primary,
    status: item.status,
    sample: item.sample
  }
}

/** Tarjetas de la home: las primeras `limit`, la primera marcada como destacada. */
export const toHomeCardProjects = (items: PortfolioType[], limit = 5): PortfolioCardProject[] =>
  items.slice(0, limit).map((item, index) => toPortfolioCardProject(item, { primary: index === 0 }))

// --- Sobre mí -----------------------------------------------------------------------------------

/** Forma de `GET /api/about` de la API (los opcionales vacíos vienen omitidos). */
export type ApiAbout = {
  eyebrow: string
  heading: string
  intro: string
  quote?: string
  howIWork?: string
  beyondWork?: string
  location?: string
  workMode?: string
  availability?: string
  stats: { value: string; label: string }[]
  tools: string[]
  cta?: { label: string; href: string }
  images: { src: string; alt: string; width?: number; height?: number }[]
}

/** El collage muestra como máximo estas imágenes (la API puede enviar hasta 4). */
export const ABOUT_MAX_IMAGES = 3

const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0
const optionalText = (value: unknown): string | undefined =>
  isText(value) ? value.trim() : undefined
const isDimension = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0

/** Solo rutas del propio sitio (`/about/…`): nunca una URL externa ni una ruta rara. */
const isSiteImage = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\/(?!\/)[A-Za-z0-9_\-./]+\.(webp|jpe?g|png)$/.test(value) &&
  !value.includes('..')
const isSafeHref = (value: unknown): value is string =>
  typeof value === 'string' && /^(\/(?!\/)|https:\/\/)\S*$/.test(value)

/**
 * Convierte la respuesta de la API en contenido del sitio. Devuelve `null` ante cualquier forma
 * inválida (faltan título, presentación o imágenes): el llamador usa entonces el respaldo del código.
 * Lo opcional vacío se omite y las listas se recortan a su máximo.
 */
export const mapApiAbout = (raw: unknown): AboutContent | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<ApiAbout>
  if (!isText(data.heading) || !isText(data.intro) || !Array.isArray(data.images)) return null

  const images: AboutImage[] = data.images
    .filter(item => item && isSiteImage(item.src) && isText(item.alt))
    .slice(0, ABOUT_MAX_IMAGES)
    .map(item => ({
      src: item.src,
      alt: item.alt.trim(),
      ...(isDimension(item.width) && isDimension(item.height)
        ? { width: item.width, height: item.height }
        : {})
    }))
  if (images.length === 0) return null

  const stats = (Array.isArray(data.stats) ? data.stats : [])
    .filter(item => item && isText(item.value) && isText(item.label))
    .slice(0, 4)
    .map(item => ({ value: item.value.trim(), label: item.label.trim() }))
  const tools = (Array.isArray(data.tools) ? data.tools : []).filter(isText).slice(0, 12)
  const cta =
    data.cta && isText(data.cta.label) && isSafeHref(data.cta.href)
      ? { label: data.cta.label.trim(), href: data.cta.href }
      : undefined

  return {
    eyebrow: optionalText(data.eyebrow) ?? 'Sobre mí',
    heading: data.heading.trim(),
    intro: data.intro.trim(),
    quote: optionalText(data.quote),
    howIWork: optionalText(data.howIWork),
    beyondWork: optionalText(data.beyondWork),
    location: optionalText(data.location),
    workMode: optionalText(data.workMode),
    availability: optionalText(data.availability),
    stats,
    tools,
    cta,
    images
  }
}
