import { z } from 'zod'
import type { AboutContent } from '../../types/about'
import { moveItem } from './siteContent.ts'

/**
 * Lógica pura (sin Nuxt) de la pantalla "Sobre mí" del panel. Las reglas coinciden con el contrato de
 * la API (`docs/openapi-panel.yaml`, sección About): lo que aquí es válido, la API lo acepta.
 */

// --- Límites (los mismos de la API) -------------------------------------------------------------

export const ABOUT_LIMITS = {
  eyebrow: 30,
  heading: 80,
  intro: 400,
  quote: 220,
  howIWork: 500,
  beyondWork: 500,
  location: 60,
  workMode: 40,
  availability: 80,
  stats: 4,
  statValue: 12,
  statLabel: 40,
  tools: 12,
  tool: 24,
  ctaLabel: 40,
  ctaHref: 200,
  images: 4,
  imagePath: 200,
  alt: 140
} as const

export const ABOUT_DEFAULT_EYEBROW = 'Sobre mí'

/** Imágenes que muestra el sitio (la API acepta 4: la cuarta queda de reserva). */
export const ABOUT_SITE_IMAGES = 3

const IMAGE_PATH_RE = /^\/about\/[a-z0-9]+(-[a-z0-9]+)*\.(webp|jpg|jpeg|png)$/
const HREF_RE = /^(\/(?!\/)|https:\/\/)\S*$/
const IMAGE_PATH_MESSAGE =
  'Escribe una ruta como /about/miguel.webp (minúsculas, números y guiones; webp, jpg, jpeg o png).'

// --- Tipos --------------------------------------------------------------------------------------

export type AboutStat = { value: string; label: string }

export type AboutImageRecord = {
  id: string
  path: string
  alt: string
  width: number | null
  height: number | null
  sortOrder: number
  isDefault: boolean
  createdAt: string
}

/** Lo que devuelve `GET/PUT /api/admin/about`. Los textos opcionales vacíos llegan como `''`. */
export type AboutAdminRecord = {
  eyebrow: string
  heading: string
  intro: string
  quote: string
  howIWork: string
  beyondWork: string
  location: string
  workMode: string
  availability: string
  stats: AboutStat[]
  tools: string[]
  ctaLabel: string
  ctaHref: string
  isPublished: boolean
  updatedAt: string | null
  images: AboutImageRecord[]
}

/** Una imagen en edición. Sin `id` = aún no registrada en la API. La posición en la lista es el orden. */
export type AboutImageDraft = {
  id?: string
  path: string
  alt: string
  isDefault: boolean
}

export type AboutFormValues = {
  eyebrow: string
  heading: string
  intro: string
  quote: string
  howIWork: string
  beyondWork: string
  location: string
  workMode: string
  availability: string
  stats: AboutStat[]
  tools: string[]
  ctaLabel: string
  ctaHref: string
  isPublished: boolean
  images: AboutImageDraft[]
}

export type AboutErrors = Record<string, string>

// --- Formulario ↔ registro ----------------------------------------------------------------------

export const emptyAboutForm = (): AboutFormValues => ({
  eyebrow: ABOUT_DEFAULT_EYEBROW,
  heading: '',
  intro: '',
  quote: '',
  howIWork: '',
  beyondWork: '',
  location: '',
  workMode: '',
  availability: '',
  stats: [],
  tools: [],
  ctaLabel: '',
  ctaHref: '',
  isPublished: false,
  images: []
})

export const formFromAboutRecord = (record: AboutAdminRecord): AboutFormValues => ({
  eyebrow: record.eyebrow || ABOUT_DEFAULT_EYEBROW,
  heading: record.heading,
  intro: record.intro,
  quote: record.quote,
  howIWork: record.howIWork,
  beyondWork: record.beyondWork,
  location: record.location,
  workMode: record.workMode,
  availability: record.availability,
  stats: record.stats.map(item => ({ value: item.value, label: item.label })),
  tools: [...record.tools],
  ctaLabel: record.ctaLabel,
  ctaHref: record.ctaHref,
  isPublished: record.isPublished,
  images: record.images.map(item => ({
    id: item.id,
    path: item.path,
    alt: item.alt,
    isDefault: item.isDefault
  }))
})

