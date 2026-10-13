import type { PortafolioType } from '~/components/templates/templates'
import type { PortfolioCardProject } from '~/components/templates/Portfolio/portfolio.types'

export const PORTFOLIO_PROJECTS: PortafolioType[] = [
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
    version: '1.0.0',
    status: 'En desarrollo',
    description:
      'Aplicación para la gestión de finanzas personales: seguimiento de ingresos, gastos y presupuesto en un solo lugar.',
    urlImage: '',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'tu-radio-ar-stereo',
    type: 'client',
    title: 'Tu Radio AR Stereo',
    portfolioType: 'Cliente',
    slug: 'tu-radio-ar-stereo',
    problem:
      'La radio necesitaba una presencia digital que conectara comunidad, contenido editorial y programación sonora sin depender de una experiencia dispersa o difícil de mantener.',
    decision:
      'Construimos una plataforma con Nuxt y Tailwind enfocada en claridad editorial, identidad sonora y una navegación que reduciera fricción para audiencias de diferentes perfiles.',
    result:
      'La web pasó a funcionar como un centro de contenido y comunidad, con una presentación más sólida, moderna y fácil de mantener en el tiempo.',
    technologies: ['Nuxt', 'Tailwind', 'Firebase'],
    version: '1.0.0',
    description:
      'Plataforma editorial y sonora para conectar comunidad, contenido y radio en una sola experiencia.',
    urlImage: '/ar-stereo.webp',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'caja-de-ritmos',
    type: 'practice',
    portfolioType: 'Practica',
    title: 'Caja de Ritmos',
    slug: 'caja-de-ritmos',
    problem:
      'Necesitaba una herramienta ligera para explorar ideas musicales, crear referencias y organizar conceptos de composición sin abrir demasiadas pestañas ni depender de software pesado.',
    decision:
      'Opté por una experiencia simple, visual y rápida que permitiera trabajar en ideas creativas desde un flujo mínimo y enfocado en la inspiración.',
    result:
      'Se logró un prototipo útil para exploración creativa con un formato cómodo para idear, combinar y guardar referencias del proceso musical.',
    technologies: ['Vue', 'TypeScript', 'Tailwind', 'Firebase'],
    version: '0.9.0',
    description:
      'Herramienta para ideación musical y experimentación creativa con una experiencia simple y visual.',
    urlImage: '/caja-de-ritmos.webp',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'frases-aleatorias',
    type: 'practice',
    portfolioType: 'Practica',
    title: 'Frases Aleatorias',
    slug: 'frases-aleatorias',
    problem:
      'Quería una experiencia ligera para generar frases inspiradoras y contenido digital de manera rápida, sin complejidad de backend ni mantenimiento extra.',
    decision:
      'Construí un producto de baja fricción con foco en UX y entrega inmediata, usando una lógica simple y un diseño inspirador.',
    result:
      'Se obtuvo un recurso útil para contenido visual y referencias rápidas, con una experiencia ágil y fácil de replicar.',
    technologies: ['JavaScript', 'Tailwind', 'CSS'],
    version: '1.1.0',
    description:
      'Microproducto para generar frases motivacionales y contenido inspirador con una interfaz clara y rápida.',
    urlImage: '/frases-aleatorias.webp',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'agencia-ops',
    type: 'practice',
    portfolioType: 'Practica',
    title: 'Agencia Ops',
    slug: 'agencia-ops',
    problem:
      'La marca necesitaba una presencia digital más contundente para presentar servicios, casos de uso y procesos con mejor estructura y mayor claridad comercial.',
    decision:
      'Reestructuramos la narrativa y la arquitectura visual para transformar el contenido en una experiencia más profesional y fácil de vender.',
    result:
      'Se mejoró la percepción de marca y la navegación para que los leads entendieran mejor los servicios ofrecidos.',
    technologies: ['Nuxt', 'Tailwind', 'SEO', 'Analytics'],
    version: '1.2.0',
    description:
      'Sitio corporativo para agencia con enfoque en posicionamiento, servicio y presentación de procesos.',
    urlImage: '',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'crm-visual',
    type: 'practice',
    portfolioType: 'Practica',
    title: 'CRM Visual',
    slug: 'crm-visual',
    problem:
      'El equipo comercial necesitaba mayor visibilidad sobre leads, etapas y seguimiento sin depender de procesos dispersos y poco claros.',
    decision:
      'Implementé una solución de gestión visual con flujos de trabajo simples y vistas rápidas, ajustadas a una operación intensiva y en crecimiento.',
    result:
      'Se redujo la fricción en la operación comercial y se mejoró la trazabilidad del pipeline de ventas.',
    technologies: ['Vue', 'Node.js', 'PostgreSQL', 'Docker'],
    version: '2.0.0',
    description:
      'Sistema de gestión visual para seguimiento de clientes, oportunidades y pipeline comercial.',
    urlImage: '',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  },
  {
    id: 'intranet-lab',
    type: 'practice',
    portfolioType: 'Practica',
    title: 'Intranet Lab',
    slug: 'intranet-lab',
    problem:
      'El equipo interno tenía información fragmentada, procesos manuales y poca visibilidad sobre tareas y documentación compartida.',
    decision:
      'Diseñé un panel centralizado que agrupó documentación, procesos y tareas clave para mejorar la operación diaria del equipo.',
    result:
      'Se consolidó una base más ordenada y un punto único de acceso para la información y las actividades internas.',
    technologies: ['Nuxt', 'TypeScript', 'PostgreSQL', 'Docker'],
    version: '1.4.0',
    description:
      'Intranet para centralizar documentación, tareas y procesos operativos del equipo.',
    urlImage: '',
    url: '',
    initialProblem: '',
    solutionDetails: '',
    images: [],
    gallery: []
  }
]

