/** Oferta de servicio tal como la muestra `/como-cobro` (precio «desde» en USD). */
export type ServiceOfferView = {
  id: string
  slug: string
  title: string
  summary: string
  includes: string[]
  duration?: string
  /** Sin precio (respaldo del código): la tarjeta indica que se cotiza según el alcance. */
  priceFromUsd?: number
  /** Solo mientras el interruptor de lanzamiento esté activo en el panel. */
  launchPriceFromUsd?: number
  launchNote?: string
}

/** Condición de cobro que acompaña a las ofertas (anticipo, moneda, cotización de proyectos). */
export type PricingTerm = { title: string; text: string }
