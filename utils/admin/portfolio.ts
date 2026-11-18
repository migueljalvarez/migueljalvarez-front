import { z } from 'zod'
import type { PortfolioCardProject } from '../../components/templates/Portfolio/portfolio.types'
import { mapApiPortfolioEntry, toPortfolioCardProject } from '../publicContent.ts'
import { moveItem } from './siteContent.ts'

/**
 * Lógica pura (sin Nuxt) del editor de portafolio del panel. Las reglas coinciden con los DTO de la
 * API (`portfolio-admin.dto.ts`): lo que aquí es válido, la API lo acepta.
 */

// --- Límites (los mismos del DTO) ---------------------------------------------------------------

export const PORTFOLIO_LIMITS = {
  title: 120,
  slug: 80,
  description: 400,
  role: 120,
  year: 20,
  duration: 60,
  story: 1500,
  audience: 160,
  url: 300,
  tags: 4,
  tag: 40,
  highlights: 6,
  highlightValue: 40,
  highlightLabel: 120,
  listItems: 12,
  listItem: 120,
  gallery: 6,
  alt: 200,
  caption: 200,
  sortOrder: 9999
} as const

export const PORTFOLIO_KIND_OPTIONS = [
  { value: 'client', label: 'Trabajo para un cliente' },
  { value: 'product', label: 'Producto propio' }
] as const

export const PORTFOLIO_KIND_LABEL = { client: 'Cliente', product: 'Producto propio' } as const

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const IMAGE_RE = /^\/[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*\.(webp|jpe?g|png)$/
const URL_RE = /^https:\/\/\S+$/
const IMAGE_MESSAGE =
  'Escribe una ruta del sitio como /projects/mi-app/cover.webp (webp, jpg, jpeg o png; sin espacios ni puntos extra).'

// --- Tipos --------------------------------------------------------------------------------------

export type PortfolioKind = 'client' | 'product'
export type PortfolioStatus = 'published' | 'in-development'
export type PortfolioHighlight = { value: string; label: string }

export type PortfolioMediaRecord = {
  id: string
  path: string
  alt: string
  caption: string
  sortOrder: number
}

/** Respuesta de la API para una ficha (lista y detalle; el detalle añade `media`). */
export type PortfolioEntryRecord = {
  id: string
  projectId: string | null
  slug: string
  title: string
  kind: PortfolioKind
  status: PortfolioStatus
  description: string
  role: string
  year: string
  duration: string
  problem: string
  decision: string
  result: string
  highlights: PortfolioHighlight[]
  scope: string[]
  technologies: string[]
  audience: string
  tags: string[]
  coverPath: string
  ogPath: string
  url: string
  featured: boolean
  sortOrder: number
  isPublished: boolean
  publishedAt: string | null
  mediaCount: number
  createdAt: string
  updatedAt: string
}

export type PortfolioDetailRecord = PortfolioEntryRecord & { media: PortfolioMediaRecord[] }

/** Imagen de la galería en edición; `id` solo existe si ya está guardada en la API. */
export type PortfolioGalleryDraft = { id?: string; path: string; alt: string; caption: string }

export type PortfolioFormValues = {
  title: string
  slug: string
  kind: PortfolioKind
  status: PortfolioStatus
  description: string
  url: string
  tags: string[]
  audience: string
  role: string
  year: string
  duration: string
  problem: string
  decision: string
  result: string
  highlights: PortfolioHighlight[]
  scope: string[]
  technologies: string[]
  coverPath: string
  ogPath: string
  gallery: PortfolioGalleryDraft[]
  isPublished: boolean
  featured: boolean
  /** Se escribe como texto y sale como entero 0–9999. */
  sortOrder: string
}

// --- Listas, slug y normalización ---------------------------------------------------------------

/** Recorta, descarta vacíos y repetidos (sin distinguir mayúsculas; gana la primera escritura). */
export const normalizeList = (list: string[]): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of list) {
    const value = item.trim()
    const key = value.toLowerCase()
    if (!value || seen.has(key)) continue
    seen.add(key)
    out.push(value)
  }
  return out
}

