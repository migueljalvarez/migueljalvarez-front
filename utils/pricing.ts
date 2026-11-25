/**
 * Lógica pura (sin Nuxt) de las ofertas de `/como-cobro`: formato del precio y qué se muestra según el
 * interruptor de lanzamiento. Se prueba en `tests/pricing.test.mjs`.
 */

/** «USD 1.200»: monto entero en dólares, con separador de miles de es-CO. */
export const formatUsd = (amount: number): string =>
  `USD ${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

export type OfferPrice = {
  /** Precio «desde» normal, o `undefined` si la oferta se cotiza según el alcance. */
  regular?: string
  /** Precio de lanzamiento (solo si es menor que el normal). */
  launch?: string
  /** Texto para lectores de pantalla que explica ambos precios. */
  label: string
}

export const describeOfferPrice = (offer: {
  priceFromUsd?: number
  launchPriceFromUsd?: number
  launchNote?: string
}): OfferPrice => {
  const { priceFromUsd, launchPriceFromUsd, launchNote } = offer
  if (priceFromUsd === undefined) return { label: 'Precio según el alcance' }
  const regular = formatUsd(priceFromUsd)
  if (launchPriceFromUsd === undefined || launchPriceFromUsd >= priceFromUsd) {
    return { regular, label: `Desde ${regular}` }
  }
  const launch = formatUsd(launchPriceFromUsd)
  const note = launchNote ? ` (${launchNote})` : ''
  return {
    regular,
    launch,
    label: `Precio de lanzamiento desde ${launch}${note}; precio normal desde ${regular}`
  }
}
