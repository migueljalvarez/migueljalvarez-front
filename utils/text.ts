/** Añade un punto final si el texto no termina ya en un signo de cierre. Vacío se queda vacío. */
export const withFinalPeriod = (text: string | undefined | null) => {
  const value = (text ?? '').trim()
  if (!value) return ''
  return /[.!?…:;)»"”]$/.test(value) ? value : `${value}.`
}
