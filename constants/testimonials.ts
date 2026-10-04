import type { TestimonialContent } from '~/types/common'

// Datos locales temporales para mantener el carrusel desacoplado de Firestore.
export const TESTIMONIALS_MOCK: TestimonialContent[] = [
  {
    id: 'gustavo-sanchez',
    author: 'Gustavo Sanchez',
    role: 'Senior Software Engineer',
    quote:
      'Miguel es un excelente trabajador y un excelente programador, persona confiable y responsable, trabajador de equipo y persona capaz de asumir nuevos retos.',
    profileType: 'Trabajo'
  },
  {
    id: 'alfredo-rojas',
    author: 'Alfredo Rojas',
    role: 'Director',
    company: 'AR Stereo',
    quote: 'Un gran trabajo, me ayudó a salir de la zona de confort y a mejorar mis habilidades.',
    image: '/alfredo-rojas.webp',
    profileType: 'Cliente'
  }
]