/** Quita espacios sobrantes y garantiza una sola imagen predeterminada (la primera si ninguna lo es). */
export const normalizeAboutForm = (raw: AboutFormValues): AboutFormValues => {
  const images = raw.images.map(item => ({
    ...(item.id ? { id: item.id } : {}),
    path: item.path.trim(),
    alt: item.alt.trim(),
    isDefault: item.isDefault
  }))
  const defaultIndex = Math.max(
    0,
    images.findIndex(item => item.isDefault)
  )
  return {
    eyebrow: raw.eyebrow.trim() || ABOUT_DEFAULT_EYEBROW,
    heading: raw.heading.trim(),
    intro: raw.intro.trim(),
    quote: raw.quote.trim(),
    howIWork: raw.howIWork.trim(),
    beyondWork: raw.beyondWork.trim(),
    location: raw.location.trim(),
    workMode: raw.workMode.trim(),
    availability: raw.availability.trim(),
    stats: raw.stats.map(item => ({ value: item.value.trim(), label: item.label.trim() })),
    tools: raw.tools.map(item => item.trim()),
    ctaLabel: raw.ctaLabel.trim(),
    ctaHref: raw.ctaHref.trim(),
    isPublished: raw.isPublished,
    images: images.map((item, index) => ({ ...item, isDefault: index === defaultIndex }))
  }
}

// --- Validación ---------------------------------------------------------------------------------

const text = (max: number, label: string) =>
  z.string().max(max, `${label} admite hasta ${max} caracteres.`)

const imageSchema = z.object({
  id: z.string().optional(),
  path: z
    .string()
    .min(1, 'Escribe la ruta de la imagen.')
    .max(ABOUT_LIMITS.imagePath, IMAGE_PATH_MESSAGE)
    .regex(IMAGE_PATH_RE, IMAGE_PATH_MESSAGE),
  alt: z
    .string()
    .min(1, 'Describe lo que se ve en la imagen (texto alternativo).')
    .max(ABOUT_LIMITS.alt, `El texto alternativo admite hasta ${ABOUT_LIMITS.alt} caracteres.`),
  isDefault: z.boolean()
})

const aboutSchema = z
  .object({
    eyebrow: z
      .string()
      .min(1)
      .max(
        ABOUT_LIMITS.eyebrow,
        `El sobre-título admite hasta ${ABOUT_LIMITS.eyebrow} caracteres.`
      ),
    heading: z
      .string()
      .min(1, 'Escribe el título de la sección.')
      .max(ABOUT_LIMITS.heading, `El título admite hasta ${ABOUT_LIMITS.heading} caracteres.`),
    intro: z
      .string()
      .min(1, 'Escribe la presentación.')
      .max(ABOUT_LIMITS.intro, `La presentación admite hasta ${ABOUT_LIMITS.intro} caracteres.`),
    quote: text(ABOUT_LIMITS.quote, 'La cita'),
    howIWork: text(ABOUT_LIMITS.howIWork, 'Este texto'),
    beyondWork: text(ABOUT_LIMITS.beyondWork, 'Este texto'),
    location: text(ABOUT_LIMITS.location, 'La ubicación'),
    workMode: text(ABOUT_LIMITS.workMode, 'El modo de trabajo'),
    availability: text(ABOUT_LIMITS.availability, 'La disponibilidad'),
    stats: z
      .array(
        z.object({
          value: z
            .string()
            .min(1, 'Escribe la cifra.')
            .max(
              ABOUT_LIMITS.statValue,
              `La cifra admite hasta ${ABOUT_LIMITS.statValue} caracteres.`
            ),
          label: z
            .string()
            .min(1, 'Escribe qué mide.')
            .max(ABOUT_LIMITS.statLabel, `Admite hasta ${ABOUT_LIMITS.statLabel} caracteres.`)
        })
      )
      .max(ABOUT_LIMITS.stats, `Máximo ${ABOUT_LIMITS.stats} cifras.`),
    tools: z
      .array(
        z
          .string()
          .min(1)
          .max(ABOUT_LIMITS.tool, `Cada herramienta admite hasta ${ABOUT_LIMITS.tool} caracteres.`)
      )
      .max(ABOUT_LIMITS.tools, `Máximo ${ABOUT_LIMITS.tools} herramientas.`),
    ctaLabel: text(ABOUT_LIMITS.ctaLabel, 'El texto del botón'),
    ctaHref: text(ABOUT_LIMITS.ctaHref, 'El enlace'),
    isPublished: z.boolean(),
    images: z.array(imageSchema).max(ABOUT_LIMITS.images, `Máximo ${ABOUT_LIMITS.images} imágenes.`)
  })
  .superRefine((value, ctx) => {
    const hasLabel = value.ctaLabel !== ''
    const hasHref = value.ctaHref !== ''
    if (hasLabel && !hasHref) {
      ctx.addIssue({ code: 'custom', path: ['ctaHref'], message: 'Escribe el enlace del botón.' })
    } else if (hasHref && !hasLabel) {
      ctx.addIssue({ code: 'custom', path: ['ctaLabel'], message: 'Escribe el texto del botón.' })
    }
    if (hasHref && !HREF_RE.test(value.ctaHref)) {
      ctx.addIssue({
        code: 'custom',
        path: ['ctaHref'],
        message: 'Usa una ruta del sitio (/#contacto) o una dirección que empiece por https://.'
      })
    }
    const seen = new Set<string>()
    value.images.forEach((image, index) => {
      if (seen.has(image.path)) {
        ctx.addIssue({
          code: 'custom',
          path: ['images', index, 'path'],
          message: 'Esta imagen ya está en la lista.'
        })
      }
      seen.add(image.path)
    })
    if (value.isPublished && value.images.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['isPublished'],
        message: 'Para publicar necesitas al menos una imagen con texto alternativo.'
      })
    }
  })

