type PortafolioType = {
  id: string
  title: string
  version: string
  state: string
  description: string
  technologies: string[]
  urlImage: string
  url: string
  initialProblem: string
  solutionDetails: string
  portafolioType: string
}
export default defineEventHandler(async (_event): Promise<PortafolioType[]> => {
  const portafolio: PortafolioType[] = [
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Tu Radio AR Stereo',
      version: 'V1',
      description:
        'AR Stereo es una estación de radio digital que se distingue por su propuesta musical innovadora y fresca, respaldada con el sello oficial de Alfredo Rojas. Su programación de estilo Crossover ofrece una fusión de géneros cuidadosamente seleccionados, logrando una experiencia sonora única, balanceada y con calidad digital superior. Es una alternativa moderna a lo convencional, ideal para quienes buscan una radio en línea con personalidad, visión y autenticidad.',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss', 'Docker'],
      urlImage: '/ar.png',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portafolioType: 'Cliente'
    },
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Caja de Ritmo',
      version: 'V1',
      description: 'Esta es una Practca de React ',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss', 'Docker'],
      urlImage: '/ar.png',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portafolioType: 'Practica'
    },
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Frases Aleatorias',
      version: 'V1',
      description: 'Esta es una Practca de React ',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss', 'Docker'],
      urlImage: '/ar.png',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portafolioType: 'Practica'
    },
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Caja de Ritmo',
      version: 'V1',
      description: 'Esta es una Practca de React ',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss', 'Docker'],
      urlImage: '/ar.png',
      url: 'https://www.arstereo.com/',
      initialProblem: '',
      solutionDetails: '',
      state: 'Entregado',
      portafolioType: 'Practica'
    }
  ]

  return portafolio
})
