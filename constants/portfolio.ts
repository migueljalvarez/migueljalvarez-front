import type { PortafolioType } from '~/types/common'
import type { PortfolioCardProject } from '~/components/templates/Portfolio/portfolio.types'
import { MOCK_PORTFOLIO_CONTEXT, MOCK_PORTFOLIO_PROJECTS } from './portfolio.mock'

/**
 * Proyectos de ejemplo solo en desarrollo. `import.meta.dev` se reemplaza por `false` en build,
 * por lo que los mocks no se incluyen en producción.
 */
export const USE_PORTFOLIO_MOCKS: boolean = import.meta.dev

/** Solo productos propios y trabajos reales de clientes. */
const REAL_PORTFOLIO_PROJECTS: PortafolioType[] = [
  {
    id: 'mi-comodoro',
    type: 'product',
    title: 'Mi Comodoro',
    portfolioType: 'Producto propio',
    slug: 'mi-comodoro',
    problem:
      'Necesitaba un espacio claro para controlar ingresos, gastos, metas y hábitos financieros sin depender de aplicaciones complejas o poco amigables.',
    decision:
      'Diseñé una experiencia con foco en claridad visual, trazabilidad semanal y ahorro de tiempo. La app prioriza decisiones rápidas, consistencia en el flujo y una vista centrada en la salud financiera del usuario.',
    result:
      'Se consolidó una herramienta útil para seguimiento personal con una base que permite escalar nuevas métricas y reportes sin romper la experiencia.',
    technologies: ['Nuxt', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    description:
      'Aplicación para la gestión de finanzas personales: seguimiento de ingresos, gastos y presupuesto en un solo lugar.',
    urlImage: '/projects/mi-comodoro/cover.webp',
    ogImage: '/projects/mi-comodoro/og.jpg'
  },
  {
    id: 'mi-despensa',
    type: 'product',
    status: 'in-development',
    title: 'Mi Despensa',
    portfolioType: 'Producto propio',
    slug: 'mi-despensa',
    technologies: [],
    description:
      'Aplicación móvil en desarrollo para gestionar los recursos de la despensa según un presupuesto. Forma parte del ecosistema de Mi Comodoro, pero puede usarse de forma independiente.',
    urlImage: ''
  }
]

export const PORTFOLIO_PROJECTS: PortafolioType[] = USE_PORTFOLIO_MOCKS
  ? [...REAL_PORTFOLIO_PROJECTS, ...MOCK_PORTFOLIO_PROJECTS]
  : REAL_PORTFOLIO_PROJECTS

const PORTFOLIO_PROJECT_CONTEXT: Record<
  string,
  Pick<PortfolioCardProject, 'audience'> & { projectKind: string; sector: string }
> = {
  'mi-comodoro': {
    projectKind: 'Aplicación financiera',
    sector: 'Finanzas personales',
    audience: 'personas que organizan sus finanzas'
  },
  'mi-despensa': {
    projectKind: 'Aplicación móvil',
    sector: 'En desarrollo',
    audience: 'personas que gestionan su despensa con un presupuesto'
  },
  ...(USE_PORTFOLIO_MOCKS ? MOCK_PORTFOLIO_CONTEXT : {})
}

const toPortfolioCardProject = (
  projectId: string,
  options: { primary?: boolean } = {}
): PortfolioCardProject => {
  const project = PORTFOLIO_PROJECTS.find(item => item.id === projectId)
  const context = PORTFOLIO_PROJECT_CONTEXT[projectId]

  if (!project || !context) {
    throw new Error(`Portfolio project not found: ${projectId}`)
  }

  return {
    id: project.id,
    slug: project.slug || project.id,
    title: project.title,
    description: project.description,
    type: project.type === 'client' ? 'cliente' : 'propio',
    tags: [context.projectKind, context.sector],
    audience: context.audience,
    image: project.urlImage,
    // Sin ficha de detalle mientras el producto está en desarrollo (no hay contenido real que mostrar).
    href: project.status === 'in-development' ? '' : `/portafolio/${project.slug || project.id}`,
    primary: options.primary,
    status: project.status
  }
}

export const HOME_PORTFOLIO_PROJECTS: PortfolioCardProject[] = PORTFOLIO_PROJECTS.slice(0, 5).map(
  (project, index) => toPortfolioCardProject(project.id, { primary: index === 0 })
)

export const ALL_PORTFOLIO_CARD_PROJECTS: PortfolioCardProject[] = PORTFOLIO_PROJECTS.map(project =>
  toPortfolioCardProject(project.id)
)