/** Sugiere la dirección pública desde el título: sin acentos ni símbolos, en minúsculas y con guiones. */
export const suggestSlug = (title: string): string =>
  title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, PORTFOLIO_LIMITS.slug)
    .replace(/-+$/, '')

export { moveItem }

export const emptyPortfolioForm = (): PortfolioFormValues => ({
  title: '',
  slug: '',
  kind: 'client',
  status: 'published',
  description: '',
  url: '',
  tags: [],
  audience: '',
  role: '',
  year: '',
  duration: '',
  problem: '',
  decision: '',
  result: '',
  highlights: [],
  scope: [],
  technologies: [],
  coverPath: '',
  ogPath: '',
  gallery: [],
  isPublished: false,
  featured: false,
  sortOrder: '0'
})

/** Valores del formulario a partir de la respuesta de la API (con la galería ya ordenada). */
export const formFromRecord = (record: PortfolioDetailRecord): PortfolioFormValues => ({
  title: record.title,
  slug: record.slug,
  kind: record.kind,
  status: record.status,
  description: record.description,
  url: record.url,
  tags: [...record.tags],
  audience: record.audience,
  role: record.role,
  year: record.year,
  duration: record.duration,
  problem: record.problem,
  decision: record.decision,
  result: record.result,
  highlights: record.highlights.map(({ value, label }) => ({ value, label })),
  scope: [...record.scope],
  technologies: [...record.technologies],
  coverPath: record.coverPath,
  ogPath: record.ogPath,
  gallery: [...record.media]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ id, path, alt, caption }) => ({ id, path, alt, caption })),
  isPublished: record.isPublished,
  featured: record.featured,
  sortOrder: String(record.sortOrder)
})

/** Recorta textos y normaliza listas: lo que se compara, valida y envía. */
export const normalizePortfolioForm = (values: PortfolioFormValues): PortfolioFormValues => ({
  ...values,
  title: values.title.trim(),
  slug: values.slug.trim(),
  description: values.description.trim(),
  url: values.url.trim(),
  tags: normalizeList(values.tags),
  audience: values.audience.trim(),
  role: values.role.trim(),
  year: values.year.trim(),
  duration: values.duration.trim(),
  problem: values.problem.trim(),
  decision: values.decision.trim(),
  result: values.result.trim(),
  highlights: values.highlights
    .map(item => ({ value: item.value.trim(), label: item.label.trim() }))
    .filter(item => item.value || item.label),
  scope: normalizeList(values.scope),
  technologies: normalizeList(values.technologies),
  coverPath: values.coverPath.trim(),
  ogPath: values.ogPath.trim(),
  gallery: values.gallery.map(item => ({
    ...(item.id ? { id: item.id } : {}),
    path: item.path.trim(),
    alt: item.alt.trim(),
    caption: item.caption.trim()
  })),
  sortOrder: values.sortOrder.trim()
})

// --- Validación ---------------------------------------------------------------------------------

const max = (n: number) => `Máximo ${n} caracteres.`

const listOf = (itemMax: number, listMax: number, listMessage: string) =>
  z.array(z.string().min(1).max(itemMax, max(itemMax))).max(listMax, listMessage)

const portfolioSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Escribe el título del proyecto.')
      .max(PORTFOLIO_LIMITS.title, max(PORTFOLIO_LIMITS.title)),
    slug: z
      .string()
      .min(1, 'Escribe la dirección del proyecto, p. ej. mi-despensa.')
      .max(PORTFOLIO_LIMITS.slug, max(PORTFOLIO_LIMITS.slug))
      .regex(
        SLUG_RE,
        'Usa solo minúsculas, números y guiones, sin espacios ni tildes, p. ej. mi-despensa.'
      ),
    kind: z.enum(['client', 'product'], { message: 'Elige el tipo de proyecto.' }),
    status: z.enum(['published', 'in-development']),
    description: z
      .string()
      .min(1, 'Escribe una descripción de 1 o 2 frases: es lo que se ve en la tarjeta.')
      .max(PORTFOLIO_LIMITS.description, max(PORTFOLIO_LIMITS.description)),
    url: z
      .string()
      .max(PORTFOLIO_LIMITS.url, max(PORTFOLIO_LIMITS.url))
      .refine(
        value => value === '' || URL_RE.test(value),
        'Escribe una dirección que empiece por https://, p. ej. https://mi-app.co.'
      ),
    tags: listOf(
      PORTFOLIO_LIMITS.tag,
      PORTFOLIO_LIMITS.tags,
      `Puedes usar hasta ${PORTFOLIO_LIMITS.tags} etiquetas.`
    ),
    audience: z.string().max(PORTFOLIO_LIMITS.audience, max(PORTFOLIO_LIMITS.audience)),
    role: z.string().max(PORTFOLIO_LIMITS.role, max(PORTFOLIO_LIMITS.role)),
    year: z.string().max(PORTFOLIO_LIMITS.year, max(PORTFOLIO_LIMITS.year)),
    duration: z.string().max(PORTFOLIO_LIMITS.duration, max(PORTFOLIO_LIMITS.duration)),
    problem: z.string().max(PORTFOLIO_LIMITS.story, max(PORTFOLIO_LIMITS.story)),
    decision: z.string().max(PORTFOLIO_LIMITS.story, max(PORTFOLIO_LIMITS.story)),
    result: z.string().max(PORTFOLIO_LIMITS.story, max(PORTFOLIO_LIMITS.story)),
    highlights: z
      .array(
        z.object({
          value: z
            .string()
            .min(1, 'Escribe la cifra, p. ej. 30 %.')
            .max(PORTFOLIO_LIMITS.highlightValue, max(PORTFOLIO_LIMITS.highlightValue)),
          label: z
            .string()
            .min(1, 'Explica qué mide la cifra.')
            .max(PORTFOLIO_LIMITS.highlightLabel, max(PORTFOLIO_LIMITS.highlightLabel))
        })
      )
      .max(
        PORTFOLIO_LIMITS.highlights,
        `Puedes destacar hasta ${PORTFOLIO_LIMITS.highlights} cifras.`
      ),
    scope: listOf(
      PORTFOLIO_LIMITS.listItem,
      PORTFOLIO_LIMITS.listItems,
      `Puedes listar hasta ${PORTFOLIO_LIMITS.listItems} elementos.`
    ),
    technologies: listOf(
      PORTFOLIO_LIMITS.listItem,
      PORTFOLIO_LIMITS.listItems,
      `Puedes listar hasta ${PORTFOLIO_LIMITS.listItems} tecnologías.`
    ),
    coverPath: z.string().refine(value => value === '' || IMAGE_RE.test(value), IMAGE_MESSAGE),
    ogPath: z.string().refine(value => value === '' || IMAGE_RE.test(value), IMAGE_MESSAGE),
    gallery: z
      .array(
        z.object({
          id: z.string().optional(),
          path: z
            .string()
            .min(1, 'Escribe la ruta de la imagen, p. ej. /projects/mi-app/01-inicio.webp.')
            .regex(IMAGE_RE, IMAGE_MESSAGE),
          alt: z
            .string()
            .min(1, 'Describe lo que se ve en la imagen: es el texto alternativo.')
            .max(PORTFOLIO_LIMITS.alt, max(PORTFOLIO_LIMITS.alt)),
          caption: z.string().max(PORTFOLIO_LIMITS.caption, max(PORTFOLIO_LIMITS.caption))
        })
      )
      .max(
        PORTFOLIO_LIMITS.gallery,
        `La galería admite hasta ${PORTFOLIO_LIMITS.gallery} imágenes.`
      ),
    isPublished: z.boolean(),
    featured: z.boolean(),
    sortOrder: z
      .string()
      .regex(/^\d{1,4}$/, `Escribe un número entero entre 0 y ${PORTFOLIO_LIMITS.sortOrder}.`)
  })
  .superRefine((value, ctx) => {
    if (value.isPublished && !value.coverPath) {
      ctx.addIssue({
        code: 'custom',
        path: ['coverPath'],
        message: 'Para publicar necesitas una imagen de portada. Añade su ruta.'
      })
    }
  })

