import { z } from 'zod'

/**
 * Lógica pura (sin Nuxt) del módulo «Ofertas» del panel. Las reglas coinciden con el DTO y los CHECK de la API
 * (`service-offers-admin.dto.ts`, migración 0017): lo que aquí es válido, la API lo acepta. Montos en USD enteros.
 */

export const OFFER_TITLE_MAX = 120
export const OFFER_SUMMARY_MAX = 300
export const OFFER_INCLUDE_MAX = 160
export const OFFER_INCLUDES_LIMIT = 8
export const OFFER_DURATION_MAX = 60
export const OFFER_NOTE_MAX = 80
export const OFFER_SLUG_MAX = 60
export const OFFER_PRICE_MAX = 1_000_000
export const OFFER_ORDER_MAX = 9999

export type ServiceOfferRecord = {
  id: string
  slug: string
  title: string
  summary: string
  includes: string[]
  duration: string
  priceFromUsd: number
  launchPriceFromUsd: number | null
  launchEnabled: boolean
  launchNote: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

/** Dirección sugerida a partir del título: minúsculas, sin tildes, con guiones. */
export const slugifyOfferTitle = (title: string): string =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, OFFER_SLUG_MAX)
    .replace(/-+$/, '')

/** Texto del área «Qué incluye» (una línea por elemento) → arreglo sin líneas vacías. */
export const includesFromText = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

const priceField = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, `${label}: escribe un número entero de dólares, sin puntos ni símbolos.`)
    .transform(Number)
    .refine(
      value => value >= 1 && value <= OFFER_PRICE_MAX,
      `${label}: entre 1 y ${OFFER_PRICE_MAX}.`
    )

/** Formulario de oferta. Todo se escribe como texto; sale con números, arreglo y `null` donde corresponda. */
export const offerFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Escribe el nombre de la oferta.')
      .max(OFFER_TITLE_MAX, `Máximo ${OFFER_TITLE_MAX} caracteres.`),
    slug: z
      .string()
      .trim()
      .min(1, 'Escribe la dirección de la oferta.')
      .max(OFFER_SLUG_MAX, `Máximo ${OFFER_SLUG_MAX} caracteres.`)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones, p. ej. code-review.'),
    summary: z
      .string()
      .trim()
      .min(1, 'Cuenta en una o dos frases qué es.')
      .max(OFFER_SUMMARY_MAX, `Máximo ${OFFER_SUMMARY_MAX} caracteres.`),
    includes: z
      .string()
      .transform(includesFromText)
      .refine(
        lines => lines.length <= OFFER_INCLUDES_LIMIT,
        `Máximo ${OFFER_INCLUDES_LIMIT} líneas.`
      )
      .refine(
        lines => lines.every(line => line.length <= OFFER_INCLUDE_MAX),
        `Cada línea admite hasta ${OFFER_INCLUDE_MAX} caracteres.`
      ),
    duration: z.string().trim().max(OFFER_DURATION_MAX, `Máximo ${OFFER_DURATION_MAX} caracteres.`),
    priceFromUsd: priceField('Precio'),
    launchPriceFromUsd: z
      .string()
      .trim()
      .transform(value => (value === '' ? null : value))
      .pipe(z.union([z.null(), priceField('Precio de lanzamiento')])),
    launchEnabled: z.boolean(),
    launchNote: z.string().trim().max(OFFER_NOTE_MAX, `Máximo ${OFFER_NOTE_MAX} caracteres.`),
    sortOrder: z
      .string()
      .trim()
      .regex(/^\d{1,4}$/, `Escribe un número entero entre 0 y ${OFFER_ORDER_MAX}.`)
      .transform(Number),
    isPublished: z.boolean()
  })
  .superRefine((offer, ctx) => {
    if (offer.launchPriceFromUsd !== null && offer.launchPriceFromUsd >= offer.priceFromUsd) {
      ctx.addIssue({
        code: 'custom',
        path: ['launchPriceFromUsd'],
        message: 'El precio de lanzamiento debe ser menor que el precio normal.'
      })
    }
    if (offer.launchEnabled && offer.launchPriceFromUsd === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['launchPriceFromUsd'],
        message: 'Para activar el lanzamiento escribe su precio.'
      })
    }
  })

export type OfferFormOutput = z.output<typeof offerFormSchema>

/** Orden sugerido para una oferta nueva: al final de la lista, de 10 en 10 para poder intercalar. */
export const nextOfferOrder = (offers: { sortOrder: number }[]) =>
  Math.min(
    OFFER_ORDER_MAX,
    offers.length ? Math.max(...offers.map(offer => offer.sortOrder)) + 10 : 0
  )

/** Valores iniciales del formulario (todo como texto) para crear o editar. */
export const offerFormDefaults = (offer: ServiceOfferRecord | null, order: number) => ({
  title: offer?.title ?? '',
  slug: offer?.slug ?? '',
  summary: offer?.summary ?? '',
  includes: (offer?.includes ?? []).join('\n'),
  duration: offer?.duration ?? '',
  priceFromUsd: offer ? String(offer.priceFromUsd) : '',
  launchPriceFromUsd: offer?.launchPriceFromUsd == null ? '' : String(offer.launchPriceFromUsd),
  launchEnabled: offer?.launchEnabled ?? false,
  launchNote: offer?.launchNote ?? '',
  sortOrder: String(offer?.sortOrder ?? order),
  isPublished: offer?.isPublished ?? false
})
