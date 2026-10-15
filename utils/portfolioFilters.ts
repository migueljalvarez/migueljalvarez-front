import type { PortfolioCardProject, PortfolioFilter } from '~/components/templates/Portfolio/portfolio.types'

export function getAvailablePortfolioFilters(
  projects: Pick<PortfolioCardProject, 'type'>[]
): PortfolioFilter[] {
  const projectTypes = new Set(projects.map(project => project.type))
  const filters: PortfolioFilter[] = ['Todos']

  if (projectTypes.has('cliente')) filters.push('Clientes')
  if (projectTypes.has('propio')) filters.push('Productos propios')

  return filters
}