export type PortfolioErrors = Record<string, string>

/** Convierte los problemas de Zod en un mapa `ruta → mensaje` (p. ej. `highlights.1.value`). */
const errorMap = (error: z.ZodError): PortfolioErrors => {
  const map: PortfolioErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!map[key]) map[key] = issue.message
  }
  return map
}

export type PortfolioValidation = {
  valid: boolean
  errors: PortfolioErrors
  values: PortfolioFormValues
}

/** Valida el formulario ya normalizado. `errors` queda vacío cuando `valid` es verdadero. */
export const validatePortfolioForm = (raw: PortfolioFormValues): PortfolioValidation => {
  const values = normalizePortfolioForm(raw)
  const result = portfolioSchema.safeParse(values)
  return result.success
    ? { valid: true, errors: {}, values }
    : { valid: false, errors: errorMap(result.error), values }
}

/** Primer mensaje de error de un campo o de cualquiera de sus elementos (`tags`, `tags.2`…). */
export const errorOf = (errors: PortfolioErrors, field: string): string | undefined => {
  if (errors[field]) return errors[field]
  const prefix = `${field}.`
  const key = Object.keys(errors).find(item => item.startsWith(prefix))
  return key ? errors[key] : undefined
}

// --- Cambios para la API ------------------------------------------------------------------------

const ENTRY_FIELDS = [
  'title',
  'slug',
  'kind',
  'status',
  'description',
  'url',
  'tags',
  'audience',
  'role',
  'year',
  'duration',
  'problem',
  'decision',
  'result',
  'highlights',
  'scope',
  'technologies',
  'coverPath',
  'ogPath',
  'featured',
  'sortOrder'
] as const

type EntryField = (typeof ENTRY_FIELDS)[number]

const fieldValue = (values: PortfolioFormValues, field: EntryField) =>
  field === 'sortOrder' ? Number(values.sortOrder) : values[field]

/** Cuerpo del `POST admin/portfolio`: siempre nace como borrador (la API ignora `isPublished`). */
export const buildCreatePayload = (values: PortfolioFormValues) => {
  const clean = normalizePortfolioForm(values)
  return Object.fromEntries(ENTRY_FIELDS.map(field => [field, fieldValue(clean, field)]))
}

/** Cuerpo del `PATCH admin/portfolio/{id}`: solo lo que cambió respecto a lo guardado. */
export const buildUpdatePayload = (saved: PortfolioFormValues, current: PortfolioFormValues) => {
  const before = normalizePortfolioForm(saved)
  const after = normalizePortfolioForm(current)
  const payload: Record<string, unknown> = {}
  for (const field of [...ENTRY_FIELDS, 'isPublished'] as const) {
    const a = field === 'isPublished' ? before.isPublished : fieldValue(before, field)
    const b = field === 'isPublished' ? after.isPublished : fieldValue(after, field)
    if (JSON.stringify(a) !== JSON.stringify(b)) payload[field] = b
  }
  return payload
}

/** ¿Hay cambios sin guardar? Incluye la galería. */
export const hasPortfolioChanges = (saved: PortfolioFormValues, current: PortfolioFormValues) =>
  JSON.stringify(normalizePortfolioForm(saved)) !== JSON.stringify(normalizePortfolioForm(current))

export type GalleryPlan = {
  remove: string[]
  update: {
    id: string
    changes: Partial<Pick<PortfolioMediaRecord, 'path' | 'alt' | 'caption' | 'sortOrder'>>
  }[]
  /** `index` es la posición en la galería en edición (para asignarle el `id` al crearse). */
  create: {
    index: number
    body: { path: string; alt: string; caption: string; sortOrder: number }
  }[]
}

