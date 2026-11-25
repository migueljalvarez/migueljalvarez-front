import { DESPENSA_KINDS, DESPENSA_PAGE_SIZE, type DespensaKind } from '../despensa.ts'
import { pageInfo } from './testimonials.ts'

/** Filtros del panel: «Todos» más un tipo por filtro (los de la API de Mi Despensa). */
export type DespensaFilter = 'all' | DespensaKind

export const DESPENSA_FILTER_OPTIONS: { value: DespensaFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'idea', label: 'Ideas' },
  { value: 'problema', label: 'Problemas' },
  { value: 'otro', label: 'Otros' }
]

const KIND_LABELS: Record<DespensaKind, string> = {
  idea: 'Idea',
  problema: 'Problema',
  otro: 'Otro'
}

/** Etiqueta visible del tipo (siempre con texto: el color solo acompaña). */
export const despensaKindLabel = (kind: string): string =>
  (KIND_LABELS as Record<string, string>)[kind] ?? 'Otro'

export const despensaKindTone = (kind: string): 'success' | 'warning' | 'info' | 'neutral' =>
  kind === 'idea' ? 'info' : kind === 'problema' ? 'warning' : 'neutral'

export const PLATFORM_LABELS: Record<string, string> = { android: 'Android', ios: 'iOS' }

export const despensaPlatformLabel = (platform: string | null): string =>
  platform ? (PLATFORM_LABELS[platform.toLowerCase()] ?? platform) : 'Sin dato'

/** `25 nov 2026, 9:01 a. m.` en hora de Colombia; texto vacío si la fecha no es válida. */
export const formatDespensaDate = (iso: string): string => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Bogota'
      })
}

/** Contadores de arriba: un tipo por tarjeta y el total (suma de todos, sin filtro). */
export const despensaCounters = (porTipo: Record<string, number>) => {
  const counters = DESPENSA_KINDS.map(kind => ({
    kind,
    label: `${despensaKindLabel(kind)}s`,
    count: porTipo[kind] ?? 0
  }))
  // Un tipo nuevo que la app agregue y el panel aún no conozca cuenta como «Otros».
  const known = new Set<string>(DESPENSA_KINDS)
  const extra = Object.entries(porTipo)
    .filter(([key]) => !known.has(key))
    .reduce((sum, [, count]) => sum + count, 0)
  const withExtra = counters.map(item =>
    item.kind === 'otro' ? { ...item, count: item.count + extra } : item
  )
  return { total: withExtra.reduce((sum, item) => sum + item.count, 0), items: withExtra }
}

export const despensaOffset = (page: number, pageSize = DESPENSA_PAGE_SIZE) =>
  Math.max(0, (page - 1) * pageSize)

export const despensaPaging = (total: number, page: number) =>
  pageInfo(total, page, DESPENSA_PAGE_SIZE)

export { DESPENSA_PAGE_SIZE }
