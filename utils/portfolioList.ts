import type { PortfolioCardProject, PortfolioFilter } from '~/types/portfolio'

/**
 * Lógica pura del listado `/portafolio` (se prueba en tests/portfolioList.test.mjs). El orden ya viene de la
 * API (destacados, luego orden ascendente y publicado más reciente primero): aquí solo se reparte.
 */

/** Con menos proyectos publicados que esto, el grid termina con la tarjeta «Siguiente proyecto». */
export const FILLER_MIN_PUBLISHED = 3

export const filterPortfolioCards = <T extends Pick<PortfolioCardProject, 'type'>>(
  projects: T[],
  filter: PortfolioFilter
): T[] => (filter === 'all' ? projects : projects.filter(project => project.type === filter))

/** El primer destacado va a ancho completo; el resto (incluidos otros destacados) va al grid, en el mismo orden. */
export const splitFeatured = <T extends Pick<PortfolioCardProject, 'featured'>>(
  projects: T[]
): { featured: T | null; rest: T[] } => {
  const index = projects.findIndex(project => project.featured)
  if (index < 0) return { featured: null, rest: projects }
  return { featured: projects[index]!, rest: projects.filter((_, position) => position !== index) }
}

/** La tarjeta de relleno se deriva del conteo de proyectos publicados (no es un dato del panel ni un proyecto). */
export const showFillerCard = (projects: Pick<PortfolioCardProject, 'status'>[]): boolean =>
  projects.filter(project => project.status !== 'in-development').length < FILLER_MIN_PUBLISHED

/** Columnas de una fila de la ficha según cuántas piezas existen (1 a 3). */
export const columnsFor = (count: number, max = 3): number => Math.min(Math.max(count, 1), max)

/** Galería: 3 columnas, o 2 si hay una o dos imágenes. */
export const galleryColumns = (count: number): 2 | 3 => (count >= 3 ? 3 : 2)
