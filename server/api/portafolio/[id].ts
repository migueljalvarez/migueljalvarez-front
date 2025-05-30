import type { PortafolioType } from '~/types/common'

export default defineEventHandler(async event => {
  const portafolioId = getRouterParam(event, 'id')

  const portafolio: PortafolioType[] = [
    {
      id: '576754d6-7fa4-4529-8628-207e36cac3a2',
      title: 'Tu Radio AR Stereo',
      technologies: ['Nuxtjs', 'Vuejs', 'Tailwindcss', 'Docker'],
      version: 'V1',
      description:
        'AR Stereo es una estación de radio digital que se distingue por su propuesta musical innovadora y fresca, respaldada con el sello oficial de Alfredo Rojas. Su programación de estilo Crossover ofrece una fusión de géneros cuidadosamente seleccionados, logrando una experiencia sonora única, balanceada y con calidad digital superior. Es una alternativa moderna a lo convencional, ideal para quienes buscan una radio en línea con personalidad, visión y autenticidad.',
      urlImage: 'https://www.arstereo.com/_nuxt/banner.BeTGo23t.png',
      url: 'https://www.arstereo.com/',
      initialProblem:
        'Alfredo estaba próximo a lanzar su proyecto radial, pero enfrentaba una limitación importante: contaba con pocos recursos económicos y necesitaba una solución funcional y sostenible. En ese momento, la emisora solo disponía de un reproductor para la transmisión en vivo y, como único canal de retroalimentación, un blog donde se publicaban noticias. No existía una plataforma que integrara la información de la emisora, las noticias y el contenido radial de forma accesible y centralizada para los oyentes. Esta situación evidenció la necesidad de desarrollar una página web que ofreciera una experiencia más completa, organizada y alineada con los objetivos de crecimiento del proyecto.',
      solutionDetails:
        'Para dar solución a la necesidad identificada, iniciamos el desarrollo de un sitio web que, en su primera etapa, incorporó secciones estáticas con el objetivo de minimizar los costos asociados a un backend, ya que gran parte de la información no requería actualización constante. Desde el inicio se pensó en la escalabilidad del proyecto, dejando sentadas las bases para futuras ampliaciones. Aprovechamos la infraestructura gratuita de Netlify para alojar y desplegar el sitio, lo que permitió realizar pruebas y ajustes sin incurrir en gastos adicionales. Una vez que el resultado cumplió con las expectativas de Alfredo, procedimos con la búsqueda y adquisición del dominio, dando paso al lanzamiento oficial de la plataforma.',
      state: 'Entregado',
      images: [
        {
          title: 'Imagen 1',
          url: 'https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          title: 'Imagen 2',
          url: 'https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          title: 'Imagen 3',
          url: 'https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          title: 'Imagen 4',
          url: 'https://images.pexels.com/photos/443446/pexels-photo-443446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]
    }
  ]

  return portafolio.find(item => item.id === portafolioId) as PortafolioType
})