const PORTFOLIO_PROJECT_CONTEXT: Record<
  string,
  Pick<PortfolioCardProject, 'projectKind' | 'sector' | 'audience'>
> = {
  'mi-comodoro': {
    projectKind: 'Aplicación financiera',
    sector: 'Finanzas personales',
    audience: 'personas que organizan sus finanzas'
  },
  'tu-radio-ar-stereo': {
    projectKind: 'Plataforma digital',
    sector: 'Medios y entretenimiento',
    audience: 'radios y comunidades digitales'
  },
  'caja-de-ritmos': {
    projectKind: 'Herramienta creativa',
    sector: 'Música y creatividad',
    audience: 'músicos y compositores'
  },
  'frases-aleatorias': {
    projectKind: 'Microproducto',
    sector: 'Creación de contenido',
    audience: 'creadores digitales'
  },
  'agencia-ops': {
    projectKind: 'Sitio corporativo',
    sector: 'Servicios profesionales',
    audience: 'agencias y negocios'
  },
  'crm-visual': {
    projectKind: 'Sistema de gestión',
    sector: 'Ventas y CRM',
    audience: 'equipos comerciales'
  },
  'intranet-lab': {
    projectKind: 'Intranet',
    sector: 'Operaciones internas',
    audience: 'equipos de trabajo'
  }
}

const toPortfolioCardProject = (projectId: string, mock = false): PortfolioCardProject => {
  const project = PORTFOLIO_PROJECTS.find(item => item.id === projectId)
  const context = PORTFOLIO_PROJECT_CONTEXT[projectId]

  if (!project || !context) {
    throw new Error(`Portfolio project not found: ${projectId}`)
  }

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    type: project.type === 'client' ? 'cliente' : 'propio',
    ...context,
    image: project.urlImage,
    href: `/portafolio/${project.slug || project.id}`,
    status: project.status,
    mock
  }
}

export const HOME_PORTFOLIO_PROJECTS: PortfolioCardProject[] = [
  toPortfolioCardProject('tu-radio-ar-stereo'),
  toPortfolioCardProject('caja-de-ritmos', true),
  toPortfolioCardProject('frases-aleatorias', true),
  toPortfolioCardProject('agencia-ops', true),
  toPortfolioCardProject('crm-visual', true)
]

export const ALL_PORTFOLIO_CARD_PROJECTS: PortfolioCardProject[] =
  PORTFOLIO_PROJECTS.map(project => toPortfolioCardProject(project.id))

export const PORTFOLIO_TYPE_OPTIONS = ['Todos', 'Clientes', 'Productos Propios'] as const

export const PORTFOLIO_CTA: {
  mode: 'case' | 'contact'
  projectId: string
  caseLabel: string
  caseAction: string
  fallbackLabel: string
  fallbackTitle: string
  fallbackAction: string
  fallbackHref: string
} = {
  mode: 'case',
  projectId: 'tu-radio-ar-stereo',
  caseLabel: 'Caso real',
  caseAction: 'Ver caso completo',
  fallbackLabel: 'Siguiente paso',
  fallbackTitle: 'Hablemos de lo que quieres construir',
  fallbackAction: 'Hablemos de tu proyecto',
  fallbackHref: '#contact'
}

export const TECHNOLOGY_ICONS: Record<string, string> = {
  Nuxt: 'mdi:nuxt',
  Nest: 'mdi:server',
  Vue: 'simple-icons:vuedotjs',
  TypeScript: 'mdi:language-typescript',
  JavaScript: 'simple-icons:javascript',
  Tailwind: 'mdi:tailwind',
  CSS: 'simple-icons:css3',
  PostgreSQL: 'mdi:database',
  Firebase: 'simple-icons:firebase',
  Docker: 'simple-icons:docker',
  'Node.js': 'simple-icons:nodedotjs',
  SEO: 'mdi:search-web',
  Analytics: 'mdi:chart-box',
  'Next.js': 'simple-icons:nextdotjs',
  React: 'simple-icons:react',
  Laravel: 'simple-icons:laravel',
  PHP: 'simple-icons:php',
  Supabase: 'simple-icons:supabase',
  MongoDB: 'simple-icons:mongodb'
}

export const getTechnologyIcon = (technology: string) => {
  console.log(technology)
  return TECHNOLOGY_ICONS[technology] ? TECHNOLOGY_ICONS[technology] : 'mdi:code-braces'
}
