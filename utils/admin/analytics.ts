import { z } from 'zod'
import { TRACK_BUTTON_IDS } from '../../constants/track.ts'

/**
 * Lógica pura (sin Nuxt) del módulo «Clics por botón» del Resumen. Valida la respuesta de
 * `GET /api/admin/analytics/clicks` y prepara las filas que muestra la tabla.
 */

export const CLICK_RANGES = ['7d', '30d', 'all'] as const
export type ClickRange = (typeof CLICK_RANGES)[number]
export const DEFAULT_CLICK_RANGE: ClickRange = '30d'

export const CLICK_RANGE_LABEL: Record<ClickRange, string> = {
  '7d': '7 días',
  '30d': '30 días',
  all: 'Todo'
}

export const CLICK_BUTTON_LABEL: Record<(typeof TRACK_BUTTON_IDS)[number], string> = {
  wa_hero: 'WhatsApp · Portada',
  wa_sobre_mi: 'WhatsApp · Sobre mí',
  wa_contacto: 'WhatsApp · Contacto',
  wa_contacto_compacto: 'WhatsApp · Contacto de páginas legales',
  wa_proyecto: 'WhatsApp · Ficha de proyecto',
  wa_como_trabajo: 'WhatsApp · Cómo trabajo',
  nav_hablemos: 'Menú · Hablemos',
  cta_ver_como_trabajo: 'Ver cómo trabajo',
  cta_ver_proyecto: 'Ver proyecto (detalle o sitio)'
}

export const CLICKS_NOTE = 'Son clics en el botón, no conversaciones iniciadas en WhatsApp.'

const count = z.number().int().nonnegative()

export const clicksSummarySchema = z.object({
  range: z.enum(CLICK_RANGES),
  total: count,
  buttons: z.array(z.object({ id: z.string(), clicks: count, percent: z.number() })),
  formSubmitOk: count,
  bySource: z.array(z.object({ source: z.string(), clicks: count })),
  byPath: z.array(z.object({ path: z.string(), clicks: count })),
  bySlug: z.array(z.object({ slug: z.string(), clicks: count })).default([])
})

export type ClicksSummary = z.infer<typeof clicksSummarySchema>

/** Valida la respuesta de la API; `null` si no tiene la forma esperada. */
export const parseClicksSummary = (data: unknown): ClicksSummary | null => {
  const parsed = clicksSummarySchema.safeParse(data)
  return parsed.success ? parsed.data : null
}

export const isValidClickRange = (value: unknown): value is ClickRange =>
  (CLICK_RANGES as readonly string[]).includes(String(value))

/** Sin ningún dato todavía (ni clics ni formularios): se muestra el estado vacío, no ceros. */
export const hasNoClickData = (summary: ClicksSummary): boolean =>
  summary.total === 0 && summary.formSubmitOk === 0

export const clickButtonLabel = (id: string): string =>
  (CLICK_BUTTON_LABEL as Record<string, string>)[id] ?? id

export const formatPercent = (percent: number): string =>
  `${percent.toLocaleString('es-CO', { maximumFractionDigits: 1 })} %`

export type ClickRow = { key: string; label: string; clicks: number; percent?: number }

export const buttonRows = (summary: ClicksSummary): ClickRow[] =>
  summary.buttons.map(button => ({
    key: button.id,
    label: clickButtonLabel(button.id),
    clicks: button.clicks,
    percent: button.percent
  }))

/** Desglose con porcentaje sobre el total de clics (el de utm_source y el de página). */
const withShare = (total: number, key: string, label: string, clicks: number): ClickRow => ({
  key,
  label,
  clicks,
  percent: total > 0 ? Math.round((clicks / total) * 1000) / 10 : 0
})

export const sourceRows = (summary: ClicksSummary): ClickRow[] =>
  summary.bySource.map(item => withShare(summary.total, item.source, item.source, item.clicks))

export const pathRows = (summary: ClicksSummary): ClickRow[] =>
  summary.byPath.map(item => withShare(summary.total, item.path, item.path, item.clicks))
