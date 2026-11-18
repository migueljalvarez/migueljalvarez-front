import type { PortafolioType } from '~/types/common'
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

/**
 * Datos de presentación de la tarjeta (etiquetas y público objetivo) del contenido de respaldo.
 * Cuando el contenido viene de la API, estos datos se guardan en la propia ficha (`tags`, `audience`).
 */
const FALLBACK_CARD_CONTEXT: Record<string, { tags: string[]; audience: string }> = {
  'mi-comodoro': {
    tags: ['Aplicación financiera', 'Finanzas personales'],
    audience: 'personas que organizan sus finanzas'
  },
  'mi-despensa': {
    tags: ['Aplicación móvil', 'En desarrollo'],
    audience: 'personas que gestionan su despensa con un presupuesto'
  },
  ...(USE_PORTFOLIO_MOCKS
    ? Object.fromEntries(
        Object.entries(MOCK_PORTFOLIO_CONTEXT).map(([id, context]) => [
          id,
          { tags: [context.projectKind, context.sector], audience: context.audience }
        ])
      )
    : {})
}

const withCardContext = (projects: PortafolioType[], sample = false): PortafolioType[] =>
  projects.map(project => ({
    ...project,
    ...FALLBACK_CARD_CONTEXT[project.id],
    ...(sample ? { sample: true } : {})
  }))

/**
 * CONTENIDO DE RESPALDO. La fuente principal es la API (se gestiona desde el panel); estos proyectos
 * solo se usan cuando la API no está configurada, no responde o aún no tiene nada publicado, para que
 * el sitio nunca quede sin portafolio. Los de ejemplo solo existen en desarrollo y van marcados.
 */
export const PORTFOLIO_PROJECTS: PortafolioType[] = [
  ...withCardContext(REAL_PORTFOLIO_PROJECTS),
  ...(USE_PORTFOLIO_MOCKS ? withCardContext(MOCK_PORTFOLIO_PROJECTS, true) : [])
]