/**
 * Operaciones de la galería para llegar de lo guardado a lo editado. La posición en la lista es el
 * orden (`sortOrder`). Se quitan primero las imágenes (libera cupo del máximo de 6).
 */
export const planGalleryChanges = (
  saved: PortfolioMediaRecord[],
  current: PortfolioGalleryDraft[]
): GalleryPlan => {
  const byId = new Map(saved.map(item => [item.id, item]))
  const keptIds = new Set(current.map(item => item.id).filter(Boolean))
  const plan: GalleryPlan = {
    remove: saved.filter(item => !keptIds.has(item.id)).map(item => item.id),
    update: [],
    create: []
  }
  current.forEach((draft, index) => {
    const before = draft.id ? byId.get(draft.id) : undefined
    const path = draft.path.trim()
    const alt = draft.alt.trim()
    const caption = draft.caption.trim()
    if (!draft.id || !before) {
      plan.create.push({ index, body: { path, alt, caption, sortOrder: index } })
      return
    }
    const changes: GalleryPlan['update'][number]['changes'] = {}
    if (before.path !== path) changes.path = path
    if (before.alt !== alt) changes.alt = alt
    if (before.caption !== caption) changes.caption = caption
    if (before.sortOrder !== index) changes.sortOrder = index
    if (Object.keys(changes).length) plan.update.push({ id: draft.id, changes })
  })
  return plan
}

// --- Publicación y presentación -----------------------------------------------------------------

export type PublishRequirement = { id: 'cover' | 'description'; label: string; met: boolean }

/** Lo que la API exige para publicar (la portada) y lo que la tarjeta necesita (la descripción). */
export const publishRequirements = (values: PortfolioFormValues): PublishRequirement[] => [
  { id: 'cover', label: 'Tiene portada', met: values.coverPath.trim() !== '' },
  { id: 'description', label: 'Tiene descripción', met: values.description.trim() !== '' }
]

export const canPublish = (values: PortfolioFormValues) =>
  publishRequirements(values).every(item => item.met)

export type PortfolioStateBadge = { label: string; tone: 'success' | 'neutral' | 'warning' }

/** Estado visible en la lista: siempre con texto (Borrador, Publicado, En desarrollo). */
export const portfolioStateBadge = (
  entry: Pick<PortfolioEntryRecord, 'isPublished' | 'status'>
): PortfolioStateBadge => {
  if (!entry.isPublished) return { label: 'Borrador', tone: 'neutral' }
  return entry.status === 'in-development'
    ? { label: 'En desarrollo', tone: 'warning' }
    : { label: 'Publicado', tone: 'success' }
}

/** Dirección pública de la ficha: solo existe si está publicada y no es "en desarrollo". */
export const publicPortfolioPath = (
  entry: Pick<PortfolioEntryRecord, 'isPublished' | 'status' | 'slug'>
) => (entry.isPublished && entry.status === 'published' ? `/portafolio/${entry.slug}` : '')

/** Fecha corta y estable entre servidor y navegador (zona de Colombia). */
export const formatPortfolioDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'America/Bogota'
      }).format(new Date(iso))
    : '—'

/** Tarjeta de la home tal como la produciría el sitio con los valores del formulario. */
export const formToCardProject = (values: PortfolioFormValues): PortfolioCardProject => {
  const clean = normalizePortfolioForm(values)
  const entry = mapApiPortfolioEntry({
    slug: clean.slug || 'proyecto',
    title: clean.title,
    type: clean.kind,
    status: clean.status,
    description: clean.description,
    highlights: clean.highlights,
    scope: clean.scope,
    technologies: clean.technologies,
    coverImage: clean.coverPath,
    featured: clean.featured,
    audience: clean.audience,
    tags: clean.tags,
    gallery: []
  })
  return toPortfolioCardProject(entry)
}
