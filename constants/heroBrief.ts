import type { HeroBriefRowKey, HeroBriefScenario } from '~/types/heroBrief'

/**
 * Tarjeta "del problema al plan" del hero. Los tres escenarios son EJEMPLOS ILUSTRATIVOS: sustitúyelos por
 * frases de clientes reales editando solo este archivo (cada frase de `message` se escribe sola en pantalla).
 */
export const HERO_BRIEF_SCENARIOS: HeroBriefScenario[] = [
  {
    id: 'idea',
    tab: 'Tengo una idea',
    message: 'Tengo una idea para una app, pero no sé por dónde empezar ni cuánto va a costar.',
    rows: [
      'Que tus clientes reserven sin llamar',
      'Reservas y avisos. Los pagos, después',
      'Cómo manejas hoy tus horarios'
    ],
    nextStep: 'Siguiente paso: conversar tu caso'
  },
  {
    id: 'existing',
    tab: 'Ya tengo algo',
    message: 'Ya tengo un sistema, pero cada cambio toma semanas y se rompe algo más.',
    rows: [
      'Cambiar rápido sin romper lo que funciona',
      'Revisar el código y ordenar lo que más duele',
      'Partes que nadie entiende por separado'
    ],
    nextStep: 'Siguiente paso: revisar el estado actual'
  },
  {
    id: 'decide',
    tab: 'Debo decidir',
    message: 'Me proponen rehacerlo todo y no sé si vale la pena.',
    rows: [
      'Decidir con claridad antes de invertir',
      'Opciones comparadas, con costo y riesgo',
      'Gastar de más en lo que no es esencial'
    ],
    nextStep: 'Siguiente paso: una recomendación clara'
  }
]

export const HERO_BRIEF = {
  tablistLabel: 'Situaciones de ejemplo',
  messageLabel: 'Lo que me cuentas',
  planLabel: 'Lo que definimos juntos',
  rows: [
    { key: 'goal', label: 'Objetivo', icon: 'mdi:bullseye-arrow' },
    { key: 'scope', label: 'Alcance de la primera versión', icon: 'mdi:flag-outline' },
    { key: 'risk', label: 'Riesgo a resolver antes', icon: 'mdi:alert-outline' }
  ] satisfies { key: HeroBriefRowKey; label: string; icon: string }[],
  cta: 'Contarme tu caso',
  /** ID reservado para el conteo de clics; aún no está en la lista cerrada (requiere cambio en la API). */
  ctaTrackId: 'cta_hero_card',
  caption: 'Ejemplos ilustrativos de cómo arranco cada conversación.'
} as const

/** Tiempos (ms) de la animación, solo en cliente. */
export const HERO_BRIEF_TIMING = {
  typeStep: 22,
  typeChars: 2,
  rowsStart: 350,
  rowGap: 650,
  dwell: 4200,
  firstDwell: 6000
} as const
