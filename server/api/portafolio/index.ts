import type { PortafolioType } from '~/components/templates/templates'

export default defineEventHandler(async (_event): Promise<Omit<PortafolioType, 'images'>[]> => {
  const portafolio: Omit<PortafolioType, 'images'>[] = [
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Tu Radio AR Stereo',
      version: 'V1',
      description:
        'AR Stereo es una estación de radio digital que se distingue por su propuesta musical innovadora y fresca, respaldada con el sello oficial de Alfredo Rojas. Su programación de estilo Crossover ofrece una fusión de géneros cuidadosamente seleccionados, logrando una experiencia sonora única, balanceada y con calidad digital superior. Es una alternativa moderna a lo convencional, ideal para quienes buscan una radio en línea con personalidad, visión y autenticidad.',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss'],
      urlImage: '/ar-stereo.webp',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portfolioType: 'Cliente'
    },
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a3',
      title: 'Caja de Ritmo',
      version: 'V1',
      description: 'Esta es una Practca de React ',
      technologies: ['React', 'Bootstrap'],
      urlImage: '/caja-de-ritmos.webp',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portfolioType: 'Practica'
    },
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a4',
      title: 'Frases Aleatorias',
      version: 'V1',
      description: 'Esta es una Practca de React ',
      technologies: ['React', 'Bootstrap'],
      urlImage: '/frases-aleatorias.webp',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portfolioType: 'Practica'
    }
  ]

  return portafolio
})
