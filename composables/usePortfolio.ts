import type { PortfolioType } from '~/types/common'
import { toHomeCardProjects, toPortfolioCardProject } from '~/utils/publicContent'

/**
 * Portafolio público. Se carga durante el SSR desde `/api/portfolio` (API con respaldo en el código)
 * y se expone ya convertido a tarjetas para la home y para `/portafolio`.
 */
export const usePortfolio = async () => {
  const { data } = await useFetch<PortfolioType[]>('/api/portfolio', {
    key: 'portfolio',
    default: () => []
  })

  const items = computed(() => data.value ?? [])
  const homeCards = computed(() => toHomeCardProjects(items.value))
  const allCards = computed(() => items.value.map(item => toPortfolioCardProject(item)))

  return { items, homeCards, allCards }
}
