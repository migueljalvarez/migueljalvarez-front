import type { PortfolioCardProject, PortfolioFilter } from '~/types/portfolio'

export function getAvailablePortfolioFilters(
  projects: Pick<PortfolioCardProject, 'type'>[]
): PortfolioFilter[] {
  const projectTypes = new Set(projects.map(project => project.type))
  const filters: PortfolioFilter[] = ['all']

  if (projectTypes.has('client')) filters.push('client')
  if (projectTypes.has('product')) filters.push('product')

  return filters
}
