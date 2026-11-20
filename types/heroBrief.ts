export type HeroBriefRowKey = 'goal' | 'scope' | 'risk'

export type HeroBriefScenario = {
  id: string
  /** Etiqueta de la pestaña (refleja una tarjeta de "¿En qué punto estás?"). */
  tab: string
  /** Frase del cliente. */
  message: string
  /** Texto de cada fila, en el orden de `HERO_BRIEF.rows`. */
  rows: [string, string, string]
  nextStep: string
}