const errorMap = (error: z.ZodError): AboutErrors => {
  const map: AboutErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!map[key]) map[key] = issue.message
  }
  return map
}

export type AboutValidation = { valid: boolean; errors: AboutErrors; values: AboutFormValues }

export const validateAboutForm = (raw: AboutFormValues): AboutValidation => {
  const values = normalizeAboutForm(raw)
  const result = aboutSchema.safeParse(values)
  return result.success
    ? { valid: true, errors: {}, values }
    : { valid: false, errors: errorMap(result.error), values }
}

/** Requisitos para publicar, en el orden en que se leen en el panel. */
export type PublishRequirement = { id: 'heading' | 'intro' | 'image'; label: string; met: boolean }

export const aboutPublishRequirements = (raw: AboutFormValues): PublishRequirement[] => {
  const values = normalizeAboutForm(raw)
  return [
    { id: 'heading', label: 'Título de la sección', met: values.heading !== '' },
    { id: 'intro', label: 'Presentación', met: values.intro !== '' },
    {
      id: 'image',
      label: 'Al menos una imagen con texto alternativo',
      met: values.images.some(item => item.path !== '' && item.alt !== '')
    }
  ]
}

// --- Imágenes: orden y predeterminada -----------------------------------------------------------

/** La predeterminada va siempre primera (así la muestra el sitio); las demás conservan su orden. */
export const makeDefaultImage = (images: AboutImageDraft[], index: number): AboutImageDraft[] => {
  const target = images[index]
  if (!target) return images
  const rest = images.filter((_, i) => i !== index).map(item => ({ ...item, isDefault: false }))
  return [{ ...target, isDefault: true }, ...rest]
}

/** Al quitar una imagen, si era la predeterminada pasa a serlo la primera que quede (como en la API). */
export const removeImageAt = (images: AboutImageDraft[], index: number): AboutImageDraft[] => {
  const rest = images.filter((_, i) => i !== index)
  return rest.length && !rest.some(item => item.isDefault)
    ? rest.map((item, i) => ({ ...item, isDefault: i === 0 }))
    : rest
}

/** Mover una no predeterminada: nunca por encima de la predeterminada (posición 0). */
export const moveImage = (
  images: AboutImageDraft[],
  from: number,
  to: number
): AboutImageDraft[] => (from < 1 || to < 1 ? [...images] : moveItem(images, from, to))

// --- Cambios para la API ------------------------------------------------------------------------

export const hasAboutChanges = (saved: AboutFormValues, current: AboutFormValues): boolean =>
  JSON.stringify(normalizeAboutForm(saved)) !== JSON.stringify(normalizeAboutForm(current))

const OPTIONAL_TEXT_FIELDS = [
  'quote',
  'howIWork',
  'beyondWork',
  'location',
  'workMode',
  'availability',
  'ctaLabel',
  'ctaHref'
] as const

/** Cuerpo del `PUT /api/admin/about`: los opcionales vacíos se omiten (quedan vacíos en la API). */
export const buildAboutPayload = (values: AboutFormValues) => {
  const clean = normalizeAboutForm(values)
  const optional = Object.fromEntries(
    OPTIONAL_TEXT_FIELDS.filter(field => clean[field] !== '').map(field => [field, clean[field]])
  )
  return {
    eyebrow: clean.eyebrow,
    heading: clean.heading,
    intro: clean.intro,
    ...optional,
    stats: clean.stats,
    tools: clean.tools,
    isPublished: clean.isPublished
  }
}

const CONTENT_FIELDS = [
  'eyebrow',
  'heading',
  'intro',
  'quote',
  'howIWork',
  'beyondWork',
  'location',
  'workMode',
  'availability',
  'stats',
  'tools',
  'ctaLabel',
  'ctaHref',
  'isPublished'
] as const

