import type { PortfolioFilter } from '~/types/portfolio'

/** Texto visible de cada filtro del portafolio (la lógica usa solo los ids). */
export const PORTFOLIO_FILTER_LABEL: Record<PortfolioFilter, string> = {
  all: 'Todos',
  client: 'Clientes',
  product: 'Productos propios'
}
