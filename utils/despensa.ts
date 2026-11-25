/**
 * Comentarios de los usuarios de Mi Despensa (API de administración de esa app, solo lectura). Lógica pura y
 * compartida entre el servidor (valida lo que llega) y el panel (lo que muestra): sin Nuxt, con pruebas.
 * Contrato: docs/api-admin.md del servidor de Mi Despensa.
 */
export const DESPENSA_KINDS = ['idea', 'problema', 'otro'] as const
export type DespensaKind = (typeof DESPENSA_KINDS)[number]

export const DESPENSA_PAGE_SIZE = 20
const MAX_LIMIT = 100
const MAX_OFFSET = 100_000

export type DespensaFeedbackItem = {
  id: string
  kind: string
  message: string
  appVersion: string | null
  platform: string | null
  userRef: string | null
  createdAt: string
}

export type DespensaFeedbackPage = {
  items: DespensaFeedbackItem[]
  /** Total que cumple el filtro (sirve para paginar). */
  total: number
  /** Conteo por tipo de TODOS los comentarios, sin filtro. */
  porTipo: Record<string, number>
  limit: number
  offset: number
}

export type FeedbackQuery = { kind?: DespensaKind; limit: number; offset: number }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value)

const asCount = (value: unknown): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null

const asText = (value: unknown, max = 5000): string | null =>
  typeof value === 'string' ? value.slice(0, max) : null

const toInt = (value: unknown, fallback: number): number | null => {
  if (value === undefined || value === '') return fallback
  const text = String(value)
  return /^\d{1,9}$/.test(text) ? Number(text) : null
}

/** Filtro y paginación que acepta el panel (los mismos límites del contrato); `null` si algo no es válido. */
export const parseFeedbackQuery = (raw: Record<string, unknown>): FeedbackQuery | null => {
  const kindRaw = raw.kind
  if (
    kindRaw !== undefined &&
    kindRaw !== '' &&
    !DESPENSA_KINDS.includes(kindRaw as DespensaKind)
  ) {
    return null
  }
  const limit = toInt(raw.limit, DESPENSA_PAGE_SIZE)
  const offset = toInt(raw.offset, 0)
  if (limit === null || offset === null || limit < 1 || limit > MAX_LIMIT || offset > MAX_OFFSET) {
    return null
  }
  return {
    ...(kindRaw ? { kind: kindRaw as DespensaKind } : {}),
    limit,
    offset
  }
}

/** Valida la página de comentarios que devuelve la API; descarta lo que no tiene el formato esperado. */
export const parseFeedbackPage = (data: unknown): DespensaFeedbackPage | null => {
  if (!isRecord(data) || !Array.isArray(data.items) || !isRecord(data.porTipo)) return null
  const total = asCount(data.total)
  const limit = asCount(data.limit)
  const offset = asCount(data.offset)
  if (total === null || limit === null || offset === null) return null

  const items: DespensaFeedbackItem[] = []
  for (const raw of data.items) {
    if (!isRecord(raw)) return null
    const id = asText(raw.id, 100)
    const kind = asText(raw.kind, 30)
    const message = asText(raw.message)
    const createdAt = asText(raw.createdAt, 40)
    if (!id || !kind || message === null || !createdAt) return null
    items.push({
      id,
      kind,
      message,
      appVersion: asText(raw.appVersion, 40),
      platform: asText(raw.platform, 40),
      userRef: asText(raw.userRef, 40),
      createdAt
    })
  }

  const porTipo: Record<string, number> = {}
  for (const [key, value] of Object.entries(data.porTipo)) {
    const count = asCount(value)
    if (count !== null) porTipo[key] = count
  }
  return { items, total, porTipo, limit, offset }
}

export type DespensaPing = { ok: true; hora: string }

export const parsePing = (data: unknown): DespensaPing | null =>
  isRecord(data) && data.ok === true && typeof data.hora === 'string'
    ? { ok: true, hora: data.hora.slice(0, 40) }
    : null