const contentChanged = (saved: AboutFormValues, current: AboutFormValues) =>
  CONTENT_FIELDS.some(field => JSON.stringify(saved[field]) !== JSON.stringify(current[field]))

export type AboutImageChanges = { alt?: string; sortOrder?: number; isDefault?: true }

export type AboutStep =
  | { kind: 'save-content' }
  | { kind: 'remove-image'; id: string }
  | { kind: 'update-image'; id: string; changes: AboutImageChanges }
  | {
      kind: 'add-image'
      /** Posición en la lista en edición. */
      index: number
      body: { path: string; alt: string; sortOrder: number; isDefault?: true }
    }

/**
 * Pasos para llevar la API desde lo guardado (`saved`) hasta lo que hay en pantalla (`current`), en un
 * orden que respeta las reglas de la API:
 * - Despublicar va primero (así se pueden quitar imágenes sin dejar publicado algo sin imágenes).
 * - Publicar va al final (cuando las imágenes ya existen).
 * - Máximo 4 imágenes: si no hay sitio para las nuevas, primero se quitan; si lo hay, primero se
 *   añaden (así nunca queda publicado sin imágenes durante el cambio).
 */
export const buildAboutSteps = (saved: AboutFormValues, current: AboutFormValues): AboutStep[] => {
  const before = normalizeAboutForm(saved)
  const after = normalizeAboutForm(current)

  const keptIds = new Set(after.images.flatMap(item => (item.id ? [item.id] : [])))
  const removes: AboutStep[] = before.images
    .filter(item => item.id && !keptIds.has(item.id))
    .map(item => ({ kind: 'remove-image', id: item.id as string }))

  const savedById = new Map(before.images.map((item, index) => [item.id, { item, index }]))
  const keptBefore = before.images.filter(item => item.id && keptIds.has(item.id))
  const keptAfter = after.images.filter(item => item.id)
  // Solo se reescribe el orden si cambió el orden relativo de las que se conservan.
  const orderChanged =
    keptBefore.map(item => item.id).join() !== keptAfter.map(item => item.id).join()

  const updates: AboutStep[] = []
  after.images.forEach((item, index) => {
    const previous = item.id ? savedById.get(item.id) : undefined
    if (!item.id || !previous) return
    const changes: AboutImageChanges = {}
    if (item.alt !== previous.item.alt) changes.alt = item.alt
    if (orderChanged && index !== previous.index) changes.sortOrder = index
    if (item.isDefault && !previous.item.isDefault) changes.isDefault = true
    if (Object.keys(changes).length) updates.push({ kind: 'update-image', id: item.id, changes })
  })

  const adds: AboutStep[] = after.images.flatMap((item, index) =>
    item.id
      ? []
      : [
          {
            kind: 'add-image' as const,
            index,
            body: {
              path: item.path,
              alt: item.alt,
              sortOrder: index,
              ...(item.isDefault ? { isDefault: true as const } : {})
            }
          }
        ]
  )

  const content: AboutStep[] = contentChanged(before, after) ? [{ kind: 'save-content' }] : []
  const fitsFirst = before.images.length + adds.length <= ABOUT_LIMITS.images
  const images = fitsFirst ? [...adds, ...updates, ...removes] : [...removes, ...adds, ...updates]

  return before.isPublished && !after.isPublished
    ? [...content, ...images]
    : [...images, ...content]
}

// --- Vista previa -------------------------------------------------------------------------------

/** Lo que mostraría el sitio con lo que hay en el formulario (para la vista previa del panel). */
export const formToAboutContent = (raw: AboutFormValues): AboutContent => {
  const values = normalizeAboutForm(raw)
  const cta =
    values.ctaLabel && HREF_RE.test(values.ctaHref)
      ? { label: values.ctaLabel, href: values.ctaHref }
      : undefined
  return {
    eyebrow: values.eyebrow,
    heading: values.heading,
    intro: values.intro,
    quote: values.quote || undefined,
    howIWork: values.howIWork || undefined,
    beyondWork: values.beyondWork || undefined,
    location: values.location || undefined,
    workMode: values.workMode || undefined,
    availability: values.availability || undefined,
    stats: values.stats.filter(item => item.value && item.label),
    tools: values.tools.filter(Boolean),
    cta,
    images: values.images
      .filter(item => IMAGE_PATH_RE.test(item.path) && item.alt)
      .slice(0, ABOUT_SITE_IMAGES)
      .map(item => ({ src: item.path, alt: item.alt }))
  }
}

export const formatAboutDate = (iso: string | null): string => {
  if (!iso) return 'nunca'
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? 'nunca'
    : new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}
