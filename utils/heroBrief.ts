/** Lógica pura de la tarjeta del hero (pestañas y avance), probada en tests/heroBrief.test.mjs. */

export const nextScenarioIndex = (current: number, total: number): number =>
  total <= 0 ? 0 : (current + 1) % total

/** Índice al que lleva una tecla de navegación de pestañas, o null si la tecla no navega. */
export const tabIndexForKey = (key: string, current: number, total: number): number | null => {
  if (total <= 0) return null
  if (key === 'ArrowRight' || key === 'ArrowDown') return (current + 1) % total
  if (key === 'ArrowLeft' || key === 'ArrowUp') return (current - 1 + total) % total
  if (key === 'Home') return 0
  if (key === 'End') return total - 1
  return null
}
