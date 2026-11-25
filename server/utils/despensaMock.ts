/**
 * DATOS SIMULADOS de Mi Despensa, solo para desarrollo (se importa tras `import.meta.dev`, así que no entra en
 * el build de producción; `tests/despensa.test.mjs` lo comprueba sobre `.output`). Imita el contrato real:
 * los más recientes primero, `total` con el filtro y `porTipo` sin filtro.
 */
import type { DespensaFeedbackItem, FeedbackQuery } from '../../utils/despensa'

const KINDS = ['idea', 'problema', 'otro'] as const
const PLATFORMS = ['android', 'ios'] as const
const MESSAGES: Record<(typeof KINDS)[number], string[]> = {
  idea: [
    'Podría avisarme cuando algo está por vencer. (SIMULADO)',
    'Me gustaría compartir la lista con mi pareja. (SIMULADO)',
    'Sería útil ver cuánto gasté en el mes por categoría. (SIMULADO)'
  ],
  problema: [
    'Falla al escanear el código de barras. (SIMULADO)',
    'La app se cierra al abrir la despensa. (SIMULADO)',
    'No me deja guardar el presupuesto.\nSe queda cargando. (SIMULADO)'
  ],
  otro: [
    'Gracias, la app me está ayudando mucho. (SIMULADO)',
    '¿Habrá versión para tablet? (SIMULADO)'
  ]
}

const ITEMS: DespensaFeedbackItem[] = Array.from({ length: 23 }, (_, index) => {
  const kind = KINDS[index % KINDS.length]!
  const pool = MESSAGES[kind]
  return {
    id: `simulado-${String(index + 1).padStart(3, '0')}`,
    kind,
    message: pool[index % pool.length]!,
    appVersion: `1.0.${index % 4}`,
    platform: PLATFORMS[index % PLATFORMS.length]!,
    userRef: index % 5 === 0 ? null : `usr${String(1000 + (index % 7)).padStart(5, '0')}`,
    createdAt: new Date(Date.UTC(2026, 10, 25, 14, 0, 0) - index * 3_600_000 * 7).toISOString()
  }
})

export const simulatedPing = () => ({ ok: true, hora: new Date().toISOString() })

export const simulatedFeedback = (query: FeedbackQuery) => {
  const filtered = query.kind ? ITEMS.filter(item => item.kind === query.kind) : ITEMS
  const porTipo: Record<string, number> = {}
  for (const item of ITEMS) porTipo[item.kind] = (porTipo[item.kind] ?? 0) + 1
  return {
    items: filtered.slice(query.offset, query.offset + query.limit),
    total: filtered.length,
    porTipo,
    limit: query.limit,
    offset: query.offset
  }
}
